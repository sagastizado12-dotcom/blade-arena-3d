// ===== THE FALL OF NETHERVALE: Malzareth boss, end of raids, festivals, resettlement =====
const DEMON_K=()=>KINGDOMS.findIndex(k=>k.demon);
let MALZ=null;
function startMalz(){const k=DEMON_K(),S=SETS[KINGDOMS[k].cap];const K=kState();if(K.demonFallen||mobs.some(m=>m.malz&&!m.dead))return null;
  const go=()=>{const sp=malzSpot(),x=sp.x,y=sp.y;hero.x=x;hero.y=y+64;const lv=P.lv||1;const e=spawnMob("demongeneral",x,y,{persist:true,malz:true,kingdom:k,name:"Demon Lord Malzareth"});
    e.hp=e.maxHp=Math.round(140+lv*28);e.dmg=Math.max(3,Math.round((hero.maxHp||60)*.14));e.w=18;e.h=18;e.phase=1;e.malzCd=90;MALZ=e;
    addNews(KINGDOMS[k].cap,"The hero storms the Black Citadel. Malzareth rises from his throne!");toast("👹 DEMON LORD MALZARETH: \"So the little hero comes to die.\"");shake=8;};
  if(!room){go();return MALZ;}leaveRoom();setTimeout(go,450);return true;}
{const _tc=takeCrown;takeCrown=function(k){const K=kState();if(KINGDOMS[k]&&KINGDOMS[k].demon&&!K.demonFallen&&!takeCrown._force){const sm=showMenu;showMenu=function(){showMenu=sm;};setTimeout(()=>{showMenu=sm;},50);startMalz();return;}return _tc.apply(this,arguments);};}
{const _um=updateMob;updateMob=function(e){if(e.malz&&!e.dead){const f=e.hp/e.maxHp;const ph=f>.66?1:f>.33?2:3;
    if(ph!==e.phase){e.phase=ph;shake=10;toast(ph===2?"Malzareth: \"Rise, my legion!\" (Phase 2)":"Malzareth burns with fury! (Final phase)");e.iframes=60;
      if(ph===2)for(let i=0;i<4;i++){const a=i*1.57;spawnMob(i%2?"demonbrute":"demon",e.x+Math.cos(a)*40,e.y+Math.sin(a)*40,{malzAdd:1});}if(ph===3){e.spd=(e.spd||.6)*1.5;e.dmg=Math.round(e.dmg*1.3);}}
    if(--e.malzCd<=0){const cx=e.x+e.w/2,cy=e.y+e.h/2;const n=ph===1?6:ph===2?10:14;for(let i=0;i<n;i++){const a=i/n*6.283+frameN*.01;projectiles.push({x:cx,y:cy,vx:Math.cos(a)*2,vy:Math.sin(a)*2,life:110,r:3,dmg:Math.max(2,Math.round(e.dmg*.5)),col:[255,70,40]});}
      e.malzCd=ph===3?70:110;try{SFX.roar&&SFX.roar();}catch(_){}}}
  return _um(e);};}
{const _dm=drawMob;drawMob=function(e){if(e.malz&&!e.dead){const v=Math.hypot(e.vx||0,e.vy||0)>.05;const dir=Math.abs(hero.x-e.x)>Math.abs(hero.y-e.y)?(hero.x<e.x?1:2):(hero.y<e.y?3:0);
    ctx.save();if(e.flash>0)ctx.filter="brightness(2)";if(e.phase===3){ctx.fillStyle="rgba(255,60,20,.25)";ctx.beginPath();ctx.arc(e.x+9,e.y+6,22+Math.sin(frameN*.3)*3,0,7);ctx.fill();}
    drawRulerSpr(DEMON_K(),e.x+9,e.y+18,dir,v?10+(frameN>>2)%8:0,1.5);ctx.restore();const w=40;ctx.fillStyle="#000b";ctx.fillRect(e.x-11,e.y-42,w,4);ctx.fillStyle="#d02030";ctx.fillRect(e.x-11,e.y-42,w*Math.max(0,e.hp/e.maxHp),4);
    ctx.fillStyle="#fff";ctx.font="6px monospace";ctx.fillText("MALZARETH · P"+e.phase,e.x-11,e.y-45);return;}return _dm(e);};}
