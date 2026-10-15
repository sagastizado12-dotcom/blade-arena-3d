// ===== HERO =====

function resetHero(){hero={x:SETS[0].x*TILE,y:(SETS[0].y+2)*TILE,w:12,h:12,vx:0,vy:0,dir:0,frame:0,anim:0,hp:6,maxHp:6,swinging:-1,swingT:0,iframes:0,knockT:0,knockVx:0,knockVy:0,dodgeT:0,dodgeCd:0,dead:false,stam:100,boat:false,shore:{x:0,y:0}};
  hero.shore={x:hero.x,y:hero.y};}
let atkPressed=false,dodgePressed=false,camX=0,camY=0,frameN=0,banner=null,curSet=null,paused=false;
function getMoveInput(){let mx=0,my=0;if(keys.ArrowLeft||keys.KeyA)mx-=1;if(keys.ArrowRight||keys.KeyD)mx+=1;if(keys.ArrowUp||keys.KeyW)my-=1;if(keys.ArrowDown||keys.KeyS)my+=1;
  if(touch.active){const l=Math.hypot(touch.dx,touch.dy);if(l>6){const mg=Math.min(1,0.25+(l-6)/36);mx+=touch.dx/l*mg;my+=touch.dy/l*mg;}}const l=Math.hypot(mx,my);if(l>1){mx/=l;my/=l;}return{mx,my};}
function wantAttack(){const k=keys.KeyJ||keys.Space||touch.a||latch.KeyJ||latch.Space;latch.KeyJ=latch.Space=false;if(k&&!atkPressed){atkPressed=true;return true;}if(!k)atkPressed=false;return false;}
function wantDodge(){return false;const k=keys.KeyK||touch.b||latch.KeyK;latch.KeyK=false;if(k&&!dodgePressed){dodgePressed=true;return true;}if(!k)dodgePressed=false;return false;}
function hurtHero(dmg,ang){if(hero.iframes>0||hero.dodgeT>0||hero.dead)return;SFX.hurt();hero.hp-=dmg;hero.iframes=40;hero.knockT=10;hero.knockVx=Math.cos(ang)*3;hero.knockVy=Math.sin(ang)*3;shake=6;
  spray(hero.x+6,hero.y+6,bloodOn?6:4,ang,1);updateHearts();if(hero.hp<=0){hero.dead=true;hero.hp=0;setTimeout(respawn,900);}}
function respawn(){const lost=Math.floor(P.gold*0.1);P.gold-=lost;hero.dead=false;hero.hp=hero.maxHp;hero.boat=false;P.boarded=false;hero.x=P.respawn.x;hero.y=P.respawn.y;hero.iframes=90;hero.stam=100;
  updateHearts();toast(`You wake up safely. Lost ${lost}g.`);}
