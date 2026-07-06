window.UI = {
  el(id){ return document.getElementById(id); },
  populateSelects(){
    const teamA=this.el('teamA'), teamB=this.el('teamB');
    for(const t of FWCL_TEAMS){
      teamA.add(new Option(`${t.flag} ${t.name}`,t.id));
      teamB.add(new Option(`${t.flag} ${t.name}`,t.id));
    }
    teamA.value='bra-2002'; teamB.value='arg-1986';
  },
  teamFromSelect(id){
    const team = FWCL_TEAMS.find(t=>t.id===this.el(id).value);
    return {...team, players: FWCL_PLAYERS.filter(p=>p.teamId===team.id)};
  },
  renderScore(match){
    this.el('score').innerHTML = `<span>${match.teamA.flag} ${match.teamA.name}</span><b>${match.scoreA} x ${match.scoreB}</b><span>${match.teamB.flag} ${match.teamB.name}</span>`;
    this.el('clock').textContent = String(match.minute).padStart(2,'0') + "'";
  },
  renderField(team, ratings={}){
    const formation = FWCL_FORMATIONS['4-3-3'];
    const players = team.players;
    const used = new Set();
    const pick = slot => {
      const candidates = players.filter(p=>!used.has(p.id)&&slot.accepts.some(a=>p.positions.includes(a)||p.position===a));
      const p = candidates.sort((a,b)=>b.price-a.price)[0] || players.find(p=>!used.has(p.id));
      if(p) used.add(p.id); return p;
    };
    this.el('field').innerHTML = formation.map(s=>{
      const p=pick(s), r=ratings[p?.id]?.score || 5.5;
      return `<div class="player" id="p-${p?.id}" style="left:${s.x}%;top:${s.y}%"><strong>${s.label}</strong><span>${p?.classIcon||''} ${p?.name||'-'}</span><small>${r.toFixed(1)}</small></div>`;
    }).join('');
  },
  addEvent(ev){
    const box=this.el('events'); box.insertAdjacentHTML('beforeend', Narration.format(ev)); box.scrollTop=box.scrollHeight;
    if(ev.type==='goal') this.goalFlash(ev.text);
  },
  goalFlash(text){
    const g=this.el('goalFlash'); g.textContent=text; g.classList.add('show');
    document.body.classList.add('goalPulse');
    setTimeout(()=>{g.classList.remove('show');document.body.classList.remove('goalPulse');},1200);
  },
  renderReport(match){
    const a=match.stats[match.teamA.id], b=match.stats[match.teamB.id];
    const ratings = Object.entries(match.ratings).map(([id,r])=>({player:FWCL_PLAYERS.find(p=>p.id===id),score:r.score,notes:r.notes})).filter(x=>x.player).sort((x,y)=>y.score-x.score).slice(0,10);
    this.el('report').innerHTML = `
      <div class="card"><b>xG:</b> ${match.teamA.name} ${a.xg.toFixed(2)} x ${b.xg.toFixed(2)} ${match.teamB.name}</div>
      <div class="card"><b>Finalizações:</b> ${a.shots} x ${b.shots}</div>
      <div class="card"><b>Cruzamentos:</b> ${a.crosses} x ${b.crosses}</div>
      <div class="card"><b>Defesas:</b> ${a.saves} x ${b.saves}</div>
      <h3>Notas individuais</h3>
      ${ratings.map(r=>`<div class="rating"><b>${r.player.flag} ${r.player.name}</b><span>${r.score.toFixed(1)}</span><small>${[...new Set(r.notes)].slice(0,3).join(', ')||'participação discreta'}</small></div>`).join('')}
    `;
  }
};
