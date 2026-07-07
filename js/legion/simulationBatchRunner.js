/**
 * LEGION — Simulation Batch Runner
 *
 * Roda lotes de simulações e agrega métricas.
 */

import { evaluateBatchQuality } from './calibrationQualityGate.js';

function emptyAggregate() {
  return {
    runs: 0,
    goals_total: 0,
    xg_total: 0,
    shots_total: 0,
    shots_on_target_total: 0,
    cards_total: 0,
    corners_total: 0,
    team_a_wins: 0,
    draws: 0,
    team_b_wins: 0
  };
}

export class SimulationBatchRunner {
  constructor({ simulateMatch, thresholds = {} } = {}) {
    this.simulateMatch = simulateMatch;
    this.thresholds = thresholds;
  }

  runFixture(fixture, teamA, teamB) {
    const agg = emptyAggregate();
    const qualityFlags = [];
    const runs = fixture.runs || 100;

    for (let i = 0; i < runs; i++) {
      const result = this.simulateMatch(teamA, teamB, { fixture_id: fixture.fixture_id, run_index: i });
      const stats = result.team_stats || result.stats || {};
      const a = stats[teamA.team_wc_id] || {};
      const b = stats[teamB.team_wc_id] || {};

      agg.runs += 1;
      agg.goals_total += (a.goals || 0) + (b.goals || 0);
      agg.xg_total += (a.xg || 0) + (b.xg || 0);
      agg.shots_total += (a.shots || 0) + (b.shots || 0);
      agg.shots_on_target_total += (a.shots_on_target || 0) + (b.shots_on_target || 0);
      agg.cards_total += (a.cards || 0) + (b.cards || 0);
      agg.corners_total += (a.corners || 0) + (b.corners || 0);

      if ((a.goals || 0) > (b.goals || 0)) agg.team_a_wins += 1;
      else if ((a.goals || 0) < (b.goals || 0)) agg.team_b_wins += 1;
      else agg.draws += 1;

      for (const flag of result.quality_flags || []) {
        if (!qualityFlags.includes(flag)) qualityFlags.push(flag);
      }
    }

    const aggregate_metrics = {
      avg_goals_total: agg.goals_total / agg.runs,
      avg_xg_total: agg.xg_total / agg.runs,
      avg_shots_total: agg.shots_total / agg.runs,
      avg_shots_on_target_total: agg.shots_on_target_total / agg.runs,
      avg_cards_total: agg.cards_total / agg.runs,
      avg_corners_total: agg.corners_total / agg.runs,
      team_a_win_rate: agg.team_a_wins / agg.runs,
      draw_rate: agg.draws / agg.runs,
      team_b_win_rate: agg.team_b_wins / agg.runs
    };

    const summary = {
      fixture_id: fixture.fixture_id,
      runs: agg.runs,
      aggregate_metrics,
      quality_flags: qualityFlags
    };

    return {
      ...summary,
      quality_result: evaluateBatchQuality(summary, this.thresholds)
    };
  }
}
