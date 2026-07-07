(function(){
  function shuffle(arr){
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function entryFromTeam(team){
    const cleanName=`${team.country||String(team.name||'Seleção').replace(/^\S+\s+/,'').replace(/\s+\d{4}$/,'')} ${team.year||''}`.trim();
    return {id:team.id,name:cleanName,flag:team.flag,team,user:false};
  }
  function create(allTeams){
    const chosen=shuffle(allTeams).slice(0,15).map(entryFromTeam);
    const user={id:'USER',name:'Seu XI Legends',flag:'🏆',user:true};
    const entries=shuffle([user,...chosen]);
    // Garante o usuário no Grupo A para leitura mais simples.
    const userIndex=entries.findIndex(e=>e.user);
    [entries[0],entries[userIndex]]=[entries[userIndex],entries[0]];
    const groups=['A','B','C','D'].map((letter,i)=>({
      letter,teams:entries.slice(i*4,i*4+4),table:{},rounds:[]
    }));
    groups.forEach(g=>{
      g.teams.forEach(t=>g.table[t.id]={team:t,played:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0});
      const t=g.teams;
      g.rounds=[
        [[t[0],t[3]],[t[1],t[2]]],
        [[t[0],t[2]],[t[3],t[1]]],
        [[t[0],t[1]],[t[2],t[3]]]
      ];
    });
    return {phase:'group',stageLabel:'Fase de grupos',groups,roundIndex:0,pendingUserFixture:null,history:[],knockout:null,status:'active',champion:null};
  }
  function quickResult(a,b){
    const sa=a.user?76:window.FWCL_MARKET.teamStrength(a.team);
    const sb=b.user?76:window.FWCL_MARKET.teamStrength(b.team);
    const lambdaA=Math.max(.35,1.15+(sa-sb)/35);
    const lambdaB=Math.max(.35,1.05+(sb-sa)/35);
    function goals(lambda){
      let L=Math.exp(-lambda),p=1,k=0;
      do{k++;p*=Math.random();}while(p>L&&k<8);
      return k-1;
    }
    return {home:goals(lambdaA),away:goals(lambdaB)};
  }
  function updateTable(group,a,b,score){
    const A=group.table[a.id],B=group.table[b.id];
    A.played++;B.played++;A.gf+=score.home;A.ga+=score.away;B.gf+=score.away;B.ga+=score.home;
    A.gd=A.gf-A.ga;B.gd=B.gf-B.ga;
    if(score.home>score.away){A.w++;B.l++;A.pts+=3;}
    else if(score.home<score.away){B.w++;A.l++;B.pts+=3;}
    else{A.d++;B.d++;A.pts++;B.pts++;}
  }
  function sortedTable(group){
    return Object.values(group.table).sort((a,b)=>(b.pts-a.pts)||(b.gd-a.gd)||(b.gf-a.gf)||a.team.name.localeCompare(b.team.name));
  }
  function simulateGroupRound(cup){
    const idx=cup.roundIndex;
    cup.pendingUserFixture=null;
    cup.groups.forEach(group=>{
      group.rounds[idx].forEach(([a,b])=>{
        if(a.user||b.user){
          cup.pendingUserFixture={phase:'group',stageLabel:`Grupo ${group.letter} — Rodada ${idx+1}`,group:group.letter,home:a,away:b};
        }else{
          const score=quickResult(a,b);
          updateTable(group,a,b,score);
          cup.history.push({phase:'group',stage:`Grupo ${group.letter}`,home:a,away:b,score});
        }
      });
    });
    return cup.pendingUserFixture;
  }
  function qualifiers(cup){
    const result={};
    cup.groups.forEach(g=>{ const s=sortedTable(g); result[g.letter]=[s[0].team,s[1].team]; });
    return result;
  }
  function buildQuarterfinals(cup){
    const q=qualifiers(cup);
    cup.phase='quarterfinal';cup.stageLabel='Quartas de final';
    cup.knockout={
      fixtures:[
        {home:q.A[0],away:q.B[1]},{home:q.B[0],away:q.A[1]},
        {home:q.C[0],away:q.D[1]},{home:q.D[0],away:q.C[1]}
      ],
      winners:[]
    };
  }
  function prepareKnockout(cup){
    cup.pendingUserFixture=null;
    const winners=new Array(cup.knockout.fixtures.length);
    cup.knockout.fixtures.forEach((f,fixtureIndex)=>{
      if(f.home.user||f.away.user){
        cup.pendingUserFixture={phase:cup.phase,stageLabel:cup.stageLabel,home:f.home,away:f.away,fixture:f,fixtureIndex};
      }else{
        let score=quickResult(f.home,f.away);
        if(score.home===score.away) score[Math.random()<.5?'home':'away']++;
        const winner=score.home>score.away?f.home:f.away;
        winners[fixtureIndex]=winner;
        cup.history.push({phase:cup.phase,stage:cup.stageLabel,home:f.home,away:f.away,score,winner});
      }
    });
    cup.knockout.winners=winners;
    return cup.pendingUserFixture;
  }
  function advanceKnockout(cup){
    const winners=cup.knockout.winners.filter(Boolean);
    if(cup.phase==='quarterfinal'){
      cup.phase='semifinal';cup.stageLabel='Semifinal';
      cup.knockout={fixtures:[[winners[0],winners[1]],[winners[2],winners[3]]].map(x=>({home:x[0],away:x[1]})),winners:[]};
      return;
    }
    if(cup.phase==='semifinal'){
      cup.phase='final';cup.stageLabel='Final';
      cup.knockout={fixtures:[{home:winners[0],away:winners[1]}],winners:[]};
      return;
    }
    if(cup.phase==='final'){
      cup.status='finished';cup.champion=winners[0];cup.pendingUserFixture=null;
    }
  }
  function prepareNext(cup){
    if(cup.status!=='active') return null;
    if(cup.phase==='group'){
      if(cup.roundIndex>=3){
        buildQuarterfinals(cup);
        const userQualified=Object.values(qualifiers(cup)).flat().some(t=>t.user);
        if(!userQualified){cup.status='eliminated';return null;}
        return prepareKnockout(cup);
      }
      return simulateGroupRound(cup);
    }
    return prepareKnockout(cup);
  }
  function recordUserResult(cup,result){
    const f=cup.pendingUserFixture;
    if(!f) return;
    const score={home:result.home,away:result.away};
    if(f.phase==='group'){
      const group=cup.groups.find(g=>g.letter===f.group);
      updateTable(group,f.home,f.away,score);
      cup.history.push({...f,score});
      cup.roundIndex++;
      cup.pendingUserFixture=null;
      if(cup.roundIndex>=3){
        buildQuarterfinals(cup);
        const qualified=Object.values(qualifiers(cup)).flat().some(t=>t.user);
        if(!qualified) cup.status='eliminated';
      }
      return;
    }
    const winnerId=result.winnerId||(score.home>score.away?f.home.id:f.away.id);
    const winner=winnerId===f.home.id?f.home:f.away;
    cup.knockout.winners[f.fixtureIndex]=winner;
    cup.history.push({...f,score,winner});
    cup.pendingUserFixture=null;
    if(!winner.user){cup.status='eliminated';return;}
    // Os outros jogos da fase já foram simulados em prepareKnockout.
    advanceKnockout(cup);
  }
  window.FWCL_TOURNAMENT={create,prepareNext,recordUserResult,sortedTable,qualifiers};
})();
