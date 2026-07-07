(function(){
  function teams(){ return (window.WCHD_PART4&&window.WCHD_PART4.teams)||[]; }
  function allPlayers(){ return teams().flatMap(t=>(t.players||[]).map(p=>({team:t,player:p}))); }
  function positionDepth(){
    const slots=['GK','ZAG','LE','LD','VOL','MC','MEI','PE','PD','CA'],depth={};
    teams().forEach(t=>{
      depth[t.id]={name:t.name,country:t.country,year:t.year,counts:{}};
      slots.forEach(slot=>depth[t.id].counts[slot]=(t.players||[]).filter(p=>window.FWCL_SKILLS?window.FWCL_SKILLS.positionFit(p,slot)>0:(p.positions||[]).includes(slot)).length);
    });
    return depth;
  }
  function audit(){
    const ts=teams(),aps=allPlayers(),countries=new Set(ts.map(t=>t.country));
    const incomplete=ts.filter(t=>(t.players||[]).length<22),veryThin=[],d=positionDepth();
    Object.values(d).forEach(row=>Object.entries(row.counts).forEach(([slot,count])=>{if(count<2)veryThin.push({team:row.name,slot,count});}));
    const production=window.WCHD_PART4?.production||{};
    return{
      teams:ts.length,countries:countries.size,players:aps.length,
      expectedMin:ts.length*23,coverage:ts.length?aps.length/(ts.length*23):0,
      incomplete,veryThin,minTeamSize:ts.length?Math.min(...ts.map(t=>(t.players||[]).length)):0,
      maxTeamSize:ts.length?Math.max(...ts.map(t=>(t.players||[]).length)):0,
      production
    };
  }
  function render(){
    const el=document.getElementById('dataQualityPanel');if(!el)return;
    const a=audit(),coveragePct=Math.round(a.coverage*1000)/10,prod=a.production.coverage||{};
    const thinSample=a.veryThin.slice(0,5).map(x=>`${x.team} (${x.slot}: ${x.count})`).join('; ')||'sem alertas críticos na amostra';
    el.innerHTML=`
      <div class="notice ok"><b>Production Data Pack A–G:</b> ${a.production.loaded?'carregado':'fallback ativo'}. A origem dos dados permanece separada entre real, derivado, proxy e sintético.</div>
      <div class="qualityGrid">
        <div class="qualityBox"><span>Seleções-Copa disponíveis</span><strong>${a.teams}</strong></div>
        <div class="qualityBox"><span>Países</span><strong>${a.countries}</strong></div>
        <div class="qualityBox"><span>Registros jogador-Copa</span><strong>${a.players}</strong></div>
        <div class="qualityBox"><span>Média por seleção</span><strong>${a.teams?(a.players/a.teams).toFixed(1):0}</strong></div>
        <div class="qualityBox"><span>Real + derivado</span><strong class="qualityGood">${prod.real_plus_derived??79.02}%</strong></div>
        <div class="qualityBox"><span>Estimado + sintético</span><strong class="qualityWarn">${((prod.estimated_proxy??16.48)+(prod.synthetic_comparable??4.5)).toFixed(2)}%</strong></div>
      </div>
      <p class="muted"><b>Profundidade posicional:</b> ${thinSample}</p>`;
  }
  window.FWCL_DATA_QUALITY={audit,render,positionDepth};
  document.addEventListener('DOMContentLoaded',render);
})();
