/**
 * Stage G4 Output Validator
 * Usage:
 *   node tools/validate_stage_g4_outputs.js
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'data/production/wchd_players_production.json',
  'data/production/wchd_teams_production.json',
  'data/production/wchd_matches_production.json',
  'data/production/wchd_synergies_production.json',
  'data/production/wchd_legion_inputs.json',
  'data/quality/g4_final_data_composition_report.json',
  'data/manifest/production_manifest.json'
];

let missing = [];
for (const rel of required) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) missing.push(rel);
}

if (missing.length) {
  console.error('Missing G4 outputs:');
  missing.forEach(m => console.error(' - ' + m));
  process.exit(1);
}

const legion = JSON.parse(fs.readFileSync(path.join(root, 'data/production/wchd_legion_inputs.json'), 'utf8'));
if (!legion.players?.length || !legion.teams?.length) {
  console.error('wchd_legion_inputs.json without players or teams.');
  process.exit(1);
}

console.log('Stage G4 outputs OK.');
console.log(`Players: ${legion.players.length}`);
console.log(`Teams: ${legion.teams.length}`);
console.log(`Synergies: ${legion.synergies.length}`);
