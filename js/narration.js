(function(){
  const icons={
    build:'🧠',pass:'🎯',dribble:'✨',cross:'📐',shot:'🥅',goal:'⚽',save:'🧤',foul:'🟨',
    defense:'🛡️',setpiece:'🎲',rebound:'🔁',miss:'↗️',corner:'🚩',offside:'🚫',
    throwin:'↔️',goalkick:'🥾',tackle:'💥',header:'⬆️',crowd:'📣',danger:'🔥',
    discipline:'🟥',penalty:'⚪',duel:'⚔️',substitution:'🔄',tactical:'📋',injury:'🩺',referee:'👨‍⚖️'
  };
  const labels={
    build:'construção',pass:'passe',dribble:'drible',cross:'cruzamento',shot:'finalização',
    goal:'gol',save:'defesa',foul:'falta',defense:'defesa',setpiece:'bola parada',
    rebound:'rebote',miss:'para fora',corner:'escanteio',offside:'impedimento',
    throwin:'lateral',goalkick:'tiro de meta',tackle:'dividida',header:'cabeceio',
    crowd:'torcida',danger:'perigo',discipline:'disciplina',penalty:'pênalti',duel:'disputa',substitution:'substituição',tactical:'ajuste tático',injury:'atendimento',referee:'arbitragem'
  };
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  function tag(type){ return `<span class="tag">${icons[type]||'•'} ${labels[type]||type}</span>`; }
  function line(minute,text,type='build',extra='',meta={}){
    return {minute,text,type,html:`<b>${minute}'</b> ${text} ${tag(type)} ${extra||''}`, ...meta};
  }
  const zoneText={left:'pela esquerda',right:'pela direita',center:'pelo corredor central'};
  function build(carrier,zone){ return pick([
    `${carrier.name} recebe ${zoneText[zone]||'no meio'} e levanta a cabeça para organizar.`,
    `${carrier.name} conduz ${zoneText[zone]||'por dentro'} enquanto a marcação fecha os espaços.`,
    `A bola chega a ${carrier.name} ${zoneText[zone]||'no setor central'} e o ataque muda de ritmo.`
  ]); }
  function turnover(defender,carrier){ return pick([
    `${defender.name} lê a jogada, encurta em ${carrier.name} e recupera a posse.`,
    `${carrier.name} tenta proteger, mas ${defender.name} vence a dividida.`,
    `${defender.name} antecipa o movimento e interrompe o avanço de ${carrier.name}.`
  ]); }
  function pass(carrier,target){ return pick([
    `${carrier.name} encontra ${target.name} com um passe que rompe a primeira linha.`,
    `${carrier.name} acelera a jogada e serve ${target.name} entre os setores.`,
    `Boa leitura de ${carrier.name}; ${target.name} recebe de frente para a defesa.`
  ]); }
  function cross(crosser,target){ return pick([
    `${crosser.name} chega ao fundo e cruza na direção de ${target.name}.`,
    `${crosser.name} manda uma bola venenosa; ${target.name} ataca as costas da marcação.`,
    `Cruzamento de ${crosser.name}. ${target.name} se posiciona para a disputa aérea.`
  ]); }
  function shot(player,detail){ return pick([
    `${player.name} arruma o corpo e bate ${detail}.`,
    `${player.name} finaliza ${detail}; o estádio prende a respiração.`,
    `${player.name} não pensa duas vezes e conclui ${detail}.`
  ]); }
  function goal(player,team,score){ return pick([
    `GOOOL! ${player.name} aparece no momento exato e manda para a rede. ${team} faz ${score}.`,
    `É GOL! Construção precisa, conclusão de ${player.name} e explosão nas arquibancadas. ${score}.`,
    `GOOOL! ${player.name} decide o lance com categoria. O placar agora é ${score}.`
  ]); }
  function save(gk,kind=''){ return pick([
    `Grande defesa de ${gk.name}! ${kind||'O goleiro cresce no lance e evita o gol.'}`,
    `${gk.name} faz a leitura e espalma. ${kind||'A finalização tinha endereço.'}`,
    `Defesa decisiva de ${gk.name}. ${kind||'A torcida reconhece a intervenção.'}`
  ]); }
  function crowd(team,context){ 
    const name=team?.name||team||'A torcida';
    const pools={
      support:[`${name} recebe apoio: a torcida canta sem parar.`,`As arquibancadas empurram ${name} para o ataque.`,`A torcida grita o nome de um jogador e aumenta a pressão.`],
      boo:[`A torcida vaia o adversário e tenta transformar o estádio em pressão.`,`Vaias descem das arquibancadas a cada toque do time rival.`],
      ownBoo:[`A torcida demonstra impaciência e vaia o próprio time pelo desempenho.`,`O mau momento provoca protestos e vaias nas arquibancadas.`],
      celebrate:[`A torcida vibra, pula e transforma o estádio numa festa.`,`Comemoração intensa nas arquibancadas.`],
      invasion:[`Com o apito final e a conquista histórica, alguns torcedores invadem o gramado antes da organização restabelecer o espaço.`]
    };
    return pick(pools[context]||pools.support);
  }
  function emotional(context){
    const pool={
      danger:['Jogada perigosíssima! A defesa está completamente exposta.','O lance ganha contornos de gol; ninguém fica sentado.'],
      almost:['QUASE! A bola passa muito perto e provoca um grito coletivo no estádio.','Por centímetros! Era uma chance para mudar a história da partida.'],
      hardFoul:['Falta dura. O árbitro corre para o local e tenta controlar os ânimos.','Entrada forte, jogadores cercam o árbitro e o clima esquenta.'],
      unfair:['Jogada desleal. O árbitro não aceita a atitude e chama o jogador para uma advertência.'],
      altercation:['Desentendimento entre adversários. Companheiros chegam para separar e evitar algo maior.'],
      comeback:['VIRADA HISTÓRICA! O time muda completamente o roteiro da partida.'],
      rout:['A partida se transforma em goleada. A diferença de desempenho agora é evidente.']
    };
    return pick(pool[context]||pool.danger);
  }
  window.FWCL_NARRATION={line,tag,icons,labels,build,turnover,pass,cross,shot,goal,save,crowd,emotional,pick};
})();
