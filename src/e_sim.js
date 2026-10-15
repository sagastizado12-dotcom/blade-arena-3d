// ===== WORLD STATE / SIMULATION =====
const ITEMS={bread:{n:"Bread",p:4,food:40},meat:{n:"Raw Meat",p:5,food:25},fish:{n:"Fish",p:6,food:30},berry:{n:"Berries",p:2,food:10},herb:{n:"Herb",p:4},
 pelt:{n:"Pelt",p:8},trinket:{n:"Goblin Trinket",p:6},horn:{n:"Horn",p:10},gem:{n:"Gem",p:30},pearl:{n:"Pearl",p:25},scale:{n:"Dragon Scale",p:120},
 potion:{n:"Potion",p:15},flowers:{n:"Bouquet",p:8,gift:2},ring:{n:"Engagement Ring",p:120},amulet:{n:"Lost Amulet",p:0},pie:{n:"Berry Pie",p:12,food:60,gift:2},wood:{n:"Wood",p:3},axe:{n:"Axe",p:40}};
const SHOP_ITEMS=["bread","potion","flowers","pie","ring","axe"];
const NAMES=["Ada","Bram","Cora","Dain","Elsa","Finn","Greta","Hugo","Iris","Joss","Kira","Lio","Mara","Nils","Opal","Pip","Quinn","Rhea","Sol","Tova","Ulf","Vera","Wren","Yara","Zed","Brin","Cass","Dex","Edda","Fen","Gale","Hal","Ivo","Juna","Kai","Lark","Moss","Nell","Oren","Poppy"];
const ROLES_T=["leader","innkeeper","shopkeeper","guard","smith","fisher","farmer","child","receptionist"];
const ROLES_V=["leader","innkeeper","shopkeeper","farmer","farmer","child"];
const LEADER={town:"Mayor",village:"Elder","harbor town":"Harbormaster","island village":"Chief"};
const RANKS=["Wanderer","Citizen","Landowner","Knight","Lord","Champion","King"];
let world, P, npcs=[], nextNpc=1;
function newWorld(){
  world={trees:{},placed:[],day:0,min:8*60,weather:"clear",wUntil:240,news:[],regions:[],events:[],wrecks:[],caravans:[],bandits:[],beasts:[],migr:[],opened:{},harvested:{},nextJobId:1,
    sets:SETS.map(s=>({id:s.id,price:1,stock:{bread:10,potion:4,flowers:5,pie:3,ring:1,axe:2},crop:0,festival:0,merchant:0,raid:null,dmgLog:0,jobs:[],safety:1})),
    bld:buildings.map(b=>({dmg:0,burn:0})),castle:false,dragonsSlain:0};
  for(let i=0;i<800;i++)world.regions.push(0.6+Math.random()*0.5);
  P={gear:{sword:0,armor:0},best:{},gold:20,inv:{bread:2},hunger:80,house:-1,rent:-1,rentUntil:-1,spouse:0,dating:[],ach:{},rank:0,king:false,dec:{tax:0,patrol:0},isles:[],found:[],jobs:[],
    respawn:{x:SETS[0].x*TILE,y:(SETS[0].y+2)*TILE},boat:{owned:false,x:0,y:0},boarded:false,raidsDefended:0,beastsSlain:0,dungeon:false,kills:0,crowned:false};
  npcs=[];nextNpc=1;
  for(const s of SETS){const roles=s.kind.includes("town")?ROLES_T:ROLES_V;roles.forEach((r,i)=>makeNpc(s.id,r));
    const houses=s.bIdx.filter(b=>buildings[b].kind==="house");houses.forEach((h,i)=>{const n=makeNpc(s.id,pick(s.kind.includes("town")?["guard","smith","fisher","farmer","child","farmer"]:["farmer","fisher","child","farmer"]));n.home=h;const d=doorOf(buildings[h]);n.x=d.x;n.y=d.y;if(i%3===0){const m=makeNpc(s.id,"farmer");m.home=h;m.x=d.x;m.y=d.y;}});}
  initAdvs();
  for(const a of npcs)for(const b of npcs)if(a!==b&&a.s===b.s)a.rel[b.id]=Math.floor(Math.random()*50);
  addNews(-1,"Welcome to the Realm of Ten Winds. Live as you like.");
}
function makeNpc(sid,role,age){
  const s=SETS[sid];const houses=s.bIdx.filter(b=>buildings[b].kind==="house");
  const n={id:nextNpc++,name:pick(NAMES),s:sid,role,age:age!=null?age:role==="child"?6+Math.floor(Math.random()*9):19+Math.floor(Math.random()*50),
    home:houses.length?houses[npcs.length%houses.length]:s.bIdx[0],friend:0,met:false,last:-1,rel:{},spouse:0,partner:0,look:Math.floor(Math.random()*1e6),alive:true,x:0,y:0,dir:0,frame:0,anim:0,inside:false,gift:-1};
  if(role==="innkeeper")n.work=s.bIdx.find(b=>buildings[b].kind==="inn");
  else if(role==="shopkeeper")n.work=s.bIdx.find(b=>buildings[b].kind==="shop");
  else if(role==="receptionist"){n.work=s.bIdx.find(b=>buildings[b].kind==="guild");n.age=Math.max(n.age,20);}
  const d=doorOf(buildings[n.home]);n.x=d.x;n.y=d.y;npcs.push(n);return n;
}
const doorOf=b=>({x:(b.x+1.6)*TILE,y:(b.y+b.h)*TILE+3});
const title=n=>n.role==="leader"?LEADER[SETS[n.s].kind]+" ":n.role==="receptionist"?"Guild Receptionist ":"";
function addNews(sid,t){world.news.unshift({d:world.day,s:sid,t});if(world.news.length>40)world.news.pop();}
function absMin(){return world.day*1440+world.min;}
const season=()=>Math.floor(world.day/7)%4;
const hour=()=>Math.floor(world.min/60);
function regionOf(px,py){return clamp(Math.floor(py/TILE/32),0,24)*32+clamp(Math.floor(px/TILE/32),0,31);}
// ---- clock ----
let simAcc=0;
function advanceMinutes(m){for(let i=0;i<m;i++){world.min++;if(world.min>=1440){world.min=0;world.day++;dailyTick();}if(world.min%60===0)hourlyTick();
  P.hunger=Math.max(0,P.hunger-0.028);}}