const heroTile=()=>({tx:Math.floor((hero.x+6)/TILE),ty:Math.floor((hero.y+8)/TILE)});
function facingPoint(d){const dirs=[[0,1],[-1,0],[1,0],[0,-1]];const [dx,dy]=dirs[hero.dir];return{x:hero.x+6+dx*d,y:hero.y+6+dy*d};}
function updateHero(){
  if(hero.dead)return;if(room)return roomUpdate();
  if(hero.iframes>0)hero.iframes--;if(hero.dodgeCd>0)hero.dodgeCd--;
  const {tx,ty}=heroTile();const t=tAt(tx,ty);const swim=!hero.boat&&t===DEEP;hero.swim=swim;
  if(hero.knockT>0){moveEntity(hero,hero.knockVx,hero.knockVy);hero.knockVx*=.8;hero.knockVy*=.8;hero.knockT--;return;}
  if(hero.dodgeT>0){const f=0.35+0.9*(hero.dodgeT/(hero.dodgeMax||12));slideMove(hero,hero.knockVx*f,hero.knockVy*f);hero.dodgeT--;hero.vx=hero.knockVx*f*.5;hero.vy=hero.knockVy*f*.5;if(hero.atkBuf>0)hero.atkBuf--;return;}
  if(hero.atkBuf>0)hero.atkBuf--;if(hero.comboT>0)hero.comboT--;else hero.combo=0;
  if(hero.swinging>=0){hero.swingT++;if(hero.swingT%3===0)hero.swinging++;if(hero.swinging>4){hero.swinging=-1;hero.swingT=0;
      if(hero.atkBuf>0&&hero.combo<2){hero.atkBuf=0;hero.combo++;hero.comboT=30;hero.swinging=0;hero.swingT=0;hero.hitSet=new Set();SFX.swing();const d=[[0,1],[-1,0],[1,0],[0,-1]][hero.dir];if(hero.combo===2){hero.vx=d[0]*2.2;hero.vy=d[1]*2.2;}}else{hero.comboT=hero.combo<2?18:0;if(hero.combo>=2)hero.combo=0;}}
    else{if(hero.swinging===1&&hero.swingT===3)chopCheck();const hb=swordHitbox();if(hb)for(const e of mobs){if(e.dead||e.iframes>0)continue;if(aabb(hb,e)){const fin=hero.combo===2;if(e.sp==="dragon")hitDragon(e,hb.ang);else{hurtEnemy(e,swordDmg()+(fin?1:0),hb.ang,true);if(fin){e.knockVx*=1.6;e.knockVy*=1.6;}}hitStop=fin?6:3;shake=fin?3:1.5;}}}}
  // swimming stamina
  if(swim){hero.stam-=world.weather==="storm"?0.2:0.12;if(hero.stam<=0){hero.stam=100;hero.iframes=0;hurtHero(1,0);hero.knockT=0;if(!hero.dead){hero.x=hero.shore.x;hero.y=hero.shore.y;toast("Exhausted! You wash up on shore.");}return;}}
  else if(t!==CLIFF){if(!hero.sprinting)hero.stam=Math.min(100,hero.stam+0.8);if(!hero.boat&&!isWater(t)&&t!==PIER){hero.shore.x=hero.x;hero.shore.y=hero.y;}}
  const {mx,my}=getMoveInput();
  if(!swim&&!hero.boat&&wantDodge()&&hero.dodgeCd<=0&&hero.swinging<0){const dx=mx||[0,-1,1,0][hero.dir],dy=my||[1,0,0,-1][hero.dir],l=Math.hypot(dx,dy)||1;
    hero.dodgeT=14;hero.dodgeMax=14;hero.dodgeCd=34;hero.iframes=Math.max(hero.iframes,16);hero.knockVx=dx/l*3;hero.knockVy=dy/l*3;hero.rollDir=dx<0?-1:1;
    for(let i=0;i<5;i++)particles.push({x:hero.x+6,y:hero.y+10,z:0,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,vz:.5,life:15,max:15,col:C.dust,size:2,kind:"spark"});return;}
  if(wantAttack()){if(hero.swinging<0){if(!interact()&&!swim&&!hero.boat){if(hero.comboT>0&&hero.combo<2)hero.combo++;else hero.combo=0;hero.comboT=30;hero.swinging=0;hero.swingT=0;SFX.swing();}}else hero.atkBuf=12;}
  let spd=hero.boat?(P.boat.raft?1.6:2.3):swim?0.75:(t===ROAD||t===COBBLE||t===STAIRS?1.35:1.15);if(P.gear&&P.gear.swift&&!hero.boat)spd*=1.12;
  {const want=(keys.ShiftLeft||keys.ShiftRight||touch.b)&&!hero.boat&&(mx||my)&&t!==CLIFF;if(!want)hero.sprintLock=false;if(hero.stam<=1&&!swim)hero.sprintLock=true;
   hero.sprinting=want&&!hero.sprintLock&&hero.stam>0;if(hero.sprinting){spd*=swim?1.8:1.6;hero.stam=Math.max(0,hero.stam-(swim?0.3:0.55));if(!swim&&frameN%8===0)particles.push({x:hero.x+6,y:hero.y+12,z:0,vx:-(hero.vx||0)*.2,vy:0,vz:.3,life:16,max:16,col:[200,180,150],size:2});}}
  if(t===CLIFF&&!hero.boat){if(my<0){spd=0.45;hero.stam-=0.35;hero.climb=true;if(hero.stam<=0){hero.stam=0;hero.knockT=14;hero.knockVx=0;hero.knockVy=2.2;hero.jumpT=14;toast("You lose your grip and slide down!");return;}}
    else if(my>0){spd=2.2;if(!hero.jumpT){hero.jumpT=16;}}}else hero.climb=false;
  if(hero.jumpT>0)hero.jumpT--;
  {const tvx=mx*spd,tvy=my*spd,k=(mx||my)?(hero.boat?0.08:0.25):(hero.boat?0.04:0.3);hero.vx=(hero.vx||0)+(tvx-(hero.vx||0))*k;hero.vy=(hero.vy||0)+(tvy-(hero.vy||0))*k;
    if(Math.abs(hero.vx)<0.02)hero.vx=0;if(Math.abs(hero.vy)<0.02)hero.vy=0;const vx=hero.vx,vy=hero.vy,moving=Math.hypot(vx,vy)>0.12;
    if(vx||vy){if(hero.boat){const nx=hero.x+vx,ny=hero.y+vy;const sx=Math.sign(vx),sy=Math.sign(vy);const ntx=Math.floor((nx+6+sx*6)/TILE),nty=Math.floor((ny+8+sy*6)/TILE);const nt=tAt(ntx,nty);
        if((mx||my)&&!isWater(nt)&&!solidTile(ntx,nty)){disembark(ntx,nty);hero.vx=hero.vy=0;}else moveEntity(hero,vx,vy);P.boat.x=hero.x-8;P.boat.y=hero.y-6;}
      else slideMove(hero,vx,vy);}
    if(moving){hero.anim++;if(hero.anim%(hero.sprinting?3:6)===0){hero.frame^=1;if(hero.frame){if(hero.boat){if(hero.anim%24===0)SFX.boat();}else if(swim)SFX.swim();}}}
    if(mx||my){hero.dir=dir4(mx,my,hero.dir);}
    if(swim&&moving&&frameN%12===0)particles.push({x:hero.x+6,y:hero.y+10,z:0,vx:0,vy:0,vz:0,life:20,max:20,col:[220,240,255],size:2,kind:"spark"});}
  // cave / dungeon
  if(t===CAVE&&!hero.boat){if(tx<60){hero.x=CAVE_POS.x*TILE+2;hero.y=(CAVE_POS.y+1)*TILE+4;toast("You climb back out into the daylight.");}
    else{hero.x=(DUNGEON.x+2)*TILE+2;hero.y=(DUNGEON.y+DUNGEON.h-3)*TILE;toast("You descend into the Stormcrag depths...");enterDungeon();}}
  // isles discovered
  ISLES.forEach((I,i)=>{if(!P.isles.includes(i)&&Math.hypot(tx-I.x,ty-I.y)<I.r){P.isles.push(i);toast("Discovered "+I.name+"!");addNews(-1,"The wanderer set foot on "+I.name+".");checkRank();}});
}
function hitDragon(e,ang){if(e.iframes>0)return;e.hp-=e._spell?1:swordDmg();e._spell=0;e.iframes=12;e.flash=6;shake=4;spray(e.x+e.w/2,e.y+e.h/2,bloodOn?8:5,ang,1.5);addSplat(e.x+e.w/2,e.y+e.h/2);
  if(e.fly>0)return;const r=Math.random();const order=["wings","tail","horns"];for(const p of order)if(e.parts[p]&&r<0.18){severDragon(e,p,ang);break;}
  if(e.hp<=0){e.dead=true;e.flash=12;kills++;onKill(e);for(let i=0;i<20;i++)spray(e.x+e.w/2,e.y+e.h/2,2,Math.random()*7,1);}}
