/**
 * LEGION — Simulation Telemetry
 *
 * Coleta eventos, estatísticas de time, estatísticas de jogador e flags de qualidade.
 */

export function createEmptyTeamStats() {
  return {
    goals: 0,
    xg: 0,
    shots: 0,
    shots_on_target: 0,
    crosses: 0,
    corners: 0,
    fouls: 0,
    cards: 0,
    turnovers: 0,
    final_third_entries: 0,
    blocked_shots: 0,
    saves_forced: 0
  };
}

export function createEmptyPlayerStats() {
  return {
    rating: 5.5,
    goals: 0,
    assists: 0,
    shots: 0,
    shots_on_target: 0,
    key_passes: 0,
    crosses: 0,
    defensive_actions: 0,
    errors: 0,
    event_involvement: 0
  };
}

export class SimulationTelemetry {
  constructor(matchId = `match_${Date.now()}`) {
    this.match_id = matchId;
    this.events = [];
    this.team_stats = {};
    this.player_stats = {};
    this.quality_flags = [];
  }

  ensureTeam(teamId) {
    if (!teamId) return;
    if (!this.team_stats[teamId]) this.team_stats[teamId] = createEmptyTeamStats();
  }

  ensurePlayer(playerId) {
    if (!playerId) return;
    if (!this.player_stats[playerId]) this.player_stats[playerId] = createEmptyPlayerStats();
  }

  addFlag(flag) {
    if (flag && !this.quality_flags.includes(flag)) this.quality_flags.push(flag);
  }

  recordEvent(event) {
    const safeEvent = {
      event_id: event.event_id || `event_${this.events.length + 1}`,
      minute: event.minute ?? null,
      team_wc_id: event.team_wc_id || null,
      opponent_team_wc_id: event.opponent_team_wc_id || null,
      event_type: event.event_type || event.eventType || 'unknown',
      outcome: event.outcome || 'unknown',
      actor_wc_id: event.actor_wc_id || null,
      support_actor_wc_id: event.support_actor_wc_id || null,
      defender_wc_id: event.defender_wc_id || null,
      goalkeeper_wc_id: event.goalkeeper_wc_id || null,
      zone: event.zone || null,
      xg_delta: Number(event.xg_delta || 0),
      probability_snapshot: event.probability_snapshot || event.distribution || null,
      modifiers_applied: event.modifiers_applied || null,
      quality_flags: event.quality_flags || []
    };

    this.events.push(safeEvent);
    this.ensureTeam(safeEvent.team_wc_id);
    this.ensureTeam(safeEvent.opponent_team_wc_id);
    this.ensurePlayer(safeEvent.actor_wc_id);
    this.ensurePlayer(safeEvent.support_actor_wc_id);
    this.ensurePlayer(safeEvent.defender_wc_id);
    this.ensurePlayer(safeEvent.goalkeeper_wc_id);

    this.applyEventToStats(safeEvent);
    for (const flag of safeEvent.quality_flags) this.addFlag(flag);
  }

  applyEventToStats(event) {
    const team = event.team_wc_id ? this.team_stats[event.team_wc_id] : null;
    const actor = event.actor_wc_id ? this.player_stats[event.actor_wc_id] : null;

    if (!team) return;

    team.xg += event.xg_delta || 0;

    if (['box_shot', 'header_attempt', 'long_shot', 'free_kick_direct', 'penalty'].includes(event.event_type)) {
      team.shots += 1;
      if (actor) actor.shots += 1;
    }

    if (['goal', 'save'].includes(event.outcome)) {
      team.shots_on_target += 1;
      if (actor) actor.shots_on_target += 1;
    }

    if (event.outcome === 'goal') {
      team.goals += 1;
      if (actor) {
        actor.goals += 1;
        actor.rating += 0.8;
      }
    }

    if (event.event_type === 'cross') {
      team.crosses += 1;
      if (actor) actor.crosses += 1;
    }

    if (event.outcome === 'corner_won') team.corners += 1;
    if (event.outcome === 'turnover') team.turnovers += 1;
    if (event.outcome === 'blocked') team.blocked_shots += 1;
    if (event.outcome === 'foul') team.fouls += 1;

    if (actor) {
      actor.event_involvement += 1;
      actor.rating = Math.max(2, Math.min(9, actor.rating));
    }
  }

  toJSON() {
    return {
      match_id: this.match_id,
      events: this.events,
      team_stats: this.team_stats,
      player_stats: this.player_stats,
      quality_flags: this.quality_flags
    };
  }
}
