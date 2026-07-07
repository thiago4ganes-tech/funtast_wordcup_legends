(function(){
  const countryTranslations = {
    Algeria:'Argélia', Argentina:'Argentina', Australia:'Austrália', Austria:'Áustria',
    Belgium:'Bélgica', Bolivia:'Bolívia', 'Bosnia and Herzegovina':'Bósnia e Herzegovina',
    Brazil:'Brasil', Bulgaria:'Bulgária', Cameroon:'Camarões', Canada:'Canadá',
    Chile:'Chile', 'China PR':'China', Colombia:'Colômbia', 'Costa Rica':'Costa Rica',
    Croatia:'Croácia', 'Czech Republic':'República Tcheca', Czechoslovakia:'Tchecoslováquia',
    Denmark:'Dinamarca', Ecuador:'Equador', Egypt:'Egito', England:'Inglaterra',
    France:'França', Germany:'Alemanha', 'West Germany':'Alemanha Ocidental',
    Ghana:'Gana', Greece:'Grécia', Honduras:'Honduras', Hungary:'Hungria',
    Iceland:'Islândia', Iran:'Irã', Iraq:'Iraque', Italy:'Itália', 'Ivory Coast':'Costa do Marfim',
    Jamaica:'Jamaica', Japan:'Japão', Mexico:'México', Morocco:'Marrocos',
    Netherlands:'Holanda', 'New Zealand':'Nova Zelândia', Nigeria:'Nigéria',
    'North Korea':'Coreia do Norte', Norway:'Noruega', Panama:'Panamá',
    Paraguay:'Paraguai', Peru:'Peru', Poland:'Polônia', Portugal:'Portugal',
    Qatar:'Catar', 'Republic of Ireland':'Irlanda', Romania:'Romênia', Russia:'Rússia',
    'Saudi Arabia':'Arábia Saudita', Scotland:'Escócia', Senegal:'Senegal',
    Serbia:'Sérvia', Slovakia:'Eslováquia', Slovenia:'Eslovênia', 'South Africa':'África do Sul',
    'South Korea':'Coreia do Sul', 'Soviet Union':'União Soviética', Spain:'Espanha',
    Sweden:'Suécia', Switzerland:'Suíça', Tunisia:'Tunísia', Turkey:'Turquia',
    Ukraine:'Ucrânia', 'United Arab Emirates':'Emirados Árabes Unidos',
    'United States':'Estados Unidos', Uruguay:'Uruguai', Wales:'País de Gales',
    Yugoslavia:'Iugoslávia', Zaire:'Zaire'
  };

  const flagMap = {
    Argentina:'🇦🇷', Austrália:'🇦🇺', Áustria:'🇦🇹', Bélgica:'🇧🇪', Bolívia:'🇧🇴',
    Brasil:'🇧🇷', Bulgária:'🇧🇬', Camarões:'🇨🇲', Canadá:'🇨🇦', Chile:'🇨🇱',
    China:'🇨🇳', Colômbia:'🇨🇴', 'Costa Rica':'🇨🇷', Croácia:'🇭🇷', Dinamarca:'🇩🇰',
    Equador:'🇪🇨', Egito:'🇪🇬', Inglaterra:'🏴', França:'🇫🇷', Alemanha:'🇩🇪',
    'Alemanha Ocidental':'🇩🇪', Gana:'🇬🇭', Grécia:'🇬🇷', Holanda:'🇳🇱',
    Honduras:'🇭🇳', Hungria:'🇭🇺', Islândia:'🇮🇸', Irã:'🇮🇷', Iraque:'🇮🇶',
    Itália:'🇮🇹', Jamaica:'🇯🇲', Japão:'🇯🇵', México:'🇲🇽', Marrocos:'🇲🇦',
    Nigéria:'🇳🇬', Noruega:'🇳🇴', Panamá:'🇵🇦', Paraguai:'🇵🇾', Peru:'🇵🇪',
    Polônia:'🇵🇱', Portugal:'🇵🇹', Catar:'🇶🇦', Romênia:'🇷🇴', Rússia:'🇷🇺',
    Senegal:'🇸🇳', Sérvia:'🇷🇸', Eslováquia:'🇸🇰', Eslovênia:'🇸🇮',
    Espanha:'🇪🇸', Suécia:'🇸🇪', Suíça:'🇨🇭', Tunísia:'🇹🇳', Turquia:'🇹🇷',
    Ucrânia:'🇺🇦', Uruguai:'🇺🇾', 'Estados Unidos':'🇺🇸', 'Coreia do Sul':'🇰🇷',
    'Coreia do Norte':'🇰🇵', Argélia:'🇩🇿', 'Arábia Saudita':'🇸🇦',
    'África do Sul':'🇿🇦', 'Costa do Marfim':'🇨🇮', 'País de Gales':'🏴'
  };

  function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  function hash(text){
    let h=0;
    for(let i=0;i<String(text).length;i++) h=((h<<5)-h+String(text).charCodeAt(i))|0;
    return Math.abs(h);
  }
  function norm(text){
    return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
      .replace(/[^a-z0-9]/g,'');
  }
  function cleanPlayerName(name){
    const cleaned=String(name||'Jogador')
      .replace(/not[\s_-]*applicable/ig,' ')
      .replace(/\bn[\s._-]*a\b/ig,' ')
      .replace(/\bundefined\b/ig,' ')
      .replace(/\bnull\b/ig,' ')
      .replace(/\s+/g,' ')
      .replace(/^[-–—:;,\s]+|[-–—:;,\s]+$/g,'')
      .trim();
    return cleaned||'Jogador';
  }
  function translateCountry(name){ return countryTranslations[name] || name || 'Seleção'; }
  function teamCountry(team){
    const display=String(team.team_display_name||'');
    return translateCountry(display.replace(/\s+\d{4}$/,'').trim());
  }
  function ratePer90(total,minutes){
    const m=Number(minutes||0);
    return m>0 ? Number(total||0)*90/m : 0;
  }
  function scoreFromRate(rate, low, high){
    return clamp(40 + ((rate-low)/(high-low))*48, 30, 94);
  }
  function inferPositions(raw,index,positionOverride){
    if(positionOverride?.positions?.length)return [...positionOverride.positions];
    const pos=raw.primary_position_wc;
    const e=raw.technical_estimates||{};
    if(pos==='GK') return ['GK'];
    if(pos==='DF'){
      const wide=(Number(e.crosses||0)+Number(e.dribbles_completed||0)) > (Number(e.aerial_duels_won||0)+Number(e.interceptions||0))*0.55;
      if(wide) return index%2===0 ? ['LE','ALA_E','ZAG'] : ['LD','ALA_D','ZAG'];
      return ['ZAG', index%3===0?'VOL':'ZAG'];
    }
    if(pos==='MF'){
      const creative=Number(e.key_passes||0)+Number(e.dribbles_completed||0);
      const defensive=Number(e.tackles||0)+Number(e.interceptions||0);
      if(creative > defensive*1.25) return index%2===0 ? ['MEI','MC','PE'] : ['MEI','MC','PD'];
      if(defensive > creative*1.35) return ['VOL','MC','ZAG'];
      return ['MC','MEI','VOL'];
    }
    if(pos==='FW'){
      const wide=Number(e.crosses||0)+Number(e.dribbles_completed||0) > Number(e.shots||0)*0.75;
      if(wide) return index%2===0 ? ['PE','PD','SA'] : ['PD','PE','SA'];
      return ['CA','F9','SA'];
    }
    return ['MC'];
  }
  function deriveSkills(raw,positions){
    const r=raw.real_metrics||{}, e=raw.technical_estimates||{};
    const minutes=Number(r.minutes||0);
    const goals90=Number(r.goals_per_90||0);
    const shots90=ratePer90(e.shots,minutes);
    const key90=ratePer90(e.key_passes,minutes);
    const prog90=ratePer90(e.progressive_passes,minutes);
    const pass90=ratePer90(e.passes_completed,minutes);
    const drib90=ratePer90(e.dribbles_completed,minutes);
    const tackles90=ratePer90(e.tackles,minutes);
    const int90=ratePer90(e.interceptions,minutes);
    const aerial90=ratePer90(e.aerial_duels_won,minutes);
    const saves90=ratePer90(e.saves,minutes);
    const isGK=positions.includes('GK');
    const isFW=positions.some(x=>['CA','F9','SA','PE','PD'].includes(x));
    const isDF=positions.some(x=>['ZAG','LE','LD'].includes(x));
    const finishing=isGK?20:clamp(45+goals90*42+shots90*3.2,35,isFW?95:88);
    const passing=clamp(scoreFromRate(pass90,8,55)+prog90*1.2,40,93);
    const vision=clamp(48+key90*15+prog90*2.1,40,94);
    const dribble=clamp(45+drib90*14+(positions.some(x=>['PE','PD','MEI'].includes(x))?6:0),35,95);
    const crossing=clamp(42+ratePer90(e.crosses,minutes)*13,32,94);
    const heading=clamp(45+aerial90*10+(isFW||isDF?6:0),35,94);
    const tackle=clamp(43+tackles90*13+(isDF?5:0),32,95);
    const interception=clamp(44+int90*15+(isDF?5:0),32,95);
    const marking=clamp((tackle+interception)/2+(isDF?4:0),30,95);
    const reflexes=isGK?clamp(58+saves90*8,55,94):20;
    const handling=isGK?clamp(56+saves90*7,52,92):20;
    const onevone=isGK?clamp(55+saves90*7.5,52,94):25;
    const penalty_save=isGK?clamp(52+saves90*5+(Number(r.penalties_scored||0)===0?2:0),45,90):10;
    const experience=clamp(Number(r.minutes_share||0)*25+Number(r.matches_played||0)*2.2,0,25);
    return {
      finishing:Math.round(finishing), passing:Math.round(passing), vision:Math.round(vision),
      dribble:Math.round(dribble), crossing:Math.round(crossing), heading:Math.round(heading),
      pace:Math.round(clamp(62+(positions.some(x=>['PE','PD','LE','LD','CA'].includes(x))?9:0)+(hash(raw.player_wc_id)%15)-7,42,94)),
      power:Math.round(clamp(60+(isFW||isDF?8:0)+(hash(raw.player_base_id)%17)-8,42,94)),
      stamina:Math.round(clamp(60+Number(r.minutes_share||0)*28,45,94)),
      marking:Math.round(marking), tackle:Math.round(tackle), interception:Math.round(interception),
      aerial:Math.round(clamp(heading+(isDF?3:0),35,95)),
      reflexes:Math.round(reflexes), handling:Math.round(handling), onevone:Math.round(onevone),
      penalty_save:Math.round(penalty_save),
      decision:Math.round(clamp(58+experience+key90*3,48,94)),
      composure:Math.round(clamp(57+experience+goals90*13,45,95)),
      leadership:Math.round(clamp(52+experience+(hash(raw.player_base_id)%16),42,92)),
      clutch:Math.round(clamp(52+Number(r.knockout_goals||0)*8+Number(r.final_goals||0)*10+goals90*8,42,96)),
      discipline:Math.round(clamp(86-Number(r.yellow_cards||0)*4-Number(r.red_cards||0)*11,38,92))
    };
  }
  function historicalScore(raw,skills){
    const r=raw.real_metrics||{}, e=raw.technical_estimates||{};
    const pos=raw.primary_position_wc;
    let score=Number(r.minutes_share||0)*32+Number(r.matches_played||0)*1.5;
    if(pos==='FW') score+=Number(r.goals||0)*9+Number(r.knockout_goals||0)*7+skills.finishing*.12;
    else if(pos==='MF') score+=ratePer90(e.key_passes,r.minutes)*8+skills.passing*.11+Number(r.goals||0)*5;
    else if(pos==='DF') score+=ratePer90(e.tackles,r.minutes)*5+ratePer90(e.interceptions,r.minutes)*6+skills.marking*.11;
    else if(pos==='GK') score+=ratePer90(e.saves,r.minutes)*7+skills.reflexes*.14;
    score+=Number(r.final_goals||0)*14+Number(r.semifinal_goals||0)*8;
    return score;
  }
  function classFromPercentile(score,thresholds,raw){
    if(score>=thresholds.legend) return ['👑 Lenda','legend'];
    if(score>=thresholds.star) return ['⭐ Craque','star'];
    if(score>=thresholds.specialist){
      if((raw.primary_position_wc==='DF'||raw.primary_position_wc==='GK') && Number(raw.real_metrics?.minutes_share||0)>.62) return ['🛡️ Líder','leader'];
      return ['🎯 Especialista','specialist'];
    }
    if(Number(raw.real_metrics?.minutes_share||0)<.18) return ['🔥 Promessa','prospect'];
    return ['⚙️ Operário','worker'];
  }
  function quantile(sorted,q){
    if(!sorted.length) return 0;
    return sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))];
  }
  function playerToGame(raw,index,thresholds,positionOverride){
    const positions=inferPositions(raw,index,positionOverride);
    const skills=deriveSkills(raw,positions);
    const score=historicalScore(raw,skills);
    const [player_class,tier]=classFromPercentile(score,thresholds,raw);
    const traits=[];
    if(skills.composure>=83) traits.push('frio_sob_pressao');
    if(skills.stamina>=84) traits.push('motor_fisico');
    if(skills.vision>=84) traits.push('organizador');
    if(skills.heading>=86) traits.push('especialista_aereo');
    if(skills.clutch>=84) traits.push('cresce_em_jogo_grande');
    if(skills.leadership>=84) traits.push('lideranca_silenciosa');
    const tendencies=[];
    if(skills.dribble>=85) tendencies.push('drible_criativo');
    if(skills.crossing>=84) tendencies.push('ultrapassar','cruzar');
    if(skills.finishing>=85) tendencies.push('finalizacao_area');
    return {
      id:raw.player_wc_id,
      athlete_id:raw.player_base_id,
      name:cleanPlayerName(raw.player_name),
      country:'',
      flag:'🌍',
      year:raw.year,
      role:raw.primary_position_wc,
      positions,
      shirt:null,
      player_class,tier,
      price_mm:5,
      traits,tendencies,skills,
      historical_score:Math.round(score*100)/100,
      data_origin:raw.origin_summary||{},
      technical_confidence:raw.technical_confidence,
      engine_weight_limit:raw.engine_weight_limit,
      production_record:true
    };
  }

  function applyIconicProfile(player,profile){
    if(!profile)return player;
    const factor=Number(profile.version_factors?.[String(player.year)]||0.82);
    const tier=profile.tier||'icon';
    const tierBase=tier==='mythic'?1:tier==='legend'?.94:tier==='icon'?.88:tier==='hero'?.83:.79;
    const floorPenalty=(1-factor)*(tier==='mythic'?42:tier==='legend'?36:tier==='icon'?30:tier==='hero'?27:24);
    const floors={...(profile.archetype_skill_floors||{}),...(profile.manual_skill_profile||{})};
    player.skills=player.skills||{};
    Object.entries(floors).forEach(([key,value])=>{
      const adjusted=Math.max(60,Math.round(Number(value)*tierBase-floorPenalty));
      player.skills[key]=Math.max(Number(player.skills[key]||0),adjusted);
    });

    const relevance=Math.round(Number(profile.historical_relevance||85)*(.88+.12*factor));
    player.iconic_profile={
      tier,
      archetype:profile.archetype,
      historical_relevance:relevance,
      decisive_weight:Number(profile.decisive_weight||1.1),
      version_factor:factor,
      method:profile.method,
      special_category:profile.special_category||null,
      performance_evidence:profile.performance_evidence||null
    };
    player.historical_relevance=relevance;
    player.decisive_weight=Number(profile.decisive_weight||1.1)*(.90+.10*factor);

    if(tier==='mythic'){
      player.player_class=factor>=.82?'👑 Lenda':'⭐ Craque';
      player.traits=Array.from(new Set([...(player.traits||[]),'chama_responsabilidade','cresce_em_jogo_grande','frio_sob_pressao']));
    }else if(tier==='legend'){
      player.player_class=factor>=.87?'👑 Lenda':'⭐ Craque';
      player.traits=Array.from(new Set([...(player.traits||[]),'cresce_em_jogo_grande','confiavel']));
    }else if(tier==='icon'){
      player.player_class=factor>=.82?'⭐ Craque':'🎯 Especialista';
      player.traits=Array.from(new Set([...(player.traits||[]),'chama_responsabilidade','confiavel']));
    }else if(tier==='hero'){
      player.player_class=factor>=.86?'⭐ Craque':'🎯 Especialista';
      player.traits=Array.from(new Set([...(player.traits||[]),'cresce_em_jogo_grande']));
    }else{
      player.player_class=(player.positions||[]).some(x=>['ZAG','VOL','GK'].includes(x))?'🛡️ Líder':'🎯 Especialista';
      player.traits=Array.from(new Set([...(player.traits||[]),'confiavel']));
    }
    return player;
  }

  function mergeProduction(prod,countries,positionOverrides={},iconicRegistry={}){
    if(!prod || !Array.isArray(prod.teams) || !Array.isArray(prod.players)) return {ok:false};
    const curated=(window.WCHD_PART4&&window.WCHD_PART4.teams)||[];
    const curatedTeamMap=new Map(curated.map(t=>[norm(t.country)+'_'+t.year,t]));
    const countryById=new Map((countries||[]).map(c=>[c.country_id,c]));
    const rawScores=prod.players.map(raw=>{
      const positions=inferPositions(raw,0,positionOverrides[raw.player_wc_id]);
      const skills=deriveSkills(raw,positions);
      return historicalScore(raw,skills);
    }).sort((a,b)=>a-b);
    const thresholds={
      legend:quantile(rawScores,.992),
      star:quantile(rawScores,.955),
      specialist:quantile(rawScores,.84)
    };
    const playersByTeam=new Map();
    prod.players.forEach((p,i)=>{
      if(!playersByTeam.has(p.team_wc_id)) playersByTeam.set(p.team_wc_id,[]);
      playersByTeam.get(p.team_wc_id).push(playerToGame(p,i,thresholds,positionOverrides[p.player_wc_id]));
    });
    const merged=[];
    prod.teams.forEach((rawTeam)=>{
      const cInfo=countryById.get(rawTeam.country_id)||{};
      const originalCountry=cInfo.country_name||teamCountry(rawTeam);
      const country=translateCountry(originalCountry);
      const flag=flagMap[country]||'🌍';
      const key=norm(country)+'_'+rawTeam.year;
      const curatedTeam=curatedTeamMap.get(key);
      const generated=(playersByTeam.get(rawTeam.team_wc_id)||[]).map(p=>({...p,country,flag}));
      const curatedByName=new Map(((curatedTeam&&curatedTeam.players)||[]).map(p=>[norm(cleanPlayerName(p.name)),p]));
      const combined=generated.map(p=>{
        const known=curatedByName.get(norm(cleanPlayerName(p.name)));
        const mergedPlayer=known ? {
          ...known,
          ...p,
          name:cleanPlayerName(p.name||known.name),
          positions:(p.positions&&p.positions.length)?[...p.positions]:[...(known.positions||[])],
          role:(p.positions&&p.positions.length)?p.positions[0]:(known.role||p.role),
          traits:Array.from(new Set([...(known.traits||[]),...(p.traits||[])])),
          tendencies:Array.from(new Set([...(known.tendencies||[]),...(p.tendencies||[])])),
          skills:{...(p.skills||{}),...(known.skills||{})},
          country,flag,production_record:true,data_origin:p.data_origin
        } : {...p,name:cleanPlayerName(p.name),country,flag};
        mergedPlayer.player_class=String(mergedPlayer.player_class||'⚙️ Operário')
          .replace(/not[\s_-]*applicable/ig,' ')
          .replace(/\s+/g,' ')
          .trim();
        return mergedPlayer;
      });
      if(curatedTeam){
        const names=new Set(combined.map(p=>norm(cleanPlayerName(p.name))));
        curatedTeam.players.forEach(p=>{
          const cleanName=cleanPlayerName(p.name);
          if(!names.has(norm(cleanName))) combined.push({
            ...p,
            name:cleanName,
            positions:[...(p.positions||[])],
            player_class:String(p.player_class||'⚙️ Operário')
              .replace(/not[\s_-]*applicable/ig,' ')
              .replace(/\s+/g,' ')
              .trim(),
            country,flag,production_record:false
          });
        });
      }
      combined.forEach(player=>{
        player.name=cleanPlayerName(player.name);
        player.positions=Array.from(new Set((player.positions||[]).filter(Boolean)));
        if(!player.positions.length)player.positions=['MC'];
        player.role=player.positions[0];
        applyIconicProfile(player,iconicRegistry[norm(player.name)]);
      });
      merged.push({
        id:rawTeam.team_wc_id,
        country,flag,year:rawTeam.year,
        name:`${flag} ${country} ${rawTeam.year}`,
        dna:[rawTeam.style_estimates?.tactical_style_profile||'balanced'],
        real_metrics:rawTeam.real_metrics||{},
        style_estimates:rawTeam.style_estimates||{},
        players:combined,
        production_record:true
      });
    });
    const mergedKeys=new Set(merged.map(t=>norm(t.country)+'_'+t.year));
    curated.forEach(t=>{
      const key=norm(t.country)+'_'+t.year;
      if(!mergedKeys.has(key)) merged.push({...t,production_record:false,legacy_curated:true});
    });
    window.WCHD_PART4.teams=merged;
    window.WCHD_PART4.production={
      version:prod.version,
      coverage:prod.coverage_weighted,
      loaded:true,
      teams:merged.length,
      players:prod.players.length
    };
    return {ok:true,teams:merged.length,players:prod.players.length,coverage:prod.coverage_weighted};
  }

  async function load(){
    const status=document.getElementById('productionLoadStatus');
    try{
      const [prodRes,countryRes,positionRes,iconicRes]=await Promise.all([
        fetch(`data/production/wchd_legion_inputs.json?v=${encodeURIComponent(window.FWCL_RELEASE?.cacheKey||window.FWCL_VERSION||'current')}`,{cache:'no-store'}),
        fetch(`data/production/wchd_countries_production.json?v=${encodeURIComponent(window.FWCL_RELEASE?.cacheKey||window.FWCL_VERSION||'current')}`,{cache:'no-store'}),
        fetch(`data/production/wchd_player_position_overrides.json?v=${encodeURIComponent(window.FWCL_RELEASE?.cacheKey||window.FWCL_VERSION||'current')}`,{cache:'no-store'}),
        fetch(`data/production/wchd_iconic_player_registry.json?v=${encodeURIComponent(window.FWCL_RELEASE?.cacheKey||window.FWCL_VERSION||'current')}`,{cache:'no-store'})
      ]);
      if(!prodRes.ok) throw new Error(`Production data HTTP ${prodRes.status}`);
      const prod=await prodRes.json();
      const countries=countryRes.ok?await countryRes.json():[];
      const positionOverrides=positionRes.ok?await positionRes.json():{};
      const iconicRegistry=iconicRes.ok?await iconicRes.json():{};
      const result=mergeProduction(prod,countries,positionOverrides,iconicRegistry);
      if(status){
        status.className='notice ok';
        status.textContent=`${window.FWCL_RELEASE?.label||'Release atual'}: Production Data Pack carregado com ${result.teams} seleções-Copa e ${result.players} jogadores-Copa.`;
      }
      return result;
    }catch(error){
      console.warn('WCHD Production Data Pack não carregado. Usando base curada de fallback.',error);
      if(status){
        status.className='notice error';
        status.textContent='A base A–G não pôde ser carregada. O jogo continuará com a base curada de fallback.';
      }
      return {ok:false,error:String(error)};
    }
  }

  window.FWCL_PRODUCTION_DATA={load,mergeProduction,cleanPlayerName,applyIconicProfile};
  window.FWCL_DATA_READY=load();
})();
