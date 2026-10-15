// ===== MOB SPAWNING / AI =====
let uidN=1;
function inTown(px,py){return!!settlementAt(px,py);}
function spawnTick(){
  // materialize world events near the player
  const hx=hero.x,hy=hero.y,nearP=(x,y,r)=>Math.hypot(x-hx,y-hy)<r;
  for(const s of world.sets){const S=SETS[s.id],cx=S.x*TILE,cy=S.y*TILE;
    if(s.raid&&!s.raid.spawned&&nearP(cx,cy,700)){s.raid.spawned=true;for(let i=0;i<s.raid.n;i++){let a=Math.random()*7;const rr=(S.r+4)*TILE;for(let k=0;k<24&&(solidTile(Math.floor((cx+Math.cos(a)*rr)/TILE),Math.floor((cy+Math.sin(a)*rr)/TILE))||solidTile(Math.floor((cx+Math.cos(a)*rr+12)/TILE),Math.floor((cy+Math.sin(a)*rr+12)/TILE)));k++)a+=0.29;spawnMob(["goblin","goblin","gslinger","orc","shaman"][i%5],cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,{persist:true,raidOf:s.id,provoked:true,raider:1});}}
    if(s.dragon&&!s.dragon.spawned&&nearP(cx,cy,700)){s.dragon.spawned=true;spawnDragon(s.dragon.k,cx+60,cy-80,{town:s.id});SFX.roar();}
    if(s.dragon&&absMin()>s.dragon.until){if(!s.dragon.spawned)addNews(s.id,`${DRAGONS[s.dragon.k].name} flew off from ${S.name}, leaving scorched roofs.`);s.dragon=null;}}
  world.bandits.forEach((b,i)=>{if(!b.spawned&&nearP(b.x,b.y,500)){b.spawned=true;for(let k=0;k<b.n;k++)spawnMob("goblin",b.x+k*14,b.y+(k%2)*14,{persist:true,bandit:i+1});}});
  for(const b of world.beasts)if(!b.spawned&&!b.dead&&nearP(b.x,b.y,500)){b.spawned=true;const m=spawnMob(b.sp,b.x,b.y,{persist:true});m.uid=uidN++;b.mob=m.uid;}
  for(const m of world.migr)if(!m.spawned&&nearP(m.x,m.y,500)){m.spawned=true;for(let k=0;k<6;k++)spawnMob(m.sp,m.x+k*20,m.y+(k%3)*16,{migr:1,mdx:0.4});}
  for(const L of LAIRS)if((world["lair_"+L.sp]||0)<=world.day&&!mobs.some(m=>m.lair===L.sp)&&nearP(L.x*TILE,L.y*TILE,420))spawnDragon(L.sp,L.x*TILE,L.y*TILE,{lair:L.sp});
  campTick();
  if(Math.hypot(hx-RUINS.x*TILE,hy-RUINS.y*TILE)<400&&!mobs.some(m=>m.ruinBoss)&&(world.ruinBoss||0)<=world.day)spawnMob("boss",RUINS.x*TILE,(RUINS.y-2)*TILE,{persist:true,ruinBoss:true});
  // regular wildlife & monster herds by region population
  const wild=mobs.filter(m=>!m.persist&&!m.dead).length;if(wild>=14)return;
  const a=Math.random()*Math.PI*2,d=230+Math.random()*120,x=hx+Math.cos(a)*d,y=hy+Math.sin(a)*d;const tx=Math.floor(x/TILE),ty=Math.floor(y/TILE);
  if(solidTile(tx,ty)||tAt(tx,ty)===DEEP||inTown(x,y)||tx<40&&ty<26)return;
  const b=biomeAt(tx,ty),pop=world.regions[regionOf(x,y)];const night=hour()>=20||hour()<5;
  const cand=Object.entries(SPECIES).filter(([k,s])=>s.biome&&s.biome.includes(b)&&(!s.night||night));if(!cand.length)return;
  const peaceful=cand.filter(([k,s])=>s.beh==="pea"||s.beh==="flee"),hostile=cand.filter(([k,s])=>!(s.beh==="pea"||s.beh==="flee"));
  const list=(Math.random()<pop*0.55&&hostile.length)?hostile:(peaceful.length?peaceful:hostile);
  const [sp,def]=pick(list);const n=def.herd?3+Math.floor(Math.random()*3):def.beh==="agg"?1+Math.floor(Math.random()*Math.min(3,1+pop*2)):1+Math.floor(Math.random()*2);
  for(let i=0;i<n;i++){const ex=x+(i%3)*16,ey=y+Math.floor(i/3)*16;if(!blocked(ex,ey,12,10))spawnMob(sp,ex,ey);}
}
function updateMob(e){
  const d=e.def;const cx=e.x+e.w/2,cy=e.y+e.h/2,hx=hero.x+6,hy=hero.y+6;const dx=hx-cx,dy=hy-cy,dist=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx);
  if(e.dead)return;
  if(e.sp==="dragon")return updateDragon(e,dist,ang);
  if(e.mon&&e.raidOf==null&&monAI(e,dist,ang))return;
  let mode=d.beh;if(mode==="neu"&&e.provoked)mode="agg";if(mode==="pea"&&e.provoked)mode="flee";
  const heroSafe=hero.dead||(hero.boat&&!e.swims);
  if(e.raidOf!=null&&!e.dead&&raiderAI(e))return;
  if(mode==="agg"&&!heroSafe&&(dist<(d.aggro||90)||e.provoked)&&dist<300){
    if(d.base){combatAI(e);return;}
    if(e.iframes>0)e.iframes--;if(e.flash>0)e.flash--;if(e.atkCd>0)e.atkCd--;
    if(e.knockT>0){moveEntity(e,e.knockVx,e.knockVy);e.knockVx*=.75;e.knockVy*=.75;e.knockT--;return;}
    if(e.lunge>0)e.lunge--;if(e.wind>0){e.wind--;if(e.wind===0){e.lunge=10;moveEntity(e,Math.cos(ang)*4,Math.sin(ang)*4);if(dist<22+e.w/3)hurtHero(e.dmg,ang);e.atkCd=50;}return;}
    moveEntity(e,Math.cos(ang)*e.spd,Math.sin(ang)*e.spd);if(dist<18+e.w/3&&e.atkCd<=0){e.wind=16;}
    e.dir=dx<0?1:2;return;}
  if(e.iframes>0)e.iframes--;if(e.flash>0)e.flash--;
  if(e.knockT>0){moveEntity(e,e.knockVx,e.knockVy);e.knockVx*=.75;e.knockVy*=.75;e.knockT--;return;}
  if(mode==="flee"&&dist<70){moveEntity(e,-Math.cos(ang)*e.spd*1.5,-Math.sin(ang)*e.spd*1.5);e.dir=dx<0?2:1;return;}
  if(e.migr){moveEntity(e,e.mdx,Math.sin(frameN*0.01+e.x)*0.1);return;}
  e.wt--;if(e.wt<=0){e.wt=90+Math.random()*150;e.wx=e.hx+(Math.random()-.5)*120;e.wy=e.hy+(Math.random()-.5)*90;if(Math.random()<0.4){e.wx=e.x;e.wy=e.y;}}
  const wx=e.wx-e.x,wy=e.wy-e.y,wl=Math.hypot(wx,wy);if(wl>3){const s=(e.spd||.5)*0.45;moveEntity(e,wx/wl*s,wy/wl*s);e.dir=wx<0?1:2;e.anim++;}
}
// ===== NPC ROUTINES =====
function npcTarget(n){const S=SETS[n.s],h=hour(),ws=world.sets[n.s];const home=doorOf(buildings[n.home]);
  if(n.cheer&&absMin()<n.cheer&&curSet&&curSet.id===n.s){const a=n.id*1.7;return{x:hero.x+Math.cos(a)*26,y:hero.y+Math.sin(a)*18};}
  if(ws.raid||ws.dragon)return{...home,inside:true};
  if(h>=22||h<6)return{...home,inside:true};
  const spot=k=>({x:(S.x+((n.id*7+k*3)%7)-3)*TILE,y:(S.y+((n.id*5+k)%5)-2)*TILE});
  if(ws.festival&&h>=10)return spot(Math.floor(frameN/1200));
  if(h<11){if(n.work!=null)return{...doorOf(buildings[n.work]),inside:h>=7};if(n.role==="farmer"&&S.farm)return{x:(S.farm.x+n.id%4)*TILE,y:(S.farm.y+1)*TILE};return spot(1);}
  const inn=S.bIdx.find(b=>buildings[b].kind==="inn");
  if(h<13)return{...doorOf(buildings[inn]),inside:true,b:inn};
  if(h<20&&n.work!=null)return{...doorOf(buildings[n.work]),inside:true};
  if(h<18){return spot(2+(h%3));}
  if(h<21){if(n.adv){const gh=S.bIdx.find(b=>buildings[b].kind==="guild");if(gh!=null)return{...doorOf(buildings[gh]),inside:true,b:gh};}return n.id%2?{...doorOf(buildings[inn]),inside:true,b:inn}:spot(5);}return{...home,inside:true,b:n.home};}
