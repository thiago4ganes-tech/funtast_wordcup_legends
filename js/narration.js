(function(){
  const icons = {
    build:'🧠', pass:'🎯', dribble:'✨', cross:'📐', shot:'🥅', goal:'⚽', save:'🧤', foul:'🟨', defense:'🛡️', setpiece:'🎲', rebound:'🔁', miss:'↗️'
  };
  function tag(type){ return `<span class="tag">${icons[type]||'•'} ${type}</span>`; }
  function line(minute, text, type='build', extra=''){
    return { minute, text, type, html:`<b>${minute}'</b> ${text} ${tag(type)} ${extra||''}` };
  }
  window.FWCL_NARRATION = { line, tag, icons };
})();
