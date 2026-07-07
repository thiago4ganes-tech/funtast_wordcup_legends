/**
 * WCHD Stage C — Attribute and LEGION Modifier Derivation Skeleton
 *
 * Uso:
 *   node tools/derive_stage_c_attributes.js
 *
 * Este script gera atributos e modificadores básicos a partir das métricas da Etapa B.
 * Ele foi desenhado para ser conservador: quando não há evidência suficiente, retorna null
 * ou aplica fallback com confiança reduzida.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DERIVED = path.join(ROOT, 'data', 'derived');

function readJson(file) {
  const p = path.join(DERIVED, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(file, data) {
  const p = path.join(DERIVED, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function clamp(n, min, max) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.max(min, Math.min(max, n));
}

function capByConfidence(value, confidence) {
  if (value === null || value === undefined) return null;
  const caps = { A: 99, B: 94, C: 88, D: 82 };
  return clamp(value, 1, caps[confidence] || 82);
}

function scoreFromRatio(value, baseline = 0.25, spread = 0.15) {
  if (value === null || value === undefined) return null;
  return clamp(50 + ((value - baseline) / spread) * 12, 1, 99);
}

function modifierFromAttribute(value, center = 75, maxAbs = 0.18) {
  if (value === null || value === undefined) return 0;
  const raw = ((value - center) / 24) * maxAbs;
  return Number(clamp(raw, -maxAbs, maxAbs).toFixed(4));
}

function safeNumber(v) {
  return typeof v === 'number' && !Number.isNaN(v) ? v : null;
}

const playerMetrics = readJson('player_wc_metrics.json');
const teamMetrics = readJson('team_wc_metrics.json');

const teamById = new Map(teamMetrics.map(t => [t.team_wc_id, t]));

const playerAttributes = playerMetrics.map(p => {
  const team = teamById.get(p.team_wc_id) || {};
  const confidence = p.confidence_level || 'D';

  const goalsPer90Score = scoreFromRatio(p.goals_per_90, 0.30, 0.22);
  const teamGoalShareScore = scoreFromRatio(p.team_goal_share, 0.12, 0.10);
  const knockoutBonus = p.knockout_goals === null || p.knockout_goals === undefined ? null : clamp(55 + p.knockout_goals * 8, 1, 99);
  const finalSemiBonus = ((p.final_goals || 0) + (p.semifinal_goals || 0)) ? 88 : null;

  const finishingComponents = [goalsPer90Score, teamGoalShareScore, knockoutBonus, finalSemiBonus].filter(v => v !== null);
  const finishingRaw = finishingComponents.length
    ? finishingComponents.reduce((a, b) => a + b, 0) / finishingComponents.length
    : null;

  const disciplineBase = p.minutes && (p.yellow_cards !== null || p.red_cards !== null)
    ? 99 - (((p.yellow_cards || 0) + (p.red_cards || 0) * 4) / p.minutes * 90 * 18)
    : null;

  const reliabilityBase = p.minutes_share !== null && p.minutes_share !== undefined
    ? scoreFromRatio(p.minutes_share, 0.50, 0.30)
    : null;

  const clutchComponents = [knockoutBonus, finalSemiBonus, teamGoalShareScore].filter(v => v !== null);
  const clutchRaw = clutchComponents.length
    ? clutchComponents.reduce((a, b) => a + b, 0) / clutchComponents.length
    : null;

  const attributes = {
    finishing: capByConfidence(finishingRaw, confidence),
    heading: null,
    dribbling: null,
    vision: null,
    passing: null,
    crossing: null,
    pace: null,
    power: null,
    off_ball_movement: capByConfidence(teamGoalShareScore, confidence),
    marking: null,
    tackling: null,
    interception: null,
    aerial_defense: null,
    defensive_positioning: null,
    reflexes: null,
    handling: null,
    one_v_one: null,
    penalty_save: null,
    aerial_claim: null,
    decision: null,
    composure: capByConfidence(clutchRaw, confidence),
    clutch: capByConfidence(clutchRaw, confidence),
    leadership: null,
    discipline: capByConfidence(disciplineBase, confidence),
    reliability: capByConfidence(reliabilityBase, confidence),
    stamina: capByConfidence(reliabilityBase, confidence)
  };

  return {
    player_wc_id: p.player_wc_id,
    player_base_id: p.player_base_id,
    team_wc_id: p.team_wc_id,
    country_id: p.country_id,
    year: p.year,
    attributes,
    evidence_fields: ['goals_per_90', 'team_goal_share', 'knockout_goals', 'final_goals', 'minutes_share', 'cards'],
    formula_ids: ['C_PLAYER_FINISHING_V1', 'C_PLAYER_CLUTCH_V1', 'C_PLAYER_DISCIPLINE_V1', 'C_PLAYER_RELIABILITY_V1'],
    confidence_level: confidence,
    method_note: 'Atributos iniciais gerados de métricas observadas; campos sem evidência suficiente permanecem null.'
  };
});

const teamProfiles = teamMetrics.map(t => {
  const confidence = t.confidence_level || 'D';

  const attackBase = t.attack_observed_index ?? scoreFromRatio(t.goals_for_per_game, 1.4, 0.6);
  const defenseBase = t.defense_observed_index ?? scoreFromRatio(t.goals_against_per_game === null ? null : (2.2 - t.goals_against_per_game), 1.2, 0.5);

  return {
    team_wc_id: t.team_wc_id,
    country_id: t.country_id,
    year: t.year,
    profiles: {
      attack_profile: capByConfidence(attackBase, confidence),
      defense_profile: capByConfidence(defenseBase, confidence),
      transition_profile: null,
      possession_profile: null,
      aerial_profile: null,
      set_piece_profile: null,
      knockout_resilience_profile: null
    },
    evidence_fields: ['goals_for_per_game', 'goals_against_per_game', 'attack_observed_index', 'defense_observed_index'],
    formula_ids: ['C_TEAM_ATTACK_PROFILE_V1', 'C_TEAM_DEFENSE_PROFILE_V1'],
    confidence_level: confidence,
    method_note: 'Perfis iniciais conservadores; componentes táticos sem evidência suficiente permanecem null.'
  };
});

const playerModifiers = playerAttributes.map(p => {
  const a = p.attributes;
  return {
    player_wc_id: p.player_wc_id,
    modifiers: {
      chance_shot_conversion_bonus: modifierFromAttribute(a.finishing),
      chance_shot_on_target_bonus: modifierFromAttribute(a.finishing, 74, 0.14),
      chance_big_chance_conversion_bonus: modifierFromAttribute(a.composure, 75, 0.14),
      chance_header_goal_bonus: modifierFromAttribute(a.heading),
      chance_through_ball_success_bonus: modifierFromAttribute(a.vision),
      chance_key_pass_bonus: modifierFromAttribute(a.passing),
      chance_dribble_success_bonus: modifierFromAttribute(a.dribbling),
      chance_cross_accuracy_bonus: modifierFromAttribute(a.crossing),
      chance_tackle_success_bonus: modifierFromAttribute(a.tackling),
      chance_interception_bonus: modifierFromAttribute(a.interception),
      chance_save_bonus: modifierFromAttribute(a.reflexes),
      chance_penalty_save_bonus: modifierFromAttribute(a.penalty_save),
      risk_card_modifier: modifierFromAttribute(a.discipline, 75, 0.10) * -1
    },
    confidence_level: p.confidence_level,
    method_note: 'Modificadores derivados de atributos; atributos null geram modificador neutro.'
  };
});

const teamModifiers = teamProfiles.map(t => {
  const p = t.profiles;
  return {
    team_wc_id: t.team_wc_id,
    modifiers: {
      team_attack_volume_modifier: modifierFromAttribute(p.attack_profile, 75, 0.12),
      team_defensive_resistance_modifier: modifierFromAttribute(p.defense_profile, 75, 0.12),
      team_transition_speed_modifier: modifierFromAttribute(p.transition_profile, 75, 0.12),
      team_possession_control_modifier: modifierFromAttribute(p.possession_profile, 75, 0.12),
      team_aerial_threat_modifier: modifierFromAttribute(p.aerial_profile, 75, 0.12),
      team_set_piece_threat_modifier: modifierFromAttribute(p.set_piece_profile, 75, 0.12),
      team_knockout_resilience_modifier: modifierFromAttribute(p.knockout_resilience_profile, 75, 0.12)
    },
    confidence_level: t.confidence_level,
    method_note: 'Modificadores coletivos derivados de perfis; perfis null geram modificador neutro.'
  };
});

const competencyCandidates = playerAttributes
  .filter(p => (p.attributes.clutch || 0) >= 86)
  .map(p => ({
    player_wc_id: p.player_wc_id,
    competency_candidate: 'cresce_em_jogo_grande',
    trigger: 'knockout_or_late_game_pressure',
    evidence: ['clutch', 'knockout_goals', 'final_goals', 'team_goal_share'],
    status: 'candidate_pending_review',
    confidence_level: p.confidence_level,
    method_note: 'Candidato gerado por atributo clutch elevado; exige revisão antes de ativação.'
  }));

writeJson('player_derived_attributes.json', playerAttributes);
writeJson('team_derived_profiles.json', teamProfiles);
writeJson('player_legion_modifiers.json', playerModifiers);
writeJson('team_legion_modifiers.json', teamModifiers);
writeJson('player_competency_candidates.json', competencyCandidates);

console.log('WCHD Stage C attributes and modifiers generated.');
console.log(`player_derived_attributes: ${playerAttributes.length}`);
console.log(`team_derived_profiles: ${teamProfiles.length}`);
console.log(`player_legion_modifiers: ${playerModifiers.length}`);
console.log(`team_legion_modifiers: ${teamModifiers.length}`);
console.log(`player_competency_candidates: ${competencyCandidates.length}`);