function updateNpc(n){
  if(n.adv&&n.adv.state==="travel"){const p=advWorldPos(n);if(p){n.x=p.x;n.y=p.y;n.inside=false;if(Math.hypot(n.x-hero.x,n.y-hero.y)<400&&frameN%40===0){const m=mobs.find(m=>!m.dead&&m.def&&m.def.beh==="agg"&&Math.hypot(m.x-n.x,m.y-n.y)<70);if(m){n.gest=12;m.iframes=0;if(m.sp==="dragon")hitDragon(m,0);else hurtEnemy(m,1,Math.atan2(m.y-n.y,m.x-n.x),true);}}if(n.gest>0)n.gest--;return;}}
  const t=npcTarget(n);const far=Math.hypot(n.x-hero.x,n.y-hero.y)>500;
  if(far){n.x=t.x;n.y=t.y;n.inside=!!t.inside;n.at=t.b;return;}
  const dx=t.x-n.x,dy=t.y-n.y,l=Math.hypot(dx,dy);
  if(l<3){n.inside=!!t.inside;n.at=t.b;return;}n.inside=false;n.at=null;
  if(n.pauseT>0){n.pauseT--;if(n.pauseT%40===0)n.vdir=[0,1,2,3][(n.id+n.pauseT)%4];return;}
  if(Math.random()<0.0025){n.pauseT=50+Math.floor(Math.random()*110);return;}
  const sp=(n.role==="child"?0.6:0.45)*(0.75+((n.id*37)%40)/100)*(n.age>60?0.8:1);const ox=n.x,oy=n.y;const ent={x:n.x+2,y:n.y+4,w:10,h:8,npc:true};
  let ax=dx/l,ay=dy/l;for(const o of npcs){if(o===n||!o.alive||o.inside)continue;const qx=n.x-o.x,qy=n.y-o.y;const d2=qx*qx+qy*qy;if(d2>0.01&&d2<196){const d=Math.sqrt(d2),f=(14-d)/14;ax+=qx/d*f*0.8-ay*f*0.4;ay+=qy/d*f*0.8+ax*f*0.4;}}
  const al=Math.hypot(ax,ay)||1;n.svx=(n.svx||0)*0.8+ax/al*sp*0.2;n.svy=(n.svy||0)*0.8+ay/al*sp*0.2;
  moveEntity(ent,n.svx,n.svy);n.x=ent.x-2;n.y=ent.y-4;
  if(Math.abs(n.x-ox)+Math.abs(n.y-oy)<0.1){n.stuck=(n.stuck||0)+1;if(n.stuck>40){n.x=t.x;n.y=t.y;n.stuck=0;}}else n.stuck=0;
  n.anim++;if(n.anim%10===0)n.frame^=1;n.dir=dx<0?1:2;
}
// ===== UI HELPERS =====
let toasts=[],floats=[];
function toast(t){toasts.push({t,life:180});if(toasts.length>4)toasts.shift();const el=document.getElementById("toasts");el.innerHTML=toasts.map(x=>`<div>${x.t.replace(/</g,"&lt;")}</div>`).join("");}
function floatText(x,y,t,c){if(/g$/.test(t))SFX.coin();floats.push({x,y,t,c,life:60});}
const hfURL=heartFull.toDataURL(),heURL=heartEmpty.toDataURL();
function updateHearts(){const el=document.getElementById("hearts");let s="";for(let i=0;i<hero.maxHp;i++)s+=`<img class="heart" src="${i<hero.hp?hfURL:heURL}" alt="">`;el.innerHTML=s;}
function updateHud(){if(!world)return;const h=hour(),m=world.min%60;
  document.getElementById("clock").textContent=`Day ${world.day+1} · ${SEASONS[season()]} · ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} · ${world.weather}`;
  document.getElementById("gold").textContent=`${P.gold}g · ${RANKS[P.rank]}`;
  document.getElementById("hungerFill").style.width=P.hunger+"%";
  const st=document.getElementById("stam");st.style.display=hero.stam<100?"block":"none";document.getElementById("stamFill").style.width=hero.stam+"%";if(P.mag)document.getElementById("manaFill").style.width=(P.mag.mp/P.mag.max*100)+"%";}
