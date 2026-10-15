// ===== AUDIO (WebAudio synthesis; soft envelopes, low-pass, master limiter) =====
const AU={ctx:null,set:Object.assign({music:0.4,sfx:0.6,mute:false},JSON.parse(localStorage.getItem("realmAudio")||"{}")),mood:"",nextT:0,step:0,amb:{}};
function saveAudio(){localStorage.setItem("realmAudio",JSON.stringify(AU.set));applyVol();}
function applyVol(){if(!AU.ctx)return;const t=AU.ctx.currentTime,m=AU.set.mute?0:1;
  AU.music.gain.setTargetAtTime(AU.set.music*m*0.5,t,0.3);AU.sfx.gain.setTargetAtTime(AU.set.sfx*m*0.7,t,0.1);AU.ambG.gain.setTargetAtTime(AU.set.sfx*m*0.5,t,0.3);}
function audioInit(){if(AU.ctx)return;const C2=window.AudioContext||window.webkitAudioContext;if(!C2)return;const c=new C2();AU.ctx=c;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=12;comp.ratio.value=6;comp.attack.value=0.01;comp.release.value=0.25;
  const master=c.createGain();master.gain.value=0.8;const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=6000;
  master.connect(lp);lp.connect(comp);comp.connect(c.destination);AU.master=master;
  const mk=f=>{const g=c.createGain();const l=c.createBiquadFilter();l.type="lowpass";l.frequency.value=f;g.connect(l);l.connect(master);return g;};
  AU.music=mk(2200);AU.sfx=mk(4500);AU.ambG=mk(3000);
  const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let b=0;for(let i=0;i<len;i++){b=(b+0.02*(Math.random()*2-1))/1.02;d[i]=(Math.random()*2-1)*0.5+b*3;}AU.noise=buf;
  // ambience beds: wind, waves, rain
  const bed=(f,type,q)=>{const s=c.createBufferSource();s.buffer=buf;s.loop=true;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||0.7;const g=c.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AU.ambG);s.start();return g;};
  AU.amb={wind:bed(380,"lowpass"),waves:bed(500,"lowpass"),rain:bed(2600,"bandpass",0.6)};
  applyVol();if(c.state==="suspended")c.resume();
}
["pointerdown","touchstart","keydown"].forEach(ev=>window.addEventListener(ev,()=>{audioInit();if(AU.ctx&&AU.ctx.state==="suspended")AU.ctx.resume();},{passive:true}));
function env(g,t,a,peak,dur){g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setTargetAtTime(0.0001,t+a,dur/3);}
function tone(f,dur,o={}){if(!AU.ctx||AU.set.mute)return;const c=AU.ctx,t=c.currentTime+(o.delay||0);const os=c.createOscillator(),g=c.createGain();os.type=o.type||"sine";os.frequency.setValueAtTime(f,t);
  if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+dur);env(g,t,o.a||0.01,o.v||0.2,dur);os.connect(g);g.connect(o.bus||AU.sfx);os.start(t);os.stop(t+dur*2+0.1);}
function noiz(dur,o={}){if(!AU.ctx||AU.set.mute)return;const c=AU.ctx,t=c.currentTime+(o.delay||0);const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type=o.ft||"lowpass";f.frequency.setValueAtTime(o.f||1000,t);
  if(o.fTo)f.frequency.exponentialRampToValueAtTime(o.fTo,t+dur);f.Q.value=o.q||0.8;const g=c.createGain();env(g,t,o.a||0.005,o.v||0.2,dur);s.connect(f);f.connect(g);g.connect(o.bus||AU.sfx);s.start(t,Math.random());s.stop(t+dur*2+0.1);}