function disembark(tx,ty){hero.boat=false;P.boarded=false;hero.x=tx*TILE+2;hero.y=ty*TILE+2;toast("You step ashore. The boat waits here.");}
function board(){hero.boat=true;P.boarded=true;hero.x=P.boat.x+8;hero.y=P.boat.y+6;toast("All aboard! Sail the seas.");}
let dungeonSpawned=false;
function enterDungeon(){if(dungeonSpawned||P.dungeon)return;dungeonSpawned=true;const D=DUNGEON;
  for(let i=0;i<4;i++)spawnMob(["mummy","skeleton","heximp","evileye"][i],(D.x+8+i*4)*TILE,(D.y+8)*TILE,{persist:true,dun:true});
  spawnMob("demonlord",(D.x+22)*TILE,(D.y+5)*TILE,{persist:true,dun:true,dunBoss:true});}
function onKill(e){
  rigDeath(e,Math.atan2(e.y-hero.y,e.x-hero.x));
  const d=e.def||{};P.kills++;if(d.gold){const g=d.gold[0]+Math.floor(Math.random()*(d.gold[1]-d.gold[0]+1));P.gold+=g;floatText(e.x,e.y,"+"+g+"g","#ffe060");}
  killDrops(e);try{for(const j of guild().active)if(j.t==="huntsp"&&j.sp===e.sp)j.have=(j.have||0)+1;}catch(_){}partyShare(d.gold?d.gold[0]:0);
  if(e.stolen){if(e.stolen==="gold")P.gold+=e.stolenGold;else P.inv[e.stolen]=(P.inv[e.stolen]||0)+1;toast("You got your stolen goods back!");}
  if(e.chiefOf){world["camp_"+e.chiefOf]=world.day+7;guildProgress("camp");addNews(-1,"An orc warchief has fallen! The war camp is broken.");}
  const r=regionOf(e.x,e.y);world.regions[r]=Math.max(0.1,world.regions[r]-0.03);
  for(const j of P.jobs)if(j.t==="hunt"&&d.beh!=="pea"&&d.beh!=="flee"&&Math.hypot(e.x/TILE-SETS[j.s].x,e.y/TILE-SETS[j.s].y)<60)j.have=(j.have||0)+1;
  if(d.rare){P.beastsSlain++;addNews(-1,`The rare ${e.sp} has been slain!`);const b=world.beasts.find(b=>b.mob===e.uid);if(b)b.dead=true;}
  if(e.sp==="dragon"){world.dragonsSlain++;addNews(-1,`${e.name} the dragon has fallen! Bards are already singing.`);toast(`You slew ${e.name}!`);const L=LAIRS.find(l=>l.sp===e.dk);if(L)world["lair_"+L.sp]=world.day+14;
    for(const s of world.sets)if(s.dragon&&s.dragon.k===e.dk)s.dragon=null;guildProgress("dragon");if(e.town!=null){P.raidsDefended++;heroicDeed(e.town,"dragon");}}
  if(d.beh==="agg")guildProgress("hunt");
  if(e.dunBoss){P.dungeon=true;addNews(-1,"The Stormcrag dungeon has been cleared!");toast("Dungeon cleared!");}
  if(e.bandit){const b=world.bandits[e.bandit-1];if(b)b.n--;}
  if(e.raidOf!=null){const s=world.sets[e.raidOf];if(s.raid){s.raid.n--;if(s.raid.n<=0)endRaid(s,true);}}
  checkRank();
}
// ===== INTERACTION =====
function near(px,py,r){return Math.hypot(hero.x+6-px,hero.y+6-py)<r;}
function interact(){
  if(hero.boat)return false;
  if(P.boat.owned&&near(P.boat.x+14,P.boat.y+18,26)){board();return true;}
  for(const n of npcs)if(n.alive&&!n.inside&&near(n.x+6,n.y+6,20)){talk(n);return true;}
  for(const b of buildings){const d=doorOf(b);if(near(d.x+4,d.y-2,16)){if(b.kind==="harbor"||world.bld[b.id].dmg>0.05&&b.kind==="house")buildingMenu(b);else enterBuilding(b);return true;}}
  {const cf=campfireNear();if(cf){showMenu("Campfire","The fire crackles warmly.",[{l:"Rest by the fire (2h)",f:()=>fadeBlack("You rest by the fire...",()=>{advanceMinutes(120);hero.hp=Math.min(hero.maxHp,hero.hp+2);updateHearts();P.respawn={x:cf.x,y:cf.y+8};})},
    {l:"Cook meat",dis:!(P.inv.meat>0),f:()=>{P.inv.meat--;P.inv.pie=(P.inv.pie||0)+0;P.hunger=Math.min(100,P.hunger+45);hero.hp=Math.min(hero.maxHp,hero.hp+1);updateHearts();toast("A hearty roast!");}},{l:"Leave"}]);return true;}}
  if(castleObj&&near((castleObj.x+3)*TILE,(castleObj.y+3)*TILE,24)){enterBuilding({kind:"castle",id:-5,s:0});return true;}
  for(const w of waystones)if(near(w.x*TILE+8,w.y*TILE+8,22)){waystoneMenu(w);return true;}
  for(const o of objects){if(!near(o.x*TILE+8,o.y*TILE+8,22))continue;if(o.type==="board"){boardMenu(o.s);return true;}
    if(o.type==="lookout"){if(!P.looks)P.looks=[];const fresh=!P.looks.includes(o.id);if(fresh)P.looks.push(o.id);
      const ws=waystones.slice().sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)).slice(0,2);ws.forEach(w=>w.found=true);
      toast(fresh?"From the peak you see for miles! Nearby waystones attuned.":"A breathtaking view.");if(fresh){P.gold+=15;}toggleMap();return true;}
    if(o.type==="chest"){if(world.opened[o.id])toast("Empty.");else{world.opened[o.id]=1;let s=[];for(const k in o.loot){if(k==="tome"){learnTome(o.loot[k]);s.push("a spell tome");continue;}if(k==="gold")P.gold+=o.loot[k];else P.inv[k]=(P.inv[k]||0)+o.loot[k];s.push(o.loot[k]+" "+(k==="gold"?"gold":ITEMS[k].n));}
      toast("Treasure! "+s.join(", "));saveGame();}return true;}}
  for(const w of world.wrecks)if(!w.looted&&near(w.x+20,w.y+10,30)){w.looted=true;P.gold+=35;P.inv.pearl=(P.inv.pearl||0)+1;P.inv.fish=(P.inv.fish||0)+2;toast("Salvaged the wreck: 35g, a pearl and fish.");return true;}
  for(const s of world.sets)for(const b of SETS[s.id].bIdx)if(world.bld[b].burn>0){const B=buildings[b];if(near((B.x+2)*TILE,(B.y+2)*TILE,40)){world.bld[b].burn=0;for(const n of npcs)if(n.s===s.id)n.friend=Math.min(100,n.friend+3);addNews(s.id,"The wanderer helped put out a fire in "+SETS[s.id].name+".");toast("You doused the fire! The townsfolk cheer.");return true;}}
  const f=facingPoint(14),ftx=Math.floor(f.x/TILE),fty=Math.floor(f.y/TILE),ft=tAt(ftx,fty);
  if((ft===BUSH||ft===FLOWER)&&!hero.swim){const i=fty*WW+ftx;const got=ft===BUSH?(season()<3?"berry":"herb"):"herb";P.inv[got]=(P.inv[got]||0)+(ft===BUSH?2:1);
    world.harvested[i]={o:ft,r:ft===BUSH?FOREST:GRASS,until:world.day+3};T[i]=ft===BUSH?FOREST:GRASS;invalidateTile(ftx,fty);floatText(hero.x,hero.y-6,"+"+ITEMS[got].n,"#cfc");return true;}
  if(isWater(ft)&&!hero.swim&&!mobs.some(m=>!m.dead&&m.def.beh==="agg"&&Math.hypot(m.x-hero.x,m.y-hero.y)<100)){startFishing();return true;}
  return false;
}
let fishing=null;
function startFishing(){fishing={t:0,bite:60+Math.floor(Math.random()*120),done:false};toast("You cast your line... press A when it bites!");}
function updateFishing(){if(!fishing)return;fishing.t++;const a=keys.KeyJ||keys.Space||touch.a||latch.KeyJ||latch.Space;latch.KeyJ=latch.Space=false;
  if(fishing.t>5&&a&&!atkPressed){atkPressed=true;if(fishing.t>=fishing.bite&&fishing.t<fishing.bite+45){P.inv.fish=(P.inv.fish||0)+1;floatText(hero.x,hero.y-8,"+Fish!","#9ef");}else toast("Too soon... it got away.");fishing=null;return;}
  if(!a)atkPressed=false;if(fishing.t>fishing.bite+45){toast("The fish escaped.");fishing=null;}
  if(getMoveInput().mx||getMoveInput().my)fishing=null;}
