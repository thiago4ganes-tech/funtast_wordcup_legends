window.Market = {
  state:{mode:'dynasty',country:'Brasil',formation:'4-3-3',budget:100,lineup:{},lockedSlot:null,usedAthletes:new Set()},
  // Release 0.1: mercado documentado, motor de partida ativo. Implementação completa volta na 0.2 sem quebrar LEGION.
  validateNoDuplicates(players){
    const ids=new Set();
    for(const p of players){ if(ids.has(p.athleteId)) return false; ids.add(p.athleteId); }
    return true;
  }
};