function hourlyTick(){
  if(absMin()>=world.wUntil){const w={0:["clear","clear","rain","fog"],1:["clear","clear","clear","storm","rain"],2:["rain","fog","clear","clear","storm"],3:["snow","snow","clear","fog"]}[season()];
    world.weather=pick(w);world.wUntil=absMin()+180+Math.floor(Math.random()*300);}
  if(P.hunger<=0&&hero&&!hero.dead){hero.hp=Math.max(1,hero.hp-1);updateHearts();toast("You are starving! Eat something (E).");}
  for(const s of world.sets){
    if(s.raid&&absMin()>=s.raid.until)endRaid(s,false);
    if(s.festival&&absMin()>=s.festival){s.festival=0;}
    if(s.merchant&&absMin()>=s.merchant)s.merchant=0;
  }
  world.bld.forEach((b,i)=>{if(b.burn>0){b.burn--;b.dmg=Math.min(1,b.dmg+0.03);}});
  // caravans move
  for(const c of world.caravans){c.t+=1/c.hours;if(c.t>=1){c.done=true;const s=world.sets[c.to];s.price=Math.max(0.6,s.price-0.12);for(const k in s.stock)s.stock[k]+=3;
    addNews(c.to,`A caravan from ${SETS[c.from].name} arrived in ${SETS[c.to].name}. Prices dropped!`);}}
  world.caravans=world.caravans.filter(c=>!c.done);
  world.bandits=world.bandits.filter(b=>absMin()<b.until&&b.n>0);world.beasts=world.beasts.filter(b=>absMin()<b.until&&!b.dead);world.migr=world.migr.filter(m=>absMin()<m.until);
  // random events, independent of the player
  advHourly();wallHourly();
  const chance=0.09+(P.king&&P.dec.festival?0.02:0);
  if(Math.random()<chance)forceEvent();
}
function dailyTick(){
  const se=season();
  for(const s of world.sets){
    for(const k of SHOP_ITEMS){s.stock[k]=Math.min(k==="ring"||k==="axe"?2:12,(s.stock[k]||0)+(k==="ring"||k==="axe"?1:2));}
    s.price=clamp(s.price+(1-s.price)*0.2+(Math.random()-0.5)*0.14,0.6,1.8);s.demand={};for(const k of ["fang","claw","horn","hide","scale","wing","tail","eye","core","dscale","dhorn","dheart"])s.demand[k]=+(0.7+Math.random()*0.7).toFixed(2);
    if(se<2&&s.crop<4)s.crop++;
    if(se===2&&s.crop>=3){s.crop=0;s.stock.bread+=8;addNews(s.id,`${SETS[s.id].name} brought in the harvest. Bread is plentiful.`);}
    if(se===3)s.crop=0;
    if(s.festival===0&&Math.random()<0.04)startFestival(s.id);
  }
  world.bld.forEach(b=>{if(b.burn<=0&&b.dmg>0)b.dmg=Math.max(0,b.dmg-0.15);});regrowTrees();
  world.regions=world.regions.map(p=>clamp(p+(1-p)*0.1+(Math.random()-0.5)*0.16-(se===3?0.05:0)-(P.dec.patrol?0.06:0),0.15,1.6));
  // NPC life
  for(const n of npcs){if(!n.alive)continue;
    if(world.day%28===0)n.age++;
    for(const id in n.rel){n.rel[id]=clamp(n.rel[id]+(Math.random()-0.45)*6,0,100);}
    if(n.partner&&!n.spouse&&Math.random()<0.15){const m=npcs.find(x=>x.id===n.partner);if(m&&m.alive&&!m.spouse)npcWedding(n,m);}
  }
  for(const n of npcs.filter(n=>n.alive&&n.age>=18&&!n.partner&&!n.spouse&&n.id!==P.spouse&&!P.dating.includes(n.id))){
    const best=Object.entries(n.rel).map(([id,v])=>[npcs.find(x=>x.id==id),v]).filter(([m,v])=>m&&m.alive&&m.age>=18&&!m.partner&&!m.spouse&&m.id!==P.spouse&&v>75)[0];
    if(best&&Math.random()<0.3){n.partner=best[0].id;best[0].partner=n.id;addNews(n.s,`${n.name} and ${best[0].name} of ${SETS[n.s].name} have started courting.`);}
  }
  // taxes
  if(P.king&&P.dec.tax){const inc=P.dec.tax*25;P.gold+=inc;toast(`Royal taxes collected: +${inc}g`);for(const n of npcs)n.friend=Math.max(0,n.friend-P.dec.tax);}
  if(P.rent>=0&&world.day>P.rentUntil){P.rent=-1;toast("Your house rental has ended.");}
  for(const s of world.sets)genJobs(s);advDaily();wallDaily();
  checkRank();
  saveGame();
}
// ---- events ----
const EVENT_TYPES=["raid","merchant","caravan","festival","storm","fire","bandits","beast","shipwreck","migration","wedding","birth","death","move","dragon"];
function forceEvent(type,sid){
  type=type||pick(EVENT_TYPES);if(sid==null)sid=Math.floor(Math.random()*SETS.length);
  const S=SETS[sid],ws=world.sets[sid];let ev={type,s:sid,day:world.day};
  const bl=S.bIdx;
  switch(type){
  case "raid":{const d=P.dec.patrol?0.6:1;ws.raid={until:absMin()+360,spawned:false,n:Math.round(5*d)};const b=pick(bl);world.bld[b].dmg=Math.min(1,world.bld[b].dmg+0.25);ws.price=Math.min(1.8,ws.price+0.2);
    addNews(sid,`Monster raiders attack ${S.name}! The townsfolk beg for help.`);break;}
  case "merchant":ws.merchant=absMin()+600;addNews(sid,`A traveling merchant set up a stall in ${S.name} with rare goods.`);break;
  case "caravan":{let to=sid;while(to===sid||SETS[to].island)to=Math.floor(Math.random()*5);if(S.island)sid=ev.s=1;
    world.caravans.push({from:ev.s,to,t:0,hours:8});addNews(ev.s,`A caravan departs ${SETS[ev.s].name} bound for ${SETS[to].name}.`);break;}
  case "festival":startFestival(sid);break;
  case "storm":world.weather="storm";world.wUntil=absMin()+360;if(Math.random()<0.5){const b=pick(bl);world.bld[b].dmg=Math.min(1,world.bld[b].dmg+0.2);}
    addNews(-1,"A great storm rolls in from the sea. Swimmers beware!");break;
  case "fire":{const b=pick(bl);world.bld[b].burn=4;world.bld[b].dmg=Math.min(1,world.bld[b].dmg+0.35);ev.b=b;addNews(sid,`Fire! A ${buildings[b].kind} in ${S.name} is burning.`);break;}
  case "bandits":{const tx=Math.round((S.x+SETS[0].x)/2),ty=Math.round((S.y+SETS[0].y)/2);world.bandits.push({x:tx*TILE,y:ty*TILE,n:4,until:absMin()+1440,spawned:false});
    world.regions[regionOf(tx*TILE,ty*TILE)]+=0.2;addNews(sid,`Bandits were spotted on the road near ${S.name}.`);break;}
  case "beast":{const sp=pick(["treant","seaserpent","kingslime","cyclops","archfiend"]);const p=findTile(sp==="seaserpent"?[SAND,SHAL]:[FOREST,GRASS],S.x,S.y,30);
    world.beasts.push({sp,x:p.x,y:p.y,until:absMin()+2880,spawned:false,dead:false});addNews(sid,`A rare ${sp} was sighted near ${S.name}!`);break;}
  case "shipwreck":{const p=findTile([SAND],S.x,S.y,40);world.wrecks.push({x:p.x,y:p.y,looted:false,id:"w"+absMin()});addNews(sid,`A ship ran aground near ${S.name}. Loot may wash ashore.`);break;}
  case "migration":{const p=findTile([GRASS],S.x,S.y,30);world.migr.push({x:p.x,y:p.y,sp:pick(["meadowslime","slime"]),until:absMin()+720,spawned:false});
    world.regions[regionOf(p.x,p.y)]+=0.3;addNews(sid,`Great herds are migrating through the plains near ${S.name}.`);break;}
  case "wedding":{const c=npcs.filter(n=>n.alive&&n.s===sid&&n.age>=18&&!n.spouse&&n.id!==P.spouse&&!P.dating.includes(n.id));
    if(c.length>=2){const a=c.find(n=>n.partner)||c[0];const b=npcs.find(x=>x.id===a.partner)||c.find(x=>x!==a);npcWedding(a,b);}else ev.type="festival",startFestival(sid);break;}
  case "birth":{const m=npcs.find(n=>n.alive&&n.spouse&&n.s===sid)||npcs.find(n=>n.alive&&n.spouse);if(m){const b=makeNpc(m.s,"child",0);b.name=pick(NAMES);addNews(m.s,`${m.name} welcomed a baby, little ${b.name}!`);}
    else addNews(sid,`A litter of fluffins was born near ${S.name}.`);break;}
  case "death":{const o=npcs.filter(n=>n.alive&&n.age>55&&n.role!=="leader"&&n.id!==P.spouse);if(o.length){const n=pick(o);n.alive=false;addNews(n.s,`${n.name} of ${SETS[n.s].name} passed away peacefully at ${n.age}. They will be missed.`);}
    else addNews(sid,"The elders of "+S.name+" are in good health.");break;}
  case "move":{const c=npcs.filter(n=>n.alive&&n.role==="farmer"&&!n.spouse&&n.id!==P.spouse);if(c.length){const n=pick(c);const old=n.s;let to=old;while(to===old)to=Math.floor(Math.random()*SETS.length);
    n.s=to;const hs=SETS[to].bIdx.filter(b=>buildings[b].kind==="house");n.home=pick(hs);const d=doorOf(buildings[n.home]);n.x=d.x;n.y=d.y;
    addNews(to,`${n.name} moved from ${SETS[old].name} to ${SETS[to].name}.`);}break;}
  case "dragon":{const k=pick(Object.keys(DRAGONS));ws.dragon={k,until:absMin()+480,spawned:false};const b=pick(bl);world.bld[b].burn=3;world.bld[b].dmg=Math.min(1,world.bld[b].dmg+0.4);
    addNews(sid,`DRAGON ATTACK! ${DRAGONS[k].name} is ravaging ${S.name}!`);toast(`⚠ ${DRAGONS[k].name} attacks ${S.name}!`);break;}
  }
  world.events.unshift(ev);if(world.events.length>30)world.events.pop();
  return ev;
}
function startFestival(sid){world.sets[sid].festival=absMin()+720;addNews(sid,`${SETS[sid].name} is holding a festival today! Food is cheap and spirits are high.`);}
function npcWedding(a,b){a.spouse=b.id;b.spouse=a.id;a.partner=b.id;b.partner=a.id;if(b.s!==a.s){b.s=a.s;}b.home=a.home;addNews(a.s,`${a.name} and ${b.name} were married in ${SETS[a.s].name}! Everyone celebrated.`);
  if(!world.sets[a.s].festival)world.sets[a.s].festival=absMin()+300;}