// minimap
const mini=document.getElementById("mini"),mg=mini.getContext("2d");
function drawMini(){mg.imageSmoothingEnabled=false;const R=40;const tx=hero.x/TILE,ty=hero.y/TILE;
  mg.fillStyle="#123";mg.fillRect(0,0,mini.width,mini.height);mg.drawImage(worldMapC,tx-R,ty-R*0.75,R*2,R*1.5,0,0,mini.width,mini.height);
  const sx=mini.width/(R*2),sy=mini.height/(R*1.5),P2=(x,y)=>[(x-tx+R)*sx,(y-ty+R*0.75)*sy];
  for(const s of SETS){const [x,y]=P2(s.x,s.y);mg.fillStyle="#ffd84a";mg.fillRect(x-2,y-2,4,4);}
  for(const w of waystones)if(w.found){const [x,y]=P2(w.x,w.y);mg.fillStyle="#5ff";mg.fillRect(x-1,y-1,3,3);}
  if(P.boat.owned){const [x,y]=P2(P.boat.x/TILE,P.boat.y/TILE);mg.fillStyle="#fff";mg.fillRect(x-2,y-1,4,2);}
  for(const m of mobs)if(!m.dead&&(m.def.beh==="agg"||m.sp==="dragon")){const [x,y]=P2(m.x/TILE,m.y/TILE);mg.fillStyle=m.sp==="dragon"?"#f0f":"#f44";mg.fillRect(x-1,y-1,2,2);}
  mg.fillStyle="#fff";mg.beginPath();mg.arc(mini.width/2,mini.height/2,2.5,0,7);mg.fill();mg.strokeStyle="#e8c060";mg.strokeRect(.5,.5,mini.width-1,mini.height-1);}
// full world map with fast travel
const mapEl=document.getElementById("mapov"),mapC=document.getElementById("mapc");
function toggleMap(){if(!mapEl.classList.contains("hidden")){mapEl.classList.add("hidden");paused=false;return;}paused=true;mapEl.classList.remove("hidden");drawFullMap();}
function drawFullMap(){const g=mapC.getContext("2d");mapC.width=WW*3;mapC.height=WH*3;g.imageSmoothingEnabled=false;g.drawImage(worldMapC,0,0,WW*3,WH*3);
  g.font="bold 11px system-ui";g.textAlign="center";
  for(const s of SETS){g.fillStyle="#ffd84a";g.fillRect(s.x*3-4,s.y*3-4,8,8);g.fillStyle="#fff";g.strokeStyle="#000";g.lineWidth=3;g.strokeText(s.name,s.x*3,s.y*3-8);g.fillText(s.name,s.x*3,s.y*3-8);
    const ws=world.sets[s.id];if(ws.raid||ws.dragon){g.fillStyle="#f33";g.fillText("⚔",s.x*3+12,s.y*3+4);}if(ws.festival){g.fillStyle="#f9f";g.fillText("✦",s.x*3-12,s.y*3+4);}}
  ISLES.forEach((I,i)=>{g.fillStyle=P.isles.includes(i)?"#bff":"#79a";g.strokeText(P.isles.includes(i)?I.name:"???",I.x*3,(I.y+I.r)*3+10);g.fillText(P.isles.includes(i)?I.name:"???",I.x*3,(I.y+I.r)*3+10);});
  for(const L of LAIRS){g.fillStyle="#f6f";g.fillText("🐉",L.x*3,L.y*3);}
  g.fillStyle="#ccc";g.fillText("Ruins",RUINS.x*3,RUINS.y*3-20);
  for(const l of LOOKOUTS){g.fillStyle="#fff";g.fillText("▲",l.x*3,l.y*3+4);}
  for(const w of world.wrecks)if(!w.looted){g.fillStyle="#fc8";g.fillText("⚓",w.x/TILE*3,w.y/TILE*3);}
  for(const w of waystones){g.fillStyle=w.found?"#5ff":"#567";g.beginPath();g.arc(w.x*3,w.y*3,w.found?6:3,0,7);g.fill();}
  if(P.boat.owned){g.fillStyle="#fff";g.fillText("⛵",P.boat.x/TILE*3,P.boat.y/TILE*3);}
  g.fillStyle="#f22";g.beginPath();g.arc(hero.x/TILE*3,hero.y/TILE*3,5,0,7);g.fill();g.strokeStyle="#fff";g.lineWidth=2;g.stroke();}