function demonFall(){const K=kState(),k=DEMON_K();if(K.demonFallen)return;K.demonFallen=true;K.demonPeace=true;MALZ=null;
  for(const ws of world.sets)if(ws.raid&&ws.raid.demon)ws.raid=null;for(const m of mobs)if(!m.dead&&(m.raidOf!=null||m.malzAdd||m.demon&&m.hunter)){m.dead=true;m.flash=0;}
  takeCrown._force=true;try{takeCrown(k);}finally{takeCrown._force=false;}
  P.titles=P.titles||[];if(!P.titles.includes("Demonslayer"))P.titles.push("Demonslayer");P.fame=(P.fame||0)+250;
  world.festival={until:world.day+3};world.resettle={start:world.day,done:[]};
  addNews(KINGDOMS[k].cap,"MALZARETH IS SLAIN! Nethervale has fallen. The demon raids are over!");
  for(const q of KINGDOMS)if(!q.demon)addNews(q.cap,`${q.name} holds a great festival in honor of the Demonslayer!`);
  toast("👑 Malzareth is slain! You are the DEMONSLAYER. +250 fame");shake=12;try{saveGame&&saveGame();}catch(_){}}
{const _ok=onKill;onKill=function(e){_ok(e);try{if(e.malz)demonFall();}catch(err){console.error(err);}};}
// no more raids once fallen (also guard the raid starter)
{const _dr=demonRaid;demonRaid=function(sid){const K=kState();if(K.demonFallen)return null;return _dr(sid);};}
// resettlement: one demon town per 2 days becomes a human settlement
{const _hr=hourlyTick;hourlyTick=function(){_hr.apply(this,arguments);try{const R=world.resettle;if(!R||hour()!==8)return;const k=DEMON_K();const towns=SETS.filter(S=>kOf(S.id)===k&&!R.done.includes(S.id));if(!towns.length)return;
  if((world.day-R.start)>=2*(R.done.length+1)){const S=towns[0];R.done.push(S.id);world.sets[S.id].settled=true;addNews(S.id,`Human settlers have moved into ${S.name}. Fields are being planted in the ash.`);
    for(const n of npcs)if(n.s===S.id&&n.demon&&n.alive&&!(n.role==="child"||n.age<18)&&Math.random()<.5)n.peaceful=true;}}catch(_){}};}
// festival: confetti & cheering near human capitals
{const _u=update;update=function(){_u();const F=world&&world.festival;if(!F||world.day>F.until||room||!hero||frameN%8)return;if(particles.length>240)return;
  for(const q of KINGDOMS){if(q.demon)continue;const S=SETS[q.cap];if(Math.hypot(S.x*TILE-hero.x,S.y*TILE-hero.y)>360)continue;const x=hero.x+(Math.random()-.5)*200,y=hero.y-60-Math.random()*40;
    particles.push({x,y,z:30,vx:(Math.random()-.5)*.4,vy:.4,vz:0,life:70,max:70,col:pick([[255,80,80],[255,220,80],[90,200,255],[120,255,140]]),size:2,kind:"magic"});}};}
{const _drm=drawRuinMap;drawRuinMap=function(g,P2,txt,z){_drm(g,P2,txt,z);if(!world.resettle)return;for(const id of world.resettle.done){const S=SETS[id];const [x,y]=P2(S.x,S.y);txt("🌱 resettled",x,y+32,"#9cff9c",10);}};}
// ---- v18: Malzareth waits in his castle; reaching him starts the fight (no general prerequisite) ----
const demonCastle=()=>{const k=DEMON_K();return CASTLES.find(c=>c.s===KINGDOMS[k].cap)||null;};
const malzActive=()=>{const K=kState();return !K.demonFallen;};
function malzSpot(){const c=demonCastle(),S=SETS[KINGDOMS[DEMON_K()].cap];return c?{x:(c.x+3)*TILE,y:(c.y+5.5)*TILE}:{x:S.x*TILE,y:(S.y+2)*TILE};}
let malzIntroAt=0;
function malzTrigger(){if(!malzActive()||mobs.some(m=>m.malz&&!m.dead)||performance.now()-malzIntroAt<1500)return null;malzIntroAt=performance.now();
  toast("👹 Malzareth rises from his throne: \"At last, the little hero comes to me. Kneel... or burn!\"");return startMalz();}
