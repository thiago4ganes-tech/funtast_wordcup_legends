/**
 * LEGION — Calibration Quality Gate
 *
 * Aprova ou reprova uma partida/lote de partidas com base em thresholds.
 */

export function evaluateMatchQuality(matchResult, thresholds = {}) {
  const flags = [];
  const single = thresholds.match_single || {};
  const teamStats = matchResult.team_stats || matchResult.stats || {};
  const teams = Object.values(teamStats);

  const totalGoals = teams.reduce((sum, t) => sum + Number(t.goals || 0), 0);
  const totalShots = teams.reduce((sum, t) => sum + Number(t.shots || 0), 0);
  const totalXg = teams.reduce((sum, t) => sum + Number(t.xg || 0), 0);

  if (single.max_goals_total_soft && totalGoals > single.max_goals_total_soft) flags.push('soft_high_goal_total');
  if (single.max_goals_total_hard && totalGoals > single.max_goals_total_hard) flags.push('hard_high_goal_total');
  if (single.max_shots_total_soft && totalShots > single.max_shots_total_soft) flags.push('soft_high_shot_total');
  if (single.max_xg_total_soft && totalXg > single.max_xg_total_soft) flags.push('soft_high_xg_total');

  if (single.allow_goals_without_shots === false && totalGoals > totalShots) flags.push('critical_goals_without_shots');

  const hasNaN = JSON.stringify(teamStats).includes('NaN');
  if (single.allow_nan_stats === false && hasNaN) flags.push('critical_nan_stats');

  const critical = flags.some(f => f.startsWith('critical') || f.startsWith('hard'));

  return {
    approved: !critical,
    flags,
    metrics: { totalGoals, totalShots, totalXg }
  };
}

export function evaluateBatchQuality(batchSummary, thresholds = {}) {
  const flags = [];
  const avg = thresholds.batch_average || {};
  const m = batchSummary.aggregate_metrics || {};

  function rangeCheck(metric, minKey, maxKey, lowFlag, highFlag) {
    if (avg[minKey] !== undefined && m[metric] < avg[minKey]) flags.push(lowFlag);
    if (avg[maxKey] !== undefined && m[metric] > avg[maxKey]) flags.push(highFlag);
  }

  rangeCheck('avg_goals_total', 'avg_goals_total_min', 'avg_goals_total_max', 'low_avg_goals', 'high_avg_goals');
  rangeCheck('avg_xg_total', 'avg_xg_total_min', 'avg_xg_total_max', 'low_avg_xg', 'high_avg_xg');
  rangeCheck('avg_shots_total', 'avg_shots_total_min', 'avg_shots_total_max', 'low_avg_shots', 'high_avg_shots');
  rangeCheck('avg_shots_on_target_total', 'avg_shots_on_target_min', 'avg_shots_on_target_max', 'low_avg_sot', 'high_avg_sot');

  return {
    approved: flags.length === 0,
    flags,
    recommendations: buildRecommendations(flags)
  };
}

function buildRecommendations(flags) {
  const recs = [];
  if (flags.includes('high_avg_goals')) recs.push('Reduzir conversão de box_shot/header_attempt e volume de chances claras.');
  if (flags.includes('low_avg_goals')) recs.push('Aumentar progressão ao último terço ou reduzir bloqueios/interceptações.');
  if (flags.includes('high_avg_shots')) recs.push('Aumentar reciclagem de posse, turnovers e bloqueios antes da finalização.');
  if (flags.includes('low_avg_shots')) recs.push('Aumentar eventos de progressão e entradas na área.');
  if (flags.includes('high_avg_xg')) recs.push('Reduzir frequência de chances claras e pênaltis.');
  if (flags.includes('low_avg_xg')) recs.push('Aumentar cutbacks, through balls e cruzamentos com alvo.');
  return recs;
}
