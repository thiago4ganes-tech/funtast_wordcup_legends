(function(){
  let enabled=true;
  let unlocked=false;

  function availableVoice(){
    if(!('speechSynthesis' in window))return null;
    const voices=window.speechSynthesis.getVoices();
    return voices.find(v=>/^pt-BR$/i.test(v.lang))||
      voices.find(v=>/^pt/i.test(v.lang))||
      voices.find(v=>/Brazil|Portugu/i.test(v.name))||
      voices[0]||null;
  }

  function retroTone(){
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx)return;
      const ctx=new AudioCtx();
      const gain=ctx.createGain();
      gain.gain.setValueAtTime(.0001,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.075,ctx.currentTime+.02);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.75);
      gain.connect(ctx.destination);
      [261.63,329.63,392,523.25].forEach((freq,index)=>{
        const osc=ctx.createOscillator();
        osc.type=index%2?'square':'sawtooth';
        osc.frequency.setValueAtTime(freq,ctx.currentTime+index*.055);
        osc.connect(gain);
        osc.start(ctx.currentTime+index*.055);
        osc.stop(ctx.currentTime+.55+index*.055);
      });
      setTimeout(()=>ctx.close?.(),1100);
    }catch(error){}
  }

  function speakGoal(info={}){
    if(!enabled)return;
    retroTone();
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance('Gooooooooooooooooool!');
    utterance.lang='pt-BR';
    utterance.rate=.68;
    utterance.pitch=1.12;
    utterance.volume=1;
    const voice=availableVoice();
    if(voice)utterance.voice=voice;
    window.speechSynthesis.speak(utterance);

    if(info.player){
      utterance.onend=()=>{
        if(!enabled)return;
        const detail=new SpeechSynthesisUtterance(`Gol de ${info.player}!`);
        detail.lang='pt-BR';
        detail.rate=.92;
        detail.pitch=1.02;
        detail.volume=.92;
        const detailVoice=availableVoice();
        if(detailVoice)detail.voice=detailVoice;
        window.speechSynthesis.speak(detail);
      };
    }
  }

  function unlock(){
    unlocked=true;
    if('speechSynthesis' in window){
      const silent=new SpeechSynthesisUtterance(' ');
      silent.volume=0;
      window.speechSynthesis.speak(silent);
    }
  }
  function toggle(){
    enabled=!enabled;
    if(!enabled&&'speechSynthesis' in window)window.speechSynthesis.cancel();
    return enabled;
  }
  function isEnabled(){return enabled;}

  window.FWCL_AUDIO={goal:speakGoal,unlock,toggle,isEnabled};
})();
