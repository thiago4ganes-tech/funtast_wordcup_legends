/**
 * LEGION — Calibrated Match Simulator Skeleton
 *
 * Este simulador é um esqueleto para teste em lote.
 * A integração visual e seleção real de jogadores virão na próxima etapa.
 */

export class CalibratedMatchSimulator {
  constructor({ eventGraph, rng = Math.random } = {}) {
    this.eventGraph = eventGraph;
    this.rng = rng;
  }

  createInitialState(teamA, teamB) {
    return {
      minute: 0,
      score: { [teamA.team_wc_id]: 0, [teamB.team_wc_id]: 0 },
      stats: {
        [teamA.team_wc_id]: this.emptyStats(),
        [teamB.team_wc_id]: this.emptyStats()
      },
      events: []
    };
  }

  emptyStats() {
    return {
      goals: 0,
      xg: 0,
      shots: 0,
      shots_on_target: 0,
      crosses: 0,
      corners: 0,
      fouls: 0,
      cards: 0,
      turnovers: 0,
      final_third_entries: 0
    };
  }

  simulate(teamA, teamB, possessions = 38) {
    const state = this.createInitialState(teamA, teamB);

    for (let i = 0; i < possessions; i++) {
      state.minute = Math.min(90, Math.floor((i / possessions) * 90 + this.rng() * 3));
      const attacking = this.rng() < 0.5 ? teamA : teamB;
      const defending = attacking === teamA ? teamB : teamA;

      const chain = this.pickChain(attacking);
      for (const eventType of chain) {
        const result = this.eventGraph.resolveEvent(eventType, {
          minute: state.minute,
          team_wc_id: attacking.team_wc_id,
          opponent_team_wc_id: defending.team_wc_id
        });

        this.applyResult(state, attacking.team_wc_id, result);
        state.events.push(result);

        if (['goal', 'save', 'miss', 'blocked', 'clearance', 'turnover'].includes(result.outcome)) break;
      }
    }

    return state;
  }

  pickChain(team) {
    const chains = [
      ['build_up', 'central_progression', 'through_ball', 'box_shot'],
      ['build_up', 'wide_progression', 'cross', 'header_attempt'],
      ['transition_attack', 'through_ball', 'box_shot']
    ];
    return chains[Math.floor(this.rng() * chains.length)];
  }

  applyResult(state, teamId, result) {
    const s = state.stats[teamId];

    if (['box_shot', 'long_shot', 'header_attempt'].includes(result.eventType)) {
      s.shots += 1;
      s.xg += result.eventType === 'box_shot' ? 0.13 : result.eventType === 'header_attempt' ? 0.10 : 0.04;
    }

    if (result.eventType === 'cross') s.crosses += 1;

    if (result.outcome === 'goal') {
      s.goals += 1;
      s.shots_on_target += 1;
      state.score[teamId] += 1;
    }

    if (result.outcome === 'save') s.shots_on_target += 1;
    if (result.outcome === 'corner_won') s.corners += 1;
    if (result.outcome === 'turnover') s.turnovers += 1;
  }
}
