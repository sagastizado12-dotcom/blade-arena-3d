// ===== ACTION-RPG HUD (original art): ring D-pad, big sword button + 4 spell arc, bars with LV badge =====
const RING_SVG=`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><defs><radialGradient id='g' cx='50%' cy='45%'><stop offset='0' stop-color='#fff' stop-opacity='.10'/><stop offset='1' stop-color='#3a2a10' stop-opacity='.28'/></radialGradient><linearGradient id='au' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffe9a0'/><stop offset='.5' stop-color='#d4a040'/><stop offset='1' stop-color='#8a5a1a'/></linearGradient></defs><circle cx='64' cy='64' r='60' fill='url(#g)' stroke='url(#au)' stroke-width='4' opacity='.9'/><circle cx='64' cy='64' r='44' fill='none' stroke='#ffe6a0' stroke-opacity='.35' stroke-width='2'/>${[0,90,180,270].map(a=>`<g transform='rotate(${a} 64 64)'><path d='M64 8 L76 24 L64 40 L52 24 Z' fill='#7ac860' fill-opacity='.55' stroke='url(#au)' stroke-width='2.5'/><path d='M64 14 L70 24 L64 30 L58 24 Z' fill='#fff' fill-opacity='.35'/></g>`).join("")}<circle cx='64' cy='64' r='8' fill='none' stroke='url(#au)' stroke-width='2' opacity='.7'/></svg>`)}`;
(function(){const st=document.createElement("style");st.textContent=`
#touch{display:block!important}
#hearts,#btnC,#btnW,#hotbar{display:none!important}
#hudL{top:58px!important;left:10px!important;font-size:11px}
#hudL .bar:not(#stam){display:none}
#tl{position:fixed;top:calc(8px + env(safe-area-inset-top));left:calc(8px + env(safe-area-inset-left));display:flex;gap:8px;z-index:22}
#tl button{width:42px;height:42px;border-radius:50%;border:3px solid #c8902c;background:radial-gradient(circle at 45% 35%,#7a4a2a,#3a2010);color:#ffe9b0;font:bold 11px system-ui;box-shadow:0 2px 6px #0008,inset 0 0 0 1px #ffe08a;padding:0}
#bars{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(8px + env(safe-area-inset-bottom));width:min(46vw,440px);z-index:21;pointer-events:none}
#bars .row{display:flex;align-items:center;gap:0}
#bars .hp,#bars .mp{flex:1;height:12px;border:2px solid #2a1808;background:#2a1a14;position:relative;overflow:hidden}
#bars .hp{border-radius:7px 0 0 7px}#bars .mp{border-radius:0 7px 7px 0}
#bars .hp i{position:absolute;right:0;top:0;bottom:0;background:linear-gradient(#ff7a6a,#c8201a 60%,#8a1010);transition:width .25s}
#bars .mp i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(#ffe880,#e0b020 45%,#4a7ae0 46%,#2a4ab0);transition:width .25s}
#bars .lv{min-width:58px;height:22px;margin:0 -2px;z-index:1;border-radius:6px;border:2px solid #d4a040;background:linear-gradient(#5a6a8a,#2a3048);color:#fff2c0;font:bold 12px Georgia,serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px #2a1808,inset 0 1px 0 #ffffff55;letter-spacing:.5px}
#bars .xp{height:5px;margin:3px 10px 0;border:1px solid #102a10;background:#1a2a1a;border-radius:3px;overflow:hidden}#bars .xp i{display:block;height:100%;background:linear-gradient(#9cff7a,#38b030);transition:width .3s}
#bars .num{position:absolute;inset:0;font:bold 9px system-ui;color:#fff;text-shadow:0 1px 1px #000;display:flex;align-items:center;justify-content:center}
#stickBase{width:128px!important;height:128px!important;left:18px!important;bottom:18px!important;border:none!important;background:url("${RING_SVG}") center/contain no-repeat!important;border-radius:50%}
#stickKnob{width:46px!important;height:46px!important;background:radial-gradient(circle at 45% 35%,#fff8,#c8a05055)!important;border:2px solid #e8c070!important;left:59px!important;bottom:59px!important}
.rb{position:fixed;border-radius:50%;padding:0;pointer-events:auto;touch-action:none;border:4px solid #b8802c;box-shadow:0 0 0 2px #3a2008,0 3px 8px #0009,inset 0 0 0 2px #ffe08a;color:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;z-index:20}
#btnA.rb{width:88px;height:88px;right:calc(22px + env(safe-area-inset-right));bottom:calc(30px + env(safe-area-inset-bottom));font-size:34px;background:radial-gradient(circle at 45% 35%,#c8d0e0,#5a6a8a 60%,#2a3048)!important}
#btnA.rb.charge{box-shadow:0 0 0 2px #3a2008,0 0 18px 6px #ffd860,inset 0 0 0 2px #fff}
#btnB.rb{width:46px;height:46px;font-size:20px;background:radial-gradient(circle at 45% 35%,#e0c890,#8a6a3a)!important}
.sp4{width:54px;height:54px;font-size:22px}.sp4 .cd{position:absolute;inset:0;border-radius:50%;pointer-events:none}.sp4.low{filter:grayscale(.7) brightness(.6)}.sp4 small{position:absolute;bottom:2px;font:bold 8px system-ui;opacity:.85}
@media (orientation:portrait){#bars{width:70vw;bottom:calc(150px + env(safe-area-inset-bottom))}#stickBase{width:116px!important;height:116px!important}}
`;document.head.appendChild(st);})();
const SP_COL={fireball:"#e8501a",thunder:"#7a5ae0",heal:"#38b04a",air:"#3ab8a8"};
function buildHUD(){if(document.getElementById("bars"))return;
  const tl=document.createElement("div");tl.id="tl";tl.innerHTML=`<button id="btnPause" title="Pause">II</button><button id="btnSave" title="Save">💾</button><button id="btnShop" title="Shop">Shop</button>`;document.body.appendChild(tl);
  const bars=document.createElement("div");bars.id="bars";bars.innerHTML=`<div class="row"><div class="hp"><i id="hpFill"></i><span class="num" id="hpNum"></span></div><div class="lv" id="lvBadge">LV.01</div><div class="mp"><i id="mpFill"></i><span class="num" id="mpNum"></span></div></div><div class="xp"><i id="xpFill"></i></div>`;document.body.appendChild(bars);
  const A=document.getElementById("btnA"),B=document.getElementById("btnB");A.classList.add("rb");A.textContent="🗡";B.classList.add("rb");B.textContent="🏃";B.setAttribute("aria-label","Sprint");B.title="Sprint (hold Shift)";
  for(const el of [A,B])document.body.appendChild(el);
  // spell arc around the sword button
  const place=()=>{const port=innerHeight>innerWidth;const R=port?76:84,cr=22+44,cb=30+44;const angs=[180,145,110,75];
    SPELL_ORDER.forEach((k,i)=>{const b=document.getElementById("sp_"+k);if(!b)return;const a=angs[i]*Math.PI/180;b.style.right=(cr-Math.cos(a)*R-27)+"px";b.style.bottom=(cb+Math.sin(a)*R-27)+"px";});
    B.style.right=(cr-23-10)+"px";B.style.bottom=(cb+R+36)+"px";};
  SPELL_ORDER.forEach((k,i)=>{const b=document.createElement("button");b.id="sp_"+k;b.className="rb sp4";b.title=SPELLS[k].n;b.style.background=`radial-gradient(circle at 45% 35%,#ffffff88,${SP_COL[k]} 55%,#1a1020)`;
    b.innerHTML=`${SPELLS[k].ic}<small>${i+1}</small><span class="cd"></span>`;const go=e=>{e.preventDefault();e.stopPropagation();if(state!=="play"||paused)return;curSpell=k;castSpell(k);};
    b.addEventListener("touchstart",go,{passive:false});b.addEventListener("click",go);document.body.appendChild(b);});
  place();addEventListener("resize",place);
  document.getElementById("btnPause").onclick=e=>{e.stopPropagation();if(state!=="play")return;showMenu("Paused","The world waits for you.",[{l:"Resume"},{l:"Spells",f:()=>spellsMenu()},{l:"Profanity: "+(P.prof===false?"off":"on"),f:()=>{P.prof=P.prof===false;toast("Profanity "+(P.prof?"on":"off"));saveGame();}},{l:"Odd jobs (nearest town)",f:()=>oddJobsMenu(nearestTown())},{l:"Bag",f:()=>invMenu()},{l:"Blood: "+(document.getElementById("bloodToggle").textContent.includes("ON")?"on":"off"),f:()=>document.getElementById("bloodToggle").click()},{l:"Quest Log",f:()=>questLog()},{l:"Map",f:()=>document.getElementById("btnMap").click()},{l:"Sound",f:()=>document.getElementById("btnSnd").click()}]);};
  document.getElementById("btnSave").onclick=e=>{e.stopPropagation();if(state!=="play")return;saveGame();toast("Game saved.");SFX.chime();};
  document.getElementById("btnShop").onclick=e=>{e.stopPropagation();if(state!=="play")return;if(curSet&&!SETS[curSet.id].island||curSet){shopMenu(curSet.id);}else toast("No shop nearby — visit a town or village.");};}