function regrow(){for(const k in world.harvested){const h=world.harvested[k];if(world.day>=h.until){const i=+k;T[i]=h.o;invalidateTile(i%WW,(i/WW)|0);delete world.harvested[k];}}}
// ===== NPC TALK =====
function dialogLines(n){
  const S=SETS[n.s],ws=world.sets[n.s],name=P.king?"Your Majesty":P.rank>=3?RANKS[P.rank]:n.met?"friend":"traveler";const L=[];
  if(!n.met)L.push(`Hello, ${name}. I'm ${title(n)}${n.name} of ${S.name}.`);
  else if(n.friend>70)L.push(pick([`${name}! Always a joy to see you.`,`There you are! I was just thinking about you, ${name}.`]));
  else L.push(pick([`Good to see you again, ${name}.`,`Oh, it's you! How have you been?`,`Back again, ${name}?`]));
  if(P.titles&&P.titles.length){const mine=P.titles.find(t=>t.endsWith(S.name));L.push(mine?`You're the ${mine}! Our whole town owes you everything.`:`They say you're the ${pick(P.titles)}. Incredible!`);}
  if(P.guild&&P.guild.reg&&P.guild.rank>=3)L.push(`A ${GRANKS[P.guild.rank]}-rank adventurer! It's an honor.`);
  if(ws.raid)L.push("Monsters are attacking! Please, drive them off!");
  if(ws.dragon)L.push(`The dragon ${DRAGONS[ws.dragon.k].name}! Run, or fight it if you dare!`);
  if(ws.festival)L.push(pick(["Isn't the festival wonderful? Try the pies!","Music, lanterns, dancing... I love festival days."]));
  const rec=world.news.filter(x=>x.d>=world.day-3&&x.s!==n.s&&x.s>=0);if(rec.length&&Math.random()<0.7)L.push("Did you hear? "+pick(rec).t);
  const loc=world.news.find(x=>x.s===n.s&&x.d>=world.day-4);if(loc)L.push("Around here: "+loc.t);
  if(n.adv){const a=n.adv;L.splice(1,0,`I am a level ${a.lvl} ${a.cls}, ${GRANKS[a.rank]}-rank${a.team?" of the "+a.team:""}. ${a.state==="travel"?"Off on a job right now!":(P.party||[]).includes(n.id)?"Lead on, I have got your back.":"Looking for work... or a drink."}`);}
  const role={adventurer:["The guild board had a dragon job yesterday. Someone grabbed it fast.","Monster parts sell well in Saltmere."],leader:[`${S.name} needs capable folk. Check the notice board for work.`,"I keep this place running. It isn't easy."],innkeeper:["A warm bed and a hot meal, always ready.","Travelers bring the best stories."],
    shopkeeper:[`Prices are ${ws.price>1.15?"high lately, sorry":ws.price<0.9?"great this week":"fair as ever"}.`,"Bring me pelts and gems, I pay well."],guard:["Bandits on the roads lately. Stay sharp.","I patrol until sunset."],
    smith:["A good blade is worth more than gold.","Dragon scale... now that I'd love to work with."],fisher:["The fish bite best at dawn.","Cast near the shore and wait for the tug."],farmer:[["Spring planting is hard work!","The crops are growing tall.","Harvest time! Busy, busy.","Winter rest. The fields are sleeping."][season()]],child:["Wanna race? I'm super fast!","Mom says not to go near the ruins.","I saw a dragon shadow once!"]}[n.role];
  L.push(pick(role));
  L.push(pick([`${world.weather==="rain"?"This rain is good for the crops.":world.weather==="storm"?"What a storm!":world.weather==="snow"?"Snow again! I love it.":"Lovely weather today."}`,`${SEASONS[season()]} always feels short.`]));
  if(n.spouse>0){const m=npcs.find(x=>x.id===n.spouse);if(m)L.push(`My spouse ${m.name} sends their regards.`);}
  else if(n.partner){const m=npcs.find(x=>x.id===n.partner);if(m)L.push(`Between us... I've been seeing ${m.name}.`);}
  const f=Object.entries(n.rel).sort((a,b)=>b[1]-a[1])[0];if(f){const m=npcs.find(x=>x.id==f[0]);if(m&&m.alive&&Math.random()<0.4)L.push(`${m.name} is my dearest friend.`);}
  if(n.spouse===-1)L.push(pick(["I love you, dear.","Home is wherever you are.","Shall we have dinner together tonight?"]));
  else if(P.dating.includes(n.id))L.push("I had a wonderful time on our last date.");
  return L;
}
function talk(n){
  SFX.blip();
  const lines=dialogLines(n);
  if(n.last!==world.day){n.last=world.day;n.friend=Math.min(100,n.friend+(n.met?2:3));}n.met=true;
  const btns=[];
  const giftable=Object.keys(P.inv).filter(k=>P.inv[k]>0&&k!=="amulet"&&k!=="ring");
  if(giftable.length&&n.gift!==world.day)btns.push({l:"Give gift",f:()=>{showMenu("Gift for "+n.name,"",giftable.map(k=>({l:`${ITEMS[k].n} (${P.inv[k]})`,f:()=>{giveGift(n,k);showMenu(n.name,`"Oh, thank you!" (${heartsOf(n)})`,[{l:"OK"}]);}})).concat([{l:"Back"}]));}});
  if(canRomance(n)&&n.friend>=50&&n.spouse!==-1)btns.push({l:P.dating.includes(n.id)?"Go on a date":"Ask on a date",f:()=>{const r=askDate(n);fadeBlack("",()=>showMenu(n.name,r,[{l:"OK"}]));}});
  if(P.dating.includes(n.id))btns.push({l:"Propose 💍",f:()=>showMenu(n.name,propose(n),[{l:"OK"}])});
  if(n.spouse===-1)btns.push({l:"Spend the evening",f:()=>fadeBlack("You share a quiet, cozy evening together.",()=>{advanceMinutes(240);n.friend=Math.min(100,n.friend+3);})});
  if(n.adv){const inP=(P.party||[]).includes(n.id);btns.push(inP?{l:"Leave party",f:()=>dismissParty(n)}:{l:"Invite to party",f:()=>showMenu(n.name,inviteParty(n),[{l:"OK"}])});}
  if(n.role==="leader"){btns.push({l:"Ask for work",f:()=>boardMenu(n.s)});

    if(n.s===4&&P.inv.amulet){btns.push({l:"Return the amulet",f:()=>{P.inv.amulet=0;P.gold+=120;n.friend=Math.min(100,n.friend+20);addNews(4,"The Reedwick heirloom amulet was returned!");showMenu(n.name,"My family's amulet! Bless you. Take this: 120 gold.",[{l:"OK"}]);}});}}
  if(tryCompleteJobs(n.s,n))lines.push("Thanks for the work you did for us!");
  btns.push({l:"Bye"});
  showMenu(`${title(n)}${n.name} ${heartsOf(n)}`,lines.slice(0,4).join("\n\n"),btns);
}
const heartsOf=n=>"♥".repeat(Math.round(n.friend/20))+"♡".repeat(5-Math.round(n.friend/20));
// ===== MENUS =====
const menuEl=document.getElementById("menu");
function showMenu(t,text,btns){paused=true;SFX.ui();menuEl.innerHTML="";const h=document.createElement("h2");h.textContent=t;menuEl.appendChild(h);
  if(text){const p=document.createElement("p");p.textContent=text;menuEl.appendChild(p);}
  const wrap=document.createElement("div");wrap.className="mbtns";
  for(const b of btns){const e=document.createElement("button");e.type="button";if(b.cls)e.className=b.cls;e.textContent=b.l;if(b.dis){e.classList.add("dis");e.setAttribute("aria-disabled","true");}e.onclick=ev=>{ev.stopPropagation();if(b.dis){SFX.ui();return;}closeMenu();if(b.f)b.f();updateHud();};wrap.appendChild(e);}
  menuEl.appendChild(wrap);menuEl.classList.remove("hidden");atkPressed=true;}
