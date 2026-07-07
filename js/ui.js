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
  function playGoalSound(){
    try{
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      const ctx=new C(),gain=ctx.createGain();gain.gain.value=.065;gain.connect(ctx.destination);const now=ctx.currentTime;
      [392,523.25,659.25].forEach((f,i)=>{const o=ctx.createOscillator();o.type='triangle';o.frequency.setValueAtTime(f,now+i*.09);o.connect(gain);o.start(now+i*.09);o.stop(now+i*.09+.16);});
      setTimeout(()=>ctx.close&&ctx.close(),900);
    }catch(e){}
  }
  function goalAlert(ev){
    playGoalSound();const el=$('goalAlert');el.textContent=`⚽ GOL! ${ev.team} — ${ev.player} (${ev.score})`;
    el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400);
  }
  const coords=[
    [50,89],[18,72],[38,76],[62,76],[82,72],[50,61],[33,49],[67,49],[22,29],[50,22],[78,29]
  ];
  function renderLivePitch(match,ev){
    const pitch=$('livePitch');pitch.querySelectorAll('.livePlayer').forEach(n=>n.remove());
    const home=match?.home?.lineup||[],away=match?.away?.lineup||[];
    function marker(p,teamKey,i){
      const c=coords[i]||[10+(i%6)*15,20+Math.floor(i/6)*20];
      const x=teamKey==='home'?c[0]:100-c[0],y=teamKey==='home'?c[1]:100-c[1];
      const div=document.createElement('div');div.className=`livePlayer ${teamKey}`;
      const id=p.id||p.player_wc_id;
      if(ev?.actor?.id===id)div.classList.add('ballCarrier');
      if(ev?.support?.id===id)div.classList.add('supporting');
      if(ev?.defender?.id===id)div.classList.add('dueling');
      div.style.left=x+'%';div.style.top=y+'%';div.textContent=p.name.split(' ').slice(-1)[0];div.title=p.name;pitch.appendChild(div);
      if(ev?.actor?.id===id){
        const ball=$('liveBall');ball.classList.remove('hide');ball.style.left=(x+2)+'%';ball.style.top=(y-3)+'%';
      }
    }
    home.forEach((p,i)=>marker(p,'home',i));away.forEach((p,i)=>marker(p,'away',i));
    if(!ev?.actor)$('liveBall').classList.add('hide');
    const team=ev?.possessionTeam==='home'?match?.home:ev?.possessionTeam==='away'?match?.away:null;
    $('possessionBanner').textContent=team?`⚽ Posse: ${team.name}${ev.actor?.name?` — ${ev.actor.name} com a bola`:''}`:'⚪ Bola parada ou transição de posse';
    $('possessionBanner').className=`possessionBanner ${ev?.possessionTeam||''}`;
    const pieces=[];
    if(ev?.actor?.name)pieces.push(`<b>Com a bola:</b> ${ev.actor.name}`);
    if(ev?.support?.name)pieces.push(`<b>Apoio:</b> ${ev.support.name}`);
    if(ev?.defender?.name)pieces.push(`<b>Disputa:</b> ${ev.defender.name}`);
    $('duelPanel').innerHTML=pieces.length?pieces.join(' <span class="duelSep">×</span> '):'<span>Jogada sem disputa individual destacada.</span>';
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
    const h=match.home.stats,a=match.away.stats,all=[...match.home.lineup,...match.away.lineup].sort((x,y)=>y.match.rating-x.match.rating),best=all[0];
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
        <div class="reportBox"><b>Melhor nota</b><br>${best.name}: ${best.match.rating.toFixed(1)}</div>
      </div>`;
    $('ratings').innerHTML=`<h3>Notas individuais</h3><div class="reportGrid">${all.map(p=>`<div class="reportBox"><b>${p.flag||''} ${p.name}</b><br>Nota ${p.match.rating.toFixed(1)}<br><span class="muted">Gols ${p.match.goals||0} • Chutes ${p.match.shots||0} • Desarmes ${p.match.tackles||0} • Ações-chave ${p.match.keyActions||0}</span></div>`).join('')}</div>`;
  }
  function renderAll(state){
    if(window.FWCL_DATA_QUALITY)window.FWCL_DATA_QUALITY.render();
    renderConfig(state);renderCountries(state);renderBudget(state);renderField(state);renderLineupStatus(state);showDraft(state);
    renderTournament(state.tournament,state.currentFixture);
  }
  window.FWCL_UI={renderAll,renderScore,addEvent,clearEvents,goalAlert,report,renderField,renderLivePitch,renderTournament};
})();
