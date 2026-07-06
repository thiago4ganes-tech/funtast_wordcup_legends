window.Narration = {
  format(ev){
    const min = String(ev.minute).padStart(2,'0') + "'";
    const xg = ev.xg ? ` <span class="pill">xG ${ev.xg.toFixed(2)}</span>` : '';
    const tag = ev.tag ? ` <span class="tag">${ev.tag}</span>` : '';
    return `<div class="event event-${ev.type}"><b>${min}</b> ${ev.text}${tag}${xg}</div>`;
  }
};
