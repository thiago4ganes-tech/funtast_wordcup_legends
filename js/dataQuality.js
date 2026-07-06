(function(){
  function teams(){ return (window.WCHD_PART4 && window.WCHD_PART4.teams) || []; }
  function allPlayers(){ return teams().flatMap(t => (t.players||[]).map(p=>({team:t, player:p}))); }
  function countBy(arr, fn){ const m=new Map(); arr.forEach(x=>{ const k=fn(x); m.set(k,(m.get(k)||0)+1); }); return m; }
  function positionDepth(){
    const slots = ['GK','ZAG','LE','LD','VOL','MC','MEI','PE','PD','CA'];
    const depth = {};
    for(const t of teams()){
      depth[t.id] = {name:t.name, country:t.country, year:t.year, counts:{}};
      for(const slot of slots){
        const c = (t.players||[]).filter(p => window.FWCL_SKILLS ? window.FWCL_SKILLS.positionFit(p, slot) > 0 : (p.positions||[]).includes(slot)).length;
        depth[t.id].counts[slot]=c;
      }
    }
    return depth;
  }
  function audit(){
    const ts = teams();
    const aps = allPlayers();
    const countries = new Set(ts.map(t=>t.country));
    const incomplete = ts.filter(t=>(t.players||[]).length < 23);
    const veryThin = [];
    const d = positionDepth();
    Object.values(d).forEach(row=>{
      Object.entries(row.counts).forEach(([slot,count])=>{ if(count < 3) veryThin.push({team:row.name, slot, count}); });
    });
    const athleteTeamDup = [];
    for(const t of ts){
      const byAth = countBy((t.players||[]), p=>p.athlete_id || p.id);
      byAth.forEach((count,ath)=>{ if(count>1) athleteTeamDup.push({team:t.name, athlete:ath, count}); });
    }
    return {
      teams: ts.length,
      countries: countries.size,
      players: aps.length,
      expectedMin: ts.length * 23,
      coverage: ts.length ? aps.length / (ts.length*23) : 0,
      incomplete,
      veryThin,
      athleteTeamDup,
      minTeamSize: ts.length ? Math.min(...ts.map(t=>(t.players||[]).length)) : 0,
      maxTeamSize: ts.length ? Math.max(...ts.map(t=>(t.players||[]).length)) : 0
    };
  }
  function render(){
    const el = document.getElementById('dataQualityPanel');
    if(!el) return;
    const a = audit();
    const coveragePct = Math.round(a.coverage*1000)/10;
    const cls = coveragePct >= 90 ? 'qualityGood' : coveragePct >= 70 ? 'qualityWarn' : 'qualityBad';
    const status = coveragePct >= 90 ? 'boa para MVP amplo' : coveragePct >= 70 ? 'parcial, mas jogável' : 'provisória; precisa expansão';
    const thinSample = a.veryThin.slice(0,5).map(x=>`${x.team} (${x.slot}: ${x.count})`).join('; ') || 'sem alertas críticos na amostra';
    el.innerHTML = `
      <div class="notice">
        <b>Data Quality Gate:</b> esta base ainda é provisória. O jogo roda, mas a cobertura histórica e os atributos ainda precisam de auditoria antes de uso comercial.
      </div>
      <div class="qualityGrid">
        <div class="qualityBox"><span>Seleções</span><strong>${a.teams}</strong></div>
        <div class="qualityBox"><span>Países</span><strong>${a.countries}</strong></div>
        <div class="qualityBox"><span>Registros jogador-copa</span><strong>${a.players}</strong></div>
        <div class="qualityBox"><span>Cobertura vs. 23 por seleção</span><strong class="${cls}">${coveragePct}%</strong><small>${status}</small></div>
        <div class="qualityBox"><span>Menor / maior elenco</span><strong>${a.minTeamSize} / ${a.maxTeamSize}</strong></div>
        <div class="qualityBox"><span>Seleções incompletas</span><strong class="qualityWarn">${a.incomplete.length}</strong></div>
      </div>
      <p class="muted"><b>Profundidade posicional:</b> ${thinSample}</p>
    `;
  }
  window.FWCL_DATA_QUALITY = { audit, render, positionDepth };
  document.addEventListener('DOMContentLoaded', render);
})();
