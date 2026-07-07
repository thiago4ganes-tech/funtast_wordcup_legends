/**
 * LEGION — Event Probability Utilities
 *
 * Funções puras para transformar probabilidades-base e modificadores em distribuição final.
 */

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeDistribution(scores, minProb = 0.01, maxProb = 0.65) {
  const entries = Object.entries(scores);
  const clamped = entries.map(([key, value]) => [key, clamp(value, minProb, maxProb)]);
  const total = clamped.reduce((sum, [, value]) => sum + value, 0) || 1;
  return Object.fromEntries(clamped.map(([key, value]) => [key, value / total]));
}

export function weightedPick(distribution, rng = Math.random) {
  const r = rng();
  let acc = 0;
  for (const [key, value] of Object.entries(distribution)) {
    acc += value;
    if (r <= acc) return key;
  }
  return Object.keys(distribution).at(-1);
}

export function applyModifiers(baseOutcomes, modifierMap = {}, context = {}) {
  const scores = {};
  for (const [outcome, base] of Object.entries(baseOutcomes)) {
    let value = base;
    if (modifierMap[outcome]) value += modifierMap[outcome];
    if (context[outcome]) value += context[outcome];
    scores[outcome] = value;
  }
  return normalizeDistribution(scores);
}

export function boundedRandomNoise(rng = Math.random, amplitude = 0.04) {
  return (rng() * 2 - 1) * amplitude;
}
