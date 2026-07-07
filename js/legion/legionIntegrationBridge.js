/**
 * LEGION — Integration Bridge
 *
 * Ponte entre o jogo atual e o motor calibrado.
 * Mantém fallback e registra quality flags para dados ausentes.
 */

import { SimulationTelemetry } from './simulationTelemetry.js';
import { analyzeMatchReport } from './matchReportAnalyzer.js';
import { evaluateMatchQuality } from './calibrationQualityGate.js';
import { NarrationEventMapper } from './narrationEventMapper.js';

export class LegionIntegrationBridge {
  constructor({ simulator, thresholds = {}, narrationTemplates = {}, engineMode = 'calibrated', fallbackSimulator = null } = {}) {
    this.simulator = simulator;
    this.thresholds = thresholds;
    this.engineMode = engineMode;
    this.fallbackSimulator = fallbackSimulator;
    this.narrationMapper = new NarrationEventMapper(narrationTemplates);
  }

  normalizeTeam(team, side = 'A') {
    const quality_flags = [];
    const team_wc_id = team.team_wc_id || team.id || `team_unknown_${side}`;
    if (!team.team_wc_id) quality_flags.push('missing_team_wc_id');

    const players = (team.players || team.lineup || []).map((p, index) => {
      const player_wc_id = p.player_wc_id || p.id || `fallback_${team_wc_id}_${index}`;
      const player_base_id = p.player_base_id || p.athlete_id || player_wc_id.replace(/_\d{4}$/, '');
      const playerFlags = [];
      if (!p.player_wc_id) playerFlags.push('missing_player_wc_id_fallback_used');
      return {
        ...p,
        player_wc_id,
        player_base_id,
        display_name: p.display_name || p.name || p.short_name || `Jogador ${index + 1}`,
        team_wc_id,
        slot: p.slot || p.position || p.pos || null,
        quality_flags: playerFlags
      };
    });

    if (players.length !== 11) quality_flags.push('invalid_lineup_size');
    if (!players.some(p => ['GK', 'GOL', 'GOLEIRO'].includes(String(p.slot || '').toUpperCase()))) {
      quality_flags.push('no_goalkeeper_found');
    }

    return {
      team_wc_id,
      display_name: team.display_name || team.name || team.label || team_wc_id,
      formation: team.formation || null,
      players,
      quality_flags
    };
  }

  simulateMatch({ userTeam, opponentTeam, context = {} } = {}) {
    const teamA = this.normalizeTeam(userTeam || {}, 'A');
    const teamB = this.normalizeTeam(opponentTeam || {}, 'B');
    const preFlags = [...teamA.quality_flags, ...teamB.quality_flags];

    try {
      if (this.engineMode === 'legacy' && this.fallbackSimulator) {
        return this.fallbackSimulator({ userTeam, opponentTeam, context });
      }

      const result = this.simulator.simulate(teamA, teamB, context);
      const telemetry = this.hydrateTelemetry(result, teamA, teamB, preFlags);
      const quality = evaluateMatchQuality(telemetry, this.thresholds);
      const labels = this.buildLabels(teamA, teamB);
      const narrationEvents = telemetry.events.map(e => this.narrationMapper.mapEvent(e, labels));
      const report = analyzeMatchReport(telemetry, labels);

      return {
        ...result,
        telemetry,
        team_stats: telemetry.team_stats,
        player_stats: telemetry.player_stats,
        quality_flags: [...new Set([...(telemetry.quality_flags || []), ...(quality.flags || [])])],
        quality_result: quality,
        narrationEvents,
        matchReport: report
      };
    } catch (error) {
      if (this.fallbackSimulator) {
        const fallback = this.fallbackSimulator({ userTeam, opponentTeam, context });
        return {
          ...fallback,
          quality_flags: [...(fallback.quality_flags || []), 'calibrated_engine_failed_fallback_used'],
          error_message: error.message
        };
      }
      throw error;
    }
  }

  hydrateTelemetry(result, teamA, teamB, preFlags = []) {
    const telemetry = new SimulationTelemetry(result.match_id || `match_${Date.now()}`);
    for (const flag of preFlags) telemetry.addFlag(flag);

    const events = result.events || [];
    for (const event of events) {
      telemetry.recordEvent({
        ...event,
        event_type: event.event_type || event.eventType,
        team_wc_id: event.team_wc_id || event.context?.team_wc_id,
        opponent_team_wc_id: event.opponent_team_wc_id || event.context?.opponent_team_wc_id,
        minute: event.minute || event.context?.minute,
        probability_snapshot: event.distribution
      });
    }

    // Merge stats from simulator when available.
    for (const [teamId, stats] of Object.entries(result.stats || result.team_stats || {})) {
      telemetry.ensureTeam(teamId);
      telemetry.team_stats[teamId] = { ...telemetry.team_stats[teamId], ...stats };
    }

    return telemetry.toJSON();
  }

  buildLabels(teamA, teamB) {
    const labels = {
      [teamA.team_wc_id]: teamA.display_name,
      [teamB.team_wc_id]: teamB.display_name
    };
    for (const p of [...teamA.players, ...teamB.players]) labels[p.player_wc_id] = p.display_name;
    return labels;
  }
}

export function simulateCalibratedMatch(args) {
  const bridge = new LegionIntegrationBridge(args);
  return bridge.simulateMatch(args);
}