function endRaid(s,defended){const S=SETS[s.id];
  if(defended){P.raidsDefended++;guildProgress("raid",s.id);setTimeout(()=>heroicDeed(s.id,"raid"),0);P.gold+=40;for(const n of npcs)if(n.s===s.id)n.friend=Math.min(100,n.friend+8);addNews(s.id,`A brave wanderer drove off the raiders at ${S.name}!`);toast("Raid defended! +40g, the town is grateful.");}
  else{for(let k=0;k<2;k++){const b=pick(S.bIdx);world.bld[b].dmg=Math.min(1,world.bld[b].dmg+0.3);}addNews(s.id,`Raiders sacked parts of ${S.name}. Repairs have begun.`);}
  s.raid=null;mobs=mobs.filter(m=>m.raidOf!==s.id);checkRank();}
function findTile(types,cx,cy,r){for(let k=0;k<400;k++){const x=cx+Math.floor((Math.random()-0.5)*2*r),y=cy+Math.floor((Math.random()-0.5)*2*r);
  if(types.includes(tAt(x,y))&&!OCC[y*WW+x]&&!settlementAt(x*TILE,y*TILE))return{x:x*TILE,y:y*TILE};}return{x:cx*TILE,y:(cy+cy%3+8)*TILE};}
// ---- jobs (optional side work) ----
function genJobs(s){s.jobs=s.jobs.filter(j=>!j.taken);while(s.jobs.length<2){const t=pick(["gather","hunt","fish","deliver"]);const id=world.nextJobId++;
  if(t==="gather"){const it=pick(["herb","berry","wood","wood","fang","hide","claw","eye","core"]);s.jobs.push({id,t,item:it,n:it==="wood"?5:3,reward:it==="wood"?30:20,s:s.id,text:it==="wood"?"Builders need 5 ":ITEMS[it].part?"Alchemist wants 3 ":"Gather 3 "});}
  else if(t==="fish")s.jobs.push({id,t,item:"fish",n:2,reward:22,s:s.id,text:"Bring 2 "});
  else if(t==="hunt")s.jobs.push({id,t,n:4,have:0,reward:35,s:s.id,text:"Cull 4 monsters around "+SETS[s.id].name});
  else{let to=s.id;while(to===s.id)to=Math.floor(Math.random()*5);s.jobs.push({id,t,to,reward:30,s:s.id,text:"Deliver a parcel to "+SETS[to].name});}}}
