/**
 * LEGION — Match Report Analyzer
 *
 * Gera análise tático-estatística a partir da telemetria.
 */

function safeDiv(a, b) {
  if (!b) return null;
  return a / b;
}

function fmt(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return 'n/d';
  return Number(n).toFixed(digits);
}

export function analyzeMatchReport(telemetry, teamLabels = {}) {
  const stats = telemetry.team_stats || {};
  const teamIds = Object.keys(stats);
  if (teamIds.length < 2) {
    return {
      summary: 'Relatório indisponível: estatísticas de equipes insuficientes.',
      sections: [],
      quality_flags: ['insufficient_team_stats']
    };
  }

  const [aId, bId] = teamIds;
  const a = stats[aId];
  const b = stats[bId];
  const aName = teamLabels[aId] || aId;
  const bName = teamLabels[bId] || bId;

  const aEfficiency = safeDiv(a.goals, a.xg);
  const bEfficiency = safeDiv(b.goals, b.xg);
  const aAccuracy = safeDiv(a.shots_on_target, a.shots);
  const bAccuracy = safeDiv(b.shots_on_target, b.shots);

  const winner = a.goals === b.goals ? null : (a.goals > b.goals ? aName : bName);
  const loser = a.goals === b.goals ? null : (a.goals > b.goals ? bName : aName);

  let summary;
  if (!winner) {
    summary = `O empate refletiu uma partida equilibrada em placar, com ${aName} somando ${fmt(a.xg)} xG e ${bName} somando ${fmt(b.xg)} xG.`;
  } else {
    const wStats = a.goals > b.goals ? a : b;
    const lStats = a.goals > b.goals ? b : a;
    const xgSignal = wStats.xg >= lStats.xg ? 'também sustentou vantagem em criação de chances' : 'venceu apesar de criar menos xG, com eficiência superior nas conclusões';
    summary = `${winner} venceu e ${xgSignal}. O placar foi construído a partir de ${wStats.shots} finalizações e ${fmt(wStats.xg)} xG.`;
  }

  const sections = [
    {
      title: 'Eficiência ofensiva',
      text: `${aName}: ${a.goals} gol(s), ${fmt(a.xg)} xG, eficiência ${fmt(aEfficiency)}. ${bName}: ${b.goals} gol(s), ${fmt(b.xg)} xG, eficiência ${fmt(bEfficiency)}.`
    },
    {
      title: 'Volume e pontaria',
      text: `${aName} finalizou ${a.shots} vez(es), com ${a.shots_on_target} no alvo (${fmt(aAccuracy)}). ${bName} finalizou ${b.shots} vez(es), com ${b.shots_on_target} no alvo (${fmt(bAccuracy)}).`
    },
    {
      title: 'Construção das chances',
      text: `${aName} produziu ${a.crosses} cruzamento(s), ${a.corners} escanteio(s) e ${a.final_third_entries} entrada(s) no último terço. ${bName} produziu ${b.crosses} cruzamento(s), ${b.corners} escanteio(s) e ${b.final_third_entries} entrada(s) no último terço.`
    },
    {
      title: 'Controle e erros',
      text: `${aName} teve ${a.turnovers} perda(s) relevantes; ${bName} teve ${b.turnovers}. Esse dado ajuda a explicar transições e pressão territorial.`
    }
  ];

  return {
    summary,
    sections,
    score: { [aId]: a.goals, [bId]: b.goals },
    quality_flags: telemetry.quality_flags || []
  };
}