const SFX={
 swing:()=>noiz(0.16,{ft:"bandpass",f:600,fTo:1800,q:1.2,v:0.18,a:0.02}),
 hit:()=>{tone(150,0.12,{to:70,v:0.3});noiz(0.06,{f:900,v:0.12});},
 blood:()=>noiz(0.18,{f:500,v:0.12,a:0.01}),
 hurt:()=>{tone(220,0.2,{to:140,type:"triangle",v:0.18});},
 step:t=>{const m={7:[700,.05],12:[1500,.045],2:[500,.05],10:[0,0],1:[900,.06]}[t]||[1000,.04];if(t===10)tone(180+Math.random()*30,0.06,{v:0.08,type:"triangle"});else noiz(0.05,{f:m[0]*(0.9+Math.random()*0.2),v:m[1]});},
 swim:()=>noiz(0.3,{f:700,fTo:300,v:0.12,a:0.04}),
 boat:()=>noiz(0.6,{f:400,v:0.08,a:0.2}),
 ui:()=>tone(660,0.08,{v:0.08,type:"triangle"}),
 blip:()=>{for(let i=0;i<3;i++)tone(500+Math.random()*200,0.05,{v:0.05,type:"triangle",delay:i*0.07});},
 coin:()=>{tone(1320,0.12,{v:0.08});tone(1760,0.2,{v:0.07,delay:0.07});},
 chime:()=>{[784,988,1175].forEach((f,i)=>tone(f,0.5,{v:0.06,delay:i*0.09,a:0.02}));},
 spell:k=>{const m={fireball:()=>{noiz(0.5,{f:400,fTo:1500,v:0.2,a:0.05});tone(200,0.4,{to:90,v:0.12});},ice:()=>{tone(1400,0.3,{to:900,v:0.08});tone(2100,0.3,{v:0.04,delay:0.03});},
   heal:()=>[523,659,784,1047].forEach((f,i)=>tone(f,0.6,{v:0.07,delay:i*0.08,a:0.05})),dash:()=>noiz(0.3,{ft:"bandpass",f:400,fTo:2000,v:0.18,a:0.03}),
   wall:()=>{tone(90,0.5,{to:50,v:0.25,a:0.03});noiz(0.4,{f:300,v:0.15});},chain:()=>{for(let i=0;i<4;i++)noiz(0.08,{ft:"bandpass",f:1800,q:2,v:0.12,delay:i*0.05});},
   blade:()=>[440,554,659].forEach((f,i)=>tone(f,0.7,{v:0.06,delay:i*0.05,type:"triangle",a:0.06})),meteor:()=>{noiz(1.2,{f:200,fTo:1200,v:0.22,a:0.4});tone(70,1.4,{to:40,v:0.25,delay:0.9,a:0.02});}}[k];m&&m();},
 explode:()=>{tone(80,0.6,{to:40,v:0.3});noiz(0.6,{f:500,fTo:150,v:0.2});},
 roar:()=>{tone(110,1.0,{to:70,type:"sawtooth",v:0.06,a:0.15});noiz(0.9,{f:300,v:0.12,a:0.15});},
 bird:()=>{const f=2200+Math.random()*900;for(let i=0;i<2+Math.floor(Math.random()*3);i++)tone(f,0.07,{to:f*1.25,v:0.025,delay:i*0.11,bus:AU.ambG});},
};
// generative music by mood
const MOODS={town:{root:261.6,sc:[0,2,4,7,9],bpm:84,pad:"triangle",lead:"triangle",dens:0.45},forest:{root:220,sc:[0,2,3,5,7,9],bpm:72,pad:"sine",lead:"triangle",dens:0.35},
 ocean:{root:196,sc:[0,2,4,6,7,11],bpm:60,pad:"sine",lead:"sine",dens:0.25},night:{root:174.6,sc:[0,3,5,7,10],bpm:56,pad:"sine",lead:"sine",dens:0.2},
 dungeon:{root:146.8,sc:[0,1,3,5,7,8],bpm:66,pad:"sine",lead:"triangle",dens:0.25,drone:1},dragon:{root:164.8,sc:[0,2,3,5,7,8,10],bpm:104,pad:"triangle",lead:"triangle",dens:0.5,pulse:1},
 field:{root:246.9,sc:[0,2,4,7,9],bpm:78,pad:"sine",lead:"triangle",dens:0.3}};