function jobText(j){return j.t==="gather"||j.t==="fish"?j.text+ITEMS[j.item].n:j.text;}
function takeJob(j){if(P.jobs.length>=3){toast("You can hold 3 jobs at once.");return;}j.taken=true;P.jobs.push(j);toast("Job accepted: "+jobText(j));}
function tryCompleteJobs(sid){let done=0;for(const j of P.jobs.slice()){let ok=false;
  if((j.t==="gather"||j.t==="fish")&&j.s===sid&&have(j.item)>=j.n){for(let i=0;i<j.n;i++){if((P.inv[j.item]||0)>0)P.inv[j.item]--;else P.inv[j.item+"+"]--;}ok=true;}
  if(j.t==="hunt"&&j.s===sid&&j.have>=j.n)ok=true;if(j.t==="deliver"&&j.to===sid)ok=true;
  if(ok){P.gold+=j.reward;P.jobs.splice(P.jobs.indexOf(j),1);done++;toast(`Job done! +${j.reward}g`);for(const n of npcs)if(n.s===j.s)n.friend=Math.min(100,n.friend+2);}}
  return done;}
// ---- ranks / achievements ----
function achievements(){
  const lead=npcs.filter(n=>n.role==="leader"&&n.alive);
  const towns=SETS.filter(s=>{const ns=npcs.filter(n=>n.s===s.id&&n.alive);return ns.length&&ns.reduce((a,n)=>a+n.friend,0)/ns.length>=25;}).length;
  return[
   {k:"wealth",n:"Wealth: hold 500 gold",ok:P.gold>=500},
   {k:"home",n:"Property: own a house",ok:P.house>=0},
   {k:"friends",n:"Friendship: 3 friends (40+)",ok:npcs.filter(n=>n.friend>=40).length>=3},
   {k:"rep",n:"Reputation: liked in 3 settlements",ok:towns>=3},
   {k:"raid",n:"Defend a settlement from raiders",ok:P.raidsDefended>0},
   {k:"dungeon",n:"Clear the Stormcrag dungeon",ok:P.dungeon},
   {k:"beast",n:"Slay a rare beast",ok:P.beastsSlain>0},
   {k:"isles",n:"Discover all 3 islands",ok:P.isles.length>=3},
   {k:"dragon",n:"Slay a dragon",ok:world.dragonsSlain>0},
   {k:"leaders",n:"Win support of 4 town leaders (60+)",ok:lead.filter(n=>n.friend>=60).length>=4},
   {k:"hero",n:"Earn a heroic title or reach guild rank B",ok:(P.titles||[]).length>0||(P.guild&&P.guild.rank>=4)},
  ];
}
function checkRank(){const a={};for(const x of achievements())a[x.k]=x.ok;
  let r=0;if(a.home||P.rent>=0||a.friends)r=1;if(r>=1&&a.home)r=2;if(r>=2&&(a.raid||a.beast))r=3;if(r>=3&&a.wealth&&(a.rep||a.estates))r=4;if(r>=1&&a.estates&&r<2)r=2;if(r>=4&&a.dragon&&a.dungeon)r=5;
  if(r>=5&&a.isles&&a.leaders)r=P.crowned?6:5;if(P.crowned)r=6;
  if(r>P.rank){P.rank=r;SFX.chime();if(P.mag)P.mag.max=100+r*15;toast("New rank: "+RANKS[r]+"!");addNews(-1,`The realm whispers of a new ${RANKS[r]}.`);}
  P.canCrown=!P.crowned&&a.hero&&a.home&&a.raid&&a.beast&&a.wealth&&a.rep&&a.dragon&&a.dungeon&&a.isles&&a.leaders;
  if(P.mag)unlockSpells();return P.rank;}