function closeMenu(){menuEl.classList.add("hidden");paused=false;atkPressed=!!(keys.KeyJ||keys.Space||touch.a);for(const k in latch)latch[k]=false;}
function fadeBlack(text,cb){const f=document.getElementById("fade");f.textContent=text||"";f.classList.add("on");paused=true;setTimeout(()=>{f.classList.remove("on");paused=false;cb&&cb();},window.__FAST?50:1600);}
function priceOf(sid,k,sell){const ws=world.sets[sid];let p=ITEMS[k].p*ws.price*((ws.demand&&ws.demand[k.replace("+","")])||1)*(sell?1:1-guildDiscount());if(ws.festival&&ITEMS[k].food)p*=0.7;if(ws.raid)p*=1.2;return Math.max(1,Math.round(sell?p*0.5:p));}
function buildingMenu(b,inside){const sid=b.s,ws=world.sets[sid],S=SETS[sid];
  if(world.bld[b.id].burn>0)return showMenu("Fire!","The building is ablaze! Press A nearby to help douse it.",[{l:"OK"}]);
  if(b.kind==="inn")return showMenu(S.name+" Inn","Rest restores health and passes the night. A meal fills you up.",[
    {l:`Rest (${priceOf(sid,"bread")*2}g)`,f:()=>{const c=priceOf(sid,"bread")*2;if(P.gold<c)return toast("Not enough gold.");P.gold-=c;sleep(b);}},
    {l:`Hot meal (${priceOf(sid,"bread")}g)`,f:()=>{const c=priceOf(sid,"bread");if(P.gold<c)return toast("Not enough gold.");P.gold-=c;P.hunger=Math.min(100,P.hunger+60);toast("Delicious!");}},
    {l:"Odd jobs",f:()=>boardMenu(sid)},{l:"Leave"}]);
  if(b.kind==="shop")return shopMenu(sid);
  if(b.kind==="guild")return guildMenu(sid);
  if(b.kind==="harbor")return showMenu("Saltmere Harbor","Boats for sale, sturdy and swift. Dock at any pier.",[
    {l:P.boat.owned?"Return my boat to this pier":`Buy a boat (60g)`,f:()=>{if(!P.boat.owned){if(P.gold<60)return toast("Not enough gold.");P.gold-=60;P.boat.owned=true;toast("You bought a boat! It's docked at the pier.");}
      const p=piers[0];P.boat.x=p.bx-14;P.boat.y=p.by-18;hero.boat=false;saveGame();}},{l:"Leave"}]);
  if(b.kind==="forsale"&&!inside){const mine=P.house===b.id||P.rent===b.id;
    const btn=[];if(mine)btn.push({l:"Go inside",f:()=>enterBuilding(b)});
    if(P.house!==b.id)btn.push({l:"Buy house (250g)",f:()=>{if(P.gold<250)return toast("Not enough gold.");P.gold-=250;P.house=b.id;b.owned=true;P.rent=-1;const sp=npcs.find(n=>n.id===P.spouse);if(sp)sp.home=b.id;
      addNews(sid,"The wanderer bought a house in "+S.name+".");checkRank();saveGame();toast("This house is yours!");}});
    if(!mine)btn.push({l:"Rent (15g / 3 days)",f:()=>{if(P.gold<15)return toast("Not enough gold.");P.gold-=15;P.rent=b.id;P.rentUntil=world.day+3;checkRank();toast("Rented for 3 days.");}});
    btn.push({l:"Leave"});return showMenu(mine?"Your Home":"House for sale",mine?"Home sweet home.":"A cozy house with a hearth and a garden.",btn);}
  if(world.bld[b.id].dmg>0.05)return showMenu("Damaged building","The builders could use wood for repairs.",[{l:"Go inside",f:()=>enterBuilding(b)},{l:"Donate 3 wood",dis:!((P.inv.wood||0)>=3),f:()=>{P.inv.wood-=3;world.bld[b.id].dmg=Math.max(0,world.bld[b.id].dmg-0.4);P.gold+=12;for(const n of npcs)if(n.s===sid)n.friend=Math.min(100,n.friend+3);addNews(sid,"The wanderer helped repair a building in "+S.name+".");toast("Repairs made! +12g, the town thanks you.");}},{l:"Leave"}]);
  const owner=npcs.filter(n=>n.home===b.id&&n.alive).map(n=>n.name).join(" & ");
  showMenu("A home in "+S.name,owner?`This is where ${owner} live${owner.includes("&")?"":"s"}. You knock, but it's a private home.`:"An empty house.",[{l:"OK"}]);
}
function sleep(b){fadeBlack("Zzz...",()=>{const toMorning=((24-hour()+7)%24||24)*60-world.min%60;advanceMinutes(toMorning);hero.hp=hero.maxHp;updateHearts();const d=doorOf(b);P.respawn={x:d.x,y:d.y+4};toast("You feel rested. Day "+(world.day+1));saveGame();});}
function shopMenu(sid){const ws=world.sets[sid];const btn=[];
  for(const k of SHOP_ITEMS)btn.push({l:`Buy ${ITEMS[k].n} ${priceOf(sid,k)}g (${ws.stock[k]||0})`,dis:!(ws.stock[k]>0),f:()=>{const c=priceOf(sid,k);if(P.gold<c)return toast("Not enough gold.");P.gold-=c;ws.stock[k]--;P.inv[k]=(P.inv[k]||0)+1;
    if(k==="potion"&&hero.hp<hero.maxHp){}shopMenu(sid);}});
  if(ws.merchant){btn.push({l:"Merchant: Heart Charm (+1 max ♥) 80g",f:()=>{if(P.gold<80)return toast("Not enough gold.");P.gold-=80;P.extraHp=(P.extraHp||0)+1;hero.maxHp+=1;hero.hp=hero.maxHp;updateHearts();}});}
  btn.push({l:"Sell items",f:()=>sellMenu(sid)});btn.push({l:"Leave"});
  showMenu(SETS[sid].name+" Shop",`Prices ${ws.price>1.1?"are up":ws.price<0.9?"are down":"are steady"} (x${ws.price.toFixed(2)}). You have ${P.gold}g.`,btn);}
