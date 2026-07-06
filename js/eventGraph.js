window.EventGraph = {
  rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; },
  pickWeighted(items){
    const total = items.reduce((s,i)=>s+Math.max(0,i.w),0);
    let r = Math.random()*total;
    for(const i of items){ r -= Math.max(0,i.w); if(r <= 0) return i; }
    return items[items.length-1];
  },
  selectPlayers(team){
    const by = pos => team.players.filter(p=>p.positions.includes(pos) || p.position===pos);
    return {
      keeper: by('GK')[0] || team.players[0],
      defender: this.rand(by('ZAG').concat(by('LD'),by('LE'),by('VOL'))) || team.players[0],
      creator: this.rand(by('MEI').concat(by('MC'),by('PD'),by('PE'))) || team.players[0],
      wide: this.rand(by('PD').concat(by('PE'),by('LD'),by('LE'))) || team.players[0],
      striker: this.rand(by('CA').concat(by('SA'),by('F9'))) || team.players[0]
    };
  },
  createMatch(teamA, teamB){
    return { teamA, teamB, minute:0, scoreA:0, scoreB:0, events:[], stats:{}, ratings:{}, ended:false };
  },
  initStats(match){
    for(const t of [match.teamA, match.teamB]){
      match.stats[t.id] = {shots:0,goals:0,xg:0,crosses:0,passes:0,dribbles:0,fouls:0,cards:0,saves:0,duelsWon:0,possessions:0,finalThird:0};
      for(const p of t.players){ match.ratings[p.id] = {score:5.5,notes:[]}; }
    }
  },
  rate(match, player, delta, note){
    if(!player) return;
    if(!match.ratings[player.id]) match.ratings[player.id]={score:5.5,notes:[]};
    match.ratings[player.id].score = Math.max(2, Math.min(9, match.ratings[player.id].score + delta));
    if(note) match.ratings[player.id].notes.push(note);
  },
  simulate(match, onEvent){
    this.initStats(match);
    const timeline = [];
    const push = ev => { timeline.push(ev); onEvent && onEvent(ev, match); };
    push({minute:0,type:'start',text:`A bola rola para ${match.teamA.flag} ${match.teamA.name} contra ${match.teamB.flag} ${match.teamB.name}.`});
    while(match.minute < 90){
      match.minute += Math.max(1, Math.floor(Math.random()*4)+1);
      if(match.minute > 90) match.minute = 90;
      const attackTeam = Math.random() < 0.5 ? match.teamA : match.teamB;
      const defendTeam = attackTeam === match.teamA ? match.teamB : match.teamA;
      this.simulatePossession(match, attackTeam, defendTeam, push);
      if(match.minute===45) push({minute:45,type:'halftime',text:'Intervalo. O LEGION recalcula momento, desgaste e moral para a segunda etapa.'});
      if(match.minute===90) break;
    }
    push({minute:90,type:'end',text:`Fim de jogo. Resultado: ${match.scoreA} x ${match.scoreB}.`});
    match.ended = true;
    return timeline;
  },
  simulatePossession(match, atk, def, push){
    const A = this.selectPlayers(atk), D = this.selectPlayers(def);
    const context = {minute:match.minute,isKnockout:true,isPressure:Math.random()<0.35,teamLosing:(atk===match.teamA?match.scoreA<match.scoreB:match.scoreB<match.scoreA)};
    const st = match.stats[atk.id];
    st.possessions++;
    const route = this.pickWeighted([
      {name:'passe vertical',w:30},{name:'drible',w:22},{name:'cruzamento',w:24},{name:'chute de longe',w:12},{name:'perda na construção',w:12}
    ]).name;
    if(route === 'perda na construção'){
      const defender = D.defender;
      push({minute:match.minute,type:'turnover',text:`${A.creator.name} tenta acelerar pelo meio, mas ${defender.name} lê bem a jogada e recupera a posse.`,tag:'interceptação'});
      this.rate(match,A.creator,-0.06,'perdeu posse'); this.rate(match,defender,0.10,'interceptação'); return;
    }
    if(route === 'passe vertical') return this.verticalPass(match, atk, def, A, D, context, push);
    if(route === 'drible') return this.dribble(match, atk, def, A, D, context, push);
    if(route === 'cruzamento') return this.cross(match, atk, def, A, D, context, push);
    return this.longShot(match, atk, def, A, D, context, push);
  },
  verticalPass(match, atk, def, A, D, context, push){
    match.stats[atk.id].passes++;
    const p = SkillsEngine.duel(A.creator,D.defender,['pass','vision','composure'],['defense','positioning'],context);
    if(Math.random()<p){
      match.stats[atk.id].finalThird++;
      push({minute:match.minute,type:'creation',text:`${A.creator.name} encontra espaço entre as linhas e aciona ${A.striker.name} com passe vertical.`,tag:'passe vertical'});
      this.rate(match,A.creator,0.12,'passe progressivo');
      return this.finish(match, atk, def, A.striker, D.keeper, 0.18+Math.random()*0.22, context, push);
    }
    push({minute:match.minute,type:'defense',text:`${A.creator.name} procura o passe vertical, mas ${D.defender.name} intercepta no tempo certo.`,tag:'interceptação'});
    this.rate(match,A.creator,-0.05,'passe interceptado'); this.rate(match,D.defender,0.12,'interceptação');
  },
  dribble(match, atk, def, A, D, context, push){
    match.stats[atk.id].dribbles++;
    const p = SkillsEngine.duel(A.creator,D.defender,['dribble','pace','composure'],['defense','positioning','strength'],context);
    if(Math.random()<p){
      match.stats[atk.id].finalThird++;
      push({minute:match.minute,type:'skill',text:`${A.creator.name} encara ${D.defender.name}, vence o duelo no drible e cria superioridade.`,tag:'drible certo'});
      this.rate(match,A.creator,0.14,'drible certo'); this.rate(match,D.defender,-0.05,'superado no duelo');
      return this.finish(match, atk, def, A.creator, D.keeper, 0.12+Math.random()*0.18, context, push);
    }
    if(Math.random()<0.18){
      match.stats[atk.id].fouls++;
      push({minute:match.minute,type:'foul',text:`${D.defender.name} para ${A.creator.name} com falta antes da entrada da área.`,tag:'falta'});
      return this.freeKick(match, atk, def, A.creator, D.keeper, context, push);
    }
    push({minute:match.minute,type:'defense',text:`${D.defender.name} sustenta o duelo e desarma ${A.creator.name}.`,tag:'desarme'});
    this.rate(match,A.creator,-0.05,'drible perdido'); this.rate(match,D.defender,0.13,'desarme');
  },
  cross(match, atk, def, A, D, context, push){
    match.stats[atk.id].crosses++;
    const quality = SkillsEngine.duel(A.wide,D.defender,['cross','pace','composure'],['defense','positioning'],context);
    push({minute:match.minute,type:'cross',text:`${A.wide.name} avança pelo corredor e cruza para a área.`,tag:'cruzamento'});
    this.rate(match,A.wide,0.06,'cruzamento');
    const headingEdge = SkillsEngine.duel(A.striker,D.defender,['heading','positioning','strength'],['defense','heading','positioning'],context);
    const outcome = this.pickWeighted([
      {name:'keeperCatch',w:18 + SkillsEngine.skill(D.keeper,'goalkeeping')*15},
      {name:'defenderClear',w:24 + SkillsEngine.skill(D.defender,'defense')*16},
      {name:'header',w:18 + headingEdge*30 + quality*12},
      {name:'rebound',w:10},
      {name:'penalty',w:2 + (D.defender.traits?.includes('temperamental')?4:0)},
      {name:'ownGoal',w:1}
    ]).name;
    if(outcome==='keeperCatch') { push({minute:match.minute,type:'save',text:`${D.keeper.name} antecipa o cruzamento e fica com a bola.`,tag:'goleiro'}); this.rate(match,D.keeper,0.08,'saída pelo alto'); return; }
    if(outcome==='defenderClear') { push({minute:match.minute,type:'defense',text:`${D.defender.name} sobe bem e afasta o perigo pelo alto.`,tag:'corte'}); this.rate(match,D.defender,0.10,'corte aéreo'); return; }
    if(outcome==='penalty') return this.penalty(match, atk, def, A.striker, D.keeper, context, push);
    if(outcome==='ownGoal'){
      if(atk===match.teamA) match.scoreA++; else match.scoreB++;
      match.stats[atk.id].goals++;
      push({minute:match.minute,type:'goal',text:`⚽ GOL! O cruzamento desvia na defesa e termina contra a própria meta.`,tag:'gol contra'}); return;
    }
    if(outcome==='rebound') { push({minute:match.minute,type:'rebound',text:`A bola sobra viva na área após o cruzamento.`,tag:'rebote'}); return this.finish(match, atk, def, A.striker, D.keeper, 0.22+Math.random()*0.22, context, push); }
    push({minute:match.minute,type:'shot',text:`${A.striker.name} ganha espaço pelo alto e cabeceia para o gol.`,tag:'cabeceio'});
    return this.finish(match, atk, def, A.striker, D.keeper, 0.16+Math.random()*0.26, context, push);
  },
  longShot(match, atk, def, A, D, context, push){
    push({minute:match.minute,type:'shot',text:`${A.creator.name} arrisca de média distância.`,tag:'chute de longe'});
    return this.finish(match, atk, def, A.creator, D.keeper, 0.05+Math.random()*0.12, context, push);
  },
  freeKick(match, atk, def, shooter, keeper, context, push){
    push({minute:match.minute,type:'setpiece',text:`${shooter.name} se prepara para a cobrança da falta.`,tag:'bola parada'});
    return this.finish(match, atk, def, shooter, keeper, 0.07+Math.random()*0.15, context, push);
  },
  penalty(match, atk, def, shooter, keeper, context, push){
    push({minute:match.minute,type:'penalty',text:`Pênalti marcado. ${shooter.name} pega a bola.`,tag:'pênalti'});
    return this.finish(match, atk, def, shooter, keeper, 0.76, {...context,isPressure:true}, push);
  },
  finish(match, atk, def, shooter, keeper, xg, context, push){
    const st = match.stats[atk.id], dst=match.stats[def.id];
    st.shots++; st.xg += xg;
    const p = SkillsEngine.finishChance(shooter, keeper, xg, context);
    if(Math.random()<p){
      if(atk===match.teamA) match.scoreA++; else match.scoreB++;
      st.goals++;
      this.rate(match,shooter,0.55,'gol'); this.rate(match,keeper,-0.12,'sofreu gol');
      push({minute:match.minute,type:'goal',text:`⚽ GOOOOOL! ${shooter.name} decide a jogada com precisão. Placar atualizado.`,tag:'gol',xg:xg});
    } else {
      const save = Math.random() < (0.55 + SkillsEngine.skill(keeper,'goalkeeping')*0.25);
      if(save){ dst.saves++; this.rate(match,keeper,0.18,'defesa'); this.rate(match,shooter,0.02,'finalização defendida'); push({minute:match.minute,type:'save',text:`${keeper.name} faz a defesa e impede o gol de ${shooter.name}.`,tag:'defesa',xg:xg}); }
      else { this.rate(match,shooter,-0.03,'finalização para fora'); push({minute:match.minute,type:'miss',text:`${shooter.name} finaliza, mas a bola sai sem direção suficiente.`,tag:'finalização fora',xg:xg}); }
    }
  }
};
