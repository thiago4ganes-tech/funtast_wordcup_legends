const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'normalized');
const files = ['world_cups.json','countries.json','team_world_cup.json','matches.json','player_base.json','player_world_cup.json','goals.json','bookings.json','substitutions.json','penalty_kicks.json'];
function readJson(file){ const full=path.join(DATA,file); if(!fs.existsSync(full)) return []; return JSON.parse(fs.readFileSync(full,'utf8')); }
function idField(file){ return ({'world_cups.json':'world_cup_id','countries.json':'country_id','team_world_cup.json':'team_wc_id','matches.json':'match_id','player_base.json':'player_base_id','player_world_cup.json':'player_wc_id','goals.json':'goal_id','bookings.json':'booking_id','substitutions.json':'substitution_id','penalty_kicks.json':'penalty_id'})[file] || 'id'; }
let errors=[];
for(const file of files){ const rows=readJson(file); const id=idField(file); const seen=new Set(); rows.forEach((row,i)=>{ if(!row.source_primary) errors.push(`${file}[${i}] sem source_primary`); if(!row.source_confidence) errors.push(`${file}[${i}] sem source_confidence`); if(row[id]){ if(seen.has(row[id])) errors.push(`${file} ID duplicado: ${row[id]}`); seen.add(row[id]); } else if(rows.length>0){ errors.push(`${file}[${i}] sem ${id}`); } }); console.log(`${file}: ${rows.length} registros`); }
const playerBase = new Set(readJson('player_base.json').map(p=>p.player_base_id));
readJson('player_world_cup.json').forEach(p=>{ if(!playerBase.has(p.player_base_id)) errors.push(`player_world_cup sem player_base válido: ${p.player_wc_id}`); });
const matches = new Set(readJson('matches.json').map(m=>m.match_id));
['goals.json','bookings.json','substitutions.json','penalty_kicks.json'].forEach(file=>{ readJson(file).forEach(row=>{ if(row.match_id && !matches.has(row.match_id)) errors.push(`${file} referencia match inexistente: ${row.match_id}`); }); });
if(errors.length){ console.error('ERROS'); errors.forEach(e=>console.error(' - '+e)); process.exit(1); }
console.log('WCHD Stage A: validação estrutural básica OK.');
