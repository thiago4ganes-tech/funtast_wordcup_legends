(function(){
  const state={
    mode:'dynasty',country:'Brasil',formation:'4-3-3',difficulty:'normal',
    budgetTotal:100,budgetLeft:100,lineup:{},chosenAthletes:new Set(),activeDraft:null,
    opponent:null,match:null,timer:null,tournament:null,currentFixture:null,matchFinalized:false
  };
  function slots(){return window.FWCL_FORMATIONS[state.formation]||[];}
  function slotById(id){return slots().find(s=>s.id===id);}
  function freshMatchStats(){return {rating:5.5,goals:0,assists:0,shots:0,onTarget:0,xg:0,saves:0,passes:0,dribbles:0,crosses:0,tackles:0,headers:0,fouls:0,cards:0,losses:0,keyActions:0,fitness:100,minutesPlayed:0,subbedIn:false,subbedOut:false,injured:false};}
  function resetAssembly(){
    clearInterval(state.timer);
    const diff=window.FWCL_DIFFICULTIES[state.difficulty];
    state.budgetTotal=diff.budget;state.budgetLeft=diff.budget;state.lineup={};state.chosenAthletes=new Set();
    state.activeDraft=null;state.opponent=null;state.match=null;state.tournament=null;state.currentFixture=null;state.matchFinalized=false;
    document.getElementById('matchSection').classList.add('hide');
    document.getElementById('tournamentSection').classList.add('hide');
    document.getElementById('continueCupBtn').classList.add('hide');
    window.FWCL_UI.clearEvents();window.FWCL_UI.report(null);window.FWCL_UI.renderScore(null);window.FWCL_UI.renderAll(state);
  }
  function handleSlotClick(slotId){
    const slot=slotById(slotId);if(!slot)return;
    if(state.activeDraft&&state.activeDraft.slot.id!==slotId){window.alert('Escolha um jogador da posição sorteada antes de continuar.');return;}
    if(state.lineup[slotId]&&!state.activeDraft){
      const p=state.lineup[slotId];delete state.lineup[slotId];state.chosenAthletes.delete(p.athlete_id);state.budgetLeft+=Number(p.price_mm||0);window.FWCL_UI.renderAll(state);return;
    }
    if(state.lineup[slotId])return;
    if(!state.activeDraft){
      const team=window.FWCL_MARKET.drawTeamForSlot(state.mode,state.country,slot.label,state.chosenAthletes,state.budgetLeft);
      if(!team){window.alert('Nenhuma seleção disponível.');return;}
      state.activeDraft={slot,team};
    }
    window.FWCL_UI.renderAll(state);
  }
  function selectCandidate(player){
    if(!state.activeDraft)return;
    if(state.chosenAthletes.has(player.athlete_id)){window.alert('Este atleta já possui outra versão no elenco.');return;}
    if(player.price_mm>state.budgetLeft){window.alert('Orçamento insuficiente.');return;}
    const slot=state.activeDraft.slot,chosen=JSON.parse(JSON.stringify(player));
    chosen.slot=slot.label;chosen.slotId=slot.id;chosen.match=freshMatchStats();
    state.lineup[slot.id]=chosen;state.chosenAthletes.add(chosen.athlete_id);state.budgetLeft-=Number(chosen.price_mm||0);state.activeDraft=null;
    window.FWCL_UI.renderAll(state);
  }
  function lineupArray(){return slots().map(s=>state.lineup[s.id]).filter(Boolean);}
  function startCup(){
    if(lineupArray().length!==slots().length){window.alert('Complete o XI titular.');return;}
    state.tournament=window.FWCL_TOURNAMENT.create(window.FWCL_MARKET.teams());
    document.getElementById('tournamentSection').classList.remove('hide');
    prepareNextMatch();
  }
  function prepareNextMatch(){
    if(!state.tournament)return;
    state.currentFixture=window.FWCL_TOURNAMENT.prepareNext(state.tournament);
    window.FWCL_UI.renderTournament(state.tournament,state.currentFixture);
    document.getElementById('continueCupBtn').classList.add('hide');
    if(!state.currentFixture){
      document.getElementById('matchSection').classList.add('hide');
      window.FWCL_UI.renderAll(state);return;
    }
    const opponentEntry=state.currentFixture.home.user?state.currentFixture.away:state.currentFixture.home;
    const oppTeam=opponentEntry.team;
    state.opponent={...oppTeam,lineup:window.FWCL_MARKET.buildAutoLineup(oppTeam,'4-3-3')};
    state.opponent.bench=window.FWCL_MARKET.buildAutoBench(oppTeam,state.opponent.lineup,7);
    state.match=null;state.matchFinalized=false;
    document.getElementById('matchSection').classList.remove('hide');
    document.getElementById('matchSection').scrollIntoView({behavior:'smooth'});
    const homeUser=state.currentFixture.home.user;
    window.FWCL_UI.renderScore({currentMinute:0,liveScore:{home:0,away:0},home:{name:homeUser?'Seu XI Legends':state.opponent.name},away:{name:homeUser?state.opponent.name:'Seu XI Legends'}});
    window.FWCL_UI.clearEvents();window.FWCL_UI.report(null);
  }
  function resetPlayersMatch(){
    [...lineupArray(),...(state.userBench||[]),...(state.opponent?.lineup||[]),...(state.opponent?.bench||[])].forEach(p=>p.match=freshMatchStats());
  }
  function buildMatch(){
    state.userBench=window.FWCL_MARKET.buildFantasyBench(lineupArray(),7);
    state.userBench.forEach(p=>p.match=freshMatchStats());
    const user={name:'Seu XI Legends',flag:'🏆',lineup:lineupArray(),bench:state.userBench};
    const opp={name:state.opponent.name,flag:state.opponent.flag,lineup:state.opponent.lineup,bench:state.opponent.bench||[]};
    const home=state.currentFixture.home.user?user:opp;
    const away=state.currentFixture.away.user?user:opp;
    const knockout=state.currentFixture.phase!=='group';
    const match=window.FWCL_EVENT_GRAPH.simulate(home,away,{knockout,stage:state.currentFixture.phase});
    match.currentMinute=0;match.liveScore={home:0,away:0};match.lastEvent=null;
    return match;
  }
  function tournamentResult(match){
    const f=state.currentFixture;
    const userHome=f.home.user;
    const homeId=f.home.id,awayId=f.away.id;
    let winnerId=null;
    if(match.winnerKey==='home')winnerId=homeId;
    if(match.winnerKey==='away')winnerId=awayId;
    return {home:match.score.home,away:match.score.away,winnerId,userHome};
  }
  function finalizeMatch(){
    if(state.matchFinalized||!state.match)return;
    state.matchFinalized=true;
    window.FWCL_TOURNAMENT.recordUserResult(state.tournament,tournamentResult(state.match));
    window.FWCL_UI.renderTournament(state.tournament,null);
    if(state.tournament.status==='active')document.getElementById('continueCupBtn').classList.remove('hide');
    else document.getElementById('continueCupBtn').classList.add('hide');
  }
  function simulateRealTime(){
    window.FWCL_AUDIO?.unlock();
    if(!state.opponent)return;
    clearInterval(state.timer);resetPlayersMatch();state.match=buildMatch();state.matchFinalized=false;
    window.FWCL_UI.clearEvents();window.FWCL_UI.report(null);window.FWCL_UI.renderScore(state.match);window.FWCL_UI.renderLivePitch(state.match,null);window.FWCL_UI.renderManagement(state.match,null);
    let i=0;
    state.timer=setInterval(()=>{
      if(i>=state.match.events.length){
        clearInterval(state.timer);window.FWCL_UI.report(state.match);finalizeMatch();return;
      }
      const ev=state.match.events[i++];state.match.currentMinute=ev.minute;state.match.lastEvent=ev;
      if(ev.scoreAfter)state.match.liveScore={...ev.scoreAfter};
      window.FWCL_UI.addEvent(ev);window.FWCL_UI.renderScore(state.match);window.FWCL_UI.renderLivePitch(state.match,ev);window.FWCL_UI.renderManagement(state.match,ev);
      if(ev.type==='goal'){
        const goal=state.match.goalEvents.find(g=>g.minute===ev.minute&&g.teamKey===ev.possessionTeam);
        if(goal)window.FWCL_UI.goalAlert(goal);
      }
    },680);
  }
  function simulateInstant(){
    window.FWCL_AUDIO?.unlock();
    if(!state.opponent)return;
    clearInterval(state.timer);resetPlayersMatch();state.match=buildMatch();state.matchFinalized=false;
    state.match.currentMinute=90;state.match.liveScore={...state.match.score};
    window.FWCL_UI.clearEvents();state.match.events.forEach(ev=>window.FWCL_UI.addEvent(ev));
    window.FWCL_UI.renderScore(state.match);window.FWCL_UI.renderLivePitch(state.match,state.match.events[state.match.events.length-1]);window.FWCL_UI.renderManagement(state.match,state.match.events[state.match.events.length-1]);
    window.FWCL_UI.report(state.match);finalizeMatch();
  }
  function bind(){
    document.getElementById('mode').onchange=e=>{state.mode=e.target.value;window.FWCL_UI.renderAll(state);};
    document.getElementById('dynastyCountry').onchange=e=>state.country=e.target.value;
    document.getElementById('formation').onchange=e=>{state.formation=e.target.value;resetAssembly();};
    document.getElementById('difficulty').onchange=e=>{state.difficulty=e.target.value;resetAssembly();};
    document.getElementById('startBtn').onclick=resetAssembly;document.getElementById('resetBtn').onclick=resetAssembly;
    document.getElementById('goMatchBtn').onclick=startCup;
    document.getElementById('realBtn').onclick=simulateRealTime;document.getElementById('instantBtn').onclick=simulateInstant;
    document.getElementById('soundToggle').onclick=e=>{
      window.FWCL_AUDIO?.unlock();
      const active=window.FWCL_AUDIO?.toggle();
      e.currentTarget.textContent=active?'🔊 Gol narrado: ligado':'🔇 Gol narrado: desligado';
    };
    document.getElementById('draftReset').onclick=resetAssembly;
    document.getElementById('continueCupBtn').onclick=()=>{prepareNextMatch();document.getElementById('matchSection').scrollIntoView({behavior:'smooth'});};
  }
  async function init(){
    if(window.FWCL_DATA_READY)await window.FWCL_DATA_READY;
    state.country=window.FWCL_MARKET.countries()[0]?.country||'Brasil';
    bind();resetAssembly();
  }
  window.FWCL_APP={init,handleSlotClick,selectCandidate,state};
  document.addEventListener('DOMContentLoaded',init);
})();