mapC.addEventListener("click",e=>{const r=mapC.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*WW,y=(e.clientY-r.top)/r.height*WH;
  for(const w of waystones)if(w.found&&Math.hypot(w.x-x,w.y-y)<5){toggleMap();travel(w);return;}});
document.getElementById("mapClose").onclick=e=>{e.stopPropagation();toggleMap();};
document.getElementById("btnMap").onclick=e=>{e.stopPropagation();if(state==="play")toggleMap();};
document.getElementById("btnBag").onclick=e=>{e.stopPropagation();if(state==="play")invMenu();};
document.getElementById("btnCrown").onclick=e=>{e.stopPropagation();if(state==="play")crownMenu();};
// ===== UPDATE =====
let spawnT=0,saveT=0,lastSet=null;
function update(){
  if(state!=="play"||paused)return;if(hitStop>0){hitStop--;if(shake>0)shake-=0.5;return;}frameN++;if(shake>0)shake=Math.max(0,shake-0.6);
  simAcc++;if(simAcc>=20){simAcc=0;advanceMinutes(1);}
  if(fishing)updateFishing();else updateHero();updateMagic();
  if(room){for(const n of npcs)if(n.alive)updateNpc(n);updateParticles();if(frameN%15===0){updateHud();}for(const f of floats){f.life--;}floats=floats.filter(f=>f.life>0);return;}
  if(++spawnT>=45){spawnT=0;spawnTick();regrow();maybeFlyer();}
  for(const e of mobs){const dd=Math.hypot(e.x-hero.x,e.y-hero.y);if(dd<450||e.sp==="dragon"&&dd<700)updateMob(e);}
  towersTick();
  mobs=mobs.filter(e=>{if(e.dead){e.flash--;return e.flash>0;}const dd=Math.hypot(e.x-hero.x,e.y-hero.y);return e.persist?dd<1600:dd<700;});
  for(const n of npcs)if(n.alive&&!(n.adv&&(P.party||[]).includes(n.id)))updateNpc(n);updateParty();updateWood();
  updateParticles();
  for(const f of flyers){f.x+=f.vx;f.y+=f.vy;f.life--;}flyers=flyers.filter(f=>f.life>0);
  for(const f of floats){f.life--;f.y-=0.3;}floats=floats.filter(f=>f.life>0);
  if(toasts.length){toasts[0].life--;if(toasts[0].life<=0){toasts.shift();document.getElementById("toasts").innerHTML=toasts.map(x=>`<div>${x.t}</div>`).join("");}}
  // ambient particles
  const {tx,ty}=heroTile();const b=biomeAt(tx,ty);const night=hour()>=20||hour()<5;
  if(b==="forest"&&Math.random()<0.15)particles.push({x:camX+Math.random()*W,y:camY-4,z:20,vx:0.3+Math.random()*.3,vy:0.4,vz:-0.05,life:200,max:200,col:hexRGB(LEAFC[season()][Math.random()<.5?0:1]),size:2,kind:"leaf"});
  if(night&&(b==="meadow"||b==="forest")&&Math.random()<0.12)particles.push({x:camX+Math.random()*W,y:camY+Math.random()*H,z:8,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,vz:.26,life:120,max:120,col:[230,255,120],size:1.5,kind:"fly"});
  if(world.weather==="snow"&&Math.random()<0.6)particles.push({x:camX+Math.random()*W,y:camY+Math.random()*H*0.2,z:30,vx:.2,vy:.6,vz:-.0,life:150,max:150,col:[255,255,255],size:1.5,kind:"snow"});
  const s=settlementAt(hero.x,hero.y);curSet=s;if(s&&s!==lastSet){guildProgress("escort",s.id);banner={t:s.name,sub:s.kind+(world.sets[s.id].festival?" · Festival!":""),life:150};tryCompleteJobs(s.id);}lastSet=s;
  if(frameN%15===0){updateHud();drawMini();if(frameN%60===0)updatePartyHud();}
  if(++saveT>=900){saveT=0;saveGame();}
}
const hexRGB=h=>[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];
// ===== DRAW =====
function drawShadow(x,y,rx,ry){ctx.fillStyle="rgba(10,0,20,.28)";ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill();}
function drawMob(e){if(e.dead&&e.flash<=0)return;
  if(e.sp==="dragon"){const im=e.img;const fly=e.fly>0?18+Math.sin(frameN*.1)*4:0;drawShadow(e.x+e.w/2,e.y+e.h,e.w*.7,6);
    if(e.flash>0)ctx.filter="brightness(2)";const flip=hero.x<e.x;ctx.save();ctx.translate(Math.floor(e.x+e.w/2),Math.floor(e.y+e.h-fly));if(!flip)ctx.scale(-1,1);ctx.drawImage(im,-im.width/2,-im.height+4);ctx.restore();ctx.filter="none";
    const bw=60;ctx.fillStyle="#200";ctx.fillRect(e.x+e.w/2-bw/2-1,e.y-48-fly,bw+2,5);ctx.fillStyle="#f43";ctx.fillRect(e.x+e.w/2-bw/2,e.y-47-fly,bw*e.hp/e.maxHp,3);
    ctx.font="bold 7px system-ui";ctx.textAlign="center";ctx.fillStyle="#ffe";ctx.fillText(e.name+" · phase "+e.phase,e.x+e.w/2,e.y-51-fly);return;}
  if(e.img){const im=e.img;drawShadow(e.x+e.w/2,e.y+e.h-1,im.width*.35,3);if(e.flash>0)ctx.filter="brightness(2)";
    const bob=Math.sin((e.anim||0)*0.25)*1;ctx.save();ctx.translate(Math.floor(e.x+e.w/2),Math.floor(e.y+e.h+bob));if(e.dir===2)ctx.scale(-1,1);ctx.drawImage(im,-im.width/2,-im.height);ctx.restore();ctx.filter="none";
    if(e.def.rare||e.provoked&&e.hp<e.maxHp){ctx.fillStyle="#300";ctx.fillRect(e.x,e.y-im.height+e.h-5,e.w,2);ctx.fillStyle="#e44";ctx.fillRect(e.x,e.y-im.height+e.h-5,e.w*e.hp/e.maxHp,2);}return;}
  drawEnemy(e);}
