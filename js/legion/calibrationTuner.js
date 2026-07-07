/**
 * LEGION Stage F — Calibration Tuner
 * Produces recommended adjustments from quality gate warnings.
 */

function recommendAdjustments(gateResult) {
  const recommendations = [];

  for (const item of gateResult.results || []) {
    if (item.status === 'pass') continue;

    if (item.name === 'avg_total_goals' && item.value > item.target_max) {
      recommendations.push('Reduzir conversão de box_shot e header_attempt.');
      recommendations.push('Aumentar pesos de save, miss e blocked.');
    }

    if (item.name === 'avg_total_goals' && item.value < item.target_min) {
      recommendations.push('Aumentar progressões para box_shot e cutback.');
      recommendations.push('Reduzir interceptações automáticas em central_progression.');
    }

    if (item.name === 'avg_total_xg' && item.value > item.target_max) {
      recommendations.push('Reduzir volume de chances claras por posse.');
      recommendations.push('Reduzir through_ball → box_shot.');
    }

    if (item.name === 'avg_total_shots' && item.value > item.target_max) {
      recommendations.push('Reduzir posses relevantes por partida.');
      recommendations.push('Aumentar recycle_possession e turnovers não-finalizadores.');
    }

    if (item.name === 'avg_total_shots' && item.value < item.target_min) {
      recommendations.push('Aumentar final_third_entries.');
      recommendations.push('Aumentar probabilidade de cross, cutback e long_shot em progressões.');
    }

    if (item.name === 'avg_cards' && item.value > item.target_max) {
      recommendations.push('Reduzir risk_card_modifier e eventos de tactical_foul.');
    }

    if (item.name === 'penalty_goal_rate' && item.value > item.target_max) {
      recommendations.push('Reduzir probabilidade de goal em penalty.');
    }

    if (item.name === 'penalty_goal_rate' && item.value < item.target_min) {
      recommendations.push('Aumentar probabilidade de goal em penalty.');
    }
  }

  return [...new Set(recommendations)];
}

module.exports = {
  recommendAdjustments
};