// place the fight in front of his castle instead of the town square

// entering the demon throne room starts the fight
{const _eb=enterBuilding;enterBuilding=function(b){const r=_eb.apply(this,arguments);try{if(b&&isDemonCastleDoor(b)&&malzActive())setTimeout(()=>malzTrigger(),250);}catch(_){}return r;};}
// or walking within ~6 tiles of him at the castle; flee or knockout resets him
{const _u=update;update=function(){_u();if(!world||!hero||state!=="play")return;try{
  const live=mobs.find(m=>m.malz&&!m.dead);
  if(live){const far=Math.hypot(live.x-hero.x,live.y-hero.y)>30*TILE;if(hero.dead||far||room){live.dead=true;live.flash=0;for(const m of mobs)if(m.malzAdd&&!m.dead){m.dead=true;m.flash=0;}MALZ=null;malzIntroAt=performance.now();
      toast(hero.dead?"Malzareth laughs and returns to his throne.":"You flee. Malzareth returns to his throne, fully healed.");}return;}
  if(room||!malzActive()||paused)return;const c=demonCastle();if(c){const hx=(hero.x+6)/TILE,hy=(hero.y+8)/TILE;if(Math.hypot(hx-(c.x+3),hy-(c.y+1.5))<8||Math.hypot(hx-(c.x+3),hy-(c.y+4))<8)malzTrigger();}}catch(_){}};}
// throne room: he sits on his throne (ruler sprite already his own); no "storm the throne" gate for the demons
{const _sm=showMenu;showMenu=function(t,x,b){if(Array.isArray(b)&&KINGDOMS[DEMON_K()]&&(t===KINGDOMS[DEMON_K()].ruler||t===KINGDOMS[DEMON_K()].name))b=b.filter(o=>!/Storm the throne|Demon General/.test(o.l||""));return _sm.call(this,t,x,b);};}
// map marker: skull at his castle
function drawMalzMap(g,P2,txt,z){if(!malzActive())return;const c=demonCastle();if(!c)return;const [x,y]=P2(c.x+3,c.y+3);txt("💀",x,y-14,"#ff6a5a",14);if(z>=2)txt("Malzareth",x,y-26,"#ff9a8a",10);}
{const _drm=drawRuinMap;drawRuinMap=function(g,P2,txt,z){_drm(g,P2,txt,z);try{drawMalzMap(g,P2,txt,z);}catch(_){}};}

function isDemonCastleDoor(b){const cap=KINGDOMS[DEMON_K()].cap;if(b.kind==="castle"&&(b.s===cap||kOf(b.s)===DEMON_K()&&b.s===cap))return true;const c=demonCastle();
  if(c&&b.x!=null&&Math.abs(b.x+(b.w||0)/2-(c.x+3))<6&&Math.abs(b.y+(b.h||0)/2-(c.y+1.5))<6)return true;return false;}