const _buildHotbarH=buildHotbar;buildHotbar=function(){buildHUD();};
updateHotbar=function(){if(!P||!P.mag||!hero)return;const now=performance.now();for(const k of SPELL_ORDER){const b=document.getElementById("sp_"+k);if(!b)continue;
    b.classList.toggle("low",P.mag.mp<SPELLS[k].mp);const r=Math.max(0,((SPCD[k]||0)-now)/SPCDMS(k));b.lastChild.style.background=r>0?`conic-gradient(rgba(0,0,0,.65) ${r*360}deg,transparent 0)`:"";}
  const hp=document.getElementById("hpFill");if(!hp)return;hp.style.width=Math.max(0,hero.hp/hero.maxHp*100)+"%";document.getElementById("hpNum").textContent=`${Math.max(0,Math.ceil(hero.hp))}/${hero.maxHp}`;
  document.getElementById("mpFill").style.width=(P.mag.mp/P.mag.max*100)+"%";document.getElementById("mpNum").textContent=`${Math.floor(P.mag.mp)}/${P.mag.max}`;
  document.getElementById("lvBadge").textContent="LV."+String(P.lv||1).padStart(2,"0");document.getElementById("xpFill").style.width=Math.min(100,(P.exp||0)/expNeed(P.lv||1)*100)+"%";
  document.getElementById("btnA").classList.toggle("charge",(hero.chargeT||0)>=CHARGE_T);};