function drawEnemy(e){const spr=enemySprite(e);drawShadow(e.x+e.w/2,e.y+e.h-1,e.w*.4,2.5);if(e.flash>0)ctx.filter="brightness(2)";
  ctx.drawImage(spr,Math.floor(e.x-2),Math.floor(e.y-(e.type==="boss"?4:2)));ctx.filter="none";
  if(e.type==="boss"&&!e.dead){ctx.fillStyle="#200";ctx.fillRect(e.x-2,e.y-8,24,4);ctx.fillStyle="#c44";ctx.fillRect(e.x-1,e.y-7,22*(e.hp/e.maxHp),2);}}
function drawNpc(n){const s=npcSprites(n)[n.frame];const child=n.age<15;drawShadow(n.x+8,n.y+15,5,2);ctx.save();ctx.translate(Math.floor(n.x+8),Math.floor(n.y+16));if(n.dir===1)ctx.scale(-1,1);
  const sc=child?0.72:1;ctx.scale(sc,sc);ctx.drawImage(s,-8,-16);ctx.restore();
  if(n.spouse===-1||P.dating.includes(n.id)){ctx.fillStyle="#ff6a9a";ctx.font="7px system-ui";ctx.textAlign="center";ctx.fillText("♥",n.x+8,n.y-(child?0:2));}
  if(n.role==="leader"){ctx.fillStyle="#ffd84a";ctx.fillRect(n.x+6,n.y-1,4,2);}}
function drawHeroFull(){if(hero.boat){ctx.drawImage(SPR2.boat,Math.floor(hero.x-8),Math.floor(hero.y-6+Math.sin(frameN*.08)));}
  if(hero.swim){ctx.save();ctx.beginPath();ctx.rect(hero.x-4,hero.y-6,24,14);ctx.clip();drawHero();ctx.restore();
    ctx.strokeStyle="rgba(255,255,255,.7)";ctx.beginPath();ctx.ellipse(hero.x+6,hero.y+8,8+Math.sin(frameN*.2),3,0,0,7);ctx.stroke();return;}
  if(hero.boat){ctx.save();ctx.beginPath();ctx.rect(hero.x-4,hero.y-8,24,18);ctx.clip();drawHero();ctx.restore();return;}
  drawHero();if(P.king){ctx.fillStyle="#ffd84a";ctx.beginPath();ctx.moveTo(hero.x+1,hero.y-3);ctx.lineTo(hero.x+3,hero.y-7);ctx.lineTo(hero.x+6,hero.y-4);ctx.lineTo(hero.x+9,hero.y-7);ctx.lineTo(hero.x+11,hero.y-3);ctx.fill();}}
