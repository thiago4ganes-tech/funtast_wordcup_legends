(function(){
  let enabled=true;
  let unlocked=false;
  const sourceUrl=`assets/audio/gol_retro_original.wav?v=${encodeURIComponent(window.FWCL_RELEASE?.cacheKey||'fwcl-0-4-4-20260707')}`;
  const baseAudio=new Audio(sourceUrl);
  baseAudio.preload='auto';
  baseAudio.volume=1;

  function fallbackSpeech(info={}){
    if(!('speechSynthesis' in window))return;
    try{
      window.speechSynthesis.cancel();
      const call=new SpeechSynthesisUtterance('Gooooooooooooooooool!');
      call.lang='pt-BR';call.rate=.72;call.pitch=1.08;call.volume=1;
      window.speechSynthesis.speak(call);
      if(info.player){
        call.onend=()=>{
          const detail=new SpeechSynthesisUtterance(`Gol de ${info.player}!`);
          detail.lang='pt-BR';detail.rate=.92;detail.pitch=1;detail.volume=.95;
          window.speechSynthesis.speak(detail);
        };
      }
    }catch(error){}
  }

  async function playGoal(info={}){
    if(!enabled)return false;
    try{
      const audio=baseAudio.cloneNode(true);
      audio.volume=1;
      audio.currentTime=0;
      await audio.play();
      return true;
    }catch(error){
      fallbackSpeech(info);
      return false;
    }
  }

  async function unlock(){
    if(unlocked)return true;
    try{
      baseAudio.volume=.001;
      await baseAudio.play();
      baseAudio.pause();
      baseAudio.currentTime=0;
      baseAudio.volume=1;
      unlocked=true;
      return true;
    }catch(error){
      unlocked=false;
      return false;
    }
  }

  function toggle(){
    enabled=!enabled;
    if(!enabled){
      baseAudio.pause();
      if('speechSynthesis' in window)window.speechSynthesis.cancel();
    }
    return enabled;
  }
  function isEnabled(){return enabled;}
  function test(){return playGoal({player:'Teste'});}
  window.FWCL_AUDIO={goal:playGoal,unlock,toggle,isEnabled,test,sourceUrl};
})();
