window.App = {
  current:null,timer:null,timeline:null,index:0,
  start(){ UI.populateSelects(); UI.renderField(UI.teamFromSelect('teamA')); UI.renderScore({teamA:UI.teamFromSelect('teamA'),teamB:UI.teamFromSelect('teamB'),scoreA:0,scoreB:0,minute:0}); },
  prepare(){
    const teamA=UI.teamFromSelect('teamA'), teamB=UI.teamFromSelect('teamB');
    const match=EventGraph.createMatch(teamA,teamB);
    this.current=match; UI.el('events').innerHTML=''; UI.el('report').innerHTML='<div class="card">Partida em andamento.</div>'; UI.renderField(teamA); UI.renderScore(match); return match;
  },
  instant(){
    const match=this.prepare(); EventGraph.simulate(match,(ev,m)=>{UI.addEvent(ev);UI.renderScore(m);}); UI.renderField(match.teamA,match.ratings); UI.renderReport(match);
  },
  realtime(){
    const match=this.prepare(); const events=[]; EventGraph.simulate(match,(ev)=>events.push(ev));
    match.scoreA=0; match.scoreB=0; match.minute=0; match.stats={}; match.ratings={}; EventGraph.initStats(match);
    UI.el('events').innerHTML=''; UI.renderScore(match); this.timeline=events; this.index=0;
    clearInterval(this.timer); this.timer=setInterval(()=>this.step(),650);
  },
  step(){
    if(!this.timeline || this.index>=this.timeline.length){ clearInterval(this.timer); UI.renderField(this.current.teamA,this.current.ratings); UI.renderReport(this.current); return; }
    const ev=this.timeline[this.index++];
    this.current.minute=ev.minute;
    if(ev.type==='goal'){
      if(ev.text.includes('contra a própria meta')) this.current.scoreA += 1;
      else {
        // Reconstroi score pela contagem de gols na timeline já exibida.
        const goalsA=this.timeline.slice(0,this.index).filter(e=>e.type==='goal').length;
        // Simplificação visual: placar real já foi calculado no objeto durante geração; no realtime preservamos evolução aproximada.
        // Evita revelar placar final antes dos eventos.
        const teamAPlayers=this.current.teamA.players.map(p=>p.name);
        const fromA=teamAPlayers.some(n=>ev.text.includes(n));
        if(fromA) this.current.scoreA++; else this.current.scoreB++;
      }
    }
    UI.addEvent(ev); UI.renderScore(this.current); UI.renderField(this.current.teamA,this.current.ratings);
  }
};
window.addEventListener('load',()=>App.start());