function coronation(){P.crowned=true;P.king=true;P.rank=6;world.castle=true;unlockSpells();for(const s of world.sets)s.festival=absMin()+1440;
  addNews(-1,"Old King Aldric named the summoned hero his successor. Long live the new King!");fadeBlack("King Aldric places the crown upon your head... Long live the King!",()=>toast("You are now King! Issue decrees from your castle."));saveGame();}
function decree(k){if(k==="tax")P.dec.tax=(P.dec.tax+1)%3;if(k==="patrol")P.dec.patrol=P.dec.patrol?0:1;
  if(k==="festival"){if(P.gold<100)return toast("A royal festival costs 100g.");P.gold-=100;for(const s of world.sets)startFestival(s.id);for(const n of npcs)n.friend=Math.min(100,n.friend+5);}
  addNews(-1,`Royal decree: ${k==="tax"?"taxes set to "+["none","fair","heavy"][P.dec.tax]:k==="patrol"?"patrols "+(P.dec.patrol?"ordered":"recalled"):"a realm-wide festival!"}`);}
// ---- romance (adults only; fade to black) ----
function canRomance(n){return n.alive&&n.age>=18&&n.role!=="child";}
function giveGift(n,item){if(!(P.inv[item]>0))return false;P.inv[item]--;const g=ITEMS[item].gift||1;n.friend=Math.min(100,n.friend+(item==="ring"?0:4*g+ (item===n.fav?6:0)));n.gift=world.day;return true;}
function askDate(n){if(!canRomance(n))return"They smile politely. \"I'm not interested in that.\"";
  if(n.spouse&&n.spouse!==-1)return`"I'm married to ${(npcs.find(x=>x.id===n.spouse)||{}).name||"someone"}, you know."`;
  if(n.friend<60)return`"Maybe once we know each other better."`;
  if(!P.dating.includes(n.id)){P.dating.push(n.id);if(n.partner){const m=npcs.find(x=>x.id===n.partner);if(m)m.partner=0;n.partner=0;}}
  n.friend=Math.min(100,n.friend+6);advanceMinutes(120);return`You spend a lovely evening walking together under the lanterns. ${n.name} is now dating you.`;}
