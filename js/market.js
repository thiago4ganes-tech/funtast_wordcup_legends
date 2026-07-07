(function(){
  const compat = {
    GK:['GK'], ZAG:['ZAG','VOL','LE','LD'], LE:['LE','ALA_E','ZAG','VOL','PE'], LD:['LD','ALA_D','ZAG','VOL','PD'],
    VOL:['VOL','MC','ZAG','LE','LD','MEI'], MC:['MC','MEI','VOL','PE','PD','SA'], MEI:['MEI','MC','SA','PE','PD','VOL','F9'],
    PE:['PE','PD','SA','MEI','CA','F9'], PD:['PD','PE','SA','MEI','CA','F9'], CA:['CA','F9','SA','PE','PD','MEI']
  };
  window.FWCL_COMPATIBILITY = compat;
  function teams(){ return (window.WCHD_PART4 && window.WCHD_PART4.teams) || []; }
  function teamStrength(team){
    const players=team?.players||[];
    if(!players.length) return 50;
    const best=[...players].sort((a,b)=>{
      const sa=window.FWCL_SKILLS.actionScore(a,'build',{}), sb=window.FWCL_SKILLS.actionScore(b,'build',{});
      return sb-sa;
    }).slice(0,11);
    return best.reduce((sum,p)=>sum+window.FWCL_SKILLS.actionScore(p,'build',{}),0)/best.length;
  }
  function countries(){ const map=new Map(); teams().forEach(t=>{ if(!map.has(t.country)) map.set(t.country,{country:t.country,flag:t.flag}); }); return Array.from(map.values()).sort((a,b)=>a.country.localeCompare(b.country,'pt-BR')); }
  function hashText(text){ let h=0; for(let i=0;i<String(text).length;i++) h=((h<<5)-h+String(text).charCodeAt(i))|0; return Math.abs(h); }
  function tierBase(player){
    const cls=(player.player_class||'').toLowerCase(), tier=(player.tier||'').toLowerCase();
    if(cls.includes('lenda') || tier==='legend') return 14.8;
    if(cls.includes('craque') || tier==='star') return 9.2;
    if(cls.includes('especialista') || tier==='specialist') return 6.8;
    if(cls.includes('líder') || cls.includes('lider') || tier==='leader') return 6.0;
    if(cls.includes('promessa') || tier==='prospect') return 2.4;
    return 3.2;
  }
  function positionSkillIndex(player, slot){
    const s=player.skills||{}; const avg=(...keys)=>keys.reduce((a,k)=>a+(Number(s[k])||55),0)/keys.length;
    if(slot==='GK') return avg('reflexes','handling','onevone','penalty_save','decision');
    if(slot==='ZAG') return avg('marking','tackle','interception','heading','aerial','decision');
    if(slot==='LE'||slot==='LD') return avg('pace','stamina','crossing','marking','tackle','decision');
    if(slot==='VOL') return avg('tackle','interception','passing','decision','stamina','marking');
    if(slot==='MC') return avg('passing','vision','decision','stamina','interception','composure');
    if(slot==='MEI') return avg('vision','passing','dribble','decision','composure','finishing');
    if(slot==='PE'||slot==='PD') return avg('pace','dribble','crossing','finishing','decision','vision');
    if(slot==='CA') return avg('finishing','heading','power','composure','decision','pace');
    return avg('passing','decision','composure');
  }
  function marketPrice(player, slot){
    const skillIndex=positionSkillIndex(player,slot), fit=window.FWCL_SKILLS?window.FWCL_SKILLS.positionFit(player,slot):100;
    const traits=(player.traits||[]); const premiumTraits=['cresce_em_jogo_grande','chama_responsabilidade','frio_sob_pressao','especialista_aereo','organizador'];
    const traitBoost=traits.filter(t=>premiumTraits.includes(t)).length*0.35;
    const superstar=(player.player_class||'').includes('👑')?1.6:0;
    const variability=((hashText(player.id+':'+slot)%61)-30)/10; // -3.0 a +3.0
    const anchor=(Number(player.price_mm||5)-7)*0.06;
    let price=tierBase(player)+((skillIndex-70)*0.15)+((fit-86)*0.035)+traitBoost+superstar+variability+anchor;
    if(fit<100) price-= (100-fit)*0.035;
    if(slot==='GK') price-=0.8;
    if(['LE','LD','VOL'].includes(slot)) price-=0.4;
    price*=0.80; // Redução global de 20% solicitada para adequação aos orçamentos.
    price=Math.max(0.8,Math.min(16.0,price));
    return Math.round(price*10)/10;
  }
  function teamCandidatesForMode(mode,country){ let list=teams(); if(mode==='dynasty') list=list.filter(t=>t.country===country); return list; }
  function isCompatible(player,slot){ return window.FWCL_SKILLS.positionFit(player,slot)>0; }
  function pricePlayerForSlot(player,slot){ const effective=marketPrice(player,slot); return {...player, fit:window.FWCL_SKILLS.positionFit(player,slot), market_price_mm:effective, price_mm:effective, original_price_mm:player.price_mm}; }
  function availablePlayers(team,slot,chosenAthletes){
    const used=chosenAthletes||new Set();
    return (team.players||[]).filter(p=>isCompatible(p,slot)).map(p=>pricePlayerForSlot(p,slot)).sort((a,b)=>{
      const da=used.has(a.athlete_id), db=used.has(b.athlete_id); if(da!==db) return da?1:-1;
      return (b.fit-a.fit)||(a.market_price_mm-b.market_price_mm)||a.name.localeCompare(b.name,'pt-BR');
    });
  }
  function depthScore(team,slot,chosenAthletes,budget){
    const c=availablePlayers(team,slot,chosenAthletes).filter(p=>!chosenAthletes.has(p.athlete_id));
    const affordable=c.filter(p=>p.market_price_mm<=budget).length;
    return {count:c.length, affordable, score:affordable*2+c.length};
  }
  function weightedChoice(pool,weightFn){ const weights=pool.map(weightFn); const sum=weights.reduce((a,b)=>a+b,0); if(sum<=0) return pool[Math.floor(Math.random()*pool.length)]; let r=Math.random()*sum; for(let i=0;i<pool.length;i++){ r-=weights[i]; if(r<=0) return pool[i]; } return pool[pool.length-1]; }
  function drawTeamForSlot(mode,country,slot,chosenAthletes,budget){
    const pool=teamCandidatesForMode(mode,country); if(!pool.length) return null;
    const valid=pool.filter(t=>availablePlayers(t,slot,chosenAthletes).some(p=>!chosenAthletes.has(p.athlete_id)));
    if(!valid.length) return pool[Math.floor(Math.random()*pool.length)];
    return weightedChoice(valid,t=>{ const d=depthScore(t,slot,chosenAthletes,budget); return Math.max(1,d.score + (d.count>=6?6:0) + (d.affordable>=4?5:0)); });
  }
  function buildAutoLineup(team,formationName='4-3-3'){
    const slots=window.FWCL_FORMATIONS[formationName]||window.FWCL_FORMATIONS['4-3-3']; const used=new Set(); const lineup=[];
    for(const slot of slots){
      const candidates=availablePlayers(team,slot.label,used).filter(p=>!used.has(p.athlete_id)).sort((a,b)=>(b.fit-a.fit)||(b.market_price_mm-a.market_price_mm));
      const chosen=candidates[0] || (team.players||[]).map(p=>pricePlayerForSlot(p,slot.label)).find(p=>!used.has(p.athlete_id));
      if(chosen){ used.add(chosen.athlete_id); lineup.push({...chosen, slot:slot.label, slotId:slot.id}); }
    }
    return lineup;
  }
function cloneReserve(player){
  const copy=JSON.parse(JSON.stringify(player));
  copy.match=null;
  copy.reserve=true;
  return copy;
}
function roleGroup(player){
  const pos=player.positions||[];
  if(pos.includes('GK'))return 'GK';
  if(pos.some(x=>['ZAG','LE','LD','ALA_E','ALA_D'].includes(x)))return 'DEF';
  if(pos.some(x=>['VOL','MC','MEI'].includes(x)))return 'MID';
  return 'ATT';
}
function diverseBench(pool,used,size=7){
  const chosen=[];
  const groups=['GK','DEF','MID','ATT','DEF','MID','ATT'];
  const scored=[...pool].filter(p=>!used.has(p.athlete_id)).sort((a,b)=>{
    const sa=window.FWCL_SKILLS.actionScore(a,'build',{})+window.FWCL_SKILLS.actionScore(a,'finish',{})*.25;
    const sb=window.FWCL_SKILLS.actionScore(b,'build',{})+window.FWCL_SKILLS.actionScore(b,'finish',{})*.25;
    return sb-sa;
  });
  for(const group of groups){
    const candidate=scored.find(p=>!used.has(p.athlete_id)&&roleGroup(p)===group);
    if(candidate){chosen.push(cloneReserve(candidate));used.add(candidate.athlete_id);}
    if(chosen.length>=size)break;
  }
  for(const candidate of scored){
    if(chosen.length>=size)break;
    if(!used.has(candidate.athlete_id)){chosen.push(cloneReserve(candidate));used.add(candidate.athlete_id);}
  }
  return chosen;
}
function buildAutoBench(team,lineup,size=7){
  const used=new Set((lineup||[]).map(p=>p.athlete_id));
  return diverseBench(team?.players||[],used,size);
}
function buildFantasyBench(lineup,size=7){
  const used=new Set((lineup||[]).map(p=>p.athlete_id));
  const pool=[];
  const seenTeams=new Set();
  (lineup||[]).forEach(selected=>{
    const team=teams().find(t=>t.country===selected.country&&Number(t.year)===Number(selected.year));
    if(!team||seenTeams.has(team.id))return;
    seenTeams.add(team.id);
    (team.players||[]).forEach(p=>{if(!used.has(p.athlete_id))pool.push(p);});
  });
  return diverseBench(pool,used,size);
}
window.FWCL_MARKET={
  countries,teams,drawTeamForSlot,availablePlayers,buildAutoLineup,buildAutoBench,
  buildFantasyBench,marketPrice,depthScore,teamStrength,roleGroup
};
})();
