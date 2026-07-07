(function(){
  const $=id=>document.getElementById(id);
  function displayName(value){
    return String(value||'Jogador')
      .replace(/not[\s_-]*applicable/ig,' ')
      .replace(/\s+/g,' ')
      .trim()||'Jogador';
  }
  function fmtMoney(v){ return `US$${Math.max(0,Math.round(v*10)/10)}MM`; }
  function classIcon(p){ return (p?.player_class||'⚙️').split(' ')[0]; }
  function shortTeam(t){ return `${t.flag||''} ${t.country} ${t.year}`; }
  function initials(name){
    const parts=displayName(name).split(/\s+/).filter(Boolean);
    return (parts[0]?.[0]||'J') + (parts.length>1?(parts[parts.length-1]?.[0]||''):'');
  }
  function portraitHtml(player){
    const src=player.photo_url||player.photoUrl||player.photo||'';
    if(src)return `<div class="playerPortrait"><img src="${src}" alt="Foto de ${displayName(player.name)}" loading="lazy" referrerpolicy="no-referrer"></div>`;
    return `<div class="playerPortrait placeholder"><span class="portraitFlag">${player.flag||'⚽'}</span><span class="portraitSilhouette"></span><span class="portraitInitials">${initials(player.name)}</span></div>`;
  }

  const traitLabels={
    frio_sob_pressao:'Frio sob pressão',confiavel:'Confiável',motor_fisico:'Motor físico',
    lideranca_silenciosa:'Liderança silenciosa',competidor_extremo:'Competidor extremo',
    organizador:'Organizador',cresce_em_jogo_grande:'Cresce em jogo grande',
    chama_responsabilidade:'Chama a responsabilidade',acredita_ate_o_fim:'Acredita até o fim',
    especialista_aereo:'Especialista aéreo',genialidade_intermitente:'Genialidade intermitente',
    temperamental:'Temperamental'
  };
  const tendencyLabels={
    drible_criativo:'Drible criativo',ultrapassar:'Ultrapassagens',
    cruzar:'Cruzamentos',finalizacao_area:'Finalização na área'
  };
  function profileMetrics(player){
    const s=player.skills||{};
    const avg=(...keys)=>Math.round(keys.reduce((sum,k)=>sum+Number(s[k]||50),0)/keys.length);
    return [
      {key:'Ataque',value:avg('finishing','heading','power')},
      {key:'Criação',value:avg('passing','vision','crossing')},
      {key:'Drible',value:avg('dribble','pace','decision')},
      {key:'Defesa',value:avg('marking','tackle','interception')},
      {key:'Físico',value:avg('pace','power','stamina')},
      {key:'Mental',value:avg('decision','composure','leadership','clutch')}
    ];
  }
  function radarSvg(player){
    const metrics=profileMetrics(player),center=78,radius=55;
    const points=metrics.map((m,index)=>{
      const angle=(-Math.PI/2)+(Math.PI*2*index/metrics.length);
      const r=radius*Math.max(.18,Math.min(1,m.value/100));
      return `${center+Math.cos(angle)*r},${center+Math.sin(angle)*r}`;
    }).join(' ');
    const axes=metrics.map((m,index)=>{
      const angle=(-Math.PI/2)+(Math.PI*2*index/metrics.length);
      const x=center+Math.cos(angle)*radius,y=center+Math.sin(angle)*radius;
      const lx=center+Math.cos(angle)*(radius+18),ly=center+Math.sin(angle)*(radius+18);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" class="radarAxis"/>
        <text x="${lx}" y="${ly}" class="radarLabel" text-anchor="middle">${m.key}</text>`;
    }).join('');
    return `<svg class="attributeRadar" viewBox="0 0 156 156" role="img" aria-label="Gráfico de atributos">
      <polygon points="78,23 125.6,50.5 125.6,105.5 78,133 30.4,105.5 30.4,50.5" class="radarGrid"/>
      ${axes}<polygon points="${points}" class="radarValue"/></svg>`;
  }
  function temperament(player){
    const s=player.skills||{},traits=player.traits||[];
    if(traits.includes('temperamental')||Number(s.discipline||70)<55)return 'Intenso e temperamental';
    if(traits.includes('frio_sob_pressao')||Number(s.composure||0)>=84)return 'Frio e controlado';
    if(traits.includes('lideranca_silenciosa')||Number(s.leadership||0)>=84)return 'Líder e agregador';
    if(traits.includes('competidor_extremo')||Number(s.clutch||0)>=84)return 'Competitivo e decisivo';
    return 'Equilibrado';
  }
  function playingStyles(player){
    const s=player.skills||{},styles=[];
    (player.tendencies||[]).forEach(t=>styles.push(tendencyLabels[t]||t.replaceAll('_',' ')));
    if(Number(s.vision||0)>=82)styles.push('Armador');
    if(Number(s.passing||0)>=82)styles.push('Distribuidor');
    if(Number(s.dribble||0)>=84)styles.push('Condução e 1 contra 1');
    if(Number(s.finishing||0)>=84)styles.push('Finalizador');
    if(Number(s.heading||0)>=84)styles.push('Jogo aéreo');
    if(Number(s.marking||0)>=82)styles.push('Marcador');
    if(Number(s.pace||0)>=84)styles.push('Ataque em velocidade');
    return Array.from(new Set(styles)).slice(0,4);
  }
  function profileCardHtml(player,{buttonLabel='Selecionar',disabled=false,statusText=''}={}){
    const traits=(player.traits||[]).map(t=>traitLabels[t]||t.replaceAll('_',' ')).slice(0,4);
    const styles=playingStyles(player);
    const cleanClass=String(player.player_class||'⚙️ Operário').replace(/not[\s_-]*applicable/ig,' ').replace(/\s+/g,' ').trim();
    return `<div class="playerProfileTop">
        ${portraitHtml(player)}
        <div><div class="name">${classIcon(player)} ${displayName(player.name)}</div>
        <div class="small">${player.flag||''} ${player.country||''} ${player.year||''} • ${(player.positions||[]).join(' / ')}</div>
        <div class="profileClass">${cleanClass}</div>
        ${player.iconic_profile?`<div class="historicalIconBadge tier-${player.iconic_profile.tier}">${
          player.iconic_profile.tier==='mythic'?'ÍCONE MÁXIMO':
          player.iconic_profile.tier==='legend'?'LENDA HISTÓRICA':
          player.iconic_profile.tier==='icon'?'ÍCONE HISTÓRICO':
          player.iconic_profile.tier==='hero'?'HERÓI DE COPA':'ÍDOLO NACIONAL'
        } • relevância ${player.historical_relevance}/100</div>`:''}
        </div>${radarSvg(player)}
      </div>
      <div class="profileSection"><b>Temperamento</b><span>${temperament(player)}</span></div>
      <div class="profileSection"><b>Estilo de jogo</b><div class="profileTags">${styles.length?styles.map(s=>`<span>${s}</span>`).join(''):'<span>Versátil</span>'}</div></div>
      <div class="profileSection"><b>Características</b><div class="profileTags">${traits.length?traits.map(s=>`<span>${s}</span>`).join(''):'<span>Sem traço dominante</span>'}</div></div>
      ${statusText?`<div class="small candidateStatus">${statusText}</div>`:''}
      <button ${disabled?'disabled':''}>${buttonLabel}</button>`;
  }

  function renderCountries(state){
    const sel=$('dynastyCountry'); sel.innerHTML='';
    window.FWCL_MARKET.countries().forEach(c=>{
      const o=document.createElement('option');o.value=c.country;o.textContent=`${c.flag} ${c.country}`;sel.appendChild(o);
    });
    if(state.country) sel.value=state.country;
  }
  function renderConfig(state){
    const form=$('formation');form.innerHTML='';
    Object.keys(window.FWCL_FORMATIONS).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;form.appendChild(o);});
    form.value=state.formation;
    const diff=$('difficulty');diff.innerHTML='';
    Object.entries(window.FWCL_DIFFICULTIES).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;diff.appendChild(o);});
    diff.value=state.difficulty;$('mode').value=state.mode;$('dynastyWrap').classList.toggle('hide',state.mode!=='dynasty');
  }
  function renderBudget(state){
    $('budgetText').textContent=fmtMoney(state.budgetLeft);
    $('budgetBar').style.width=Math.max(0,Math.min(100,state.budgetLeft/state.budgetTotal*100))+'%';
    $('budgetText').style.color=state.budgetLeft<0?'var(--danger)':'var(--accent)';
  }
  function renderField(state){
    const field=$('field');field.innerHTML='<div class="circle"></div>';
    (window.FWCL_FORMATIONS[state.formation]||[]).forEach(slot=>{
      const p=state.lineup[slot.id],div=document.createElement('button');
      div.className='slot '+(p?'filled':'empty')+(p&&(p.player_class||'').includes('Lenda')?' legend':'');
      div.style.left=slot.x+'%';div.style.top=slot.y+'%';
      div.innerHTML=p?`<div class="pos">${slot.label}</div><div class="name">${classIcon(p)} ${displayName(p.name)}</div><div class="meta">${p.flag} ${p.year}</div><div class="rating">Nota ${((p.match&&p.match.rating)||5.5).toFixed(1)}</div><div class="price">US$${p.price_mm}MM</div>`:`<div class="pos">${slot.label}</div><div class="name">Vazio</div>`;
      div.onclick=()=>window.FWCL_APP.handleSlotClick(slot.id);field.appendChild(div);
    });
  }
  function renderLineupStatus(state){
    const filled=Object.keys(state.lineup).length,total=(window.FWCL_FORMATIONS[state.formation]||[]).length,box=$('lineupStatus');
    if(state.activeDraft){box.className='notice';box.textContent=`Sorteio travado: ${shortTeam(state.activeDraft.team)} para ${state.activeDraft.slot.label}. Escolha um jogador.`;}
    else if(filled===total){box.className='notice ok';box.textContent='XI completo. O sorteio da Copa do Mundo está liberado.';}
    else{box.className='notice';box.textContent=`Monte o XI titular: ${filled}/${total}.`;}
    $('goMatchBtn').disabled=filled!==total||!!state.activeDraft||state.budgetLeft<0;
  }
  function showDraft(state){
    const modal=$('draftModal'),grid=$('candidateGrid');
    if(!state.activeDraft){modal.classList.remove('show');return;}
    const {team,slot}=state.activeDraft;
    $('draftTitle').textContent=`${shortTeam(team)} — ${slot.label}`;
    const cands=window.FWCL_MARKET.availablePlayers(team,slot.label,state.chosenAthletes);
    const available=cands.filter(p=>!state.chosenAthletes.has(p.athlete_id));
    const affordable=available.filter(p=>p.price_mm<=state.budgetLeft);
    $('draftSubtitle').textContent='Sorteio vinculante. Escolha um jogador para continuar.';
    grid.innerHTML=`<div class="candidateDepth"><b>Profundidade:</b> ${available.length} compatíveis; ${affordable.length} dentro do orçamento.</div>`;
    cands.forEach(p=>{
      const duplicate=state.chosenAthletes.has(p.athlete_id),over=p.price_mm>state.budgetLeft,disabled=duplicate||over;
      const card=document.createElement('div');
      card.className='candidate '+((p.player_class||'').includes('Lenda')?'legend ':'')+(disabled?'disabled':'');
      const statusText=duplicate?'Outra versão deste atleta já foi usada.':over?'Orçamento insuficiente.':`US$${p.price_mm}MM • ajuste posicional ${p.fit}%`;
      card.innerHTML=profileCardHtml(p,{buttonLabel:'Selecionar',disabled,statusText});
      card.querySelector('button').onclick=()=>window.FWCL_APP.selectCandidate(p);grid.appendChild(card);
    });
    modal.classList.add('show');
  }
  function renderScore(match){
    $('clock').textContent=`${match?match.currentMinute:0}'`;
    $('score').textContent=`${match?match.liveScore.home:0} x ${match?match.liveScore.away:0}`;
    $('homeName').textContent=match?match.home.name:'Seu XI Legends';$('awayName').textContent=match?match.away.name:'Adversário';
  }
  function addEvent(ev){
    const div=document.createElement('div');
    div.className='event '+(ev.type==='goal'?'goal':ev.type==='foul'||ev.type==='discipline'?'warn':ev.danger>.7?'dangerEvent':'');
    div.innerHTML=ev.html;$('log').appendChild(div);$('log').scrollTop=$('log').scrollHeight;
  }
  function clearEvents(){$('log').innerHTML='';}
  function goalAlert(ev){
    window.FWCL_AUDIO?.goal({player:displayName(ev.player),team:ev.team,score:ev.score});
    const el=$('goalAlert'),inner=el.querySelector('.goalAlertInner')||el;
    inner.innerHTML=`<span class="goalWord">GOOOOOL!</span><span class="goalScorer">${displayName(ev.player)} — ${ev.team}</span><span class="goalScore">${ev.score}</span>`;
    el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
    document.body.classList.add('goalFlashActive');
    setTimeout(()=>{el.classList.remove('show');document.body.classList.remove('goalFlashActive');},2800);
  }
  const liveTemplates={
    '4-3-3':[['GK',5,50],['LE',16,15],['ZAG',16,38],['ZAG',16,62],['LD',16,85],['VOL',28,50],['MC',34,30],['MC',34,70],['PE',45,18],['CA',47,50],['PD',45,82]],
    '4-2-3-1':[['GK',5,50],['LE',16,15],['ZAG',16,38],['ZAG',16,62],['LD',16,85],['VOL',29,38],['VOL',29,62],['PE',39,18],['MEI',39,50],['PD',39,82],['CA',47,50]],
    '4-4-2':[['GK',5,50],['LE',16,15],['ZAG',16,38],['ZAG',16,62],['LD',16,85],['PE',32,15],['MC',32,38],['MC',32,62],['PD',32,85],['CA',46,38],['CA',46,62]],
    '3-5-2':[['GK',5,50],['ZAG',16,28],['ZAG',16,50],['ZAG',16,72],['ALA_E',29,10],['VOL',29,38],['MC',31,50],['MC',29,62],['ALA_D',29,90],['CA',46,38],['CA',46,62]],
    '5-4-1':[['GK',5,50],['LE',16,10],['ZAG',16,30],['ZAG',16,50],['ZAG',16,70],['LD',16,90],['PE',31,15],['MC',31,38],['MC',31,62],['PD',31,85],['CA',47,50]],
    '4-5-1':[['GK',5,50],['LE',16,15],['ZAG',16,38],['ZAG',16,62],['LD',16,85],['PE',31,10],['VOL',31,30],['MC',31,50],['MEI',31,70],['PD',31,90],['CA',47,50]],
    '4-2-4':[['GK',5,50],['LE',16,15],['ZAG',16,38],['ZAG',16,62],['LD',16,85],['VOL',30,38],['MC',30,62],['PE',45,12],['SA',45,38],['CA',45,62],['PD',45,88]],
    '3-4-3':[['GK',5,50],['ZAG',16,28],['ZAG',16,50],['ZAG',16,72],['ALA_E',30,12],['MC',30,38],['MC',30,62],['ALA_D',30,88],['PE',45,18],['CA',47,50],['PD',45,82]],
    '3-3-4':[['GK',5,50],['ZAG',16,28],['ZAG',16,50],['ZAG',16,72],['VOL',30,28],['MC',30,50],['MEI',30,72],['PE',45,10],['SA',45,36],['CA',45,64],['PD',45,90]]
  };
  function normalizeLiveSlot(role){
    if(role==='ALA_E')return 'LE';
    if(role==='ALA_D')return 'LD';
    if(role==='SA')return 'CA';
    return role;
  }
  function assignExactFormation(players,shape,side){
    const template=liveTemplates[shape]||liveTemplates['4-2-3-1'],available=[...players],assigned=[];
    template.forEach(([role,x,y])=>{
      if(!available.length)return;
      const normalized=normalizeLiveSlot(role);
      let bestIndex=0,bestScore=-Infinity;
      available.forEach((player,index)=>{
        let score=window.FWCL_SKILLS.positionFit(player,normalized);
        if(player.slot===role||player.slot===normalized)score+=35;
        if(player.slotId&&String(player.slotId).startsWith(role))score+=28;
        if((player.positions||[])[0]===role||(player.positions||[])[0]===normalized)score+=18;
        if(score>bestScore){bestScore=score;bestIndex=index;}
      });
      const player=available.splice(bestIndex,1)[0];
      assigned.push({player,x:side==='home'?x:100-x,y,side,role});
    });
    return assigned;
  }
  function shortLabel(name){
    const clean=displayName(name),parts=clean.split(/\s+/);
    return parts.length<=2?clean:parts[parts.length-1];
  }
  function renderLivePitch(match,ev){
    const pitch=$('livePitch');
    pitch.querySelectorAll('.livePlayer').forEach(node=>node.remove());
    const trace=$('playTrace');
    if(trace)trace.querySelectorAll('.dynamicTrace').forEach(node=>node.remove());

    const homeSquad=match?.home?.squad||match?.home?.lineup||[];
    const awaySquad=match?.away?.squad||match?.away?.lineup||[];
    const homeIds=new Set(ev?.activeLineups?.home?.activeIds||match?.home?.lineup?.map(p=>p.id||p.player_wc_id)||[]);
    const awayIds=new Set(ev?.activeLineups?.away?.activeIds||match?.away?.lineup?.map(p=>p.id||p.player_wc_id)||[]);
    const home=homeSquad.filter(p=>homeIds.has(p.id||p.player_wc_id));
    const away=awaySquad.filter(p=>awayIds.has(p.id||p.player_wc_id));

    const homeShape=ev?.activeLineups?.home?.shape||match?.home?.currentShape||'4-2-3-1';
    const awayShape=ev?.activeLineups?.away?.shape||match?.away?.currentShape||'4-2-3-1';
    const positions=[
      ...assignExactFormation(home,homeShape,'home'),
      ...assignExactFormation(away,awayShape,'away')
    ];
    const pointById=new Map();

    positions.forEach(({player,x,y,side,role},index)=>{
      const id=player.id||player.player_wc_id;
      pointById.set(id,{x,y});
      const marker=document.createElement('div');
      marker.className=`livePlayer ${side}`;
      if(ev?.actor?.id===id)marker.classList.add('ballCarrier');
      if(ev?.support?.id===id)marker.classList.add('supporting');
      if(ev?.defender?.id===id)marker.classList.add('dueling');
      marker.style.left=x+'%';
      marker.style.top=y+'%';
      const number=player.shirt||((index%11)+1);
      marker.innerHTML=`<span class="playerRole">${role}</span><span class="playerDisc"><b>${number}</b></span><span class="playerTag">${shortLabel(player.name)}</span>`;
      marker.title=`${displayName(player.name)} • ${(player.positions||[]).join('/')}${player.historical_relevance?` • relevância ${player.historical_relevance}`:''}`;
      pitch.appendChild(marker);
    });

    const ball=$('liveBall');
    const actorPoint=ev?.actor?.id?pointById.get(ev.actor.id):null;
    if(actorPoint){
      ball.classList.remove('hide');
      ball.style.left=(actorPoint.x+1.1)+'%';
      ball.style.top=(actorPoint.y-4.2)+'%';
    }else{
      ball.classList.add('hide');
    }

    function traceLine(fromId,toId,cssClass){
      if(!trace||!fromId||!toId)return;
      const from=pointById.get(fromId),to=pointById.get(toId);
      if(!from||!to)return;
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',String(from.x*10));
      line.setAttribute('y1',String(from.y*5.6));
      line.setAttribute('x2',String(to.x*10));
      line.setAttribute('y2',String(to.y*5.6));
      line.setAttribute('class',`dynamicTrace ${cssClass}`);
      trace.appendChild(line);
    }
    traceLine(ev?.actor?.id,ev?.support?.id,'supportTrace');
    traceLine(ev?.actor?.id,ev?.defender?.id,'duelTrace');

    const team=ev?.possessionTeam==='home'?match?.home:ev?.possessionTeam==='away'?match?.away:null;
    $('possessionBanner').textContent=team
      ?`⚽ Posse: ${team.name}${ev.actor?.name?` — ${ev.actor.name} com a bola`:''}`
      :'⚪ Bola parada ou transição de posse';
    $('possessionBanner').className=`possessionBanner ${ev?.possessionTeam||''}`;

    const pieces=[];
    if(ev?.actor?.name)pieces.push(`<b>Com a bola:</b> ${ev.actor.name}`);
    if(ev?.support?.name)pieces.push(`<b>Apoio:</b> ${ev.support.name}`);
    if(ev?.defender?.name)pieces.push(`<b>Marcador:</b> ${ev.defender.name}`);
    if(ev?.type)pieces.push(`<b>Ação:</b> ${window.FWCL_NARRATION.labels?.[ev.type]||ev.type}`);
    $('duelPanel').innerHTML=pieces.length
      ?pieces.join(' <span class="duelSep">•</span> ')
      :'<span>Jogada sem disputa individual destacada.</span>';
  }
  function renderManagement(match,ev){
    if(!match){
      $('refereeProfile').textContent='Aguardando partida';
      $('homeShape').textContent='—';$('awayShape').textContent='—';
      return;
    }
    const hs=ev?.activeLineups?.home||{
      shape:match.home.currentShape,stance:match.home.currentStance,
      averageFitness:window.FWCL_EVENT_GRAPH.averageFitness(match.home),
      substitutions:match.home.stats?.substitutions||0,injuries:match.home.stats?.injuries||0
    };
    const as=ev?.activeLineups?.away||{
      shape:match.away.currentShape,stance:match.away.currentStance,
      averageFitness:window.FWCL_EVENT_GRAPH.averageFitness(match.away),
      substitutions:match.away.stats?.substitutions||0,injuries:match.away.stats?.injuries||0
    };
    $('refereeProfile').textContent=match.referee?.name||'Perfil não informado';
    $('homeTacticalLabel').textContent=match.home.name;
    $('awayTacticalLabel').textContent=match.away.name;
    $('homeShape').textContent=`${hs.shape} — ${hs.stance}`;
    $('awayShape').textContent=`${as.shape} — ${as.stance}`;
    $('homeManagement').textContent=`Físico ${Number(hs.averageFitness||100).toFixed(0)}% • Subs ${hs.substitutions||0} • Atend. ${hs.injuries||0}`;
    $('awayManagement').textContent=`Físico ${Number(as.averageFitness||100).toFixed(0)}% • Subs ${as.substitutions||0} • Atend. ${as.injuries||0}`;
  }

  function showSubstitution(match,ev,onChoose){
    const modal=$('substitutionModal'),data=ev?.substitution;
    if(!modal||!data)return false;
    const team=match[data.teamKey];
    const outPlayer=(team.squad||[]).find(p=>(p.id||p.player_wc_id)===data.out?.id);
    const candidates=(data.candidateIds||[]).map(id=>(team.squad||[]).find(p=>(p.id||p.player_wc_id)===id)).filter(Boolean);
    $('substitutionTitle').textContent=`Substituição aos ${ev.minute}' — ${team.name}`;
    $('substitutionSubtitle').textContent=`Escolha quem entra na posição ${data.slot||outPlayer?.slot||outPlayer?.positions?.[0]||''}. A partida ficará pausada.`;
    $('substitutionOutgoing').innerHTML=outPlayer?`<b>Sai:</b> ${displayName(outPlayer.name)} • físico ${Number(outPlayer.match?.fitness||100).toFixed(0)}% • nota ${Number(outPlayer.match?.rating||5.5).toFixed(1)}`:'Jogador substituído';
    const grid=$('substitutionCandidates');grid.innerHTML='';
    candidates.forEach(player=>{
      const card=document.createElement('div');
      card.className='candidate substitutionCandidate '+((player.player_class||'').includes('Lenda')?'legend':'');
      card.innerHTML=profileCardHtml(player,{buttonLabel:'Colocar em campo',statusText:`Físico ${Number(player.match?.fitness||100).toFixed(0)}% • compatível com ${data.slot||'a posição'}`});
      card.querySelector('button').onclick=()=>onChoose(player.id||player.player_wc_id);
      grid.appendChild(card);
    });
    $('keepRecommendedSub').onclick=()=>onChoose(data.in?.id);
    modal.classList.add('show');
    return true;
  }
  function hideSubstitution(){$('substitutionModal')?.classList.remove('show');}


function metricNumber(v){ return typeof v==='number' ? v : Number(v||0); }
function phraseIndex(seed,length){ return Math.abs(Math.round(seed))%length; }
function detectComeback(match,userTeamKey){
  const goals=(match.goalEvents||[]).slice().sort((a,b)=>a.minute-b.minute);
  let user=0,opp=0,trailed=false,led=false;
  goals.forEach(g=>{
    const isUser=g.teamKey===userTeamKey;
    if(isUser) user++; else opp++;
    if(user<opp) trailed=true;
    if(user>opp) led=true;
  });
  return {wonFromBehind: trailed && user>opp, lostAfterLeading: led && user<opp};
}
function reportHeadline(match){
  const userKey=match.userTeamKey||'home', oppKey=userKey==='home'?'away':'home';
  const userTeam=match[userKey], oppTeam=match[oppKey], us=match[userKey].stats, os=match[oppKey].stats;
  const goalsFor=match.score[userKey], goalsAgainst=match.score[oppKey];
  const diff=goalsFor-goalsAgainst;
  const dominant=(metricNumber(us.shots) >= Math.max(1,metricNumber(os.shots))*2) || (metricNumber(us.dangerousAttacks) > metricNumber(os.dangerousAttacks)*1.6) || (metricNumber(us.xg) > metricNumber(os.xg)*1.7);
  const heavyLoss=(diff<=-3) || (goalsAgainst>=4 && diff<=-2) || (metricNumber(os.shots) >= Math.max(1,metricNumber(us.shots))*2);
  const info=detectComeback(match,userKey);
  const seed=metricNumber(us.shots)+metricNumber(os.shots)+goalsFor*7+goalsAgainst*11;
  const dominantWins=[
    `Foi um passeio de ${userTeam.name}: o time controlou o jogo e sufocou o rival do início ao fim.`,
    `${userTeam.name} transformou a partida em treino de ataque contra defesa, empilhando chegadas perigosas.`,
    `Vitória com amplo domínio: a equipe do player acelerou quando quis e praticamente não foi incomodada.`,
    `${userTeam.name} mandou no jogo, ocupou o campo de ataque e venceu com autoridade tática.`,
    `${diff>=3?'Foi uma goleada com assinatura tática: ':'Foi um controle absoluto: '}${userTeam.name} produziu muito mais e fez a superioridade aparecer no placar.`
  ];
  const comebackWins=[
    `Reação heróica de ${userTeam.name}: o time saiu de baixo e virou no coração e na raça.`,
    `${userTeam.name} jogou com o coração na ponta da chuteira e encontrou uma virada histórica.`,
    `Virada construída na insistência: ${userTeam.name} resistiu ao momento ruim e cresceu no jogo.`,
    `Quando parecia difícil, ${userTeam.name} respondeu com personalidade e arrancou a vitória de virada.`,
    `Foi jogo de superação: ${userTeam.name} apanhou do contexto, reagiu e virou com autoridade emocional.`
  ];
  const reverseLosses=[
    `Apagão tático de ${userTeam.name}: o time deixou o jogo escapar depois de estar à frente.`,
    `${oppTeam.name} aplicou um nó tático na reta final e virou a partida sobre a equipe do player.`,
    `${userTeam.name} perdeu a concentração nos minutos decisivos e sofreu a virada.`,
    `A vitória parecia nas mãos, mas ${userTeam.name} caiu de rendimento e permitiu a reação rival.`,
    `Faltou gestão emocional e tática: ${userTeam.name} liderava, perdeu o controle e saiu derrotado.`
  ];
  const heavyLosses=[
    `${userTeam.name} levou uma goleada e agora é hora de repensar a estratégia.`,
    `Que feio, jogador! ${userTeam.name} foi dominado e não conseguiu competir em nenhum trecho longo do jogo.`,
    `Cadê a moral? ${userTeam.name} sofreu demais, cedeu espaços e terminou em larga desvantagem.`,
    `Derrota pesada: ${userTeam.name} foi empurrado para trás e viu o adversário transformar volume em placar.`,
    `Foi uma noite dura para ${userTeam.name}: o time apanhou taticamente e saiu goleado.`
  ];
  const genericWin=[
    `${userTeam.name} foi mais eficiente nos momentos-chave e saiu com a vitória.`,
    `Vitória construída com maturidade: ${userTeam.name} soube alternar controle e agressividade.`,
    `${userTeam.name} fez o suficiente para vencer e administrou melhor os momentos importantes.`,
    `O time do player encontrou as melhores soluções ofensivas e confirmou a vitória.`,
    `${userTeam.name} jogou de forma competitiva, criou o bastante e venceu com justiça.`
  ];
  const genericLoss=[
    `${userTeam.name} competiu, mas ficou abaixo nos lances decisivos.`,
    `A equipe do player teve seus momentos, porém o adversário foi mais cirúrgico.`,
    `${userTeam.name} não sustentou o plano de jogo até o fim e acabou derrotado.`,
    `Derrota explicada por menor eficiência ofensiva e respostas defensivas tardias.`,
    `${userTeam.name} perdeu um jogo em que o adversário foi mais preciso nas ações de maior valor.`
  ];
  const draws=[
    `Empate de forças parecidas: o placar refletiu um jogo equilibrado.`,
    `Ninguém conseguiu impor domínio definitivo, e a igualdade fez sentido.`,
    `O empate nasceu de uma partida aberta, com bons momentos para os dois lados.`,
    `Jogo nivelado: as equipes alternaram superioridade e terminaram em equilíbrio.`,
    `Empate honesto, com produção relativamente parecida e poucas margens entre os times.`
  ];
  let main;
  if(diff>0 && info.wonFromBehind) main=comebackWins[phraseIndex(seed,comebackWins.length)];
  else if(diff>0 && (dominant || diff>=3)) main=dominantWins[phraseIndex(seed,dominantWins.length)];
  else if(diff<0 && info.lostAfterLeading) main=reverseLosses[phraseIndex(seed,reverseLosses.length)];
  else if(diff<0 && heavyLoss) main=heavyLosses[phraseIndex(seed,heavyLosses.length)];
  else if(diff>0) main=genericWin[phraseIndex(seed,genericWin.length)];
  else if(diff<0) main=genericLoss[phraseIndex(seed,genericLoss.length)];
  else main=draws[phraseIndex(seed,draws.length)];
  const support=[];
  if(metricNumber(us.shots)!==metricNumber(os.shots)) support.push(`Finalizações: ${metricNumber(us.shots)} x ${metricNumber(os.shots)}.`);
  if(metricNumber(us.xg)!==metricNumber(os.xg)) support.push(`xG: ${metricNumber(us.xg).toFixed(2)} x ${metricNumber(os.xg).toFixed(2)}.`);
  if(metricNumber(us.dangerousAttacks)!==metricNumber(os.dangerousAttacks)) support.push(`Ataques perigosos: ${metricNumber(us.dangerousAttacks)} x ${metricNumber(os.dangerousAttacks)}.`);
  if(metricNumber(us.corners)+metricNumber(os.corners)>0) support.push(`Escanteios: ${metricNumber(us.corners)} x ${metricNumber(os.corners)}.`);
  return `<p>${main}</p><p>Leitura tática e estatística: ${support.slice(0,3).join(' ')}</p>`;
}
function statsPyramid(match){
  const hs=match.home.stats, as=match.away.stats;
  const rows=[
    ['xG', metricNumber(hs.xg), metricNumber(as.xg), v=>v.toFixed(2)],
    ['Finalizações', metricNumber(hs.shots), metricNumber(as.shots)],
    ['No alvo', metricNumber(hs.onTarget), metricNumber(as.onTarget)],
    ['Ataques perigosos', metricNumber(hs.dangerousAttacks), metricNumber(as.dangerousAttacks)],
    ['Escanteios', metricNumber(hs.corners), metricNumber(as.corners)],
    ['Dribles', metricNumber(hs.dribbles), metricNumber(as.dribbles)],
    ['Tabelas', metricNumber(hs.oneTwos), metricNumber(as.oneTwos)],
    ['Ultrapassagens', metricNumber(hs.overlaps), metricNumber(as.overlaps)],
    ['Contra-ataques', metricNumber(hs.counters), metricNumber(as.counters)],
    ['Faltas', metricNumber(hs.fouls), metricNumber(as.fouls)],
    ['Impedimentos', metricNumber(hs.offsides), metricNumber(as.offsides)],
    ['Substituições', metricNumber(hs.substitutions), metricNumber(as.substitutions)]
  ];
  return `<div class="analysisBox topGapSmall"><h3>Comparativo estatístico</h3><div class="reportPyramid">${rows.map(([label,left,right,fmt])=>{
    const max=Math.max(left,right,1); const leftPct=(left/max)*100; const rightPct=(right/max)*100; const f=fmt||((v)=>String(v));
    return `<div class="pyramidRow"><div class="pyramidValue left">${f(left)}</div><div class="pyramidBar left"><span class="fill" style="width:${leftPct}%"></span></div><div class="pyramidMetric">${label}</div><div class="pyramidBar right"><span class="fill" style="width:${rightPct}%"></span></div><div class="pyramidValue right">${f(right)}</div></div>`;
  }).join('')}</div><div class="small topGapSmall"><b>${match.home.name}</b> à esquerda • <b>${match.away.name}</b> à direita</div></div>`;
}
function playerTable(team,title){
  const players=[...(team.squad||team.lineup||[])].filter(p=>(p.match?.minutesPlayed||0)>0||p.match?.subbedIn).sort((a,b)=>b.match.rating-a.match.rating);
  return `<div class="reportBox ratingsTeam"><h3>${title}</h3><table class="ratingTable"><thead><tr><th>Jogador</th><th>Pos</th><th class="num">Nota</th><th class="num">Físico</th><th class="num">Gols</th><th class="num">Ações</th></tr></thead><tbody>${players.map((p,i)=>`<tr class="${i===0?'best':''}"><td>${p.flag||''} ${displayName(p.name)}</td><td>${(p.slot||p.positions?.[0]||'—')}</td><td class="num"><b>${Number(p.match.rating||5.5).toFixed(1)}</b></td><td class="num">${Number(p.match.fitness||100).toFixed(0)}%</td><td class="num">${p.match.goals||0}</td><td class="num">${p.match.keyActions||0}</td></tr>`).join('')}</tbody></table></div>`;
}

  function renderTournament(cup,currentFixture){
    const section=$('tournamentSection');section.classList.remove('hide');
    if(!cup){$('tournamentPanel').innerHTML='<div class="reportBox">Aguardando sorteio.</div>';return;}
    let html=`<div class="tournamentHeader"><b>${cup.stageLabel}</b><span>${cup.status==='active'?'Competição em andamento':cup.status==='finished'?'Competição encerrada':'Eliminado'}</span></div>`;
    if(cup.phase==='group'||cup.groups){
      html+='<div class="groupGrid">';
      cup.groups.forEach(g=>{
        const rows=window.FWCL_TOURNAMENT.sortedTable(g);
        html+=`<div class="groupBox"><h3>Grupo ${g.letter}</h3><table><thead><tr><th>Seleção</th><th>J</th><th>SG</th><th>Pts</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${r.team.user?'userRow':''}"><td>${i<2?'◉ ':''}${r.team.flag||''} ${r.team.name}</td><td>${r.played}</td><td>${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></div>`;
      });
      html+='</div>';
    }
    if(currentFixture) html+=`<div class="nextFixture"><b>Próximo jogo:</b> ${currentFixture.home.flag||''} ${currentFixture.home.name} × ${currentFixture.away.flag||''} ${currentFixture.away.name}</div>`;
    if(cup.status==='eliminated') html+='<div class="notice error">Sua seleção foi eliminada. Reinicie para disputar uma nova Copa.</div>';
    if(cup.status==='finished') html+=`<div class="championBox">🏆 Campeão: ${cup.champion?.flag||''} ${cup.champion?.name||''}</div>`;
    $('tournamentPanel').innerHTML=html;
  }

function report(match){
  if(!match){$('report').innerHTML='<div class="reportBox">Aguardando partida.</div>'; $('ratings').innerHTML=''; return;}
  const h=match.home.stats,a=match.away.stats;
  const all=[...(match.home.squad||match.home.lineup),...(match.away.squad||match.away.lineup)]
    .filter(p=>(p.match?.minutesPlayed||0)>0||p.match?.subbedIn)
    .sort((x,y)=>y.match.rating-x.match.rating);
  const best=all[0];
  $('report').innerHTML=`<div class="analysisBox"><h3>Relatório transparente</h3>${reportHeadline(match)}</div>
    ${statsPyramid(match)}
    <div class="reportGrid topGapSmall">
      <div class="reportBox"><b>Árbitro</b><br>${match.referee?.name||'—'}</div>
      <div class="reportBox"><b>Melhor nota</b><br>${best?`${displayName(best.name)}: ${best.match.rating.toFixed(1)}`:'—'}</div>
      <div class="reportBox"><b>Defensores no ataque</b><br>${h.defendersInAttack} x ${a.defendersInAttack}</div>
      <div class="reportBox"><b>Gestão de vantagem</b><br>${h.timeManagement} x ${a.timeManagement}</div>
      <div class="reportBox"><b>Mudanças de desenho</b><br>${h.formationChanges} x ${a.formationChanges}</div>
      <div class="reportBox"><b>Atendimentos físicos</b><br>${h.injuries} x ${a.injuries}</div>
    </div>`;
  $('ratings').innerHTML=`<h3>Notas individuais por equipe</h3><div class="ratingsTables">${playerTable(match.home,match.home.name)}${playerTable(match.away,match.away.name)}</div>`;
}
function renderAll(state){
    if(window.FWCL_DATA_QUALITY)window.FWCL_DATA_QUALITY.render();
    renderConfig(state);renderCountries(state);renderBudget(state);renderField(state);renderLineupStatus(state);showDraft(state);
    renderTournament(state.tournament,state.currentFixture);
  }
  window.FWCL_UI={renderAll,renderScore,addEvent,clearEvents,goalAlert,report,renderField,renderLivePitch,renderTournament,renderManagement,showSubstitution,hideSubstitution,profileCardHtml,displayName};
})();
