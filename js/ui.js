(function(){
  const $ = (id)=>document.getElementById(id);
  function fmtMoney(v){ return `US$${Math.max(0,Math.round(v))}MM`; }
  function classIcon(player){ return (player.player_class||'⚙️').split(' ')[0]; }
  function shortTeam(t){ return `${t.flag||''} ${t.country} ${t.year}`; }
  function renderCountries(state){
    const sel = $('dynastyCountry');
    sel.innerHTML = '';
    window.FWCL_MARKET.countries().forEach(c=>{
      const o=document.createElement('option'); o.value=c.country; o.textContent=`${c.flag} ${c.country}`; sel.appendChild(o);
    });
    if(state.country) sel.value = state.country;
  }
  function renderConfig(state){
    const formSel = $('formation'); formSel.innerHTML='';
    Object.keys(window.FWCL_FORMATIONS).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=k; formSel.appendChild(o); });
    formSel.value = state.formation;
    const diffSel = $('difficulty'); diffSel.innerHTML='';
    Object.entries(window.FWCL_DIFFICULTIES).forEach(([k,v])=>{ const o=document.createElement('option'); o.value=k; o.textContent=v.label; diffSel.appendChild(o); });
    diffSel.value = state.difficulty;
    $('mode').value = state.mode;
    $('dynastyWrap').classList.toggle('hide', state.mode!=='dynasty');
  }
  function renderBudget(state){
    $('budgetText').textContent = fmtMoney(state.budgetLeft);
    const pct = Math.max(0, Math.min(100, state.budgetLeft/state.budgetTotal*100));
    $('budgetBar').style.width = pct+'%';
    $('budgetText').style.color = state.budgetLeft < 0 ? 'var(--danger)' : 'var(--accent)';
  }
  function renderField(state){
    const field=$('field'); field.innerHTML = '<div class="circle"></div>';
    const slots = window.FWCL_FORMATIONS[state.formation] || [];
    slots.forEach(slot=>{
      const p = state.lineup[slot.id];
      const div=document.createElement('button');
      div.className = 'slot ' + (p?'filled':'empty') + (p && (p.player_class||'').includes('Lenda')?' legend':'') + (state.activeSlot===slot.id?' active':'');
      div.style.left = slot.x+'%'; div.style.top = slot.y+'%';
      div.dataset.slotId = slot.id;
      div.innerHTML = p ? `<div class="pos">${slot.label}</div><div class="name">${classIcon(p)} ${p.name}</div><div class="meta">${p.flag} ${p.year}</div><div class="rating">Nota ${((p.match&&p.match.rating)||5.5).toFixed(1)}</div><div class="price">US$${p.price_mm}MM</div>` : `<div class="pos">${slot.label}</div><div class="name">Vazio</div>`;
      div.onclick = ()=> window.FWCL_APP.handleSlotClick(slot.id);
      field.appendChild(div);
    });
  }
  function renderLineupStatus(state){
    const filled = Object.keys(state.lineup).length;
    const total = (window.FWCL_FORMATIONS[state.formation]||[]).length;
    const box=$('lineupStatus');
    if(state.activeDraft){ box.className='notice'; box.textContent=`Sorteio travado: ${shortTeam(state.activeDraft.team)} para ${state.activeDraft.slot.label}. Escolha um jogador antes de continuar.`; }
    else if(filled===total){ box.className='notice ok'; box.textContent='Elenco titular completo. Você já pode ir para a partida.'; }
    else { box.className='notice'; box.textContent=`Monte o XI titular: ${filled}/${total} posições preenchidas.`; }
    $('goMatchBtn').disabled = filled !== total || !!state.activeDraft || state.budgetLeft < 0;
  }
  function showDraft(state){
    const modal=$('draftModal'); const grid=$('candidateGrid'); const head=$('draftTitle'); const sub=$('draftSubtitle');
    if(!state.activeDraft){ modal.classList.remove('show'); return; }
    const {team, slot} = state.activeDraft;
    head.textContent = `${shortTeam(team)} — ${slot.label}`;
    sub.textContent = 'Sorteio vinculante. Não há resortear. Escolha um jogador para continuar.';
    const cands = window.FWCL_MARKET.availablePlayers(team, slot.label, state.chosenAthletes);
    grid.innerHTML='';
    if(!cands.length){ grid.innerHTML='<div class="notice error">Não há jogadores compatíveis nesta convocação. Reinicie a montagem.</div>'; }
    cands.forEach(p=>{
      const duplicate = state.chosenAthletes.has(p.athlete_id);
      const over = p.price_mm > state.budgetLeft;
      const disabled = duplicate || over;
      const card=document.createElement('div');
      card.className='candidate '+((p.player_class||'').includes('Lenda')?'legend ':'')+(disabled?'disabled':'');
      card.innerHTML = `<div class="name">${classIcon(p)} ${p.name}</div><div class="small">${p.flag} ${p.country} ${p.year} • ${p.positions.join(' / ')} • ajuste ${p.fit}%</div><div><b>US$${p.price_mm}MM</b> • ${p.player_class}</div><div class="attrs">Fin ${p.skills.finishing} • Pas ${p.skills.passing} • Dri ${p.skills.dribble} • Def ${p.skills.marking} • Dec ${p.skills.decision}</div><div class="small">${duplicate?'Já existe outra versão deste atleta no elenco.': over?'Sem orçamento para contratar.':'Disponível.'}</div><button ${disabled?'disabled':''}>Selecionar</button>`;
      card.querySelector('button').onclick=()=>window.FWCL_APP.selectCandidate(p);
      grid.appendChild(card);
    });
    modal.classList.add('show');
  }
  function renderScore(match){
    $('clock').textContent = `${match ? match.currentMinute : 0}'`;
    $('score').textContent = `${match ? match.liveScore.home : 0} x ${match ? match.liveScore.away : 0}`;
    $('homeName').textContent = match ? match.home.name : 'Seu XI Legends';
    $('awayName').textContent = match ? match.away.name : 'Adversário';
  }
  function addEvent(ev){
    const log=$('log'); const div=document.createElement('div');
    div.className = 'event '+(ev.type==='goal'?'goal':ev.type==='foul'?'warn':'');
    div.innerHTML = ev.html;
    log.appendChild(div); log.scrollTop = log.scrollHeight;
  }
  function clearEvents(){ $('log').innerHTML=''; }
  function goalAlert(ev){
    const el=$('goalAlert'); el.textContent = `⚽ GOL! ${ev.team} — ${ev.player} (${ev.score})`;
    el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1200);
  }
  function report(match){
    if(!match){ $('report').innerHTML='<div class="reportBox">Aguardando partida.</div>'; return; }
    const h=match.home.stats,a=match.away.stats;
    const all=[...match.home.lineup,...match.away.lineup].sort((x,y)=>(y.match.rating-x.match.rating));
    const best=all[0];
    $('report').innerHTML = `<div class="reportGrid">
      <div class="reportBox"><b>xG</b><br>${h.xg.toFixed(2)} x ${a.xg.toFixed(2)}</div>
      <div class="reportBox"><b>Finalizações</b><br>${h.shots} x ${a.shots}</div>
      <div class="reportBox"><b>Cruzamentos</b><br>${h.crosses} x ${a.crosses}</div>
      <div class="reportBox"><b>Dribles certos</b><br>${h.dribbles} x ${a.dribbles}</div>
      <div class="reportBox"><b>Melhor nota</b><br>${best.name}: ${best.match.rating.toFixed(1)}</div>
      <div class="reportBox"><b>Leitura do LEGION</b><br>O placar emergiu das cadeias de eventos: posse, progressão, duelos, criação de chances e conversão.</div>
    </div>`;
    $('ratings').innerHTML = `<h3>Notas individuais</h3><div class="reportGrid">${all.map(p=>`<div class="reportBox"><b>${p.flag} ${p.name}</b><br>Nota ${p.match.rating.toFixed(1)}<br><span class="muted">Gols ${p.match.goals||0} • Chutes ${p.match.shots||0} • Defesas ${p.match.saves||0} • Ações-chave ${p.match.keyActions||0}</span></div>`).join('')}</div>`;
  }
  function renderAll(state){ renderConfig(state); renderCountries(state); renderBudget(state); renderField(state); renderLineupStatus(state); showDraft(state); }
  window.FWCL_UI = { renderAll, renderScore, addEvent, clearEvents, goalAlert, report, renderField };
})();