const CHORDS=[0,5,3,4];
function musicTick(){if(!AU.ctx||state!=="play"&&state!=="intro"){return;}const c=AU.ctx;const M=MOODS[AU.mood]||MOODS.field;const beat=60/M.bpm/2;
  if(AU.nextT<c.currentTime)AU.nextT=c.currentTime+0.05;
  while(AU.nextT<c.currentTime+0.4){const t=AU.nextT-c.currentTime,s=AU.step++;const bar=Math.floor(s/16)%4;const deg=CHORDS[bar];
    const n=i=>M.root*Math.pow(2,(M.sc[(deg+i)%M.sc.length]+12*Math.floor((deg+i)/M.sc.length))/12);
    if(s%16===0)[0,2,4].forEach(i=>tone(n(i)/2,beat*14,{type:M.pad,v:0.05,a:beat*4,bus:AU.music,delay:t}));
    if(M.drone&&s%32===0)tone(M.root/4,beat*30,{v:0.06,a:2,bus:AU.music,delay:t});
    if(M.pulse&&s%2===0)tone(M.root/2,beat*0.8,{v:0.035,a:0.03,bus:AU.music,delay:t,type:"sine"});
    if(Math.random()<M.dens&&s%2===0)tone(n(Math.floor(Math.random()*5))*(Math.random()<0.3?2:1),beat*3,{type:M.lead,v:0.045,a:0.04,bus:AU.music,delay:t});
    AU.nextT+=beat;}}
let audT=0;
function audioUpdate(){if(!AU.ctx)return;musicTick();if(++audT%30)return;
  let mood="field";if(state==="intro")mood="town";else if(hero){const {tx,ty}=heroTile();const night=world&&(hour()>=20||hour()<5);
    if(mobs.some(m=>m.sp==="dragon"&&!m.dead&&Math.hypot(m.x-hero.x,m.y-hero.y)<300))mood="dragon";else if(tx<40&&ty<26)mood="dungeon";
    else if(hero.boat||hero.swim||isWater(tAt(tx,ty)))mood="ocean";else if(night)mood="night";else if(curSet)mood="town";else if(biomeAt(tx,ty)==="forest")mood="forest";}
  if(mood!==AU.mood){AU.mood=mood;}
  if(!world||!hero)return;const t=AU.ctx.currentTime;const {tx,ty}=heroTile();let water=0;for(let y=-6;y<=6;y+=3)for(let x=-8;x<=8;x+=4)if(isWater(tAt(tx+x,ty+y)))water++;
  const w=world.weather;AU.amb.waves.gain.setTargetAtTime(Math.min(0.35,water*0.02),t,1);AU.amb.rain.gain.setTargetAtTime(w==="rain"?0.12:w==="storm"?0.2:0,t,1.5);
  AU.amb.wind.gain.setTargetAtTime((biomeAt(tx,ty)==="mountain"?0.3:0.1)+(w==="storm"?0.15:0)+Math.sin(t*0.3)*0.04,t,1.5);
  const day=hour()>=6&&hour()<19;if(day&&state==="play"&&w!=="rain"&&w!=="storm"&&Math.random()<0.12&&["meadow","forest"].includes(biomeAt(tx,ty)))SFX.bird();}
function audioMenu(){paused=true;SFX.ui();menuEl.innerHTML=`<h2>Sound</h2><p>Music <input id="volM" type="range" min="0" max="100" value="${Math.round(AU.set.music*100)}" style="width:60%;touch-action:auto"></p>
 <p>Effects <input id="volS" type="range" min="0" max="100" value="${Math.round(AU.set.sfx*100)}" style="width:60%;touch-action:auto"></p><p><label><input id="mute" type="checkbox" ${AU.set.mute?"checked":""}> Mute all</label></p><div class="mbtns"><button id="audClose" type="button">Done</button></div>`;
  menuEl.classList.remove("hidden");
  document.getElementById("volM").oninput=e=>{AU.set.music=e.target.value/100;saveAudio();};document.getElementById("volS").oninput=e=>{AU.set.sfx=e.target.value/100;saveAudio();SFX.coin();};
  document.getElementById("mute").onchange=e=>{AU.set.mute=e.target.checked;saveAudio();};document.getElementById("audClose").onclick=e=>{e.stopPropagation();closeMenu();};}
document.getElementById("btnSnd").onclick=e=>{e.stopPropagation();audioInit();audioMenu();};
window.__AU=AU;window.__audioSet=(k,v)=>{AU.set[k]=v;saveAudio();};
