(function(){
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function skill(p,k, fallback=55){ return p && p.skills && Number.isFinite(p.skills[k]) ? p.skills[k] : fallback; }
  function classBonus(p){
    const c = (p.player_class||'').toLowerCase();
    if(c.includes('lenda')) return 7;
    if(c.includes('craque')) return 4;
    if(c.includes('especialista')) return 3;
    if(c.includes('líder') || c.includes('lider')) return 2;
    return 0;
  }
  function traitBonus(player, context){
    const traits = player.traits || [];
    let b = 0;
    if(context.minute >= 75 && (traits.includes('acredita_ate_o_fim') || traits.includes('motor_fisico'))) b += 5;
    if(context.isKnockout && traits.includes('cresce_em_jogo_grande')) b += 4;
    if(context.teamLosing && traits.includes('chama_responsabilidade')) b += 5;
    if((context.type==='penalty' || context.bigChance) && traits.includes('frio_sob_pressao')) b += 5;
    if(context.type==='header' && traits.includes('especialista_aereo')) b += 8;
    if(context.type==='build' && traits.includes('organizador')) b += 5;
    if(context.type==='duel' && traits.includes('competidor_extremo')) b += 4;
    if(context.type==='safe' && traits.includes('confiavel')) b += 3;
    if(context.type==='genius' && traits.includes('genialidade_intermitente')) b += 7;
    if(context.tense && traits.includes('temperamental')) b -= 3;
    return b;
  }
  const fitMap = {
    GK:{GK:100},
    ZAG:{ZAG:100,VOL:84,LE:76,LD:76},
    LE:{LE:100,ALA_E:96,ZAG:76,VOL:74,PE:70},
    LD:{LD:100,ALA_D:96,ZAG:76,VOL:74,PD:70},
    VOL:{VOL:100,MC:90,ZAG:82,LE:72,LD:72,MEI:68},
    MC:{MC:100,VOL:90,MEI:88,PE:66,PD:66,SA:62},
    MEI:{MEI:100,MC:90,SA:88,PE:78,PD:78,VOL:66,F9:72},
    PE:{PE:100,PD:86,SA:88,MEI:80,CA:70,F9:78},
    PD:{PD:100,PE:86,SA:88,MEI:80,CA:70,F9:78},
    CA:{CA:100,F9:94,SA:88,PE:72,PD:72,MEI:66}
  };
  function positionFit(player, slot){
    const positions = player.positions || [];
    let best = 0;
    for(const p of positions){ best = Math.max(best, (fitMap[slot]||{})[p] || 0); }
    return best;
  }
  function actionScore(player, action, context={}){
    if(!player) return 45;
    const avg = (...keys)=> keys.reduce((a,k)=>a+skill(player,k),0)/keys.length;
    let base = 55;
    if(action==='build') base = avg('passing','vision','decision','composure');
    if(action==='passVertical') base = avg('passing','vision','decision');
    if(action==='dribble') base = avg('dribble','pace','decision','composure');
    if(action==='cross') base = avg('crossing','passing','decision');
    if(action==='header') base = avg('heading','aerial','power','decision');
    if(action==='finish') base = avg('finishing','decision','composure','power');
    if(action==='longShot') base = avg('finishing','power','decision') - 6;
    if(action==='defend') base = avg('marking','tackle','interception','decision');
    if(action==='goalkeeper') base = avg('reflexes','handling','onevone','decision');
    if(action==='penalty') base = avg('finishing','composure','decision','clutch');
    return clamp(base + classBonus(player) + traitBonus(player, context), 5, 112);
  }
  function duel(attacker, defender, action, context={}){
    const atk = actionScore(attacker, action, context);
    const defAction = action === 'header' ? 'defend' : (defender && defender.role === 'GK' ? 'goalkeeper' : 'defend');
    const def = actionScore(defender, defAction, context);
    return clamp(0.5 + (atk - def) / 92, 0.10, 0.90);
  }
  window.FWCL_SKILLS = { clamp, skill, classBonus, traitBonus, positionFit, actionScore, duel };
})();
