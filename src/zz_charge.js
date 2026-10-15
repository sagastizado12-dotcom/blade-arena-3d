// ===== HOLD-TO-CHARGE SPELLS =====
const CH_T=[0,600,1200,2000],CH_MULT=[1,1.5,2.2,3],CH_LV=[0,1,2,3];
let CHG=null;// {k,t0,src,btn}
const chargeTier=()=>{if(!CHG)return 0;const d=performance.now()-CHG.t0;return d>=CH_T[3]?3:d>=CH_T[2]?2:d>=CH_T[1]?1:0;};
function castCharged(k,tier){tier=Math.max(0,Math.min(3,tier|0));const s=SPELLS[k],m=P.mag;if(!s)return false;
  // mana scales with charge; drop tiers we can't afford
  while(tier>0&&m.mp<s.mp*CH_MULT[tier])tier--;
  const n0=fx.length,b0=typeof tbolts!=="undefined"?tbolts.length:0,hp0=hero.hp;window.__chargeLv=CH_LV[tier];let ok;
  try{ok=castSpell(k);}finally{window.__chargeLv=0;}
  if(!ok||!tier)return ok;const M=CH_MULT[tier];m.mp=Math.max(0,m.mp-Math.round(s.mp*(M-1)));
  for(let i=n0;i<fx.length;i++){const f=fx[i];if(f.dmg!=null)f.dmg=Math.round(f.dmg*M*10)/10;if(f.r!=null)f.r*=1+0.15*tier;f.lv=(f.lv||spellLv(k))+CH_LV[tier];f.tier=(f.tier||0)+tier;f.charged=tier;}
  if(typeof tbolts!=="undefined")for(let i=b0;i<tbolts.length;i++){const b=tbolts[i];if(b.dmg!=null)b.dmg=Math.round(b.dmg*M*10)/10;b.lv=(b.lv||spellLv(k))+CH_LV[tier];if(b.jumps!=null)b.jumps+=tier;b.charged=tier;}
  if(k==="heal"&&hero.hp>hp0){const extra=Math.round((hero.hp-hp0)*(M-1));hero.hp=Math.min(hero.maxHp,hero.hp+extra);updateHearts();}
  floatText(hero.x+6,hero.y-18,["","Charged!","Charged!!","MAX CHARGE!"][tier],["#fff","#9fe8ff","#c8a0ff","#ffd060"][tier]);shake=Math.max(shake,tier*1.2);return ok;}
// soft rising hum
let hum=null;function humStart(){try{audioInit&&audioInit();const c=AU.ctx;if(!c||hum)return;const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=110;g.gain.value=0;o.connect(g);g.connect(c.destination);o.start();hum={o,g,c};}catch(_){}}
function humTick(t){if(!hum)return;const c=hum.c;hum.o.frequency.setTargetAtTime(110+t*90,c.currentTime,.05);hum.g.gain.setTargetAtTime(0.012+t*0.012,c.currentTime,.05);}
function humStop(){if(!hum)return;try{hum.g.gain.setTargetAtTime(0,hum.c.currentTime,.03);const o=hum.o;setTimeout(()=>{try{o.stop();}catch(_){}},200);}catch(_){}hum=null;}
function chargeBegin(k,src,btn){if(state!=="play"||paused||CHG)return;if(!P.mag.known.includes(k))return;curSpell=k;try{updateSpellBtn&&updateSpellBtn();}catch(_){}CHG={k,t0:performance.now(),src,btn};humStart();}
function chargeEnd(src){if(!CHG||(src&&CHG.src!==src))return;const k=CHG.k,tier=chargeTier(),btn=CHG.btn;CHG=null;humStop();if(btn)btn.style.boxShadow="";if(btn)btn.style.backgroundImage="";
  if(state==="play"&&!paused)castCharged(k,tier);}
