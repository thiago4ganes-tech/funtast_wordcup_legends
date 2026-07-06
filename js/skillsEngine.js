window.SkillsEngine = {
  clamp(n, min=0, max=1){ return Math.max(min, Math.min(max, n)); },
  classBonus(player, context){
    if(!player) return 0;
    let b = 0;
    if(player.classIcon === '👑') b += 0.05;
    if(player.classIcon === '⭐') b += 0.03;
    if(context && context.minute >= 75 && player.traits?.includes('acredita até o final')) b += 0.06;
    if(context && context.isKnockout && player.traits?.includes('cresce em jogo grande')) b += 0.05;
    if(context && context.isPressure && player.traits?.includes('frio sob pressão')) b += 0.04;
    if(context && context.teamLosing && player.traits?.includes('chama a responsabilidade')) b += 0.05;
    return b;
  },
  skill(player, name){ return (player?.skills?.[name] ?? 50) / 100; },
  duel(attacker, defender, skillNames, defenseNames, context={}){
    const atk = skillNames.reduce((s,k)=>s+this.skill(attacker,k),0) / skillNames.length;
    const def = defenseNames.reduce((s,k)=>s+this.skill(defender,k),0) / defenseNames.length;
    const raw = 0.50 + (atk - def) * 0.35 + this.classBonus(attacker, context) - this.classBonus(defender, context) * 0.5;
    return this.clamp(raw, 0.08, 0.92);
  },
  finishChance(shooter, keeper, xg, context={}){
    const fin = (this.skill(shooter,'finishing')*0.55 + this.skill(shooter,'composure')*0.25 + this.skill(shooter,'positioning')*0.20);
    const gk = (this.skill(keeper,'goalkeeping')*0.55 + this.skill(keeper,'reflex')*0.30 + this.skill(keeper,'positioning')*0.15);
    let chance = xg + (fin - gk) * 0.18 + this.classBonus(shooter, context) - this.classBonus(keeper, context)*0.5;
    return this.clamp(chance, 0.03, 0.72);
  }
};
