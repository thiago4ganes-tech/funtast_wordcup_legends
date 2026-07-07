(function(){
  const release={version:'0.4.9',name:'Fitness Discipline & Transparent Report',label:'Release 0.4.9 — Vigor, disciplina e relatório transparente',cacheKey:'fwcl-0-4-9-20260707',generatedAt:'2026-07-07'};
  window.FWCL_RELEASE=release;window.FWCL_VERSION=release.version;
  function apply(){const b=document.getElementById('versionBadge');if(b)b.textContent=release.label;const bi=document.getElementById('buildIdentity');if(bi)bi.textContent=`Build ${release.cacheKey}`;document.documentElement.dataset.fwclVersion=release.version;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
