(function(){
  const $=id=>document.getElementById(id);
  function fmtMoney(v){ return `US$${Math.max(0,Math.round(v*10)/10)}MM`; }
  function classIcon(p){ return (p?.player_class||'⚙️').split(' ')[0]; }
  function shortTeam(t){ return `${t.flag||''} ${t.country} ${t.year}`; }
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
      div.innerHTML=p?`<div class="pos">${slot.label}</div><div class="name">${classIcon(p)} ${p.name}</div><div class="meta">${p.flag} ${p.year}</div><div class="rating">Nota ${((p.match&&p.match.rating)||5.5).toFixed(1)}</div><div class="price">US$${p.price_mm}MM</div>`:`<div class="pos">${slot.label}</div><div class="name">Vazio</div>`;
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
      card.innerHTML=`<div class="name">${classIcon(p)} ${p.name}</div>
        <div class="small">${p.flag} ${p.country} ${p.year} • ${(p.positions||[]).join(' / ')} • ajuste ${p.fit}%</div>
        <div><b>US$${p.price_mm}MM</b> • ${p.player_class}</div>
        <div class="small">Preço já contém redução global de 20%.</div>
        <div class="attrs">Fin ${p.skills.finishing} • Pas ${p.skills.passing} • Dri ${p.skills.dribble} • Def ${p.skills.marking} • Dec ${p.skills.decision}</div>
        <div class="small">${duplicate?'Outra versão deste atleta já foi usada.':over?'Orçamento insuficiente.':'Disponível.'}</div>
        <button ${disabled?'disabled':''}>Selecionar</button>`;
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
    window.FWCL_AUDIO?.goal({player:ev.player,team:ev.team,score:ev.score});const el=$('goalAlert');el.textContent=`⚽ GOL! ${ev.team} — ${ev.player} (${ev.score})`;
    el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400);
  }
  function roleRank(player){
    const pos=player?.positions||[];
    if(pos.includes('GK'))return 0;
    if(pos.some(x=>['ZAG','LE','LD','ALA_E','ALA_D'].includes(x)))return 1;
    if(pos.some(x=>['VOL','MC','MEI'].includes(x)))return 2;
    return 3;
  }
  function sideBias(player){
    const pos=player?.positions||[];
    if(pos.some(x=>['LE','ALA_E','PE'].includes(x)))return -1;
    if(pos.some(x=>['LD','ALA_D','PD'].includes(x)))return 1;
    return 0;
  }
  function formationLines(shape){
    const known={
      '5-4-1':[1,5,4,1],
      '4-5-1':[1,4,5,1],
      '4-4-2':[1,4,4,2],
      '4-3-3':[1,4,3,3],
      '4-2-3-1':[1,4,2,3,1],
      '4-2-4':[1,4,2,4],
      '3-4-3':[1,3,4,3],
      '3-3-4':[1,3,3,4]
    };
    return known[shape]||known['4-2-3-1'];
  }
  function assignFormation(players,shape,side){
    const sorted=[...players].sort((a,b)=>
      roleRank(a)-roleRank(b)||sideBias(a)-sideBias(b)||String(a.name).localeCompare(String(b.name))
    );
    const lines=formationLines(shape);
    const coords=[];
    let cursor=0;
    const minX=side==='home'?7:93;
    const maxX=side==='home'?45:55;
    lines.forEach((count,lineIndex)=>{
      const ratio=lines.length===1?0:lineIndex/(lines.length-1);
      const x=minX+(maxX-minX)*ratio;
      const ys=count===1?[50]:Array.from({length:count},(_,i)=>12+i*(76/(count-1)));
      for(let i=0;i<count&&cursor<sorted.length;i++,cursor++){
        coords.push({player:sorted[cursor],x,y:ys[i]});
      }
    });
    while(cursor<sorted.length){
      coords.push({player:sorted[cursor],x:side==='home'?42:58,y:18+(cursor%5)*15});
      cursor++;
    }
    return coords;
  }
  function shortLabel(name){
    const clean=String(name||'Jogador').replace(/^not applicable\s+/i,'').trim();
    const parts=clean.split(/\s+/);
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
      ...assignFormation(home,homeShape,'home').map(x=>({...x,side:'home'})),
      ...assignFormation(away,awayShape,'away').map(x=>({...x,side:'away'}))
    ];
    const pointById=new Map();

    positions.forEach(({player,x,y,side},index)=>{
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
      marker.innerHTML=`<span class="playerDisc"><b>${number}</b></span><span class="playerTag">${shortLabel(player.name)}</span>`;
      marker.title=`${player.name} • ${(player.positions||[]).join('/')}`;
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
    if(!match){$('report').innerHTML='<div class="reportBox">Aguardando partida.</div>';return;}
    const h=match.home.stats,a=match.away.stats,all=[...(match.home.squad||match.home.lineup),...(match.away.squad||match.away.lineup)].filter(p=>(p.match?.minutesPlayed||0)>0||p.match?.subbedIn).sort((x,y)=>y.match.rating-x.match.rating),best=all[0];
    const winner=match.score.home===match.score.away?null:(match.score.home>match.score.away?match.home:match.away);
    const narrative=winner?`${winner.name} teve maior eficiência nos momentos decisivos. O relatório abaixo deriva dos eventos efetivamente simulados.`:'O empate refletiu equilíbrio entre produção ofensiva, resistência defensiva e conversão.';
    $('report').innerHTML=`<div class="analysisBox"><h3>Análise tática e estatística</h3><p>${narrative}</p></div>
      <div class="reportGrid">
        <div class="reportBox"><b>xG</b><br>${h.xg.toFixed(2)} x ${a.xg.toFixed(2)}</div>
        <div class="reportBox"><b>Finalizações</b><br>${h.shots} x ${a.shots}</div>
        <div class="reportBox"><b>No alvo</b><br>${h.onTarget} x ${a.onTarget}</div>
        <div class="reportBox"><b>Escanteios</b><br>${h.corners} x ${a.corners}</div>
        <div class="reportBox"><b>Faltas</b><br>${h.fouls} x ${a.fouls}</div>
        <div class="reportBox"><b>Impedimentos</b><br>${h.offsides} x ${a.offsides}</div>
        <div class="reportBox"><b>Laterais</b><br>${h.throwIns} x ${a.throwIns}</div>
        <div class="reportBox"><b>Tiros de meta</b><br>${h.goalKicks} x ${a.goalKicks}</div>
        <div class="reportBox"><b>Dribles</b><br>${h.dribbles} x ${a.dribbles}</div>
        <div class="reportBox"><b>Tabelas</b><br>${h.oneTwos} x ${a.oneTwos}</div>
        <div class="reportBox"><b>Ultrapassagens</b><br>${h.overlaps} x ${a.overlaps}</div>
        <div class="reportBox"><b>Ataques perigosos</b><br>${h.dangerousAttacks} x ${a.dangerousAttacks}</div>
        <div class="reportBox"><b>Contra-ataques</b><br>${h.counters} x ${a.counters}</div>
        <div class="reportBox"><b>Ligações diretas</b><br>${h.longBalls} x ${a.longBalls}</div>
        <div class="reportBox"><b>Defensores no ataque</b><br>${h.defendersInAttack} x ${a.defendersInAttack}</div>
        <div class="reportBox"><b>Gestão de vantagem</b><br>${h.timeManagement} x ${a.timeManagement}</div>
        <div class="reportBox"><b>Substituições</b><br>${h.substitutions} x ${a.substitutions}</div>
        <div class="reportBox"><b>Mudanças de desenho</b><br>${h.formationChanges} x ${a.formationChanges}</div>
        <div class="reportBox"><b>Atendimentos físicos</b><br>${h.injuries} x ${a.injuries}</div>
        <div class="reportBox"><b>Vantagens aplicadas</b><br>${h.advantagesPlayed} x ${a.advantagesPlayed}</div>
        <div class="reportBox"><b>Árbitro</b><br>${match.referee?.name||'—'}</div>
        <div class="reportBox"><b>Melhor nota</b><br>${best.name}: ${best.match.rating.toFixed(1)}</div>
      </div>`;
    $('ratings').innerHTML=`<h3>Notas individuais</h3><div class="reportGrid">${all.map(p=>`<div class="reportBox"><b>${p.flag||''} ${p.name}</b><br>Nota ${p.match.rating.toFixed(1)} • Físico ${Number(p.match.fitness||100).toFixed(0)}%<br><span class="muted">Gols ${p.match.goals||0} • Chutes ${p.match.shots||0} • Desarmes ${p.match.tackles||0} • Ações-chave ${p.match.keyActions||0}</span></div>`).join('')}</div>`;
  }
  function renderAll(state){
    if(window.FWCL_DATA_QUALITY)window.FWCL_DATA_QUALITY.render();
    renderConfig(state);renderCountries(state);renderBudget(state);renderField(state);renderLineupStatus(state);showDraft(state);
    renderTournament(state.tournament,state.currentFixture);
  }
  window.FWCL_UI={renderAll,renderScore,addEvent,clearEvents,goalAlert,report,renderField,renderLivePitch,renderTournament,renderManagement};
})();
