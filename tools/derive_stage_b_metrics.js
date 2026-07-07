/**
 * WCHD Stage B — Metric Derivation Skeleton
 *
 * Uso:
 *   node tools/derive_stage_b_metrics.js
 *
 * Este script é um esqueleto funcional. Ele calcula métricas básicas quando
 * os arquivos normalizados da Etapa A estiverem preenchidos.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NORMALIZED = path.join(ROOT, 'data', 'normalized');
const DERIVED = path.join(ROOT, 'data', 'derived');

function readJson(file) {
  const p = path.join(NORMALIZED, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(file, data) {
  const p = path.join(DERIVED, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function safeDiv(a, b) {
  if (a === null || a === undefined || b === null || b === undefined || b === 0) return null;
  return Number((a / b).toFixed(4));
}

function confidenceMin(...levels) {
  const order = { A: 1, B: 2, C: 3, D: 4 };
  const reverse = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
  const worst = Math.max(...levels.filter(Boolean).map(l => order[l] || 4));
  return reverse[worst] || 'D';
}

const teams = readJson('team_world_cup.json');
const matches = readJson('matches.json');
const players = readJson('player_world_cup.json');
const appearances = readJson('player_match_appearance.json');
const goals = readJson('goals.json');
const bookings = readJson('bookings.json');
const penalties = readJson('penalty_kicks.json');

const teamMetrics = teams.map(t => {
  const games = t.games ?? matches.filter(m => m.team_home_id === t.team_wc_id || m.team_away_id === t.team_wc_id).length;
  const goalsFor = t.goals_for ?? null;
  const goalsAgainst = t.goals_against ?? null;
  const wins = t.wins ?? null;
  const draws = t.draws ?? null;
  const losses = t.losses ?? null;

  return {
    team_wc_id: t.team_wc_id,
    country_id: t.country_id,
    year: t.year,
    games,
    wins,
    draws,
    losses,
    goals_for: goalsFor,
    goals_against: goalsAgainst,
    goal_difference: goalsFor !== null && goalsAgainst !== null ? goalsFor - goalsAgainst : null,
    goals_for_per_game: safeDiv(goalsFor, games),
    goals_against_per_game: safeDiv(goalsAgainst, games),
    points_equivalent: wins !== null && draws !== null ? wins * 3 + draws : null,
    points_per_game: wins !== null && draws !== null ? safeDiv(wins * 3 + draws, games) : null,
    win_rate: safeDiv(wins, games),
    clean_sheets: null,
    failed_to_score: null,
    knockout_games: null,
    knockout_goals_for: null,
    knockout_goals_against: null,
    opponent_strength_avg: null,
    campaign_index: null,
    attack_observed_index: null,
    defense_observed_index: null,
    confidence_level: confidenceMin(t.source_confidence || 'D')
  };
});

const teamGoalsByTeam = Object.fromEntries(teamMetrics.map(t => [t.team_wc_id, t.goals_for]));

const appearancesByPlayer = new Map();
for (const a of appearances) {
  if (!appearancesByPlayer.has(a.player_wc_id)) appearancesByPlayer.set(a.player_wc_id, []);
  appearancesByPlayer.get(a.player_wc_id).push(a);
}

const goalsByPlayer = new Map();
for (const g of goals) {
  if (!g.player_wc_id || g.is_own_goal) continue;
  goalsByPlayer.set(g.player_wc_id, (goalsByPlayer.get(g.player_wc_id) || 0) + 1);
}

const cardsByPlayer = new Map();
for (const b of bookings) {
  if (!cardsByPlayer.has(b.player_wc_id)) cardsByPlayer.set(b.player_wc_id, { yellow: 0, red: 0 });
  const c = cardsByPlayer.get(b.player_wc_id);
  if (b.card_type === 'yellow') c.yellow += 1;
  if (b.card_type === 'red' || b.card_type === 'second_yellow') c.red += 1;
}

const penaltiesByPlayer = new Map();
for (const p of penalties) {
  if (!penaltiesByPlayer.has(p.player_wc_id)) penaltiesByPlayer.set(p.player_wc_id, { taken: 0, scored: 0 });
  const rec = penaltiesByPlayer.get(p.player_wc_id);
  rec.taken += 1;
  if (p.converted) rec.scored += 1;
}

const playerMetrics = players.map(p => {
  const apps = appearancesByPlayer.get(p.player_wc_id) || [];
  const minutes = apps.length ? apps.reduce((sum, a) => sum + (a.minutes_played || 0), 0) : null;
  const matchesPlayed = apps.length || null;
  const starts = apps.length ? apps.filter(a => a.started).length : null;
  const playerGoals = goalsByPlayer.get(p.player_wc_id) ?? 0;
  const teamGoals = teamGoalsByTeam[p.team_wc_id] ?? null;
  const cards = cardsByPlayer.get(p.player_wc_id) || { yellow: 0, red: 0 };
  const pens = penaltiesByPlayer.get(p.player_wc_id) || { taken: 0, scored: 0 };

  return {
    player_wc_id: p.player_wc_id,
    player_base_id: p.player_base_id,
    team_wc_id: p.team_wc_id,
    country_id: p.country_id,
    year: p.year,
    matches_played: matchesPlayed,
    starts,
    minutes,
    minutes_share: null,
    goals: playerGoals,
    assists: null,
    assist_data_available: false,
    goal_participations: playerGoals,
    goals_per_90: safeDiv(playerGoals * 90, minutes),
    goal_participations_per_90: safeDiv(playerGoals * 90, minutes),
    team_goal_share: safeDiv(playerGoals, teamGoals),
    knockout_minutes: null,
    knockout_goals: null,
    semifinal_goals: null,
    final_goals: null,
    yellow_cards: cards.yellow,
    red_cards: cards.red,
    penalties_taken: pens.taken,
    penalties_scored: pens.scored,
    structural_importance_index: null,
    confidence_level: confidenceMin(p.source_confidence || 'D')
  };
});

writeJson('team_wc_metrics.json', teamMetrics);
writeJson('player_wc_metrics.json', playerMetrics);
writeJson('player_pair_minutes.json', []);
writeJson('head_to_head_metrics.json', []);
writeJson('opponent_strength_metrics.json', []);
writeJson('knockout_metrics.json', []);
writeJson('player_match_metrics.json', []);

console.log('WCHD Stage B metrics generated.');
console.log(`team_wc_metrics: ${teamMetrics.length}`);
console.log(`player_wc_metrics: ${playerMetrics.length}`);
