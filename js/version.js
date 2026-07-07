(function(){
  const release={
    version:'0.4.2',
    name:'LEGION Dynamic Match Management',
    label:'Release 0.4.2 — Gestão tática dinâmica',
    cacheKey:'fwcl-0-4-2-20260707',
    generatedAt:'2026-07-07'
  };
  window.FWCL_RELEASE=release;
  window.FWCL_VERSION=release.version;

  function apply(){
    const badge=document.getElementById('versionBadge');
    if(badge)badge.textContent=release.label;
    const build=document.getElementById('buildIdentity');
    if(build)build.textContent=`Build ${release.cacheKey}`;
    document.documentElement.dataset.fwclVersion=release.version;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);
  else apply();
})();
