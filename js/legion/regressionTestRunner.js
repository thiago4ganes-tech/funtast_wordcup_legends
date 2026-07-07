/**
 * LEGION Stage F — Regression Test Runner
 * Skeleton for running fixture batches.
 */

function summarizeRuns(runs) {
  if (!runs || !runs.length) {
    return {
      avg_total_goals: null,
      avg_total_xg: null,
      avg_total_shots: null,
      avg_shots_on_target: null,
      avg_corners: null,
      avg_cards: null
    };
  }

  const total = runs.length;
  const sum = (fn) => runs.reduce((acc, r) => acc + (fn(r) || 0), 0);

  return {
    avg_total_goals: Number((sum(r => r.total_goals) / total).toFixed(3)),
    avg_total_xg: Number((sum(r => r.total_xg) / total).toFixed(3)),
    avg_total_shots: Number((sum(r => r.total_shots) / total).toFixed(3)),
    avg_shots_on_target: Number((sum(r => r.shots_on_target) / total).toFixed(3)),
    avg_corners: Number((sum(r => r.corners) / total).toFixed(3)),
    avg_cards: Number((sum(r => r.cards) / total).toFixed(3)),
    blowout_rate: Number((runs.filter(r => (r.goal_diff || 0) >= 4).length / total).toFixed(3))
  };
}

function createFixtureResult(fixture, summary, gateResult, recommendations) {
  return {
    fixture_id: fixture.fixture_id,
    team_a: fixture.team_a,
    team_b: fixture.team_b,
    runs: fixture.runs,
    summary,
    gate: gateResult,
    recommendations,
    status: gateResult.passed ? 'pass' : 'fail'
  };
}

module.exports = {
  summarizeRuns,
  createFixtureResult
};