// banner
function malzBanner(){let d=document.getElementById("malzBanner");if(!d){d=document.createElement("div");d.id="malzBanner";d.style.cssText="position:fixed;left:0;right:0;top:22%;text-align:center;z-index:60;pointer-events:none;font:900 clamp(16px,5vw,28px) Georgia,serif;letter-spacing:.08em;color:#ffdccf;text-shadow:0 0 12px #f22,0 0 24px #a00,0 2px 0 #000;transition:opacity .6s;opacity:0";document.body.appendChild(d);}
  d.innerHTML='MALZARETH, THE DEMON KING<div style="font:600 13px system-ui;letter-spacing:.2em;color:#ffb0a0;margin-top:4px">LORD OF NETHERVALE</div>';d.style.opacity="1";clearTimeout(d._t);d._t=setTimeout(()=>d.style.opacity="0",2600);}
{const _mt=malzTrigger;malzTrigger=function(){const r=_mt.apply(this,arguments);if(r)malzBanner();return r;};}
// world map marker: drawn LAST (above towns, labels, fog), all zoom levels, tappable
let mapStash=null;
{const _dh=drawHomesMap;drawHomesMap=function(g,P2,txt,z){mapStash={g,P2,txt,z};return _dh.apply(this,arguments);};}
drawMalzMap=function(){};
function malzMarker(){if(!mapStash||!malzActive())return;const {g,P2,txt,z}=mapStash;const c=demonCastle();if(!c)return;const [x,y]=P2(c.x+3,c.y+1.5);mapStash.mx=x;mapStash.my=y;
  g.save();const t=performance.now()/400;const r=11+Math.sin(t)*2;const gr=g.createRadialGradient(x,y,1,x,y,r+8);gr.addColorStop(0,"rgba(255,40,30,.9)");gr.addColorStop(1,"rgba(255,0,0,0)");g.fillStyle=gr;g.beginPath();g.arc(x,y,r+8,0,7);g.fill();
  g.fillStyle="#2a0508";g.strokeStyle="#ff4a3a";g.lineWidth=2;g.beginPath();g.arc(x,y,10,0,7);g.fill();g.stroke();g.restore();txt("💀",x,y+5,"#fff",14);txt("Demon King",x,y+24,"#ff7a6a",11);}
{const _df=drawFullMap;drawFullMap=function(){const r=_df.apply(this,arguments);try{malzMarker();}catch(_){}return r;};}
{const _mt=mapTap;mapTap=function(e){try{const C=demonCastle();if(C&&malzActive()){const c=document.getElementById("mapc"),R=c.getBoundingClientRect(),sc=mapScaleCss();
  const mx=c.clientWidth/2+(C.x+3-MAPM.cx)*sc,my=c.clientHeight/2+(C.y+1.5-MAPM.cy)*sc;if(Math.hypot(e.clientX-R.left-mx,e.clientY-R.top-my)<24){const d=Math.round(Math.hypot(hero.x/TILE-(C.x+3),hero.y/TILE-(C.y+1.5)));
  toast(`💀 Malzareth, the Demon King: ${d} tiles away (Black Citadel of ${SETS[C.s].name})`);return;}}}catch(_){}return _mt(e);};}
// minimap: skull if in view, else an edge arrow pointing to him
{const _dm=drawMini;drawMini=function(){_dm.apply(this,arguments);try{if(room||!malzActive())return;const c=demonCastle();if(!c)return;const R=MINI_R[miniZ],tx=hero.x/TILE,ty=hero.y/TILE,sx=mini.width/(R*2),sy=mini.height/(R*1.5);
  const dx=(c.x+3-tx)*sx,dy=(c.y+1.5-ty)*sy,W=mini.width/2,H=mini.height/2;mg.save();
  if(Math.abs(dx)<W-6&&Math.abs(dy)<H-6){mg.font="bold 12px system-ui";mg.textAlign="center";mg.fillText("💀",W+dx,H+dy+4);}
  else{const a=Math.atan2(dy,dx),k=Math.min((W-7)/Math.abs(Math.cos(a)||1e-6),(H-7)/Math.abs(Math.sin(a)||1e-6));const ax=W+Math.cos(a)*k,ay=H+Math.sin(a)*k;mg.translate(ax,ay);mg.rotate(a);mg.fillStyle="#ff3a2a";mg.strokeStyle="#000";mg.lineWidth=1.5;mg.beginPath();mg.moveTo(6,0);mg.lineTo(-5,-5);mg.lineTo(-2,0);mg.lineTo(-5,5);mg.closePath();mg.stroke();mg.fill();}
  mg.restore();}catch(_){}};}