function draw(){
  ctx.setTransform(RS,0,0,RS,0,0);ctx.imageSmoothingEnabled=false;
  if(state==="intro"){drawIntro();return;}
  if(room&&world){drawRoom();return;}
  if(!world){ctx.fillStyle="#0a0a12";ctx.fillRect(0,0,W,H);return;}
  if(tileSeason!==season()){tileSeason=season();TILESET=makeTiles(tileSeason);chunkCache.clear();}
  {const now=performance.now(),dt=Math.min(50,now-(camT||now));camT=now;const tx=hero.x+6-W/2+(hero.vx||0)*16,ty=hero.y+6-H/2+(hero.vy||0)*11;
   if(camFX==null||Math.hypot(tx-camFX,ty-camFY)>260||window.__FAST){camFX=tx;camFY=ty;}else{const k=1-Math.pow(0.86,dt/16.7);camFX+=(tx-camFX)*k;camFY+=(ty-camFY)*k;}
   camX=clamp(camFX,0,PXW-W);camY=clamp(camFY,0,PXH-H);camX=Math.round(camX*RS)/RS;camY=Math.round(camY*RS)/RS;}
  ctx.save();if(shake>0)ctx.translate(Math.round((Math.random()-.5)*shake*RS)/RS,Math.round((Math.random()-.5)*shake*RS)/RS);ctx.translate(-camX,-camY);
  const c0=Math.floor(camX/256),c1=Math.floor((camX+W)/256),r0=Math.floor(camY/256),r1=Math.floor((camY+H)/256);
  for(let cy=r0;cy<=r1;cy++)for(let cx=c0;cx<=c1;cx++)ctx.drawImage(getChunk(cx,cy),cx*256,cy*256,256,256);drawGroundFX(tx0g(),ty0g());drawPeaks();
  // water shimmer & crops
  const tx0=Math.floor(camX/TILE),ty0=Math.floor(camY/TILE),tx1=tx0+Math.ceil(W/TILE)+1,ty1=ty0+Math.ceil(H/TILE)+1;
  ctx.fillStyle="rgba(255,255,255,.75)";
  for(let i=0;i<30;i++){const x=tx0+Math.floor(hash2(i,Math.floor(frameN/20),3)*(tx1-tx0)),y=ty0+Math.floor(hash2(i,Math.floor(frameN/20),4)*(ty1-ty0));if(isWater(tAt(x,y)))ctx.fillRect(x*16+hash2(i,y,1)*14,y*16+hash2(i,x,2)*14,2,1);}
  for(const S of SETS)if(S.farm&&S.farm.x+4>=tx0&&S.farm.x<=tx1&&S.farm.y+3>=ty0&&S.farm.y<=ty1){const st=world.sets[S.id].crop;if(!st)continue;
    for(let y=S.farm.y;y<S.farm.y+3;y++)for(let x=S.farm.x;x<S.farm.x+4;x++){if(tAt(x,y)!==FARM)continue;for(let k=0;k<3;k++){const px=x*16+3+k*5,py=y*16+12;ctx.fillStyle=st>=4?"#e8c040":"#5ac83a";ctx.fillRect(px,py-st*2.5,2,st*2.5);if(st>=3){ctx.fillStyle=st>=4?"#ffe070":"#8f6";ctx.fillRect(px-1,py-st*2.5-2,4,3);}}}}
  drawSplats();
  const list=[];const vis=(x,y,m)=>x>camX-m&&x<camX+W+m&&y>camY-m&&y<camY+H+m;
  for(const b of buildings)if(vis(b.x*16+32,b.y*16+24,80))list.push({y:(b.y+b.h)*16,f:()=>drawBuilding(b)});
  for(const c of CASTLES)if(vis(c.x*16+48,c.y*16,140))list.push({y:(c.y+3)*16,f:()=>drawCapCastle(c)});for(const p of BORDER_POSTS)if(vis(p.x*16,p.y*16,40))list.push({y:p.y*16+12,f:()=>drawBorderPost(p)});
  if(castleObj&&vis(castleObj.x*16+48,castleObj.y*16,140))list.push({y:(castleObj.y+3)*16,f:()=>ctx.drawImage(SPR2.castle,castleObj.x*16,(castleObj.y+3)*16-88,96,88)});
  for(const w of waystones)if(vis(w.x*16,w.y*16,40))list.push({y:w.y*16+16,f:()=>{ctx.drawImage(SPR2.way[w.found?1:0],w.x*16+2,w.y*16-8);if(w.found){ctx.globalCompositeOperation="lighter";ctx.fillStyle=`rgba(80,255,255,${.15+.1*Math.sin(frameN*.05)})`;ctx.beginPath();ctx.arc(w.x*16+8,w.y*16+2,8,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";}}});
  for(const o of objects)if(vis(o.x*16,o.y*16,40))list.push({y:o.y*16+16,f:()=>{if(o.type==="lookout")return drawLookout(o);ctx.drawImage(o.type==="board"?SPR2.board:SPR2.chest[world.opened[o.id]?1:0],o.x*16,o.y*16);}});
  for(const p of PROPS)if(vis(p.x*16,p.y*16,70))list.push({y:p.y*16+14,f:()=>drawProp(p)});
  drawWallsList(list,vis);
  for(const w of world.wrecks)if(!w.looted&&vis(w.x,w.y,60))list.push({y:w.y+20,f:()=>ctx.drawImage(SPR2.wreck,w.x,w.y)});
  for(const c of world.caravans){const A=SETS[c.from],B=SETS[c.to];const x=(A.x+(B.x-A.x)*c.t)*16,y=(A.y+(B.y-A.y)*c.t)*16;if(vis(x,y,40))list.push({y:y+16,f:()=>ctx.drawImage(SPR2.cart,x,y)});}
  if(P.boat.owned&&!hero.boat&&vis(P.boat.x,P.boat.y,40))list.push({y:P.boat.y+20,f:()=>ctx.drawImage(SPR2.boat,Math.floor(P.boat.x),Math.floor(P.boat.y+Math.sin(frameN*.06)))});
  drawWoodList(list,vis);
  for(const n of npcs)if(n.alive&&!n.inside&&vis(n.x,n.y,30))list.push({y:n.y+16,f:()=>drawNpc(n)});
  for(const e of mobs)if(vis(e.x,e.y,90))list.push({y:e.y+e.h,f:()=>drawMob(e)});
  list.push({y:hero.y+12,f:drawHeroFull});
  list.sort((a,b)=>a.y-b.y);for(const it of list)it.f();drawCanopies();drawFallers();drawTorches();drawQuestMarkers();
  drawParts();drawProjectiles();drawMagic();
  for(const p of particles){ctx.globalAlpha=Math.min(1,p.life/15);if(p.kind==="fly"){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.5+.5*Math.sin(p.life*.2);}
    ctx.fillStyle=`rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;ctx.fillRect(p.x-p.size/2,p.y-p.z-p.size/2,p.size,p.size);ctx.globalCompositeOperation="source-over";
    if(p.kind==="leaf"||p.kind==="snow"){p.vx=p.kind==="leaf"?Math.sin(p.life*.05)*.5+.3:.2;if(p.z<1)p.z=1;}}
  ctx.globalAlpha=1;
  // fire on burning buildings
  for(const b of buildings)if(world.bld[b.id].burn>0&&vis(b.x*16,b.y*16,60)){for(let i=0;i<3;i++)particles.push({x:b.x*16+8+Math.random()*48,y:b.y*16+30,z:Math.random()*20,vx:(Math.random()-.5)*.3,vy:-.2,vz:.6,life:30,max:30,col:pick([[255,120,30],[255,200,60],[200,50,20]]),size:2+Math.random()*2,kind:"spark"});}
  // festival lanterns
  for(const S of SETS)if(world.sets[S.id].festival&&vis(S.x*16,S.y*16,200)){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const x=S.x*16+8+Math.cos(a)*56,y=S.y*16+Math.sin(a)*36-10;
    ctx.fillStyle=["#f55","#fd4","#5df","#f7f"][i%4];ctx.beginPath();ctx.arc(x,y+Math.sin(frameN*.05+i)*1.5,2.5,0,7);ctx.fill();}}
  // flying dragon shadows overhead
  for(const f of flyers){const im=IMG["dragon_"+f.k];drawShadow(f.x,f.y+60,30,8);if(im){ctx.save();ctx.translate(f.x,f.y+Math.sin(frameN*.05)*4);if(f.vx>0)ctx.scale(-1,1);ctx.globalAlpha=.95;ctx.scale(1,1+Math.sin(frameN*.18)*.08);ctx.drawImage(im,-im.width/4,-im.height/4,im.width/2,im.height/2);ctx.restore();ctx.globalAlpha=1;}}
  for(const f of floats){ctx.globalAlpha=Math.min(1,f.life/20);ctx.font="bold 8px system-ui";ctx.textAlign="center";ctx.fillStyle="#000";ctx.fillText(f.t,f.x+7,f.y+1);ctx.fillStyle=f.c;ctx.fillText(f.t,f.x+6,f.y);}ctx.globalAlpha=1;
  // night lights (in world space)
  const dk=darkness();if(dk>0.15){ctx.globalCompositeOperation="lighter";for(const b of buildings)if(vis(b.x*16,b.y*16,60)){const x=b.x*16+32,y=(b.y+b.h)*16-14;const g=ctx.createRadialGradient(x,y,2,x,y,40);g.addColorStop(0,`rgba(255,190,90,${dk*.45})`);g.addColorStop(1,"rgba(255,150,50,0)");ctx.fillStyle=g;ctx.fillRect(x-40,y-40,80,80);}
    ctx.globalCompositeOperation="source-over";}
  ctx.restore();
  // screen space: tint, weather, vignette
  const h=world.min/60;let tint=null;
  if(h<5||h>=21)tint=`rgba(20,25,80,${0.5*dk/0.6})`;else if(h<7)tint=`rgba(255,140,80,${0.18*(7-h)/2})`;else if(h>=18)tint=h<20?`rgba(255,110,60,${0.12+0.1*(h-18)})`:`rgba(40,30,100,${dk*0.8})`;
  if(tint){ctx.fillStyle=tint;ctx.fillRect(0,0,W,H);}
  if(dk>0.15){ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(hero.x+6-camX,hero.y+6-camY,4,hero.x+6-camX,hero.y+6-camY,60);g.addColorStop(0,`rgba(255,220,150,${dk*.3})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="source-over";}
  const wth=world.weather;if(wth==="rain"||wth==="storm"){ctx.strokeStyle="rgba(180,200,255,.45)";ctx.beginPath();for(let i=0;i<(wth==="storm"?90:50);i++){const x=(hash2(i,frameN>>1,8)*W),y=(hash2(i,frameN>>1,9)*H);ctx.moveTo(x,y);ctx.lineTo(x-3,y+8);}ctx.stroke();
    ctx.fillStyle="rgba(30,40,70,.18)";ctx.fillRect(0,0,W,H);if(wth==="storm"&&frameN%400<4){ctx.fillStyle="rgba(255,255,255,.6)";ctx.fillRect(0,0,W,H);}}
  drawClouds();
  if(wth==="fog"){ctx.fillStyle="rgba(220,225,235,.28)";ctx.fillRect(0,0,W,H);}
  const vg=ctx.createRadialGradient(W/2,H/2,H*0.45,W/2,H/2,W*0.7);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(20,0,30,.45)");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(banner&&banner.life>0){banner.life--;ctx.globalAlpha=Math.min(1,banner.life/30);ctx.textAlign="center";ctx.font="bold 20px Georgia,serif";ctx.fillStyle="#2a1008";ctx.fillText(banner.t,W/2+1,52);ctx.fillStyle="#ffe08a";ctx.fillText(banner.t,W/2,51);
    ctx.font="italic 9px Georgia,serif";ctx.fillStyle="#fff4d0";ctx.fillText(banner.sub,W/2,63);ctx.strokeStyle="#e8c060";ctx.beginPath();ctx.moveTo(W/2-70,56);ctx.lineTo(W/2+70,56);ctx.stroke();ctx.globalAlpha=1;}
  if(fishing){ctx.font="bold 12px system-ui";ctx.textAlign="center";ctx.fillStyle=fishing.t>=fishing.bite?"#ff5":"#fff";ctx.fillText(fishing.t>=fishing.bite?"!!! BITE — press A":"~ fishing ~",hero.x+6-camX,hero.y-12-camY);}
  const hint=interactHint();if(hint){ctx.font="bold 8px system-ui";ctx.textAlign="center";const tw=ctx.measureText(hint).width+8;ctx.fillStyle="rgba(20,10,30,.7)";ctx.fillRect(hero.x+6-camX-tw/2,hero.y-camY-20,tw,11);ctx.fillStyle="#ffe8a0";ctx.fillText(hint,hero.x+6-camX,hero.y-camY-12);}
}
function interactHint(){if(frameN%10!==0&&interactHint.c!==undefined)return interactHint.c;let h=null;
  if(hero.boat)h=null;else if(npcs.some(n=>n.alive&&!n.inside&&near(n.x+6,n.y+6,20)))h="A: Talk";else if(P.boat.owned&&near(P.boat.x+14,P.boat.y+18,26))h="A: Board boat";
  else if(buildings.some(b=>{const d=doorOf(b);return near(d.x+4,d.y-2,16);}))h=doorLocked(buildings.find(b=>{const d=doorOf(b);return near(d.x+4,d.y-2,16);}))?"🔒 Locked":"A: Enter";else if(waystones.some(w=>near(w.x*TILE+8,w.y*TILE+8,22)))h="A: Waystone";
  else if(objects.some(o=>near(o.x*TILE+8,o.y*TILE+8,22)))h=objects.find(o=>near(o.x*TILE+8,o.y*TILE+8,22)).type==="lookout"?"A: Look out":"A: Open";else if(tAt(heroTile().tx,heroTile().ty)===CLIFF)h="↑ Climb (stamina) · ↓ Jump down";return interactHint.c=h;}
function darkness(){const h=world.min/60;if(h>=21||h<4)return .6;if(h>=19)return (h-19)/2*.6;if(h<6)return (6-h)/2*.6;return 0;}
function drawBuilding(b){ctx.fillStyle="rgba(30,15,10,.25)";ctx.beginPath();ctx.ellipse(b.x*16+32+4,(b.y+b.h)*16+2,36,7,0,0,7);ctx.fill();const s0=buildingSprite(b);const s={width:s0.lw,height:s0.lh};const x=b.x*16,y=(b.y+b.h)*16-s.height;ctx.drawImage(s0,x,y,s.width,s.height);const st=world.bld[b.id];
  if(st.dmg>0.05){ctx.globalAlpha=Math.min(.8,st.dmg);ctx.fillStyle="#1a0e0a";for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(x+8+hash2(b.id,i,1)*48,y+8+hash2(b.id,i,2)*40,6,4,0,0,7);ctx.fill();}
    ctx.strokeStyle="#3a2010";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+10,y+20);ctx.lineTo(x+24,y+30);ctx.moveTo(x+44,y+14);ctx.lineTo(x+54,y+26);ctx.stroke();ctx.lineWidth=1;ctx.globalAlpha=1;}
  if(darkness()>0.15){ctx.globalCompositeOperation="lighter";ctx.fillStyle=`rgba(255,200,100,${darkness()*.6})`;ctx.fillRect(x+8,y+s.height-22,10,9);ctx.fillRect(x+s.width-18,y+s.height-22,10,9);ctx.globalCompositeOperation="source-over";}}
// ===== START =====
function beginPlay(){state="play";document.getElementById("overlay").classList.add("hidden");document.getElementById("hudWrap").classList.remove("hidden");
  magicInit();updateSpellBtn();for(const s of world.sets)if(!s.jobs.length)genJobs(s);if(P.house>=0)buildings[P.house].owned=true;P.homes=P.homes||(P.house>=0?[P.house]:[]);for(const id of P.homes)if(buildings[id])buildings[id].owned=true;if(typeof applyOutfit==="function")applyOutfit();
  if(P.boarded){hero.boat=true;}updateHearts();updateHud();drawMini();checkRank();}
function newGame(){newWorld();resetHero();magicInit();P.boat.x=piers[0].bx-14;P.boat.y=piers[0].by-18;if(!localStorage.getItem("realmIntroSeen"))startIntro();else{hero.x=(castleObj.x+2.6)*TILE;hero.y=(castleObj.y+3.4)*TILE;beginPlay();toast("A new life begins. Go wherever you like!");saveGame();}}
document.getElementById("startBtn").addEventListener("click",()=>newGame());
document.getElementById("contBtn").addEventListener("click",()=>{if(loadGame())beginPlay();});
let last=performance.now(),acc=0;const STEP=1000/60;
function loop(now){audioUpdate();const fd=Math.min(100,now-last);acc+=fd;last=now;framePace(fd);let n=0;while(acc>=STEP&&n<5){snapPrev();update();acc-=STEP;n++;}if(n>=5)acc=0;interpOn(acc/STEP);try{draw();}finally{interpOff();}requestAnimationFrame(loop);}
window.addEventListener("pagehide",saveGame);document.addEventListener("visibilitychange",()=>{if(document.hidden)saveGame();});
// init