// ---- player levels & EXP ----
const expNeed=lv=>Math.round(20*Math.pow(lv,1.5));
function gainExp(n,x,y){if(!P)return;P.lv=P.lv||1;P.exp=(P.exp||0)+n;if(x!=null)floatText(x,y-10,"+"+n+" EXP","#9cff7a");
  while(P.exp>=expNeed(P.lv)){P.exp-=expNeed(P.lv);P.lv++;if(P.lv%2===0)hero.maxHp=Math.min(20,hero.maxHp+1);hero.hp=hero.maxHp;if(P.mag){P.mag.max+=5;P.mag.mp=P.mag.max;}updateHearts();SFX.chime();toast("Level up! You are now level "+P.lv+".");burst(hero.x+6,hero.y+6,[255,240,140],30,1.6,2);}}
const _onKillX=onKill;onKill=function(e){_onKillX(e);try{const d=e.def||{};if(d.beh==="pea")return;gainExp(Math.max(2,Math.round((e.maxHp||2)*2+(d.rare||d.big?20:0)+(e.sp==="dragon"?80:0))),e.x+e.w/2,e.y);}catch(_){}};
const _tcjX=tryCompleteJobs;tryCompleteJobs=function(sid,n){const r=_tcjX(sid,n);if(r)gainExp(25*r);return r;};
const _gtiX=guildTurnIn;guildTurnIn=function(){const before=guild().done||0;const r=_gtiX.apply(this,arguments);const d=(guild().done||0)-before;if(d>0)gainExp(30*d);return r;};
// ---- sword: tap combos (existing) + hold-to-charge spin ----
const CHARGE_T=36;
function chargeTick(){if(!hero||hero.dead||room)return;const held=keys.KeyJ||keys.Space||touch.a;
  if(held&&!hero.boat&&!hero.swim){hero.chargeT=(hero.chargeT||0)+1;if(hero.chargeT===CHARGE_T){SFX.chime();burst(hero.x+6,hero.y+6,[255,230,140],12,1,2);}}
  else{if((hero.chargeT||0)>=CHARGE_T)spinAttack();hero.chargeT=0;}}
