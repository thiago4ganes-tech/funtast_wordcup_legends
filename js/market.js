(function(){
  const compat = {
    GK:['GK'],
    ZAG:['ZAG','VOL'],
    LE:['LE','ALA_E','ZAG'],
    LD:['LD','ALA_D','ZAG'],
    VOL:['VOL','MC','ZAG'],
    MC:['MC','MEI','VOL'],
    MEI:['MEI','MC','SA'],
    PE:['PE','PD','SA','MEI'],
    PD:['PD','PE','SA','MEI'],
    CA:['CA','F9','SA','PE','PD']
  };
  window.FWCL_COMPATIBILITY = compat;
  function teams(){ return (window.WCHD_PART4 && window.WCHD_PART4.teams) || []; }
  function countries(){
    const map = new Map();
    teams().forEach(t=>{ if(!map.has(t.country)) map.set(t.country, {country:t.country, flag:t.flag}); });
    return Array.from(map.values()).sort((a,b)=>a.country.localeCompare(b.country,'pt-BR'));
  }
  function teamCandidatesForMode(mode, country){
    let list = teams();
    if(mode==='dynasty') list = list.filter(t=>t.country===country);
    return list;
  }
  function isCompatible(player, slotLabel){ return window.FWCL_SKILLS.positionFit(player, slotLabel) > 0; }
  function availablePlayers(team, slotLabel, chosenAthletes){
    return (team.players||[])
      .filter(p=>isCompatible(p, slotLabel))
      .map(p=>({...p, fit: window.FWCL_SKILLS.positionFit(p, slotLabel)}))
      .sort((a,b)=> (b.fit-a.fit) || (b.price_mm-a.price_mm));
  }
  function drawTeamForSlot(mode, country, slotLabel, chosenAthletes, budget){
    const pool = teamCandidatesForMode(mode, country);
    if(!pool.length) return null;
    const valid = pool.filter(t => availablePlayers(t, slotLabel, chosenAthletes).length > 0);
    if(!valid.length) return pool[Math.floor(Math.random()*pool.length)];
    const affordable = valid.filter(t => availablePlayers(t, slotLabel, chosenAthletes).some(p => !chosenAthletes.has(p.athlete_id) && p.price_mm <= budget));
    const finalPool = affordable.length ? affordable : valid;
    return finalPool[Math.floor(Math.random()*finalPool.length)];
  }
  function buildAutoLineup(team, formationName='4-3-3'){
    const slots = window.FWCL_FORMATIONS[formationName] || window.FWCL_FORMATIONS['4-3-3'];
    const used = new Set();
    const lineup = [];
    for(const slot of slots){
      const candidates = availablePlayers(team, slot.label, used)
        .filter(p=>!used.has(p.athlete_id))
        .sort((a,b)=> (b.fit-a.fit) || (b.price_mm-a.price_mm));
      const chosen = candidates[0] || (team.players||[]).find(p=>!used.has(p.athlete_id));
      if(chosen){ used.add(chosen.athlete_id); lineup.push({...chosen, slot:slot.label, slotId:slot.id}); }
    }
    return lineup;
  }
  window.FWCL_MARKET = { countries, teams, drawTeamForSlot, availablePlayers, buildAutoLineup };
})();
