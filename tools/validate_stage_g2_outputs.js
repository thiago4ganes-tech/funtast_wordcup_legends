/**
 * Stage G2 Output Validator
 * Usage:
 *   node tools/validate_stage_g2_outputs.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'data/quality/g2_record_origin_summary.json',
  'data/quality/g2_field_coverage_matrix.json',
  'data/quality/g2_player_coverage_report.json',
  'data/quality/g2_team_coverage_report.json',
  'data/quality/g2_gap_register.json',
  'data/quality/g2_legion_weighted_coverage.json',
  'data/quality/g2_dashboard_summary.json'
];

let missing = [];
for (const rel of required) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) missing.push(rel);
}

if (missing.length) {
  console.error('Missing G2 outputs:');
  missing.forEach(m => console.error(' - ' + m));
  process.exit(1);
}

console.log('Stage G2 outputs OK.');
