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
    if(context.type==='header' && traits.includes('especialista_aereo')) b += 7;
    if(context.type==='build' && traits.includes('organizador')) b += 5;
    if(context.type==='duel' && traits.includes('competidor_extremo')) b += 4;
    if(context.type==='safe' && traits.includes('confiavel')) b += 3;
    if(context.type==='genius' && traits.includes('genialidade_intermitente')) b += 6;
    if(context.tense && traits.includes('temperamental')) b -= 3;
    return b;
  }
  function positionFit(player, slot){
    const map = window.FWCL_COMPATIBILITY || {};
    const positions = player.positions || [];
    if(positions.includes(slot)) return 100;
    const alt = map[slot] || [];
    for(const p of positions){ if(alt.includes(p)) return 86; }
    return 0;
  }
  function actionScore(player, action, context={}){
    if(!player) return 45;
    const s = player.skills || {};
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
    return clamp(base + classBonus(player) + traitBonus(player, context), 5, 110);
  }
  function duel(attacker, defender, action, context={}){
    const atk = actionScore(attacker, action, context);
    const defAction = action === 'header' ? 'defend' : (defender && defender.role === 'GK' ? 'goalkeeper' : 'defend');
    const def = actionScore(defender, defAction, context);
    return clamp(0.5 + (atk - def) / 90, 0.12, 0.88);
  }
  window.FWCL_SKILLS = { clamp, skill, classBonus, traitBonus, positionFit, actionScore, duel };
})();