function propose(n){if(!P.dating.includes(n.id))return`"Propose? We aren't even dating!"`;if(n.friend<90)return`"I... I need more time."`;
  if(!(P.inv.ring>0))return"You need an Engagement Ring (sold in shops).";if(P.spouse)return"You are already married.";
  P.inv.ring--;P.spouse=n.id;n.spouse=-1;n.partner=0;P.dating=P.dating.filter(i=>i!==n.id);if(P.house>=0)n.home=P.house;
  addNews(n.s,`The wanderer and ${n.name} were wed in ${SETS[n.s].name}! A festival follows.`);startFestival(n.s);checkRank();saveGame();return`"Yes! A thousand times yes!" You and ${n.name} are married.${P.house>=0?" They move into your home.":""}`;}
// ---- save/load ----
const SAVEKEY="realmTenWindsSave4";
function saveGame(){if(!hero||!world)return;try{
  const data={v:1,world,P,nextNpc,hero:{x:room?room.out.x:hero.x,y:room?room.out.y:hero.y,hp:hero.hp,maxHp:hero.maxHp},waystones:waystones.map(w=>w.found),
    npcs:npcs.map(n=>{const o={...n};delete o.inside;return o;}),T:Array.from(harvestedList())};
  localStorage.setItem(SAVEKEY,JSON.stringify(data));}catch(e){console.warn(e);}}