function sellMenu(sid){const ks=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k].p>0);
  showMenu("Sell",`You have ${P.gold}g.`,ks.map(k=>({l:`${ITEMS[k].n} x${P.inv[k]}: ${priceOf(sid,k,true)}g`,f:()=>{P.inv[k]--;P.gold+=priceOf(sid,k,true);sellMenu(sid);}})).concat([{l:"Sell all loot",f:()=>{for(const k of Object.keys(P.inv).filter(k=>ITEMS[k].part||["pelt","trinket","gem","pearl","meat"].includes(k))){while(P.inv[k]>0){P.inv[k]--;P.gold+=priceOf(sid,k,true);}}sellMenu(sid);}},{l:"Done"}]));}
function boardMenu(sid){const ws=world.sets[sid];const news=world.news.filter(n=>n.s===sid||n.s<0).slice(0,5).map(n=>`Day ${n.d+1}: ${n.t}`).join("\n");
  showMenu(SETS[sid].name+" Notice Board",(news||"No news.")+"\n\nJobs:",ws.jobs.filter(j=>!j.taken).map(j=>({l:`${jobText(j)} (${j.reward}g)`,f:()=>takeJob(j)})).concat([{l:"Close"}]));}
function waystoneMenu(w){if(!w.found){w.found=true;toast("Waystone attuned: "+wName(w));saveGame();}
  showMenu("Waystone: "+wName(w),"Travel instantly to any attuned waystone.",waystones.filter(x=>x.found&&x!==w).map(x=>({l:"→ "+wName(x),f:()=>travel(x)})).concat([{l:"Close"}]));}
