(function(){
  const S=()=>window.FWCL_SKILLS;
  const N=()=>window.FWCL_NARRATION;
  const rand=a=>a[Math.floor(Math.random()*a.length)];
  function weighted(items){
    const total=items.reduce((a,i)=>a+Math.max(0,Number(i.w)||0),0)||1;
    let r=Math.random()*total;
    for(const i of items){ r-=Math.max(0,Number(i.w)||0); if(r<=0) return i.v; }
    return items[items.length-1].v;
  }
  function allPlayers(team){ return team.lineup||team.players||[]; }
  function byRole(team,labels){
    const all=allPlayers(team);
    const pool=all.filter(p=>(p.positions||[]).some(x=>labels.includes(x))||labels.includes(p.role));
    return pool.length?weighted(pool.map(p=>({v:p,w:S().classMultiplier(p)}))):rand(all);
  }
  function goalie(team){ return byRole(team,['GK']); }
  function defenderFor(team,zone){
    if(zone==='left') return byRole(team,['LD','ZAG','VOL']);
    if(zone==='right') return byRole(team,['LE','ZAG','VOL']);
    return byRole(team,['ZAG','VOL','MC']);
  }
  function ensureStats(team){
    team.stats=team.stats||{
      possessions:0,attacks:0,finalThird:0,shots:0,onTarget:0,goals:0,xg:0,crosses:0,
      dribbles:0,passes:0,fouls:0,foulsWon:0,cards:0,redCards:0,saves:0,corners:0,
      penalties:0,offsides:0,turnovers:0,throwIns:0,goalKicks:0,freeKicks:0,tackles:0,
      headers:0,oneTwos:0,overlaps:0,duels:0,dangerousAttacks:0,counters:0,
      longBalls:0,defendersInAttack:0,timeManagement:0,deepBlocks:0,boxEntries:0
    };
    allPlayers(team).forEach(p=>{
      p.match=p.match||{
        rating:5.5,goals:0,assists:0,shots:0,onTarget:0,xg:0,saves:0,passes:0,
        dribbles:0,crosses:0,tackles:0,headers:0,fouls:0,cards:0,losses:0,keyActions:0
      };
    });
  }
  function addRating(p,d){ if(p?.match) p.match.rating=S().clamp(p.match.rating+d,2,9); }
  function playerMeta(p){ return p?{id:p.id||p.player_wc_id,name:p.name}:null; }
  function event(match,minute,text,type,attack,actor,support,defender,extra='',more={}){
    return N().line(minute,text,type,extra,{
      possessionTeam:attack?.key||null,
      teamName:attack?.name||null,
      actor:playerMeta(actor),
      support:playerMeta(support),
      defender:playerMeta(defender),
      ...more
    });
  }

  function tacticalState(match,team,opponent,minute){
    const ownStrength=match.strengths?.[team.key]||50;
    const oppStrength=match.strengths?.[opponent.key]||50;
    const strengthDelta=ownStrength-oppStrength;
    const scoreDiff=match.score[team.key]-match.score[opponent.key];
    const trailing=scoreDiff<0;
    const losingByTwo=scoreDiff<=-2;
    const leading=scoreDiff>0;
    const leadingByTwo=scoreDiff>=2;
    const after60=minute>=60;
    const final15=minute>=75;
    const final8=minute>=82;
    const weaker=strengthDelta<=-5;
    const muchWeaker=strengthDelta<=-10;
    const stronger=strengthDelta>=5;
    const muchStronger=strengthDelta>=10;

    let risk=0.08;
    if(stronger)risk+=0.10;
    if(muchStronger)risk+=0.06;
    if(weaker)risk-=0.07;
    if(after60)risk+=0.08;
    if(trailing)risk+=0.16;
    if(losingByTwo)risk+=0.18;
    if(final15&&trailing)risk+=0.12;
    if(final8&&trailing)risk+=0.10;
    if(leading)risk-=0.11;
    if(leadingByTwo)risk-=0.07;
    risk=S().clamp(risk,-0.18,0.56);

    let defensiveBlock=0.04;
    if(weaker&&!trailing)defensiveBlock+=0.22;
    if(muchWeaker&&!trailing)defensiveBlock+=0.08;
    if(leading)defensiveBlock+=0.16;
    if(leadingByTwo)defensiveBlock+=0.10;
    if(trailing)defensiveBlock-=0.10;
    if(losingByTwo)defensiveBlock-=0.08;
    const fatigue=after60?Math.min(0.18,(minute-60)*0.006):0;
    defensiveBlock=S().clamp(defensiveBlock-fatigue,0,0.42);

    let aerial=0.04;
    if(after60&&trailing)aerial+=0.18;
    if(final15&&trailing)aerial+=0.18;
    if(losingByTwo)aerial+=0.12;
    if(final8&&trailing)aerial+=0.12;
    aerial=S().clamp(aerial,0,0.62);

    let directness=0.10;
    if(weaker)directness+=0.12;
    if(after60&&trailing)directness+=0.14;
    if(losingByTwo)directness+=0.10;
    if(leading&&final15)directness+=0.16;
    directness=S().clamp(directness,0,0.48);

    let possessionControl=0;
    if(stronger)possessionControl+=0.10;
    if(muchStronger)possessionControl+=0.06;
    if(weaker)possessionControl-=0.08;
    if(leading&&final15)possessionControl+=0.12;
    if(trailing&&final15)possessionControl-=0.04;

    let press=0.05;
    if(stronger)press+=0.08;
    if(after60&&trailing)press+=0.12;
    if(losingByTwo)press+=0.10;
    if(leading&&final15)press-=0.08;
    press=S().clamp(press,0,0.38);

    const defenderJoin=S().clamp(
      (after60&&trailing?0.18:0)+(losingByTwo?0.20:0)+(final15&&trailing?0.16:0),
      0,0.58
    );
    const timeManagement=S().clamp(
      (leading&&minute>=68?0.16:0)+(leading&&final15?0.18:0)+(leadingByTwo?0.08:0),
      0,0.46
    );
    const penaltyPressure=S().clamp(
      0.02+risk*0.18+(after60?0.025:0)+(final15&&trailing?0.035:0),
      0.01,0.16
    );
    const dangerousBoost=S().clamp(
      0.04+risk*0.25+(after60?0.04:0)+(trailing?0.035:0),
      0.02,0.24
    );

    return {
      scoreDiff,trailing,losingByTwo,leading,leadingByTwo,after60,final15,final8,
      weaker,muchWeaker,stronger,muchStronger,strengthDelta,risk,defensiveBlock,
      fatigue,aerial,directness,possessionControl,press,defenderJoin,timeManagement,
      penaltyPressure,dangerousBoost
    };
  }

  function pickAerialTarget(team,tactical){
    if(tactical?.defenderJoin>0&&Math.random()<tactical.defenderJoin){
      const defender=byRole(team,['ZAG','LE','LD']);
      if(defender){
        team.stats.defendersInAttack++;
        return defender;
      }
    }
    return pickFinisher(team,'header');
  }

  function pickCarrier(team,tactical){

    return weighted(allPlayers(team).map(p=>{
      const sk=p.skills||{};
      let w=(sk.vision||55)*.25+(sk.passing||55)*.22+(sk.dribble||55)*.22+(sk.decision||55)*.16+(sk.pace||55)*.08;
      if((p.positions||[]).some(x=>['MEI','MC','PD','PE','SA','LE','LD'].includes(x))) w*=1.35;
      if(tactical?.defenderJoin>0&&(p.positions||[]).some(x=>['ZAG','LE','LD'].includes(x))) w*=1+tactical.defenderJoin*1.35;
      if(tactical?.timeManagement>0&&(p.positions||[]).some(x=>['MEI','MC','PE','PD','LE','LD'].includes(x))) w*=1+tactical.timeManagement*.45;
      w*=S().classMultiplier(p);
      return {v:p,w};
    }));
  }
  function pickFinisher(team,kind){
    return weighted(allPlayers(team).map(p=>{
      const sk=p.skills||{};
      let w=(sk.finishing||45)*.45+(sk.decision||55)*.18+(sk.composure||55)*.22;
      if(kind==='header') w+=(sk.heading||45)*.42+(sk.aerial||45)*.22;
      if((p.positions||[]).some(x=>['CA','F9','SA','PD','PE'].includes(x))) w*=1.55;
      w*=S().classMultiplier(p);
      return {v:p,w};
    }));
  }
  function pickSupport(team,exclude){
    const pool=allPlayers(team).filter(p=>p!==exclude);
    return weighted(pool.map(p=>({v:p,w:S().actionScore(p,'oneTwo',{})*S().classMultiplier(p)})));
  }
  function shotTechnique(finisher,kind){
    if(kind==='header') return 'cabeceio';
    if(kind==='penalty') return 'cobrança firme';
    const high=S().skill(finisher,'finishing')+S().skill(finisher,'composure');
    const options=[
      {v:'rasteiro',w:24},{v:'colocado',w:20+Math.max(0,high-145)*.3},
      {v:'uma bomba',w:14+Math.max(0,S().skill(finisher,'power')-70)*.35},
      {v:'de trivela',w:S().skill(finisher,'dribble')>=82?7:1},
      {v:'buscando o ângulo',w:10+Math.max(0,S().skill(finisher,'finishing')-78)*.35}
    ];
    return weighted(options);
  }
  function dribbleName(player){
    const d=S().skill(player,'dribble');
    return weighted([
      {v:'um corte seco',w:30},{v:'uma finta de corpo',w:28},{v:'uma pedalada',w:d>=74?18:5},
      {v:'um elástico',w:d>=87?7:0.4},{v:'um lençol',w:d>=89?4:0.2},
      {v:'uma carretilha',w:d>=92?2:0.05}
    ]);
  }
  function chanceXg(match,attack,defend,minute,kind,attacker,defender,gk,quality){
    let base={box:0.18,header:0.14,through:0.25,dribble:0.22,long:0.07,rebound:0.28,freeKick:0.10,penalty:0.76}[kind]||0.14;
    const atkT=tacticalState(match,attack,defend,minute);
    const defT=tacticalState(match,defend,attack,minute);
    if(kind!=='penalty'){
      base+=atkT.risk*.055+atkT.dangerousBoost*.05-defT.defensiveBlock*.075;
      if(atkT.after60)base+=.008;
      if(atkT.losingByTwo)base+=.012;
      if(defT.weaker&&!defT.trailing)base-=.010;
    }
    const fin=S().actionScore(attacker,kind==='header'?'header':kind==='long'?'longShot':kind==='freeKick'?'freeKick':'finish',{type:kind,bigChance:kind==='through'||kind==='rebound'});
    const def=S().actionScore(defender,'defend',{type:kind});
    const g=S().actionScore(gk,'goalkeeper',{type:kind});
    base+=(quality-.5)*.16+(fin-75)*.0028-(def-70)*.0014-(g-72)*.0014;
    return S().clamp(base,kind==='penalty'?.64:.015,kind==='penalty'?.86:.42);
  }
  function goalEvent(match,attack,minute,finisher,assist,xg,lines,description){
    const otherKey=attack.key==='home'?'away':'home';
    const previousDiff=match.score[attack.key]-match.score[otherKey];
    if(previousDiff<0) match.trailed[attack.key]=true;
    match.score[attack.key]++;
    attack.stats.goals++; attack.stats.onTarget++;
    finisher.match.goals++; finisher.match.onTarget++;
    addRating(finisher,1.05); if(assist&&assist!==finisher){ assist.match.assists++; addRating(assist,.45); }
    const scoreText=`${match.score.home} x ${match.score.away}`;
    lines.push(event(match,minute,N().goal(finisher,attack.name,scoreText),'goal',attack,finisher,assist,null,`<span class="tag">xG ${xg.toFixed(2)}</span>`,{
      scoreAfter:{...match.score},danger:1,description
    }));
    match.goalEvents.push({minute,team:attack.name,teamKey:attack.key,player:finisher.name,score:scoreText});
    const newDiff=match.score[attack.key]-match.score[otherKey];
    if(match.trailed[attack.key]&&newDiff>0){
      lines.push(event(match,minute,N().emotional('comeback'),'danger',attack,finisher,assist,null,'',{danger:1}));
      match.trailed[attack.key]=false;
    }
    if(newDiff<0) match.trailed[attack.key]=true;
    if(Math.abs(match.score.home-match.score.away)>=3) lines.push(event(match,minute,N().emotional('rout'),'crowd',attack,finisher,null,null,'',{danger:.7}));
    lines.push(event(match,minute,N().crowd(attack,'celebrate'),'crowd',attack,finisher,null,null));
  }
  function shotOutcome(match,attack,defend,minute,kind,carrier,finisher,defender,lead,allowRebound=true){
    const gk=goalie(defend);
    const q=S().duel(finisher,defender,kind==='header'?'header':'finish',{minute,type:kind,bigChance:['through','rebound','penalty'].includes(kind),isKnockout:match.options.knockout});
    const xg=chanceXg(match,attack,defend,minute,kind,finisher,defender,gk,q);
    const technique=shotTechnique(finisher,kind);
    attack.stats.shots++; attack.stats.xg+=xg; attack.stats.boxEntries++;
    finisher.match.shots++; finisher.match.xg+=xg;
    const atkT=tacticalState(match,attack,defend,minute);
    const defT=tacticalState(match,defend,attack,minute);
    if(xg>=.14||atkT.dangerousBoost>.12)attack.stats.dangerousAttacks++;
    addRating(finisher,.06+xg*.2);
    const lines=[
      event(match,minute,`${N().shot(finisher,`${lead}, ${technique}`)} ${gk.name} tenta fechar o ângulo.`,'shot',attack,finisher,carrier,defender,`<span class="tag">xG ${xg.toFixed(2)}</span>`,{danger:Math.min(1,xg*3)})
    ];
    if(xg>=.18) lines.push(event(match,minute,N().emotional('danger'),'danger',attack,finisher,carrier,defender,'',{danger:1}));
    const saveSkill=S().actionScore(gk,'goalkeeper',{minute,type:'save',isKnockout:match.options.knockout});
    const defenderSkill=S().actionScore(defender,'defend',{minute,type:kind});
    const blockChance=kind==='penalty'?0:S().clamp(
      .07+defT.defensiveBlock*.34+(defenderSkill-70)*.0022-(atkT.risk*.035)+(kind==='long'?.05:0),
      .04,.31
    );
    if(Math.random()<blockChance){
      addRating(defender,.13);addRating(finisher,-.04);
      lines.push(event(match,minute,`${defender.name} se joga na trajetória e bloqueia a finalização de ${finisher.name}.`,'defense',defend,defender,null,finisher,'',{danger:.52}));
      if(Math.random()<S().clamp(.72+atkT.aerial*.18+atkT.risk*.10,.66,.90)){
        lines.push(event(match,minute,`O desvio manda a bola para escanteio. A pressão continua.`,'corner',attack,finisher,null,defender,'',{danger:.55}));
        return lines.concat(cornerKick(match,attack,defend,minute,carrier));
      }else if(allowRebound&&Math.random()<.28){
        const rebounder=pickFinisher(attack,'rebound');
        lines.push(event(match,minute,`A bola bloqueada sobra na entrada da área para ${rebounder.name}.`,'rebound',attack,rebounder,finisher,defender,'',{danger:.82}));
        return lines.concat(shotOutcome(match,attack,defend,minute,'rebound',finisher,rebounder,defender,'na sobra do bloqueio',false).slice(1));
      }
      return lines;
    }
    const conversion=S().clamp(xg*(.82+(S().actionScore(finisher,'finish',{minute,type:kind,bigChance:true})-70)/250)*(1-(saveSkill-70)/280),.004,kind==='penalty'?.80:.38);
    const r=Math.random();
    if(r<conversion){
      goalEvent(match,attack,minute,finisher,carrier,xg,lines,technique);
      return lines;
    }
    const onTargetBand=conversion+xg*.82+.08;
    if(r<onTargetBand){
      attack.stats.onTarget++; defend.stats.saves++; finisher.match.onTarget++; gk.match.saves++;
      addRating(gk,.32); addRating(finisher,.04);
      const saveType=weighted([{v:'segura firme',w:27},{v:'espalma para fora',w:39},{v:'espalma para o meio',w:18},{v:'defende com os pés',w:10}]);
      lines.push(event(match,minute,N().save(gk,`${saveType}.`),'save',defend,gk,null,finisher,'',{danger:.6}));
      if(saveType==='espalma para fora'){
        attack.stats.corners++;
        lines.push(event(match,minute,`A defesa de ${gk.name} manda a bola para escanteio.`,'corner',attack,finisher,null,gk));
      }else if(saveType==='espalma para o meio'&&allowRebound&&Math.random()<.42){
        const rebounder=pickFinisher(attack,'rebound');
        lines.push(event(match,minute,`Rebote na área! ${rebounder.name} chega antes da defesa.`,'rebound',attack,rebounder,finisher,defender,'',{danger:1}));
        return lines.concat(shotOutcome(match,attack,defend,minute,'rebound',finisher,rebounder,defender,'no rebote curto',false).slice(1));
      }
      return lines;
    }
    const miss=weighted([
      {v:'na trave',w:xg>.12?10:4},{v:'no travessão',w:xg>.12?8:3},{v:'para fora',w:35},
      {v:'por cima do gol',w:22},{v:'raspando o ângulo',w:14}
    ]);
    addRating(finisher,-.07);
    if(miss==='na trave'||miss==='no travessão'){
      lines.push(event(match,minute,`${finisher.name} acerta ${miss}! O estádio reage ao quase gol.`,'danger',attack,finisher,carrier,defender,'',{danger:1}));
      lines.push(event(match,minute,N().emotional('almost'),'crowd',attack,finisher,null,null));
      if(allowRebound&&Math.random()<.34){
        const rebounder=pickFinisher(attack,'rebound');
        lines.push(event(match,minute,`A bola volta viva para a área e ${rebounder.name} tenta o rebote.`,'rebound',attack,rebounder,finisher,defender,'',{danger:1}));
        return lines.concat(shotOutcome(match,attack,defend,minute,'rebound',finisher,rebounder,defender,'na sobra da trave',false).slice(1));
      }
    }else{
      lines.push(event(match,minute,`${finisher.name} manda ${miss}. A oportunidade escapa.`,'miss',attack,finisher,carrier,defender));
      if(xg>.16) lines.push(event(match,minute,N().emotional('almost'),'crowd',attack,finisher,null,null));
    }
    defend.stats.goalKicks++;
    lines.push(event(match,minute,`${gk.name} prepara o tiro de meta para reorganizar a equipe.`,'goalkick',defend,gk,null,null));
    return lines;
  }
  function disciplinaryEvent(match,attack,defend,minute,carrier,fouler,hard=false){
    const lines=[];
    attack.stats.foulsWon++; defend.stats.fouls++; fouler.match.fouls++;
    const discipline=S().skill(fouler,'discipline');
    const severe=hard||Math.random()<Math.max(.08,(72-discipline)/75);
    lines.push(event(match,minute,`${fouler.name} derruba ${carrier.name}${severe?' com uma entrada forte':''}. Falta marcada.`,'foul',attack,carrier,null,fouler));
    if(severe){
      lines.push(event(match,minute,N().emotional(discipline<55?'unfair':'hardFoul'),'discipline',defend,fouler,null,carrier));
      const red=Math.random()<Math.max(.015,(50-discipline)/100);
      if(red){
        defend.stats.redCards++; defend.stats.cards++; fouler.match.cards++; addRating(fouler,-1);
        lines.push(event(match,minute,`Cartão vermelho para ${fouler.name}. O árbitro entende que a entrada colocou o adversário em risco.`,'discipline',defend,fouler,null,carrier));
      }else{
        defend.stats.cards++; fouler.match.cards++; addRating(fouler,-.35);
        lines.push(event(match,minute,`Cartão amarelo para ${fouler.name}.`,'foul',defend,fouler,null,carrier));
      }
      if(Math.random()<.22) lines.push(event(match,minute,N().emotional('altercation'),'discipline',attack,carrier,null,fouler));
    }
    return lines;
  }
  function directFreeKick(match,attack,defend,minute,taker,fouler){
    attack.stats.freeKicks++;
    const lines=[event(match,minute,`${taker.name} posiciona a bola para a cobrança de falta. A barreira é organizada.`,'setpiece',attack,taker,null,fouler,'',{danger:.65})];
    if(Math.random()<.54){
      return lines.concat(shotOutcome(match,attack,defend,minute,'freeKick',taker,taker,fouler,'na cobrança de falta direta'));
    }
    const target=pickAerialTarget(attack,tacticalState(match,attack,defend,minute));
    lines.push(event(match,minute,`${taker.name} cobra a falta para dentro da área. ${target.name} sobe para o cabeceio.`,'header',attack,target,taker,defenderFor(defend,'center'),'',{danger:.7}));
    attack.stats.headers++; target.match.headers++;
    return lines.concat(shotOutcome(match,attack,defend,minute,'header',taker,target,defenderFor(defend,'center'),'de cabeça após cobrança de falta'));
  }
  function cornerKick(match,attack,defend,minute,taker){
    attack.stats.corners++;
    const target=pickAerialTarget(attack,tacticalState(match,attack,defend,minute)), marker=defenderFor(defend,'center');
    const lines=[event(match,minute,`${taker.name} vai para a bandeira de escanteio e levanta a bola na área.`,'corner',attack,taker,target,marker)];
    const cornerT=tacticalState(match,attack,defend,minute);
    if(Math.random()<S().clamp(.55+cornerT.aerial*.22+cornerT.defenderJoin*.08,.52,.78)){
      attack.stats.headers++; target.match.headers++;
      lines.push(event(match,minute,`${target.name} ganha altura na disputa e cabeceia.`,'header',attack,target,taker,marker,'',{danger:.75}));
      return lines.concat(shotOutcome(match,attack,defend,minute,'header',taker,target,marker,'de cabeça após escanteio'));
    }
    lines.push(event(match,minute,`${marker.name} vence a dividida pelo alto e afasta o perigo.`,'defense',defend,marker,null,target));
    return lines;
  }
  function possession(match,attack,defend,minute){
    ensureStats(attack); ensureStats(defend);
    const atkT=tacticalState(match,attack,defend,minute);
    const defT=tacticalState(match,defend,attack,minute);
    const lines=[]; attack.stats.possessions++; attack.stats.attacks++;
    if(defT.defensiveBlock>=.18)defend.stats.deepBlocks++;
    const zone=weighted([
      {v:'left',w:30+atkT.aerial*22},{v:'center',w:40+atkT.risk*18-defT.defensiveBlock*8},
      {v:'right',w:30+atkT.aerial*22}
    ]);
    const carrier=pickCarrier(attack,atkT), marker=defenderFor(defend,zone);
    lines.push(event(match,minute,N().build(carrier,zone),'build',attack,carrier,null,marker));
    if(Math.random()<.055){
      const diff=match.score[attack.key]-match.score[defend.key];
      const crowdMode=diff<=-2&&minute>65?'ownBoo':diff<0&&minute>65?'support':'boo';
      lines.push(event(match,minute,N().crowd(attack,crowdMode),'crowd',attack,carrier,null,null));
    }
    if(atkT.timeManagement>.20&&Math.random()<atkT.timeManagement*.32){
      attack.stats.timeManagement++;
      attack.stats.passes+=2;
      const support=pickSupport(attack,carrier);
      lines.push(event(match,minute,`${carrier.name} leva a bola para o campo de ataque, protege perto da lateral e troca passes com ${support.name} para consumir o relógio.`,'pass',attack,carrier,support,marker,'',{tacticalState:'time_management'}));
      if(Math.random()<.42){
        attack.stats.foulsWon++; defend.stats.fouls++;
        lines.push(event(match,minute,`${marker.name} comete a falta ao tentar recuperar. ${attack.name} ganha mais tempo no campo ofensivo.`,'foul',attack,carrier,support,marker));
      }
      return lines;
    }

    const mode=weighted([
      {v:'circulate',w:22+S().actionScore(carrier,'build',{minute,type:'build'})*.22+atkT.possessionControl*45-atkT.losingByTwo*8},
      {v:'vertical',w:S().actionScore(carrier,'passVertical',{minute})*.59+atkT.risk*62+atkT.directness*35},
      {v:'oneTwo',w:S().actionScore(carrier,'oneTwo',{minute})*.31+atkT.risk*31},
      {v:'overlap',w:(zone==='center'?8:S().actionScore(carrier,'overlap',{minute})*.34)+atkT.aerial*35+atkT.risk*18},
      {v:'dribble',w:S().actionScore(carrier,'dribble',{minute,type:'duel'})*.42+atkT.risk*24},
      {v:'cross',w:(zone==='center'?14:S().actionScore(carrier,'cross',{minute})*.49)+atkT.aerial*102+atkT.defenderJoin*42},
      {v:'longShot',w:S().actionScore(carrier,'longShot',{minute})*.17+atkT.risk*22},
      {v:'longBall',w:10+atkT.directness*80+(atkT.leading&&atkT.final15?20:0)},
      {v:'foul',w:9+atkT.risk*18+atkT.after60*3},
      {v:'offside',w:6+atkT.directness*13},
      {v:'throwIn',w:8},
      {v:'tackle',w:16+defT.defensiveBlock*29},
      {v:'turnover',w:26+defT.defensiveBlock*42-atkT.risk*15}
    ]);
    attack.stats.duels++;
    if(mode==='throwIn'){
      attack.stats.throwIns++;
      const support=pickSupport(attack,carrier);
      lines.push(event(match,minute,`A bola sai pela lateral. ${carrier.name} cobra o arremesso lateral para ${support.name}.`,'throwin',attack,carrier,support,marker));
      attack.stats.passes++; carrier.match.passes++;
      return lines;
    }
    if(mode==='longBall'){
      attack.stats.longBalls++;
      const target=atkT.aerial>.22?pickAerialTarget(attack,atkT):pickFinisher(attack,'through');
      lines.push(event(match,minute,`${carrier.name} levanta a cabeça e dá um chutão direcionado da defesa para o ataque. ${target.name} disputa a segunda bola.`,'pass',attack,carrier,target,marker,'',{tacticalState:atkT.leading&&atkT.final15?'protecting_lead':'direct_attack'}));
      const aerialWin=S().duel(target,defenderFor(defend,'center'),'header',{minute,type:'header',isKnockout:match.options.knockout});
      if(Math.random()<aerialWin*.82+atkT.risk*.11){
        attack.stats.headers++; target.match.headers++;
        const support=pickSupport(attack,target);
        lines.push(event(match,minute,`${target.name} ganha pelo alto e escora para ${support.name}. O ataque acelera na segunda bola.`,'header',attack,target,support,defenderFor(defend,'center'),'',{danger:.56}));
        return lines.concat(shotOutcome(match,attack,defend,minute,'through',target,support,defenderFor(defend,'center'),'após ligação direta e segunda bola'));
      }
      lines.push(event(match,minute,`${defenderFor(defend,'center').name} vence a disputa aérea e afasta a ligação direta.`,'defense',defend,defenderFor(defend,'center'),null,target));
      return lines;
    }
    if(mode==='offside'){
      attack.stats.offsides++;
      const runner=pickFinisher(attack,'through');
      lines.push(event(match,minute,`${carrier.name} tenta lançar ${runner.name}, mas o auxiliar marca impedimento.`,'offside',attack,runner,carrier,marker));
      return lines;
    }
    if(mode==='foul'){
      lines.push(...disciplinaryEvent(match,attack,defend,minute,carrier,marker,Math.random()<.25));
      if(Math.random()<S().clamp(.50+atkT.risk*.32+atkT.after60*.06,.46,.76)) lines.push(...directFreeKick(match,attack,defend,minute,carrier,marker));
      return lines;
    }
    if(mode==='turnover'||mode==='tackle'){
      const success=S().duel(marker,carrier,'tackle',{minute,type:'duel',tense:minute>70});
      if(mode==='tackle'||Math.random()<success){
        defend.stats.tackles++; marker.match.tackles++; attack.stats.turnovers++; carrier.match.losses++;
        addRating(marker,.16); addRating(carrier,-.08);
        lines.push(event(match,minute,`${marker.name} entra na dividida e desarma ${carrier.name} no tempo certo.`,'tackle',defend,marker,null,carrier));
        if(Math.random()<.18){
          defend.stats.throwIns++;
          lines.push(event(match,minute,`A bola sai pela lateral após a disputa. Arremesso para ${defend.name}.`,'throwin',defend,marker,null,carrier));
        }
        const counterT=tacticalState(match,defend,attack,minute);
        if(atkT.risk>.28&&Math.random()<S().clamp(.12+counterT.directness*.35+atkT.risk*.22,.10,.38)){
          defend.stats.counters++;
          const runner=pickFinisher(defend,'through');
          lines.push(event(match,minute,`${marker.name} recupera e aciona ${runner.name} em contra-ataque, aproveitando os espaços deixados pelo adversário.`,'danger',defend,runner,marker,defenderFor(attack,'center'),'',{danger:.78,tacticalState:'counter_attack'}));
          return lines.concat(shotOutcome(match,defend,attack,minute,'through',marker,runner,defenderFor(attack,'center'),'em contra-ataque rápido'));
        }
        return lines;
      }
    }
    let duelOk=S().duel(carrier,marker,mode,{minute,type:mode,tense:minute>70,isKnockout:match.options.knockout});
    duelOk=S().clamp(duelOk+atkT.risk*.11+atkT.press*.04-defT.defensiveBlock*.16+defT.fatigue*.12,.05,.94);
    if(Math.random()>duelOk){
      attack.stats.turnovers++; carrier.match.losses++; addRating(marker,.14); addRating(carrier,-.08);
      lines.push(event(match,minute,N().turnover(marker,carrier),'defense',defend,marker,null,carrier));
      return lines;
    }
    carrier.match.keyActions++; addRating(carrier,.11); attack.stats.finalThird++;
    if(mode==='circulate'){
      const support=pickSupport(attack,carrier);
      attack.stats.passes+=2; carrier.match.passes++; support.match.passes++;
      lines.push(event(match,minute,`${carrier.name} troca passes com ${support.name} e faz a defesa se deslocar.`,'pass',attack,carrier,support,marker));
      if(Math.random()<S().clamp(.18-atkT.risk*.10+atkT.timeManagement*.31,.07,.52)) return lines;
      return lines.concat(shotOutcome(match,attack,defend,minute,'through',carrier,pickFinisher(attack,'through'),defenderFor(defend,'center'),'após construção paciente'));
    }
    if(mode==='oneTwo'){
      const support=pickSupport(attack,carrier); attack.stats.oneTwos++; attack.stats.passes+=2;
      carrier.match.passes++; support.match.passes++;
      lines.push(event(match,minute,`${carrier.name} tabela com ${support.name}: toca, passa pelo marcador e recebe de volta.`,'pass',attack,carrier,support,marker,'',{danger:.55}));
      if(Math.random()<S().clamp(.58+atkT.risk*.18-defT.defensiveBlock*.09,.48,.79)) return lines.concat(shotOutcome(match,attack,defend,minute,'through',support,carrier,defenderFor(defend,'center'),'depois da tabela'));
      lines.push(event(match,minute,`${defenderFor(defend,'center').name} fecha o espaço no último instante.`,'defense',defend,defenderFor(defend,'center'),null,carrier));
      return lines;
    }
    if(mode==='overlap'){
      const runner=byRole(attack,zone==='left'?['LE','PE']:['LD','PD']);
      attack.stats.overlaps++; attack.stats.passes++;
      lines.push(event(match,minute,`${carrier.name} prende a marcação e ${runner.name} faz a ultrapassagem pelo corredor.`,'pass',attack,runner,carrier,marker,'',{danger:.5}));
      if(Math.random()<S().clamp(.66+atkT.aerial*.18+atkT.risk*.08,.60,.84)){
        attack.stats.crosses++; runner.match.crosses++;
        const target=pickAerialTarget(attack,tacticalState(match,attack,defend,minute));
        lines.push(event(match,minute,N().cross(runner,target),'cross',attack,runner,target,defenderFor(defend,'center')));
        return lines.concat(shotOutcome(match,attack,defend,minute,'header',runner,target,defenderFor(defend,'center'),'de cabeça após ultrapassagem'));
      }
      return lines;
    }
    if(mode==='vertical'){
      attack.stats.passes++; carrier.match.passes++;
      const finisher=pickFinisher(attack,'through');
      lines.push(event(match,minute,N().pass(carrier,finisher),'pass',attack,carrier,finisher,marker,'',{danger:.55}));
      if(Math.random()<S().clamp(.10+atkT.directness*.15,.09,.20)){
        attack.stats.offsides++;
        lines.push(event(match,minute,`${finisher.name} parte um instante antes. Impedimento marcado.`,'offside',attack,finisher,carrier,marker));
        return lines;
      }
      return lines.concat(shotOutcome(match,attack,defend,minute,'through',carrier,finisher,defenderFor(defend,'center'),'após passe vertical'));
    }
    if(mode==='dribble'){
      attack.stats.dribbles++; carrier.match.dribbles++;
      const trick=dribbleName(carrier);
      lines.push(event(match,minute,`${carrier.name} encara ${marker.name} e aplica ${trick}.`,'dribble',attack,carrier,null,marker,'',{danger:.45}));
      if(Math.random()<S().clamp(.59+atkT.risk*.20-defT.defensiveBlock*.11,.47,.78)) return lines.concat(shotOutcome(match,attack,defend,minute,'dribble',carrier,carrier,marker,'depois do drible'));
      const cover=defenderFor(defend,'center');
      lines.push(event(match,minute,`${cover.name} chega na cobertura e interrompe a jogada.`,'defense',defend,cover,null,carrier));
      return lines;
    }
    if(mode==='cross'){
      attack.stats.crosses++; carrier.match.crosses++;
      const target=pickAerialTarget(attack,tacticalState(match,attack,defend,minute)), d=defenderFor(defend,'center');
      lines.push(event(match,minute,N().cross(carrier,target),'cross',attack,carrier,target,d,'',{danger:.5}));
      const result=weighted([
        {v:'keeper',w:S().actionScore(goalie(defend),'goalkeeper',{minute,type:'cross'})*.18},
        {v:'clear',w:S().actionScore(d,'defend',{minute,type:'header'})*(.24+defT.defensiveBlock*.16)},
        {v:'header',w:S().actionScore(target,'header',{minute,type:'header'})*(.30+atkT.aerial*.20+atkT.defenderJoin*.08)},
        {v:'corner',w:38+atkT.aerial*50+atkT.risk*27},
        {v:'penalty',w:2.2+Math.max(0,70-S().skill(d,'discipline'))/9+atkT.penaltyPressure*28},
        {v:'ownGoal',w:.45+atkT.aerial*.55}
      ]);
      if(result==='keeper'){ lines.push(event(match,minute,`${goalie(defend).name} sai do gol e segura a bola pelo alto.`,'save',defend,goalie(defend),null,target)); return lines; }
      if(result==='clear'){
        if(Math.random()<S().clamp(.36+atkT.aerial*.24+atkT.risk*.12,.32,.65)){
          lines.push(event(match,minute,`${d.name} corta o cruzamento sob pressão e manda para escanteio.`,'corner',attack,d,carrier,target,'',{danger:.50}));
          return lines.concat(cornerKick(match,attack,defend,minute,carrier));
        }
        lines.push(event(match,minute,`${d.name} ganha a disputa aérea e afasta.`,'defense',defend,d,null,target)); return lines;
      }
      if(result==='corner') return lines.concat(cornerKick(match,attack,defend,minute,carrier));
      if(result==='penalty'){
        attack.stats.penalties++; lines.push(event(match,minute,`${d.name} se atrasa no contato. PÊNALTI marcado!`,'penalty',attack,target,carrier,d,'',{danger:1}));
        const taker=pickFinisher(attack,'penalty');
        return lines.concat(shotOutcome(match,attack,defend,minute,'penalty',carrier,taker,goalie(defend),'na cobrança de pênalti'));
      }
      if(result==='ownGoal'){
        match.score[attack.key]++; attack.stats.goals++; addRating(d,-.9);
        const scoreText=`${match.score.home} x ${match.score.away}`;
        lines.push(event(match,minute,`${d.name} tenta cortar e manda contra a própria meta. Gol contra!`,'goal',attack,d,carrier,null,'',{scoreAfter:{...match.score},danger:1}));
        match.goalEvents.push({minute,team:attack.name,teamKey:attack.key,player:`Gol contra de ${d.name}`,score:scoreText});
        return lines;
      }
      attack.stats.headers++; target.match.headers++;
      lines.push(event(match,minute,`${target.name} sobe no meio da defesa e cabeceia.`,'header',attack,target,carrier,d,'',{danger:.75}));
      return lines.concat(shotOutcome(match,attack,defend,minute,'header',carrier,target,d,'de cabeça após cruzamento'));
    }
    if(mode==='longShot'){
      return lines.concat(shotOutcome(match,attack,defend,minute,'long',carrier,carrier,marker,'de média distância'));
    }
    return lines;
  }
  function teamStrength(team){
    const players=allPlayers(team);
    if(!players.length) return 50;
    const top=[...players].sort((a,b)=>S().actionScore(b,'build',{})-S().actionScore(a,'build',{})).slice(0,11);
    return top.reduce((sum,p)=>sum+S().actionScore(p,'build',{}),0)/top.length;
  }
  function penaltyShootout(match){
    let home=0,away=0;
    const events=[];
    for(let i=0;i<5||home===away;i++){
      for(const team of [match.home,match.away]){
        if(i>=5&&home!==away) break;
        const other=team.key==='home'?match.away:match.home;
        const taker=pickFinisher(team,'penalty'),gk=goalie(other);
        const chance=S().clamp(.72+(S().actionScore(taker,'penalty',{isKnockout:true})-75)/320-(S().actionScore(gk,'goalkeeper',{})-72)/380,.58,.88);
        const scored=Math.random()<chance;
        if(scored){ if(team.key==='home')home++;else away++; }
        events.push(event(match,90,`${taker.name} ${scored?'converte':'desperdiça'} a cobrança na disputa de pênaltis. Parcial: ${home} x ${away}.`,'penalty',team,taker,null,gk));
      }
      if(i>9) break;
    }
    match.shootout={home,away};
    match.winnerKey=home>away?'home':'away';
    events.push(event(match,90,`${match[match.winnerKey].name} vence a disputa de pênaltis por ${home} x ${away}.`,'crowd',match[match.winnerKey],null,null,null));
    return events;
  }
  function simulate(homeInput,awayInput,options={}){
    const home={key:'home',name:homeInput.name,flag:homeInput.flag,lineup:homeInput.lineup||homeInput.players||[],stats:null};
    const away={key:'away',name:awayInput.name,flag:awayInput.flag,lineup:awayInput.lineup||awayInput.players||[],stats:null};
    ensureStats(home); ensureStats(away);
    const hStr=teamStrength(home),aStr=teamStrength(away);
    const match={
      home,away,score:{home:0,away:0},events:[],goalEvents:[],trailed:{home:false,away:false},
      strengths:{home:hStr,away:aStr},
      options:{knockout:!!options.knockout,stage:options.stage||'group'}
    };
    let minute=1;
    while(minute<=90){
      const hT=tacticalState(match,home,away,minute);
      const aT=tacticalState(match,away,home,minute);
      let homeWeight=50+(hStr-aStr)*.62;
      homeWeight+=(hT.possessionControl-aT.possessionControl)*30;
      if(hT.trailing)homeWeight+=7+(hT.losingByTwo?5:0)+(hT.final15?4:0);
      if(aT.trailing)homeWeight-=7+(aT.losingByTwo?5:0)+(aT.final15?4:0);
      if(hT.stronger)homeWeight+=3;
      if(aT.stronger)homeWeight-=3;
      const attack=Math.random()*100<S().clamp(homeWeight,25,75)?home:away;
      const defend=attack===home?away:home;
      match.events.push(...possession(match,attack,defend,minute));
      const globalTempo=minute>=60?1.24:1;
      const scoreUrgency=Math.abs(match.score.home-match.score.away)>=2&&minute>=60?1.14:1;
      const stepBase=Math.random()<globalTempo*scoreUrgency*.58?1:2;
      minute+=stepBase+(Math.random()<.16?1:0);
    }
    if(match.options.knockout&&match.score.home===match.score.away) match.events.push(...penaltyShootout(match));
    else match.winnerKey=match.score.home===match.score.away?null:(match.score.home>match.score.away?'home':'away');
    if(match.options.stage==='final'&&match.winnerKey&&Math.random()<.12){
      match.events.push(event(match,90,N().crowd(match[match.winnerKey],'invasion'),'crowd',match[match.winnerKey],null,null,null));
    }
    match.events.push(N().line(90,`Fim de jogo. Resultado: ${match.score.home} x ${match.score.away}${match.shootout?` — pênaltis ${match.shootout.home} x ${match.shootout.away}`:''}.`,'build','',{
      possessionTeam:null,scoreAfter:{...match.score}
    }));
    return match;
  }
  window.FWCL_EVENT_GRAPH={simulate,teamStrength,tacticalState};
})();