function spinAttack(){const cx=hero.x+6,cy=hero.y+6;hero.spinT=16;SFX.swing();shake=3;hitStop=4;
  for(const e of mobs){if(e.dead||(e.def&&e.def.beh==="pea"))continue;const d=Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy);if(d>34+e.w/3)continue;e.iframes=0;const a=Math.atan2(e.y-cy,e.x-cx);
    if(e.sp==="dragon")hitDragon(e,a);else{hurtEnemy(e,swordDmg()+2,a,true);e.knockVx*=2;e.knockVy*=2;}}
  fx.push({k:"ring",x:cx,y:cy+2,r:4,max:36,life:18,col:[255,240,180]});burst(cx,cy,[255,240,180],20,2.4,2);}
const _updateMagicH=updateMagic;updateMagic=function(){_updateMagicH();chargeTick();if(hero.spinT>0){hero.spinT--;hero.dir=[0,2,3,1][Math.floor(hero.spinT/2)%4];}};
// ===== HUD LAYOUT GRID: safe-area aware, ≥12px gaps, scales with screen =====
(function(){const st=document.createElement("style");st.textContent=`
#bloodToggle{display:none!important}
.rb,#tl button{box-sizing:border-box;border:3px solid #c8902c!important;box-shadow:0 0 0 2px #3a2008,0 3px 8px #0009,inset 0 0 0 2px #ffe08a!important}
#hudR{gap:6px!important}#hudR .hbtns,#hudR > div{gap:6px}
#bars{transform:none!important}`;document.head.appendChild(st);})();
function safeInsets(){let p=document.getElementById("saProbe");if(!p){p=document.createElement("div");p.id="saProbe";p.style.cssText="position:fixed;visibility:hidden;pointer-events:none;top:0;left:0;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)";document.body.appendChild(p);}
  const cs=getComputedStyle(p);return{t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0};}
