(function(){
  const S = () => window.FWCL_SKILLS;
  const N = () => window.FWCL_NARRATION;
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function weighted(items){
    const total = items.reduce((a,i)=>a+Math.max(0,i.w),0) || 1;
    let r = Math.random()*total;
    for(const i of items){ r -= Math.max(0,i.w); if(r<=0) return i.v; }
    return items[items.length-1].v;
  }
  function byRole(team, labels){
    const all = team.lineup || team.players || [];
    const pool = all.filter(p => (p.positions||[]).some(x=>labels.includes(x)) || labels.includes(p.role));
    return pool.length ? rand(pool) : rand(all);
  }
  function defenderFor(team, zone){
    if(zone==='left') return byRole(team,['LD','ZAG','VOL']);
    if(zone==='right') return byRole(team,['LE','ZAG','VOL']);
    if(zone==='center') return byRole(team,['ZAG','VOL','MC']);
    return byRole(team,['ZAG','VOL','LD','LE']);
  }
  function goalie(team){ return byRole(team,['GK']); }
  function ensureStats(team){
    team.stats = team.stats || {posses:0, attacks:0, finalThird:0, shots:0, onTarget:0, goals:0, xg:0, crosses:0, dribbles:0, passes:0, fouls:0, cards:0, saves:0, corners:0, pens:0, turnovers:0};
    for(const p of (team.lineup||[])){
      p.match = p.match || {rating:5.5, goals:0, assists:0, shots:0, onTarget:0, xg:0, saves:0, passes:0, dribbles:0, crosses:0, tackles:0, fouls:0, cards:0, losses:0, keyActions:0};
    }
  }
  function addRating(p, delta){ if(p && p.match) p.match.rating = S().clamp(p.match.rating + delta, 2, 9); }
  function pickCarrier(team){
    const all = team.lineup || team.players || [];
    return weighted(all.map(p=>{
      const sk = p.skills||{};
      let w = (sk.vision||55)*.3 + (sk.passing||55)*.25 + (sk.dribble||55)*.2 + (sk.decision||55)*.15 + (sk.pace||55)*.1;
      if((p.positions||[]).some(x=>['MEI','MC','PD','PE','SA'].includes(x))) w *= 1.4;
      if((p.player_class||'').includes('👑')) w *= 1.25;
      return {v:p,w};
    }));
  }
  function pickFinisher(team, kind){
    const all = team.lineup || team.players || [];
    return weighted(all.map(p=>{
      const sk = p.skills||{};
      let w = (sk.finishing||45)*.45 + (sk.decision||55)*.2 + (sk.composure||55)*.2;
      if(kind==='header') w += (sk.heading||45)*.45 + (sk.aerial||45)*.25;
      if((p.positions||[]).some(x=>['CA','F9','SA','PD','PE'].includes(x))) w *= 1.55;
      if((p.player_class||'').includes('👑')) w *= 1.20;
      return {v:p,w};
    }));
  }
  function chanceXg(kind, attacker, defender, gk, quality){
    let base = {cross:0.12, header:0.16, through:0.22, dribble:0.18, long:0.06, rebound:0.26, penalty:0.76}[kind] || 0.12;
    const fin = S().actionScore(attacker, kind==='header'?'header': kind==='long'?'longShot':'finish', {type:kind});
    const def = S().actionScore(defender,'defend',{type:kind});
    const g = S().actionScore(gk,'goalkeeper',{type:kind});
    base += (quality-0.5)*0.18 + (fin-75)*0.003 - (def-70)*0.0017 - (g-72)*0.0015;
    return S().clamp(base, kind==='penalty'?0.62:0.02, kind==='penalty'?0.86:0.48);
  }
  function shotOutcome(match, attack, defend, minute, kind, carrier, finisher, defender, assistText){
    const gk = goalie(defend);
    const q = S().duel(finisher, defender, kind==='header'?'header':'finish', {minute, type:kind, bigChance:kind!=='long'});
    const xg = chanceXg(kind, finisher, defender, gk, q);
    attack.stats.shots++; attack.stats.xg += xg; finisher.match.shots++; finisher.match.xg += xg;
    addRating(finisher, .06 + xg*.2);
    const lines = [];
    lines.push(N().line(minute, `${finisher.name} finaliza ${assistText}. ${gk.name} reage.`, 'shot', `<span class="tag">xG ${xg.toFixed(2)}</span>`));
    const saveSkill = S().actionScore(gk,'goalkeeper',{minute,type:'save'});
    const conversion = S().clamp(xg * (0.88 + (S().actionScore(finisher,'finish',{minute,type:kind})-70)/180) * (1 - (saveSkill-70)/320), 0.01, 0.52);
    const r = Math.random();
    if(r < conversion){
      match.score[attack.key]++; attack.stats.goals++; attack.stats.onTarget++; finisher.match.goals++; finisher.match.onTarget++; addRating(finisher, 1.0); addRating(gk, -.35);
      if(carrier && carrier !== finisher){ carrier.match.assists++; addRating(carrier,.45); }
      lines.push(N().line(minute, `GOOOL! ${finisher.name} decide a jogada com precisão. Placar atualizado.`, 'goal', `<span class="tag">xG ${xg.toFixed(2)}</span>`));
      match.goalEvents.push({minute, team:attack.name, player:finisher.name, score:`${match.score.home} x ${match.score.away}`});
    } else if(r < conversion + xg*.65){
      attack.stats.onTarget++; defend.stats.saves++; finisher.match.onTarget++; gk.match.saves++; addRating(gk,.32); addRating(finisher,.08);
      lines.push(N().line(minute, `${gk.name} faz boa defesa e evita o gol.`, 'save'));
      if(Math.random()<0.18){
        const rebounder = pickFinisher(attack,'rebound');
        lines.push(N().line(minute, `A bola sobra na área. ${rebounder.name} tenta aproveitar o rebote.`, 'rebound'));
        const sub = shotOutcome(match, attack, defend, minute, 'rebound', finisher, rebounder, defender, 'no rebote curto');
        return lines.concat(sub.slice(1));
      }
    } else {
      addRating(finisher,-.08);
      lines.push(N().line(minute, `${finisher.name} manda para fora. Chance desperdiçada.`, 'miss'));
    }
    return lines;
  }
  function possession(match, attack, defend, minute){
    ensureStats(attack); ensureStats(defend);
    const lines = [];
    attack.stats.posses++;
    const zone = weighted([{v:'left',w:30},{v:'center',w:40},{v:'right',w:30}]);
    const carrier = pickCarrier(attack);
    const marker = defenderFor(defend, zone);
    const mode = weighted([
      {v:'passVertical', w:S().actionScore(carrier,'passVertical',{minute,type:'build'})},
      {v:'dribble', w:S().actionScore(carrier,'dribble',{minute,type:'duel'})*.75},
      {v:'cross', w:(zone==='center'?35:S().actionScore(carrier,'cross',{minute,type:'cross'}))},
      {v:'longShot', w:S().actionScore(carrier,'longShot',{minute,type:'shot'})*.45},
      {v:'turnover', w:28}
    ]);
    attack.stats.attacks++;
    const zoneText = zone==='left'?'lado esquerdo':zone==='right'?'lado direito':'corredor central';
    lines.push(N().line(minute, `${carrier.name} recebe pelo ${zoneText} e procura a melhor decisão.`, 'build'));
    if(mode==='turnover'){
      attack.stats.turnovers++; carrier.match.losses++; addRating(carrier,-.08); addRating(marker,.09);
      lines.push(N().line(minute, `${marker.name} fecha o espaço e força a perda da posse.`, 'defense'));
      return lines;
    }
    const duelOk = S().duel(carrier, marker, mode==='longShot'?'finish':mode, {minute,type:mode, tense:minute>70});
    if(Math.random() > duelOk){
      attack.stats.turnovers++; carrier.match.losses++; addRating(carrier,-.08); addRating(marker,.16);
      lines.push(N().line(minute, `${marker.name} leva vantagem sobre ${carrier.name} e corta a progressão.`, 'defense'));
      return lines;
    }
    carrier.match.keyActions++; addRating(carrier,.12); attack.stats.finalThird++;
    if(mode==='passVertical'){
      attack.stats.passes++; carrier.match.passes++;
      const finisher = pickFinisher(attack,'through');
      lines.push(N().line(minute, `${carrier.name} acha passe vertical para ${finisher.name} entre as linhas.`, 'pass'));
      return lines.concat(shotOutcome(match, attack, defend, minute, 'through', carrier, finisher, defenderFor(defend,'center'), 'após passe vertical'));
    }
    if(mode==='dribble'){
      attack.stats.dribbles++; carrier.match.dribbles++;
      lines.push(N().line(minute, `${carrier.name} vence o duelo individual e cria superioridade.`, 'dribble'));
      return lines.concat(shotOutcome(match, attack, defend, minute, 'dribble', carrier, carrier, marker, 'depois do drible'));
    }
    if(mode==='cross'){
      attack.stats.crosses++; carrier.match.crosses++;
      const target = pickFinisher(attack,'header');
      const d = defenderFor(defend,'center');
      lines.push(N().line(minute, `${carrier.name} cruza na área procurando ${target.name}.`, 'cross'));
      const crossResult = weighted([
        {v:'keeperCatch', w:S().actionScore(goalie(defend),'goalkeeper',{minute,type:'cross'})*.24},
        {v:'defClear', w:S().actionScore(d,'defend',{minute,type:'header'})*.35},
        {v:'header', w:S().actionScore(target,'header',{minute,type:'header'})*.34},
        {v:'penalty', w:2.2 + Math.max(0,70-S().skill(d,'discipline'))/10},
        {v:'ownGoal', w:0.65}
      ]);
      if(crossResult==='keeperCatch'){ addRating(goalie(defend),.16); lines.push(N().line(minute, `${goalie(defend).name} antecipa e fica com a bola pelo alto.`, 'save')); return lines; }
      if(crossResult==='defClear'){ addRating(d,.17); lines.push(N().line(minute, `${d.name} sobe bem e afasta o perigo pelo alto.`, 'defense')); return lines; }
      if(crossResult==='penalty'){
        attack.stats.pens++; defend.stats.fouls++; d.match.fouls++; addRating(d,-.5);
        lines.push(N().line(minute, `${d.name} se atrasa no contato. Pênalti marcado.`, 'foul'));
        const taker = pickFinisher(attack,'penalty');
        return lines.concat(shotOutcome(match, attack, defend, minute, 'penalty', carrier, taker, goalie(defend), 'na cobrança de pênalti'));
      }
      if(crossResult==='ownGoal'){
        match.score[attack.key]++; attack.stats.goals++; defend.stats.turnovers++; addRating(d,-.9);
        lines.push(N().line(minute, `Lance raro: ${d.name} tenta cortar e manda contra a própria meta. Gol contra.`, 'goal'));
        match.goalEvents.push({minute, team:attack.name, player:`Gol contra de ${d.name}`, score:`${match.score.home} x ${match.score.away}`});
        return lines;
      }
      return lines.concat(shotOutcome(match, attack, defend, minute, 'header', carrier, target, d, 'de cabeça após cruzamento'));
    }
    if(mode==='longShot'){
      lines.push(N().line(minute, `${carrier.name} encontra espaço e arrisca de fora da área.`, 'shot'));
      return lines.concat(shotOutcome(match, attack, defend, minute, 'long', carrier, carrier, marker, 'de média distância'));
    }
    return lines;
  }
  function teamStrength(team){
    const players = team.lineup || team.players || [];
    if(!players.length) return 50;
    return players.reduce((a,p)=> a + S().actionScore(p,'build',{}),0) / players.length;
  }
  function simulate(homeInput, awayInput, options={}){
    const home = {key:'home', name:homeInput.name, flag:homeInput.flag, lineup:homeInput.lineup||homeInput.players||[], stats:null};
    const away = {key:'away', name:awayInput.name, flag:awayInput.flag, lineup:awayInput.lineup||awayInput.players||[], stats:null};
    ensureStats(home); ensureStats(away);
    const match = {home, away, score:{home:0, away:0}, events:[], goalEvents:[]};
    let minute = 1;
    const hStr = teamStrength(home), aStr = teamStrength(away);
    while(minute <= 90){
      const homeWeight = 50 + (hStr-aStr)*0.4 + (match.score.home < match.score.away ? 7 : 0) - (match.score.home > match.score.away ? 4 : 0);
      const isHome = Math.random()*100 < S().clamp(homeWeight,35,65);
      const attack = isHome ? home : away;
      const defend = isHome ? away : home;
      const generated = possession(match, attack, defend, minute);
      match.events.push(...generated);
      minute += Math.floor(1 + Math.random()*4);
    }
    match.events.push(N().line(90, `Fim de jogo. Resultado: ${match.score.home} x ${match.score.away}.`, 'build'));
    return match;
  }
  window.FWCL_EVENT_GRAPH = { simulate };
})();
