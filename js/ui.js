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


  function metricNumber(v){return typeof v==='number'?v:Number(v||0);}
  const transparentPhrases={
    dominantWin:[
      'Foi um passeio: o time do player empurrou o rival para trás e controlou a partida.',
      'Goleada com autoridade: o vencedor transformou superioridade técnica em placar.',
      'Parecia treino de ataque contra defesa, tamanho o desequilíbrio nas finalizações.',
      'Domínio amplo do início ao fim: o adversário quase não conseguiu respirar.',
      'Atuação de dono do jogo: controle territorial, volume ofensivo e vitória sem discussão.'
    ],
    comebackWin:[
      'Reação heróica: o time do player recusou a derrota e buscou uma virada memorável.',
      'Jogaram com raça e coração na ponta da chuteira para transformar o resultado.',
      'A equipe cresceu na adversidade e construiu a virada com personalidade.',
      'Foi uma vitória de superação: o time saiu de baixo e terminou por cima.',
      'Virada histórica, sustentada por pressão, coragem e eficiência nos momentos decisivos.'
    ],
    comebackLoss:[
      'Apagão tático: o time perdeu o controle depois de estar em vantagem.',
      'O adversário aplicou um nó tático e virou uma partida que parecia encaminhada.',
      'A concentração desapareceu no fim, e a vitória escapou das mãos.',
      'Faltou gestão da vantagem: o time recuou demais e permitiu a virada.',
      'Uma derrota dolorosa, marcada por queda física e decisões ruins na reta final.'
    ],
    heavyLoss:[
      'Levou uma goleada: é hora de repensar a estratégia e a forma de defender.',
      'Que feio, jogador! O time foi dominado e não encontrou respostas.',
      'Cadê a moral? A equipe sofreu uma derrota pesada e ficou sem reação.',
      'O adversário passou por cima: faltou equilíbrio, cobertura e competitividade.',
      'Derrota de larga desvantagem, com sinais claros de desorganização tática.'
    ],
    normalWin:[
      'Vitória eficiente: o time do player foi melhor nos lances de maior valor.',
      'A equipe venceu com maturidade e soube administrar os momentos da partida.',
      'Foi uma vitória competitiva, construída com equilíbrio entre ataque e defesa.',
      'O time encontrou as melhores soluções e confirmou a vantagem no placar.',
      'Vitória justa, com mais precisão nas ações decisivas.'
    ],
    normalLoss:[
      'O time competiu, mas o adversário foi mais eficiente nos momentos decisivos.',
      'A derrota veio pela dificuldade de transformar posse e volume em chances claras.',
      'Faltou precisão ofensiva e sobrou espaço para o rival explorar.',
      'O plano de jogo funcionou apenas em partes, e o adversário aproveitou as falhas.',
      'Derrota equilibrada, definida por detalhes e melhor conversão do outro lado.'
    ],
    draw:[
      'Empate coerente com uma partida equilibrada e alternância de domínio.',
      'Ninguém conseguiu impor superioridade permanente, e a igualdade fez sentido.',
      'As equipes dividiram os melhores momentos e terminaram com placar justo.',
      'Jogo parelho: produção ofensiva e resistência defensiva se compensaram.',
      'Um empate honesto, com margens pequenas entre os dois times.'
    ]
  };
  function comebackState(match,userKey){
    let us=0,them=0,trailed=false,led=false;
    [...(match.goalEvents||[])].sort((a,b)=>a.minute-b.minute).forEach(g=>{
      if(g.teamKey===userKey)us++;else them++;
      if(us<them)trailed=true;if(us>them)led=true;
    });
    return {trailed,led};
  }
  function transparentAnalysis(match){
    const userKey=match.userTeamKey||'home',oppKey=userKey==='home'?'away':'home';
    const user=match[userKey],opp=match[oppKey],us=user.stats,os=opp.stats;
    const gf=match.score[userKey],ga=match.score[oppKey],diff=gf-ga,state=comebackState(match,userKey);
    const shotRatio=metricNumber(us.shots)/Math.max(1,metricNumber(os.shots));
    const xgRatio=metricNumber(us.xg)/Math.max(.25,metricNumber(os.xg));
    const dangerRatio=metricNumber(us.dangerousAttacks)/Math.max(1,metricNumber(os.dangerousAttacks));
    const dominant=diff>=3||shotRatio>=2||xgRatio>=1.75||dangerRatio>=1.8;
    const heavy=diff<=-3||shotRatio<=.5||xgRatio<=.55;
    let context='draw',label='Empate equilibrado',criteria=[];
    if(diff>0&&state.trailed){context='comebackWin';label='Vitória de virada';criteria.push('o time esteve atrás no placar e terminou vencedor');}
    else if(diff>0&&dominant){context='dominantWin';label='Vitória com amplo domínio';if(diff>=3)criteria.push(`vantagem de ${diff} gols`);if(shotRatio>=2)criteria.push('finalizou pelo menos o dobro do adversário');if(xgRatio>=1.75)criteria.push('gerou xG muito superior');}
    else if(diff<0&&state.led){context='comebackLoss';label='Derrota de virada';criteria.push('o time esteve em vantagem e sofreu a virada');}
    else if(diff<0&&heavy){context='heavyLoss';label='Derrota com larga desvantagem';if(diff<=-3)criteria.push(`perdeu por ${Math.abs(diff)} gols`);if(shotRatio<=.5)criteria.push('finalizou metade ou menos que o rival');}
    else if(diff>0){context='normalWin';label='Vitória competitiva';criteria.push('maior eficiência no placar');}
    else if(diff<0){context='normalLoss';label='Derrota competitiva';criteria.push('menor eficiência no placar');}
    else criteria.push('placar e produção equilibrados');
    const list=transparentPhrases[context];
    const seed=(gf*17+ga*23+metricNumber(us.shots)*3+metricNumber(os.shots)*5+metricNumber(us.corners));
    const phrase=list[Math.abs(seed)%list.length];
    const evidence=[`Finalizações ${metricNumber(us.shots)} x ${metricNumber(os.shots)}`,`xG ${metricNumber(us.xg).toFixed(2)} x ${metricNumber(os.xg).toFixed(2)}`,`Ataques perigosos ${metricNumber(us.dangerousAttacks)} x ${metricNumber(os.dangerousAttacks)}`];
    return `<div class="reportContext"><span class="contextBadge">${label}</span><strong>${phrase}</strong><p><b>Por que o sistema classificou assim:</b> ${criteria.join('; ')}.</p><p class="muted">Evidências: ${evidence.join(' • ')}.</p></div>`;
  }
  function pyramidChart(match){
    const hs=match.home.stats,as=match.away.stats;
    const rows=[
      ['xG',metricNumber(hs.xg),metricNumber(as.xg),v=>v.toFixed(2)],['Finalizações',hs.shots,as.shots],['No alvo',hs.onTarget,as.onTarget],
      ['Ataques perigosos',hs.dangerousAttacks,as.dangerousAttacks],['Escanteios',hs.corners,as.corners],['Dribles',hs.dribbles,as.dribbles],
      ['Tabelas',hs.oneTwos,as.oneTwos],['Ultrapassagens',hs.overlaps,as.overlaps],['Contra-ataques',hs.counters,as.counters],
      ['Faltas',hs.fouls,as.fouls],['Impedimentos',hs.offsides,as.offsides],['Substituições',hs.substitutions,as.substitutions]
    ];
    return `<div class="pyramidChart"><div class="pyramidTeams"><b>${match.home.name}</b><span>COMPARATIVO</span><b>${match.away.name}</b></div>${rows.map(([label,left,right,fmt])=>{
      left=metricNumber(left);right=metricNumber(right);const max=Math.max(left,right,1);const f=fmt||((v)=>String(v));
      return `<div class="pyramidStat"><span class="statNumber left">${f(left)}</span><div class="wedge left"><i style="width:${Math.max(5,left/max*100)}%"></i></div><span class="statLabel">${label}</span><div class="wedge right"><i style="width:${Math.max(5,right/max*100)}%"></i></div><span class="statNumber right">${f(right)}</span></div>`;
    }).join('')}</div>`;
  }
  function ratingsTable(team){
    const players=[...(team.squad||team.lineup||[])].filter(p=>(p.match?.minutesPlayed||0)>0||p.match?.subbedIn||p.match?.sentOff||p.match?.forcedOut).sort((a,b)=>b.match.rating-a.match.rating);
    return `<section class="teamRatings"><h3>${team.name}</h3><table><thead><tr><th>Jogador</th><th>Pos.</th><th>Condição</th><th class="num">Nota</th><th class="num">Vigor</th><th class="num">Gols</th><th class="num">Ações</th></tr></thead><tbody>${players.map((p,i)=>{
      const condition=p.match.sentOff?'Expulso':p.match.forcedOut?'Saiu lesionado':p.match.subbedOut?'Substituído':p.match.subbedIn?'Entrou':'Titular';
      return `<tr class="${i===0?'best':''}"><td>${p.flag||''} ${displayName(p.name)}</td><td>${p.slot||p.positions?.[0]||'—'}</td><td>${condition}</td><td class="num"><b>${Number(p.match.rating||5.5).toFixed(1)}</b></td><td class="num">${Number(p.match.fitness||100).toFixed(0)}%</td><td class="num">${p.match.goals||0}</td><td class="num">${p.match.participations||0}</td></tr>`;
    }).join('')}</tbody></table></section>`;
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
    if(currentFixture)html+=`<div class="nextFixture"><b>Próximo jogo:</b> ${currentFixture.home.flag||''} ${currentFixture.home.name} × ${currentFixture.away.flag||''} ${currentFixture.away.name}</div>`;
    if(cup.status==='eliminated')html+='<div class="notice error">Sua seleção foi eliminada. Reinicie para disputar uma nova Copa.</div>';
    if(cup.status==='finished')html+=`<div class="championBox">🏆 Campeão: ${cup.champion?.flag||''} ${cup.champion?.name||''}</div>`;
    $('tournamentPanel').innerHTML=html;
  }
  function report(match){
    if(!match){$('report').innerHTML='<div class="reportBox">Aguardando partida.</div>';$('ratings').innerHTML='';return;}
    const h=match.home.stats,a=match.away.stats;
    $('report').innerHTML=`<div class="transparentReport"><h3>RELATÓRIO TRANSPARENTE</h3>${transparentAnalysis(match)}</div>
      <div class="statsPyramidPanel"><h3>PIRÂMIDE ESTATÍSTICA DA PARTIDA</h3>${pyramidChart(match)}</div>
      <div class="reportGrid topGapSmall"><div class="reportBox"><b>Expulsões</b><br>${h.redCards} x ${a.redCards}</div><div class="reportBox"><b>Saídas sem reposição</b><br>${h.forcedExits} x ${a.forcedExits}</div><div class="reportBox"><b>Jogadores ao final</b><br>${match.home.lineup.length} x ${match.away.lineup.length}</div><div class="reportBox"><b>Árbitro</b><br>${match.referee?.name||'—'}</div></div>`;
    $('ratings').innerHTML=`<h3>NOTAS DE DESEMPENHO POR JOGADOR</h3><div class="ratingsByTeam">${ratingsTable(match.home)}${ratingsTable(match.away)}</div>`;
  }

function renderAll(state){
    if(window.FWCL_DATA_QUALITY)window.FWCL_DATA_QUALITY.render();
    renderConfig(state);renderCountries(state);renderBudget(state);renderField(state);renderLineupStatus(state);showDraft(state);
    renderTournament(state.tournament,state.currentFixture);
  }
  window.FWCL_UI={renderAll,renderScore,addEvent,clearEvents,goalAlert,report,renderField,renderLivePitch,renderTournament,renderManagement,showSubstitution,hideSubstitution,profileCardHtml,displayName};
})();