function layoutHUD(K){K=K||1;const A=document.getElementById("btnA");if(!A||!document.getElementById("bars"))return;const vw=innerWidth,vh=innerHeight,I=safeInsets(),G=12,M=10;
  const u=clamp(Math.min(vw,vh)/420,0.72,1.25);const S=Math.round(86*u*K),s=Math.round(52*u*K),d=Math.round(44*u*K),tb=Math.round(40*u),dp=Math.round(124*u);
  const px=v=>Math.round(v)+"px";const put=(el,x,y,w,h)=>{el.style.left=px(x);el.style.top=px(y);el.style.right="auto";el.style.bottom="auto";el.style.width=px(w);el.style.height=px(h);};
  // sword: bottom-right
  const cx=vw-I.r-M-S/2,cy=vh-I.b-M-S/2;put(A,cx-S/2,cy-S/2,S,S);A.style.fontSize=px(S*0.4);
  // spells: even arc from 180° to 70°, radius large enough for ≥12px chords and ring gap
  const angs=[180,150,120,90],step=(30)*Math.PI/180;let sep=1;for(let i=1;i<angs.length;i++){const a=angs[i-1]*Math.PI/180,b=angs[i]*Math.PI/180;sep=Math.min(sep,Math.max(Math.abs(Math.cos(a)-Math.cos(b)),Math.abs(Math.sin(a)-Math.sin(b))));}
  const Rr=Math.max(S/2+G+s/2,(s+G)/sep, Math.SQRT2*(S/2+s/2)+G);let topY=cy-S/2;let leftX=cx-S/2;
  SPELL_ORDER.forEach((k,i)=>{const b=document.getElementById("sp_"+k);if(!b)return;const a=angs[i]*Math.PI/180;const x=cx+Math.cos(a)*Rr,y=cy-Math.sin(a)*Rr;put(b,x-s/2,y-s/2,s,s);b.style.fontSize=px(s*0.42);topY=Math.min(topY,y-s/2);leftX=Math.min(leftX,x-s/2);});
  // sprint above the arc, over the sword column
  const B=document.getElementById("btnB");const dy=topY-G-d;put(B,cx-d/2,dy,d,d);B.style.fontSize=px(d*0.45);topY=Math.min(topY,dy);
  {const hr0=document.getElementById("hudR");if(hr0&&K>0.55){hr0.style.top=px(I.t+M);const hb=hr0.getBoundingClientRect().bottom;if(dy<hb+G)return layoutHUD(K*0.93);}}
  // D-pad bottom-left
  const base=document.getElementById("stickBase"),knob=document.getElementById("stickKnob");const bx=I.l+M,by=vh-I.b-M-dp;const zr=(base.offsetParent||document.body).getBoundingClientRect();const ox=-zr.left,oy=-zr.top;
  base.style.setProperty("left",px(bx+ox),"important");base.style.setProperty("top",px(by+oy),"important");base.style.setProperty("bottom","auto","important");base.style.setProperty("width",px(dp),"important");base.style.setProperty("height",px(dp),"important");
  const kn=Math.round(dp*0.36);knob.style.setProperty("width",px(kn),"important");knob.style.setProperty("height",px(kn),"important");knob.style.setProperty("left",px(bx+ox+dp/2-kn/2),"important");knob.style.setProperty("top",px(by+oy+dp/2-kn/2),"important");knob.style.setProperty("bottom","auto","important");
  // top-left: buttons row, then bars, then status text; top-right: minimap
  const tl=document.getElementById("tl");tl.style.top=px(I.t+M);tl.style.left=px(I.l+M);tl.style.gap=px(Math.round(G*0.7));for(const b of tl.children){b.style.width=b.style.height=px(tb);b.style.fontSize=px(tb*0.3);}
  const hr=document.getElementById("hudR");hr.style.top=px(I.t+M);hr.style.right=px(I.r+M);const mini=document.getElementById("mini");const mw=Math.round(Math.min(120*u,vw*0.3));mini.style.width=px(mw);mini.style.height=px(mw*0.75);
  const miniL=vw-I.r-M-Math.max(mw,hr.getBoundingClientRect().width);
  const bars=document.getElementById("bars");const bx0=I.l+M,bw=Math.max(140,Math.min(360*u,miniL-G-bx0));const tlB=tl.getBoundingClientRect().bottom;
  bars.style.left=px(bx0);bars.style.width=px(bw);bars.style.top=px(tlB+G*0.7);bars.style.bottom="auto";bars.style.right="auto";bars.style.transform="none";
  const hl=document.getElementById("hudL");if(hl){const bb=bars.getBoundingClientRect().bottom;hl.style.setProperty("top",px(bb+6),"important");hl.style.setProperty("left",px(I.l+M),"important");}}
addEventListener("resize",()=>setTimeout(layoutHUD,0));addEventListener("orientationchange",()=>setTimeout(layoutHUD,120));
const _buildHUDL=buildHUD;buildHUD=function(){_buildHUDL();layoutHUD();};
const _btnPauseL=()=>{};
// live orientation handling: refit canvas + camera + HUD immediately
function relayout(){try{fit();layoutHUD();document.body.classList.toggle("portrait",innerHeight>innerWidth);if(typeof updateBuffs==="function")updateBuffs();}catch(e){}}
addEventListener("resize",relayout);addEventListener("orientationchange",()=>{relayout();setTimeout(relayout,150);setTimeout(relayout,400);});
if(window.matchMedia){const mq=matchMedia("(orientation: portrait)");(mq.addEventListener?mq.addEventListener("change",relayout):mq.addListener(relayout));}
if(window.screen&&screen.orientation&&screen.orientation.addEventListener)screen.orientation.addEventListener("change",relayout);