function chargeCancel(){if(!CHG)return;if(CHG.btn)CHG.btn.style.boxShadow="";CHG=null;humStop();}
// keyboard: 1-4 and L charge while held
const KEYSP={Digit1:0,Digit2:1,Digit3:2,Digit4:3,Numpad1:0,Numpad2:1,Numpad3:2,Numpad4:3};
window.addEventListener("keydown",e=>{if(state!=="play")return;const i=KEYSP[e.code];if(i==null&&e.code!=="KeyL")return;e.stopImmediatePropagation();if(e.repeat||paused)return;const k=i==null?curSpell:SPELL_ORDER[i];chargeBegin(k,"key:"+e.code,document.getElementById("sp_"+k));},true);
window.addEventListener("keyup",e=>{const i=KEYSP[e.code];if(i==null&&e.code!=="KeyL")return;if(CHG&&CHG.src==="key:"+e.code){e.stopImmediatePropagation();chargeEnd("key:"+e.code);}},true);
window.addEventListener("blur",chargeCancel);
// touch / mouse: rebind the spell buttons (replace tap-to-cast with press/hold/release)
function bindChargeButtons(){for(const k of SPELL_ORDER){const b=document.getElementById("sp_"+k);if(!b||b._chg)continue;const nb=b.cloneNode(true);nb._chg=1;b.replaceWith(nb);
  const down=e=>{e.preventDefault();e.stopPropagation();chargeBegin(k,"btn:"+k,nb);};const up=e=>{e.preventDefault();e.stopPropagation();chargeEnd("btn:"+k);};
  nb.addEventListener("touchstart",down,{passive:false});nb.addEventListener("touchend",up,{passive:false});nb.addEventListener("touchcancel",up,{passive:false});
  nb.addEventListener("mousedown",down);nb.addEventListener("mouseup",up);nb.addEventListener("mouseleave",e=>{if(CHG&&CHG.src==="btn:"+k)chargeEnd("btn:"+k);});nb.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();});}}
{const _bh=buildHUD;buildHUD=function(){const r=_bh.apply(this,arguments);try{bindChargeButtons();}catch(_){}return r;};}
setInterval(()=>{try{if(state==="play")bindChargeButtons();}catch(_){}},1000);
// slow walk while charging, glow + ring visuals, shake at full
let chPrev=null;{const _u=update;update=function(){const px=hero&&hero.x,py=hero&&hero.y;_u();if(!CHG||!hero)return;if(px!=null){hero.x=px+(hero.x-px)*0.4;hero.y=py+(hero.y-py)*0.4;}
  const d=performance.now()-CHG.t0,t=Math.min(1,d/CH_T[3]),tier=chargeTier();humTick(t);if(tier===3)shake=Math.max(shake,0.8);
  if(particles.length<240&&frameN%3===0){const a=Math.random()*7,r=14+tier*6;const col=[[150,220,255],[150,220,255],[200,150,255],[255,210,90]][tier];particles.push({z:4,vz:0,kind:"magic",x:hero.x+6+Math.cos(a)*r,y:hero.y+6+Math.sin(a)*r,vx:-Math.cos(a)*0.7,vy:-Math.sin(a)*0.7,life:18,max:18,col,size:1.5+tier*.4});}
  const b=CHG.btn;if(b){const deg=Math.round(t*360);const col=["#9fe8ff","#9fe8ff","#c8a0ff","#ffd060"][tier];b.style.boxShadow=`0 0 0 3px #0008, 0 0 ${6+tier*6}px ${col}`;b.style.backgroundImage=`conic-gradient(${col}cc ${deg}deg, transparent ${deg}deg)`;}};}
{const _d=draw;draw=function(){_d();if(!CHG||!hero||room)return;const tier=chargeTier(),t=Math.min(1,(performance.now()-CHG.t0)/CH_T[3]);ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx.globalCompositeOperation="lighter";
  const col=["150,220,255","150,220,255","200,150,255","255,210,90"][tier];const r=8+tier*5+Math.sin(frameN*.4)*1.5;const gr=ctx.createRadialGradient(hero.x+6,hero.y+6,1,hero.x+6,hero.y+6,r);gr.addColorStop(0,`rgba(${col},${.35+t*.35})`);gr.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=gr;ctx.beginPath();ctx.arc(hero.x+6,hero.y+6,r,0,7);ctx.fill();
  ctx.strokeStyle=`rgba(${col},.8)`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(hero.x+6,hero.y+6,r+2,-Math.PI/2,-Math.PI/2+t*Math.PI*2);ctx.stroke();ctx.restore();};}
