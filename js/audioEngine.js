(function(){
  let enabled=true;
  let ctx=null;
  async function getCtx(){
    if(!ctx){
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return null;
      ctx=new AC();
    }
    if(ctx.state==='suspended') await ctx.resume();
    return ctx;
  }
  function noiseBuffer(audioCtx,duration=2.2){
    const buffer=audioCtx.createBuffer(1,Math.floor(audioCtx.sampleRate*duration),audioCtx.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*(1-(i/data.length)*0.18);
    return buffer;
  }
  async function playCrowd(){
    if(!enabled) return false;
    const audioCtx=await getCtx();
    if(!audioCtx) return false;
    const now=audioCtx.currentTime;
    const master=audioCtx.createGain();
    master.gain.setValueAtTime(0.0001,now);
    master.gain.exponentialRampToValueAtTime(0.9,now+0.18);
    master.gain.exponentialRampToValueAtTime(0.48,now+1.1);
    master.gain.exponentialRampToValueAtTime(0.0001,now+2.7);
    master.connect(audioCtx.destination);

    const src=audioCtx.createBufferSource();
    src.buffer=noiseBuffer(audioCtx,2.8);
    const band=audioCtx.createBiquadFilter(); band.type='bandpass'; band.frequency.value=820; band.Q.value=0.55;
    const low=audioCtx.createBiquadFilter(); low.type='lowpass'; low.frequency.value=2600;
    src.connect(band); band.connect(low); low.connect(master);
    src.start(now); src.stop(now+2.75);

    const chant=audioCtx.createOscillator(); chant.type='sawtooth'; chant.frequency.setValueAtTime(220,now);
    chant.frequency.exponentialRampToValueAtTime(330,now+0.55);
    chant.frequency.exponentialRampToValueAtTime(250,now+1.9);
    const chantGain=audioCtx.createGain();
    chantGain.gain.setValueAtTime(0.0001,now);
    chantGain.gain.exponentialRampToValueAtTime(0.05,now+0.12);
    chantGain.gain.exponentialRampToValueAtTime(0.0001,now+1.8);
    chant.connect(chantGain); chantGain.connect(master); chant.start(now); chant.stop(now+1.85);

    const clapTimes=[0.35,0.55,0.75,1.0,1.25,1.55,1.9];
    clapTimes.forEach(offset=>{
      const osc=audioCtx.createOscillator(); osc.type='triangle'; osc.frequency.value=900;
      const g=audioCtx.createGain();
      g.gain.setValueAtTime(0.0001,now+offset);
      g.gain.exponentialRampToValueAtTime(0.10,now+offset+0.008);
      g.gain.exponentialRampToValueAtTime(0.0001,now+offset+0.08);
      osc.connect(g); g.connect(master); osc.start(now+offset); osc.stop(now+offset+0.09);
    });
    return true;
  }
  async function unlock(){ const audioCtx=await getCtx(); return !!audioCtx; }
  function toggle(){ enabled=!enabled; return enabled; }
  function isEnabled(){ return enabled; }
  function test(){ return playCrowd(); }
  window.FWCL_AUDIO={goal:playCrowd,unlock,toggle,isEnabled,test,sourceUrl:'web-audio-crowd-cheer'};
})();
