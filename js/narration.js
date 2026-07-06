(function(){
  const icons={build:'🧠',pass:'🎯',dribble:'✨',cross:'📐',shot:'🥅',goal:'⚽',save:'🧤',foul:'🟨',defense:'🛡️',setpiece:'🎲',rebound:'🔁',miss:'↗️'};
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  function tag(type){ return `<span class="tag">${icons[type]||'•'} ${type}</span>`; }
  function line(minute,text,type='build',extra=''){ return {minute,text,type,html:`<b>${minute}'</b> ${text} ${tag(type)} ${extra||''}`}; }
  const zoneText={left:'pela esquerda',right:'pela direita',center:'pelo corredor central'};
  function build(carrier,zone){ return pick([
    `${carrier.name} recebe ${zoneText[zone]||'no meio'} e já levanta a cabeça para acelerar a jogada.`,
    `${carrier.name} aparece com espaço ${zoneText[zone]||'por dentro'}; a marcação começa a se ajustar.`,
    `A bola chega em ${carrier.name} ${zoneText[zone]||'no setor central'}, e o ataque ganha novo ritmo.`
  ]); }
  function turnover(defender,carrier){ return pick([
    `${defender.name} lê bem a jogada, encurta em ${carrier.name} e força a perda da posse.`,
    `${carrier.name} tenta proteger, mas ${defender.name} chega no tempo certo e corta o avanço.`,
    `Boa ação defensiva de ${defender.name}; o ataque perde a bola antes de entrar em zona realmente perigosa.`
  ]); }
  function pass(carrier,target){ return pick([
    `${carrier.name} enfia uma bola interessante para ${target.name}, quebrando a primeira linha de marcação.`,
    `${carrier.name} acelera com um passe vertical, e ${target.name} recebe já de frente para o gol.`,
    `Passe de boa leitura de ${carrier.name}; ${target.name} aparece entre os setores para dar sequência.`
  ]); }
  function cross(crosser,target){ return pick([
    `${crosser.name} chega ao fundo, olha para a área e manda na direção de ${target.name}.`,
    `${crosser.name} cruza com veneno; ${target.name} se movimenta nas costas da marcação.`,
    `Bola levantada por ${crosser.name}. A defesa recua, e ${target.name} ataca o espaço.`
  ]); }
  function shot(player,detail){ return pick([
    `${player.name} arruma o corpo e bate ${detail}.`,
    `${player.name} finaliza ${detail}; a bola sai com perigo.`,
    `${player.name} não pensa duas vezes e conclui ${detail}.`
  ]); }
  function goal(player,team,score){ return pick([
    `GOOOL! ${player.name} aparece no momento exato e manda para a rede. ${team} muda o placar: ${score}.`,
    `É GOL! Jogada bem construída, conclusão fria de ${player.name} e bola no fundo da rede. ${score}.`,
    `GOOOL! ${player.name} decide o lance com categoria. O placar agora é ${score}.`
  ]); }
  function save(gk){ return pick([
    `Grande defesa de ${gk.name}! O goleiro cresce no lance e evita o gol.`,
    `${gk.name} faz a leitura, salta bem e espalma para salvar sua equipe.`,
    `Defesa segura de ${gk.name}; a finalização tinha endereço.`
  ]); }
  function pressure(team){ return pick([
    `${team.name} começa a empurrar o adversário para trás e aumenta o volume no campo ofensivo.`,
    `O jogo entra em momento de pressão de ${team.name}; a bola ronda a área.`,
    `${team.name} sustenta a posse no último terço, e o lance perigoso parece amadurecer.`
  ]); }
  window.FWCL_NARRATION={line,tag,icons,build,turnover,pass,cross,shot,goal,save,pressure};
})();
