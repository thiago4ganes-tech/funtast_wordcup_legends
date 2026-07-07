/**
 * Stage F Calibration Runner — Demonstration
 *
 * Uso:
 *   node tools/run_stage_f_calibration.js
 *
 * Este script demonstra o quality gate com dados sintéticos.
 * No projeto integrado, ele deve receber resultados reais do batch runner.
 */

const fs = require('fs');
const path = require('path');
const { evaluateBatchSummary } = require('../js/legion/statisticalQualityGate');
const { recommendAdjustments } = require('../js/legion/calibrationTuner');

const root = path.resolve(__dirname, '..');
const targets = JSON.parse(
  fs.readFileSync(path.join(root, 'data/legion/calibration_targets.json'), 'utf8')
);

const syntheticSummary = {
  avg_total_goals: 2.7,
  avg_total_xg: 2.9,
  avg_total_shots: 24,
  avg_shots_on_target: 8,
  avg_corners: 7,
  avg_cards: 3,
  penalty_goal_rate: 0.76,
  own_goal_frequency: 0.01,
  blowout_rate: 0.05
};

const gate = evaluateBatchSummary(syntheticSummary, targets);
const recommendations = recommendAdjustments(gate);

console.log(JSON.stringify({
  summary: syntheticSummary,
  gate,
  recommendations
}, null, 2));