const wName=w=>w.s>=0?SETS[w.s].name:w.name;
function travel(w){fadeBlack("",()=>{hero.boat=false;P.boarded=false;hero.x=w.x*TILE;hero.y=(w.y+1)*TILE+2;advanceMinutes(30);});}
function castleMenu(){if(!P.king)return kingAudience();showMenu("Royal Castle",`Decrees shape the realm.\nTaxes: ${["none","fair","heavy"][P.dec.tax]} | Patrols: ${P.dec.patrol?"on":"off"}`,[
  {l:"Change taxes",f:()=>{decree("tax");castleMenu();}},{l:"Toggle patrols",f:()=>{decree("patrol");castleMenu();}},{l:"Proclaim festival (100g)",f:()=>decree("festival")},{l:"Sleep in the royal chamber",f:()=>sleep({x:castleObj.x+1,y:castleObj.y,h:3})},{l:"Leave"}]);}
function eatFood(){for(const k of ["pie","bread","fish","meat","berry"])if(P.inv[k]>0){P.inv[k]--;P.hunger=Math.min(100,P.hunger+ITEMS[k].food);hero.hp=Math.min(hero.maxHp,hero.hp+(k==="pie"?2:1));updateHearts();toast("Ate "+ITEMS[k].n);return;}
  if(P.inv.potion>0){P.inv.potion--;hero.hp=hero.maxHp;updateHearts();toast("Drank a potion.");return;}toast("No food! Buy bread or catch fish.");}
