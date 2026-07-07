const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const report = JSON.parse(fs.readFileSync(path.join(root,'data/quality/data_origin_coverage_report.json'),'utf8'));
console.log('WCHD Stage G1 - record counts');
console.log(report.record_counts);
if (!report.record_counts.matches || !report.record_counts.player_world_cup) {
  console.error('Critical missing table.');
  process.exit(1);
}
console.log('Stage G1 validation OK.');
