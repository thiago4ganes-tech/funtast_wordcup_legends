/**
 * Stage G3 Output Validator
 * Usage:
 *   node tools/validate_stage_g3_outputs.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'data/estimated/player_technical_estimates.json',
  'data/estimated/team_style_estimates.json',
  'data/estimated/synergy_estimates.json',
  'data/quality/g3_estimation_coverage_report.json',
  'data/quality/g3_field_origin_breakdown.json',
  'data/methodology/g3_estimation_method_registry.json'
];

let missing = [];
for (const rel of required) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) missing.push(rel);
}

if (missing.length) {
  console.error('Missing G3 outputs:');
  missing.forEach(m => console.error(' - ' + m));
  process.exit(1);
}

console.log('Stage G3 outputs OK.');
