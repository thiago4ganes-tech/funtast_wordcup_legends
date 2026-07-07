/**
 * LEGION — Calibrated Event Graph
 *
 * Esqueleto do Event Graph calibrado.
 * A integração completa com a UI fica para a próxima release.
 */

import { applyModifiers, weightedPick, boundedRandomNoise } from './eventProbability.js';

export class CalibratedEventGraph {
  constructor({ baseProbabilities, evidenceAdapter, rng = Math.random } = {}) {
    this.baseProbabilities = baseProbabilities || {};
    this.evidence = evidenceAdapter;
    this.rng = rng;
    this.recentEvents = [];
  }

  resolveEvent(eventType, context = {}) {
    const base = this.baseProbabilities[eventType];
    if (!base) {
      return {
        eventType,
        outcome: 'possession_retained',
        distribution: { possession_retained: 1 },
        context
      };
    }

    const modifierMap = this.buildOutcomeModifiers(eventType, context);
    const distribution = applyModifiers(base, modifierMap);
    const outcome = weightedPick(distribution, this.rng);

    this.recentEvents.push(eventType);
    if (this.recentEvents.length > 6) this.recentEvents.shift();

    return { eventType, outcome, distribution, context };
  }

  buildOutcomeModifiers(eventType, context) {
    const actorMods = context.actor_wc_id ? this.evidence.getPlayerModifiers(context.actor_wc_id) : {};
    const supportMods = context.support_actor_wc_id ? this.evidence.getPlayerModifiers(context.support_actor_wc_id) : {};
    const defenderMods = context.defender_wc_id ? this.evidence.getPlayerModifiers(context.defender_wc_id) : {};
    const goalkeeperMods = context.goalkeeper_wc_id ? this.evidence.getPlayerModifiers(context.goalkeeper_wc_id) : {};
    const teamMods = context.team_wc_id ? this.evidence.getTeamModifiers(context.team_wc_id) : {};
    const oppMods = context.opponent_team_wc_id ? this.evidence.getTeamModifiers(context.opponent_team_wc_id) : {};

    const noise = boundedRandomNoise(this.rng, eventType === 'penalty' ? 0.025 : 0.04);
    const antiRepeat = this.recentEvents.filter(e => e === eventType).length >= 2 ? -0.03 : 0;

    if (eventType === 'box_shot') {
      return {
        goal:
          (actorMods.chance_shot_conversion_bonus || 0) +
          (actorMods.chance_big_chance_conversion_bonus || 0) +
          (teamMods.team_attack_volume_modifier || 0) -
          (goalkeeperMods.chance_save_bonus || 0) -
          (defenderMods.chance_block_bonus || 0) -
          (oppMods.team_defensive_resistance_modifier || 0) +
          noise,
        save: (goalkeeperMods.chance_save_bonus || 0) + noise * 0.5,
        blocked: (defenderMods.chance_block_bonus || 0) + (oppMods.team_defensive_resistance_modifier || 0),
        miss: antiRepeat
      };
    }

    if (eventType === 'cross') {
      return {
        header_attempt:
          (actorMods.chance_cross_accuracy_bonus || 0) +
          (supportMods.chance_header_goal_bonus || 0) +
          (teamMods.team_aerial_threat_modifier || 0) -
          (goalkeeperMods.chance_claim_cross_bonus || 0) -
          (oppMods.team_defensive_resistance_modifier || 0) +
          noise,
        goalkeeper_claim: (goalkeeperMods.chance_claim_cross_bonus || 0),
        clearance: (oppMods.team_defensive_resistance_modifier || 0),
        cross_blocked: (defenderMods.chance_block_bonus || 0)
      };
    }

    if (eventType === 'through_ball') {
      return {
        box_shot:
          (actorMods.chance_through_ball_success_bonus || 0) +
          (teamMods.team_transition_speed_modifier || 0) -
          (defenderMods.chance_interception_bonus || 0) -
          (oppMods.team_defensive_resistance_modifier || 0) +
          noise,
        interception: (defenderMods.chance_interception_bonus || 0) + (oppMods.team_defensive_resistance_modifier || 0),
        offside: antiRepeat
      };
    }

    if (eventType === 'header_attempt') {
      return {
        goal:
          (actorMods.chance_header_goal_bonus || 0) +
          (teamMods.team_aerial_threat_modifier || 0) -
          (goalkeeperMods.chance_save_bonus || 0) -
          (oppMods.team_defensive_resistance_modifier || 0) +
          noise,
        save: (goalkeeperMods.chance_save_bonus || 0),
        clearance: (oppMods.team_defensive_resistance_modifier || 0)
      };
    }

    return {};
  }
}