function harvestedList(){return Object.keys(world.harvested).map(Number);}
function loadGame(){const raw=localStorage.getItem(SAVEKEY);if(!raw)return false;try{const d=JSON.parse(raw);
  world=d.world;P=d.P;nextNpc=d.nextNpc;npcs=d.npcs;resetHero();Object.assign(hero,d.hero);d.waystones.forEach((f,i)=>{if(waystones[i])waystones[i].found=f;});
  for(const k of Object.keys(world.harvested)){const i=+k;T[i]=world.harvested[k].r;}
  applyWalls();if(!world.trees)world.trees={};if(!world.placed)world.placed=[];applyTrees();magicInit();return true;}catch(e){console.warn(e);return false;}}
let castleObj=null;
function placeCastle(){if(castleObj)return;placeCapitalCastles();const cx=SETS[0].x-3,cy=SETS[0].y-SETS[0].r+2;castleObj={x:cx,y:cy,w:6,h:3};
  for(let y=cy-1;y<cy+5;y++)for(let x=cx-1;x<cx+7;x++){T[y*WW+x]=COBBLE;invalidateTile(x,y);}
  for(let y=cy;y<cy+3;y++)for(let x=cx;x<cx+6;x++)OCC[y*WW+x]=-2;
  for(let y=cy+3;y<SETS[0].y;y++){if(!OCC[y*WW+SETS[0].x]){T[y*WW+SETS[0].x]=COBBLE;invalidateTile(SETS[0].x,y);}}}