function crownMenu(){checkRank();const a=achievements();showMenu("♛ Crown & Achievements",`Rank: ${RANKS[P.rank]}\nPath: ${RANKS.join(" → ")}\n\n`+a.map(x=>(x.ok?"✔ ":"○ ")+x.n).join("\n")+
  `\n\nGold ${P.gold} · Kills ${P.kills} · Dragons ${world.dragonsSlain} · Friends ${npcs.filter(n=>n.friend>=40).length}${P.spouse?" · Married to "+(npcs.find(n=>n.id===P.spouse)||{}).name:""}`+(P.canCrown?"\n\nKing Aldric awaits you in the castle to name his successor!":""),[{l:"Close"}]);}
function invMenu(){const ks=Object.keys(P.inv).filter(k=>P.inv[k]>0);showMenu("Satchel",(ks.map(k=>(ITEMS[k].ic||"•")+" "+ITEMS[k].n+" x"+P.inv[k]).join("\n")||"Empty")+"\n\nJobs:\n"+(P.jobs.map(j=>"• "+jobText(j)+(j.t==="hunt"?` (${j.have||0}/${j.n})`:"")).join("\n")||"none"),[{l:"Eat",f:eatFood},{l:"Craft",f:gearMenu},{l:"Guild Card",f:()=>showMenu("Guild Card",guildCard(),[{l:"Close"}])},{l:"Bestiary",f:bestiaryMenu},{l:"Quest Log",f:questLog},{l:"Crown",f:crownMenu},{l:"Close"}]);}

function royalRequest(){if(!P.royal||P.royal.day!==world.day){const opts=[{t:"pelt",n:3,reward:60,txt:"Bring me 3 Pelts for the royal tailors."},{t:"fish",n:4,reward:50,txt:"The royal kitchen needs 4 Fish."},{t:"gem",n:1,reward:90,txt:"A Gem for the treasury, if you find one."},{t:"herb",n:4,reward:45,txt:"The court healer needs 4 Herbs."}];
  P.royal={...opts[world.day%opts.length],day:world.day,done:false};}return P.royal;}
function kingAudience(){const r=royalRequest();const raid=world.sets.find(s=>s.raid);const btn=[];
  const lines=["KING ALDRIC: \"Ah, my summoned hero! How fares your new life?\""];
  if(raid)lines.push(`"Raiders threaten ${SETS[raid.id].name}. Should you choose to help, the crown would be grateful."`);
  if(!r.done){lines.push(`Optional request: ${r.txt} (${r.reward}g)`);btn.push({l:"Fulfil request",f:()=>{if((P.inv[r.t]||0)<r.n)return toast(`You need ${r.n} ${ITEMS[r.t].n}.`);P.inv[r.t]-=r.n;P.gold+=r.reward;r.done=true;
    for(const n of npcs)if(n.role==="leader")n.friend=Math.min(100,n.friend+3);toast(`The King rewards you ${r.reward}g.`);checkRank();}});}
  lines.push(`Your standing: ${RANKS[P.rank]}.`);
  if(P.canCrown){lines.push('"You have done everything a ruler could. I am old... I name YOU my successor!"');btn.push({l:"♛ Accept the crown",f:()=>coronation()});}
  btn.push({l:"Crown & achievements",f:crownMenu});btn.push({l:"Take your leave"});showMenu("Throne Room",lines.join("\n\n"),btn);}
