(function(){
  const state = {
    mode:'dynasty', country:'Brasil', formation:'4-3-3', difficulty:'normal',
    budgetTotal:100, budgetLeft:100, lineup:{}, chosenAthletes:new Set(), activeDraft:null,
    opponent:null, match:null, timer:null
  };
  function slots(){ return window.FWCL_FORMATIONS[state.formation] || []; }
  function slotById(id){ return slots().find(s=>s.id===id); }
  function resetAssembly(){
    const diff = window.FWCL_DIFFICULTIES[state.difficulty];
    state.budgetTotal = diff.budget; state.budgetLeft = diff.budget;
    state.lineup = {}; state.chosenAthletes = new Set(); state.activeDraft = null; state.opponent=null; state.match=null;
    window.FWCL_UI.clearEvents(); window.FWCL_UI.report(null); window.FWCL_UI.renderScore(null); window.FWCL_UI.renderAll(state);
  }
  function handleSlotClick(slotId){
    const slot = slotById(slotId);
    if(!slot) return;
    if(state.activeDraft && state.activeDraft.slot.id !== slotId){ window.alert('Sorteio travado: escolha um jogador da posição atual antes de continuar.'); return; }
    if(state.lineup[slotId] && !state.activeDraft){
      const p=state.lineup[slotId];
      delete state.lineup[slotId]; state.chosenAthletes.delete(p.athlete_id); state.budgetLeft += Number(p.price_mm||0);
      window.FWCL_UI.renderAll(state); return;
    }
    if(state.lineup[slotId]) return;
    if(!state.activeDraft){
      const team = window.FWCL_MARKET.drawTeamForSlot(state.mode, state.country, slot.label, state.chosenAthletes, state.budgetLeft);
      if(!team){ window.alert('Nenhuma seleção disponível para este modo.'); return; }
      state.activeDraft = { slot, team };
    }
    window.FWCL_UI.renderAll(state);
  }
  function selectCandidate(player){
    if(!state.activeDraft) return;
    if(state.chosenAthletes.has(player.athlete_id)){ window.alert('Este atleta já tem outra versão no seu elenco.'); return; }
    if(player.price_mm > state.budgetLeft){ window.alert('Orçamento insuficiente para esta contratação.'); return; }
    const slot = state.activeDraft.slot;
    const chosen = JSON.parse(JSON.stringify(player));
    chosen.slot = slot.label; chosen.slotId = slot.id; chosen.match = {rating:5.5, goals:0, assists:0, shots:0, onTarget:0, xg:0, saves:0, passes:0, dribbles:0, crosses:0, tackles:0, fouls:0, cards:0, losses:0, keyActions:0};
    state.lineup[slot.id] = chosen;
    state.chosenAthletes.add(chosen.athlete_id);
    state.budgetLeft -= Number(chosen.price_mm||0);
    state.activeDraft = null;
    window.FWCL_UI.renderAll(state);
  }
  function lineupArray(){ return slots().map(s=>state.lineup[s.id]).filter(Boolean); }
  function randomOpponent(){
    const list = window.FWCL_MARKET.teams();
    return list[Math.floor(Math.random()*list.length)];
  }
  function goMatch(){
    if(lineupArray().length !== slots().length){ window.alert('Complete o XI titular antes de iniciar.'); return; }
    if(state.budgetLeft < 0){ window.alert('Budget inválido. Ajuste o elenco ou reinicie.'); return; }
    let oppTeam = randomOpponent();
    const myAthletes = new Set(lineupArray().map(p=>p.athlete_id));
    // Evita adversário com atletas repetidos no mesmo XI; permite enfrentar seleção histórica com atleta que você tenha, pois são universos diferentes.
    const oppLineup = window.FWCL_MARKET.buildAutoLineup(oppTeam, '4-3-3');
    state.opponent = { ...oppTeam, lineup: oppLineup };
    document.getElementById('matchSection').classList.remove('hide');
    document.getElementById('matchSection').scrollIntoView({behavior:'smooth'});
    window.FWCL_UI.renderScore({currentMinute:0,liveScore:{home:0,away:0},home:{name:'Seu XI Legends'},away:{name:state.opponent.name}});
  }
  function buildMatch(){
    const home = { name:'Seu XI Legends', flag:'🏆', lineup: lineupArray() };
    const away = { name:state.opponent.name, flag:state.opponent.flag, lineup: state.opponent.lineup };
    const match = window.FWCL_EVENT_GRAPH.simulate(home, away);
    match.currentMinute = 0; match.liveScore = {home:0, away:0};
    match.home.name='Seu XI Legends';
    return match;
  }
  function resetPlayersMatch(){
    [...lineupArray(), ...(state.opponent ? state.opponent.lineup : [])].forEach(p=>{ p.match = {rating:5.5, goals:0, assists:0, shots:0, onTarget:0, xg:0, saves:0, passes:0, dribbles:0, crosses:0, tackles:0, fouls:0, cards:0, losses:0, keyActions:0}; });
  }
  function simulateRealTime(){
    if(!state.opponent) goMatch();
    if(!state.opponent) return;
    clearInterval(state.timer); resetPlayersMatch();
    state.match = buildMatch();
    window.FWCL_UI.clearEvents(); window.FWCL_UI.report(null); window.FWCL_UI.renderField(state); window.FWCL_UI.renderScore(state.match);
    let i=0;
    state.timer=setInterval(()=>{
      if(i>=state.match.events.length){ clearInterval(state.timer); window.FWCL_UI.report(state.match); return; }
      const ev=state.match.events[i++];
      state.match.currentMinute = ev.minute;
      if(ev.type==='goal'){
        if(ev.text && ev.text.includes('GOOOL')){
          // score has already been generated; reveal gradually by counting previous goals.
        }
      }
      // Recalcula placar visível a partir dos gols já exibidos.
      const shown = state.match.events.slice(0,i).filter(e=>e.type==='goal' && e.text.includes('GOOOL'));
      // Como os eventos não guardam time no texto, usa goalEvents na ordem.
      const ge = state.match.goalEvents.slice(0, shown.length);
      let home=0, away=0;
      ge.forEach(g=>{ if(g.team==='Seu XI Legends') home++; else away++; });
      state.match.liveScore = {home,away};
      window.FWCL_UI.addEvent(ev); window.FWCL_UI.renderScore(state.match); window.FWCL_UI.renderField(state);
      if(ev.type==='goal' && ev.text.includes('GOOOL')){
        const g = ge[ge.length-1]; if(g) window.FWCL_UI.goalAlert(g);
      }
    }, 520);
  }
  function simulateInstant(){
    if(!state.opponent) goMatch();
    if(!state.opponent) return;
    clearInterval(state.timer); resetPlayersMatch();
    state.match = buildMatch(); state.match.currentMinute=90; state.match.liveScore = {...state.match.score};
    window.FWCL_UI.clearEvents();
    state.match.events.forEach(ev=>window.FWCL_UI.addEvent(ev));
    window.FWCL_UI.renderScore(state.match); window.FWCL_UI.renderField(state); window.FWCL_UI.report(state.match);
  }
  function bind(){
    document.getElementById('mode').onchange=e=>{state.mode=e.target.value; window.FWCL_UI.renderAll(state);};
    document.getElementById('dynastyCountry').onchange=e=>{state.country=e.target.value;};
    document.getElementById('formation').onchange=e=>{state.formation=e.target.value; resetAssembly();};
    document.getElementById('difficulty').onchange=e=>{state.difficulty=e.target.value; resetAssembly();};
    document.getElementById('startBtn').onclick=resetAssembly;
    document.getElementById('resetBtn').onclick=resetAssembly;
    document.getElementById('goMatchBtn').onclick=goMatch;
    document.getElementById('realBtn').onclick=simulateRealTime;
    document.getElementById('instantBtn').onclick=simulateInstant;
    document.getElementById('draftReset').onclick=resetAssembly;
  }
  function init(){
    state.country = window.FWCL_MARKET.countries()[0]?.country || 'Brasil';
    bind(); resetAssembly();
  }
  window.FWCL_APP = { init, handleSlotClick, selectCandidate, state };
  document.addEventListener('DOMContentLoaded', init);
})();
