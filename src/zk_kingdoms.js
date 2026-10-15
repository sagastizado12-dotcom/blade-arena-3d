// ===== FOUR KINGDOMS (one is demonic), WAR, CROWNS, BORDERS, DESTRUCTION =====
const KINGDOMS=[
 {id:0,name:"Aldmoria",cap:0,col:"#3d6fd6",rgb:[61,111,214],ruler:"King Aldric",fem:false},
 {id:1,name:"Varnhold",cap:10,col:"#c83a3a",rgb:[200,58,58],ruler:"Queen Brunhild",fem:true},
 {id:2,name:"Sylvara",cap:13,col:"#3aa860",rgb:[58,168,96],ruler:"Queen Elowen",fem:true},
 {id:3,name:"Nethervale",cap:16,col:"#8a2a9a",rgb:[138,42,154],ruler:"Demon Lord Malzareth",fem:false,demon:true}];
const kOf=sid=>KOF[sid]||0;
const RULER_LOOK=KINGDOMS.map(k=>{const L=chibiLook(9000+k.id*77,"king","human");return k.demon?{...L,cls:"king",skin:[150,40,70],hair:[30,10,30],beard:false,style:"spiky",fem:false,king:1}:k.fem?{...L,cls:"king",fem:true,hair:k.id===1?[230,190,90]:[120,70,40],style:"long",beard:false,king:1,skin:[244,206,172]}:null;});
const KING_DEFAULT={...KING_LOOK};
let KGRID=null;const KG=8;
function buildKGrid(){const gw=Math.ceil(WW/KG),gh=Math.ceil(WH/KG);KGRID=new Uint8Array(gw*gh);for(let y=0;y<gh;y++)for(let x=0;x<gw;x++)KGRID[y*gw+x]=kingdomAt(x*KG+4,y*KG+4);}
const kAtTile=(tx,ty)=>{if(!KGRID)buildKGrid();const gw=Math.ceil(WW/KG);return KGRID[clamp(ty/KG|0,0,Math.ceil(WH/KG)-1)*gw+clamp(tx/KG|0,0,gw-1)];};
// ---- new settlements, capital castles, border posts ----
const CASTLES=[];let BORDER_POSTS=[];
function layoutNewSets(){for(const s of SETS)if(s.id>=10)layoutSettlement(s);for(const s of SETS)if(s.demon)for(let y=s.y-s.r-6;y<=s.y+s.r+6;y++)for(let x=s.x-s.r-6;x<=s.x+s.r+6;x++){const i=y*WW+x;if(T[i]===GRASS||T[i]===FLOWER||T[i]===FOREST||T[i]===BUSH){T[i]=MUD;invalidateTile(x,y);}else if(T[i]===TREE){T[i]=DEADTREE;}}placeCapitalCastles();buildKGrid();findBorderPosts();}
function placeCapitalCastles(){if(CASTLES.length)return;for(const k of KINGDOMS){if(k.cap===0)continue;const S=SETS[k.cap];const cx=S.x-3,cy=S.y-S.r+2;const c={k:k.id,s:S.id,x:cx,y:cy,w:6,h:3};CASTLES.push(c);
  for(let y=cy-1;y<cy+5;y++)for(let x=cx-1;x<cx+7;x++){T[y*WW+x]=COBBLE;OCC[y*WW+x]=0;invalidateTile(x,y);}
  for(let y=cy;y<cy+3;y++)for(let x=cx;x<cx+6;x++)OCC[y*WW+x]=-2;
  for(let y=cy+3;y<S.y;y++){if(OCC[y*WW+S.x]<=0){OCC[y*WW+S.x]=0;T[y*WW+S.x]=COBBLE;invalidateTile(S.x,y);}}}}
function findBorderPosts(){BORDER_POSTS=[];for(let y=4;y<WH-4;y++)for(let x=4;x<WW-4;x++){const t=T[y*WW+x];if(t!==ROAD&&t!==BRIDGE)continue;const a=kAtTile(x,y),b=kAtTile(x+3,y),c=kAtTile(x,y+3);
  if(a===b&&a===c)continue;if(BORDER_POSTS.some(p=>Math.hypot(p.x-x,p.y-y)<30))continue;BORDER_POSTS.push({x,y,a,b:a!==b?b:c});}}
// ---- state ----
function kState(){if(!world.kw)world.kw={war:{},champ:{},crowns:[],side:"human",peaceQ:0,demonPeace:false,rel:{"0-1":"peace","0-2":"peace","1-2":"rival"},rep:50};const K=world.kw;if(!K.side)K.side="human";return K;}
const atWar=k=>{const K=kState();if(K.crowns.includes(k))return false;if(KINGDOMS[k].demon)return K.side==="human"&&!K.demonPeace;if(K.side==="demon")return true;return!!K.war[k];};
function syncWar(){if(!world)return;for(const s of SETS){const ws=world.sets[s.id];if(!ws)continue;if(atWar(kOf(s.id)))ws.angryUntil=1e12;else if(ws.angryUntil>=1e12)ws.angryUntil=0;}}
function migrateKingdoms(){if(!world)return;kState();while(world.sets.length<SETS.length){const id=world.sets.length;world.sets.push({id,price:1,stock:{bread:10,potion:4,flowers:5,pie:3,ring:1,axe:2},crop:0,festival:0,merchant:0,raid:null,dmgLog:0,jobs:[],safety:1});}
  while(world.bld.length<buildings.length)world.bld.push({dmg:0,burn:0});
  if(world.regions.length<800){const old=world.regions;const nr=[];for(let i=0;i<800;i++){const r=Math.floor(i/32),c=i%32;nr.push(r<13&&c<16&&old[r*16+c]!=null?old[r*16+c]:0.6+Math.random()*0.5);}world.regions=nr;}
  for(const s of SETS)if(!npcs.some(n=>n.s===s.id)){const roles=s.kind.includes("town")?ROLES_T:ROLES_V;roles.forEach(r=>makeNpc(s.id,r));
    s.bIdx.filter(b=>buildings[b].kind==="house").forEach(h=>{const n=makeNpc(s.id,pick(["guard","farmer","fisher","child","farmer"]));n.home=h;const d=doorOf(buildings[h]);n.x=d.x;n.y=d.y;});}
  for(const n of npcs)if(SETS[n.s]&&SETS[n.s].demon){n.demon=true;if(n.role==="leader")n.name=n.name;}
  syncWar();}
{const _nw=newWorld;newWorld=function(){const r=_nw.apply(this,arguments);migrateKingdoms();return r;};}
{const _lg=loadGame;loadGame=function(){const r=_lg.apply(this,arguments);if(r)migrateKingdoms();return r;};}
// ---- demons: look ----
function demonLook(seed){const L=chibiLook(seed,"bartender","human");const sk=[[170,50,70],[110,70,150],[120,120,130],[150,40,110]][seed%4];return{...L,skin:sk,hair:[30+seed%30,10,30],cloth:[60,20,50],beard:false};}
{const _lc=npcLookC;npcLookC=function(n){const L=_lc(n);if(!n.demon)return L;if(!n._dl||n._dlb!==L){const sk=[[170,50,70],[110,70,150],[120,120,130],[150,40,110]][n.id%4];n._dl={...L,skin:sk,hair:[40,12,40]};n._dlb=L;}return n._dl;};}
function demonBits(cx,top,sc,t,wings){ctx.fillStyle="#2a1020";ctx.fillRect(cx-5*sc,top+2*sc,2*sc,3*sc);ctx.fillRect(cx+3*sc,top+2*sc,2*sc,3*sc);ctx.fillStyle="#d8c8b0";ctx.fillRect(cx-6*sc,top,2*sc,2*sc);ctx.fillRect(cx+4*sc,top,2*sc,2*sc);
  if(wings){const f=Math.sin(t*0.15)*2;ctx.fillStyle="rgba(60,20,60,.9)";ctx.beginPath();ctx.moveTo(cx-3*sc,top+12*sc);ctx.lineTo(cx-11*sc,top+(6+f)*sc);ctx.lineTo(cx-8*sc,top+16*sc);ctx.fill();ctx.beginPath();ctx.moveTo(cx+3*sc,top+12*sc);ctx.lineTo(cx+11*sc,top+(6+f)*sc);ctx.lineTo(cx+8*sc,top+16*sc);ctx.fill();}
  ctx.strokeStyle="#4a1028";ctx.lineWidth=1.2*sc;ctx.beginPath();ctx.moveTo(cx+2*sc,top+24*sc);ctx.quadraticCurveTo(cx+9*sc,top+26*sc+Math.sin(t*.1)*2,cx+8*sc,top+19*sc);ctx.stroke();ctx.fillStyle="#4a1028";ctx.fillRect(cx+7*sc,top+18*sc,2*sc,2*sc);}
{const _dn=drawNpc;drawNpc=function(n){_dn(n);if(n.demon&&!(n.down>0)){const sc=n.age<15?0.75:1;demonBits(n.x+8,n.y+16-CHH*sc+2,sc,frameN+n.id*9,n.age>=15&&n.id%3===0);}
  if(n.role==="guard"&&!n.demon){const k=KINGDOMS[kOf(n.s)];ctx.fillStyle=k.col;ctx.fillRect(n.x+7,n.y-15,2,3);}};}
// demon foes (hostile people, not monsters)
Object.assign(SPECIES,{
 demon:{base:"grunt",beh:"agg",hp:8,aggro:160,gold:[6,12],chibi:"guard",race:"human",dmg:1,demonNpc:1,biome:[]},
 demonbrute:{base:"grunt",beh:"agg",hp:14,aggro:160,gold:[10,18],chibi:"guard",race:"human",dmg:2,scale:1.3,demonNpc:1,biome:[]},
 demongeneral:{base:"boss",beh:"agg",hp:42,aggro:180,gold:[90,140],chibi:"guard",race:"human",dmg:2,scale:1.6,elite:1,demonNpc:1,biome:[]},
 knight:{base:"grunt",beh:"agg",hp:9,aggro:150,gold:[8,14],chibi:"guard",race:"human",dmg:1,soldier:1,biome:[]},
 champion:{base:"boss",beh:"agg",hp:34,aggro:170,gold:[80,120],chibi:"guard",race:"human",dmg:2,scale:1.5,elite:1,soldier:1,biome:[]}});
for(const k of ["demon","demonbrute","demongeneral","knight","champion"])if(typeof MONDEF!=="undefined"&&!MONDEF[k])MONDEF[k]=SPECIES[k];
{const _sm=spawnMob;spawnMob=function(sp,x,y,extra){const e=_sm(sp,x,y,extra);if(!e)return e;const d=e.def||{};
  if(d.demonNpc){e.chibi=demonLook((x*3+y)|0);e.demon=1;e.name=sp==="demongeneral"?"Demon General":sp==="demonbrute"?"Demon Brute":"Demon Raider";}
  if(d.soldier){const k=KINGDOMS[(extra&&extra.kingdom)||0];e.kingdom=k.id;e.chibi={...chibiLook((x*5+y)|0,"guard","human"),cloth:k.rgb};e.name=sp==="champion"?"Champion of "+k.name:k.name+" Knight";}return e;};}
{const _df=drawFoe;drawFoe=function(e){_df(e);if(e.demon&&!e.dead){const sc=e.def.scale||1;demonBits(e.x+e.w/2,e.y+e.h+1-CHH*sc+2,sc,frameN+(e.x|0),true);}};}
{const _kg=killGP;killGP=function(e){if(e.def&&e.def.demonNpc)return e.sp==="demongeneral"?40:e.sp==="demonbrute"?8:5;return _kg(e);};}
// ---- war ----
function declareWar(k,quiet){const K=kState();if(KINGDOMS[k].demon){K.side="human";K.demonPeace=false;}else K.war[k]={since:world.day};syncWar();
  if(!quiet){addNews(KINGDOMS[k].cap,`The wanderer has declared war on ${KINGDOMS[k].name}! Its gates are shut.`);toast(`⚔ You are at war with ${KINGDOMS[k].name}.`);try{SFX.roar();}catch(_){}}saveGame&&saveGame();}
function makePeace(k,how){const K=kState();if(how==="gold"){const c=250+100*k;if(P.gold<c)return toast("Not enough gold.");P.gold-=c;}else if(how==="rep"){if(K.rep<20)return toast("Your reputation is too low to bargain with.");K.rep-=20;}
  delete K.war[k];if(KINGDOMS[k].demon)K.demonPeace=true;syncWar();addNews(KINGDOMS[k].cap,`Peace was made between the wanderer and ${KINGDOMS[k].name}.`);toast("☮ Peace with "+KINGDOMS[k].name+".");}
function sideWithDemons(){const K=kState();K.side="demon";for(const k of [0,1,2])K.war[k]={since:world.day};syncWar();addNews(-1,"The wanderer has sworn allegiance to the Demon Lord! The human kingdoms call for their head.");toast("😈 You now fight for Nethervale. The humans are hostile.");}
function takeCrown(k){const K=kState();if(!K.crowns.includes(k))K.crowns.push(k);delete K.war[k];if(KINGDOMS[k].demon)K.demonPeace=true;syncWar();
  addNews(KINGDOMS[k].cap,`The wanderer has taken the crown of ${KINGDOMS[k].name}!`);toast(`♛ You are now ruler of ${KINGDOMS[k].name}!`);if(k===0&&!P.crowned){try{coronation();}catch(_){}}
  if(K.crowns.length>=4){P.titles=P.titles||[];if(!P.titles.includes("High Ruler of the Four Realms"))P.titles.push("High Ruler of the Four Realms");addNews(-1,"All four realms are united under one crown!");}saveGame&&saveGame();}
{const _gc=gateClosed;gateClosed=function(g){if(world&&atWar(kOf(g.s)))return true;return _gc(g);};}
{const _po=priceOf;priceOf=function(sid,k,sell){const p=_po(sid,k,sell);return world&&atWar(kOf(sid))?Math.round(sell?p*0.5:p*1.6):p;};}
{const _sh=shopMenu;shopMenu=function(sid){if(world&&atWar(kOf(sid))&&(SETS[sid].kind.includes("capital")||KINGDOMS[kOf(sid)].demon!==!!(kState().side==="demon")&&KINGDOMS[kOf(sid)].demon))return showMenu("Shop",`"We don't serve enemies of ${KINGDOMS[kOf(sid)].name}! Get out!"`,[{l:"Leave"}]);return _sh(sid);};}
function confirmWar(k){showMenu("Declare war?",`Declare war on ${KINGDOMS[k].name}? Its guards will attack you, its gates will close, bounty hunters will hunt you and shops will refuse you.`,[{l:"⚔ Yes, declare war",f:()=>declareWar(k)},{l:"No"}]);}
function kingdomsMenu(){const K=kState();const lines=KINGDOMS.map(k=>`${k.demon?"😈":"♛"} ${k.name} (${k.ruler}): ${K.crowns.includes(k.id)?"yours":atWar(k.id)?"AT WAR":"peace"}`).join("\n");
  const rel=Object.entries(K.rel).map(([p,v])=>{const [a,b]=p.split("-");return`${KINGDOMS[a].name}–${KINGDOMS[b].name}: ${v}`;}).join("\n");
  const btns=[];for(const k of KINGDOMS){if(K.crowns.includes(k.id))continue;if(atWar(k.id))btns.push(k.demon?{l:"☮ Peace with Nethervale (questline)",f:demonPeaceMenu}:{l:`☮ Sue ${k.name} for peace`,f:()=>peaceMenu(k.id)});else if(!k.demon)btns.push({l:`⚔ Declare war on ${k.name}`,f:()=>confirmWar(k.id)});}
  if(K.side!=="demon")btns.push({l:"😈 Side with the demons",f:()=>showMenu("Betray humankind?","Swear yourself to the Demon Lord? All three human kingdoms will turn hostile.",[{l:"Swear allegiance",f:sideWithDemons},{l:"No"}])});
  btns.push({l:"Close"});showMenu("Kingdoms & War",`${lines}\n\nRelations:\n${rel}\nHuman realms vs Nethervale: war\nYour reputation: ${K.rep}\nCrowns: ${K.crowns.map(i=>KINGDOMS[i].name).join(", ")||"none"}`,btns);}
function peaceMenu(k){showMenu("Sue for peace",`${KINGDOMS[k].ruler} will hear your terms.`,[{l:`Pay ${250+100*k}g`,f:()=>makePeace(k,"gold")},{l:"Stake your reputation (−20)",f:()=>makePeace(k,"rep")},{l:"Back",f:kingdomsMenu}]);}
// demon peace questline
function demonPeaceMenu(){const K=kState();const st=["Ask a human ruler for an envoy's seal (guild rank C or higher).","Carry the seal to the Demon Lord in Pandemora.","Bring the Demon Lord 2 Dragon Hearts and 800g as a pledge.","Peace is sealed."][K.peaceQ];
  showMenu("Quest: The Long Truce",`Brokering peace with Nethervale is hard.\n\nStep ${K.peaceQ+1}/3: ${st}`,[{l:"OK"}]);}
function rulerAudience(k){const K=kState(),R=KINGDOMS[k],S=SETS[R.cap];const btns=[];let say=R.demon?`"So, the little hero dares enter my hall."`:`"Welcome to ${R.name}, traveler."`;
  if(atWar(k)){say=R.demon?`"You come to die, human?"`:`"You dare show your face here while we are at war?"`;if(K.champ[k])btns.push({l:"⚔ Storm the throne",f:()=>fadeBlack("You cut through the royal guard and face the throne...",()=>{takeCrown(k);showMenu(R.name,`${R.ruler} yields the crown to you.`,[{l:"OK"}]);})});
    else btns.push({l:"(Defeat the "+(R.demon?"Demon General":"Champion of "+R.name)+" first)",dis:true});
    if(!R.demon)btns.push({l:"☮ Sue for peace",f:()=>peaceMenu(k)});}
  else if(!R.demon)btns.push({l:"⚔ Declare war",f:()=>confirmWar(k)});
  if(R.demon&&K.peaceQ===1)btns.push({l:"📜 Present the envoy's seal",f:()=>{K.peaceQ=2;showMenu(R.ruler,`"A seal... Interesting. Bring me two Dragon Hearts and 800 gold, and perhaps my legions will rest."`,[{l:"OK"}]);}});
  if(R.demon&&K.peaceQ===2)btns.push({l:"🐉 Offer 2 Dragon Hearts + 800g",dis:!((P.inv.dheart||0)>=2&&P.gold>=800),f:()=>{P.inv.dheart-=2;P.gold-=800;K.peaceQ=3;makePeace(3);addNews(-1,"A truce is signed between the human realms and Nethervale!");}});
  if(!R.demon&&K.peaceQ===0&&atWar(3)&&guild().rank>=3)btns.push({l:"📜 Ask for an envoy's seal",f:()=>{K.peaceQ=1;showMenu(R.ruler,`"Peace with demons? Madness... but take my seal. May it protect you."`,[{l:"OK"}]);}});
  if(P.canCrown&&!K.crowns.includes(k)&&!atWar(k))btns.push({l:"♛ Accept the crown",f:()=>takeCrown(k)});
  btns.push({l:"Kingdoms & War",f:kingdomsMenu},{l:"Leave"});showMenu(R.ruler+" of "+R.name,say,btns);}
{const _cm=castleMenu;castleMenu=function(){if(room&&room.b&&room.b.kind==="castle"&&room.b.s!==0)return rulerAudience(kOf(room.b.s));return _cm();};}
{const _ka=kingAudience;kingAudience=function(){const sm=showMenu;showMenu=function(t,x,b){showMenu=sm;if(Array.isArray(b)){b=b.slice();b.splice(Math.max(0,b.length-1),0,{l:"⚔ Kingdoms & War",f:kingdomsMenu});}return sm(t,x,b);};try{return _ka();}finally{showMenu=sm;}};}
{const _rn=roomNpcs;roomNpcs=function(){const L=_rn.apply(this,arguments);if(room&&room.b&&room.b.kind==="castle"){const k=kOf(room.b.s);for(const e of L)if(e.king){e.name=KINGDOMS[k].ruler;e.demonLord=KINGDOMS[k].demon;}Object.assign(KING_LOOK,RULER_LOOK[k]||KING_DEFAULT);}return L;};}
{const _it=interact;interact=function(){if(!hero.boat)for(const c of CASTLES){if(Math.hypot(hero.x+6-(c.x+3)*TILE,hero.y+6-(c.y+3)*TILE)<24){enterBuilding({kind:"castle",id:-10-c.s,s:c.s});return true;}}return _it();};}
// pause menu entry
{const _bh=buildHUD;buildHUD=function(){_bh.apply(this,arguments);const b=document.getElementById("btnPause");if(!b)return;const old=b.onclick;if(old&&old.__inj&&old.__inj.has("kw"))return;b.onclick=e=>{const sm=showMenu;showMenu=function(t,x,bb){showMenu=sm;if(t==="Paused"&&Array.isArray(bb)){bb=bb.slice();bb.splice(1,0,{l:"⚔ Kingdoms & War",f:kingdomsMenu});}return sm(t,x,bb);};try{old&&old(e);}finally{showMenu=sm;}};b.onclick.__inj=new Set([...((old&&old.__inj)||[]),"kw"]);};}
// ---- hourly: bounty hunters, champions, demon raids, frontline, relations; repairs ----
const DEMON_BORDER=()=>SETS.filter(s=>!s.demon&&!s.island).sort((a,b)=>Math.hypot(a.x-780,a.y-606)-Math.hypot(b.x-780,b.y-606)).slice(0,4).map(s=>s.id);
function demonRaid(sid){const ws=world.sets[sid];ws.raid={until:absMin()+360,spawned:false,n:6,demon:true};addNews(sid,`Demons are raiding ${SETS[sid].name}! To arms!`);return ws.raid;}
function nearHero(x,y,r){return Math.hypot(x-hero.x,y-hero.y)<r;}
function warHourly(){const K=kState();const htx=hero.x/TILE|0,hty=hero.y/TILE|0,hk=kAtTile(htx,hty);
  if(!room&&atWar(hk)&&Math.random()<0.3&&!mobs.some(m=>m.hunter&&!m.dead)){const R=KINGDOMS[hk];for(let i=0;i<(R.demon?3:2);i++){const a=Math.random()*7;spawnMob(R.demon?"demon":"knight",hero.x+Math.cos(a)*180,hero.y+Math.sin(a)*140,{persist:true,provoked:true,hunter:1,kingdom:hk});}
    toast(R.demon?"Demon hunters are tracking you!":`Bounty hunters of ${R.name} are on your trail!`);}
  if(!K.demonPeace&&K.side!=="demon"&&Math.random()<0.12){const sid=pick(DEMON_BORDER());if(!world.sets[sid].raid)demonRaid(sid);}
  if(Math.random()<0.04){const pairs=Object.keys(K.rel);const p=pick(pairs);const [a,b]=p.split("-");K.rel[p]=K.rel[p]==="peace"?"rival":"peace";addNews(-1,K.rel[p]==="rival"?`Border skirmishes flare between ${KINGDOMS[a].name} and ${KINGDOMS[b].name}.`:`${KINGDOMS[a].name} and ${KINGDOMS[b].name} signed a trade pact.`);}
  repairHourly();}
{const _ht=hourlyTick;hourlyTick=function(){_ht.apply(this,arguments);try{warHourly();}catch(e){console.warn(e);}};}
const _updWar=update;update=function(){if(world&&hero&&state==="play"&&!room){
    for(const s of world.sets){const S=SETS[s.id];if(s.raid&&s.raid.demon&&!s.raid.spawned&&nearHero(S.x*TILE,S.y*TILE,700)){s.raid.spawned=true;for(let i=0;i<s.raid.n;i++){const a=Math.PI*0.25+Math.random()*1.2,rr=(S.r+5)*TILE;spawnMob(["demon","demon","demonbrute","demon","demon","demonbrute"][i%6],S.x*TILE+Math.cos(a)*rr,S.y*TILE+Math.sin(a)*rr,{persist:true,raidOf:s.id,provoked:true,raider:1});}}}
    const K=kState();for(const k of KINGDOMS){if(!atWar(k.id)||K.champ[k.id])continue;const S=SETS[k.cap];if(nearHero(S.x*TILE,(S.y+S.r+3)*TILE,520)&&!mobs.some(m=>m.champOf===k.id&&!m.dead)){spawnMob(k.demon?"demongeneral":"champion",S.x*TILE,(S.y+S.r+4)*TILE,{persist:true,champOf:k.id,kingdom:k.id});}}
    frontline();}
  _updWar();};
// frontline skirmishes: human soldiers vs demons near the border posts
const soldiers=[];
function frontline(){const K=kState();if(K.demonPeace||frameN%120!==0)return;const p=BORDER_POSTS.find(p=>(p.a===3||p.b===3)&&nearHero(p.x*TILE,p.y*TILE,420));if(!p)return;
  if(mobs.filter(m=>m.demon&&m.front&&!m.dead).length<2){for(let i=0;i<3;i++)spawnMob(i===2?"demonbrute":"demon",(p.x+6+i*2)*TILE,(p.y+4)*TILE,{persist:true,front:1,provoked:true});}
  if(soldiers.filter(n=>n.alive).length<3){const sid=DEMON_BORDER()[0];const n=makeNpc(sid,"guard");n.x=(p.x-6)*TILE;n.y=(p.y-2+soldiers.length%3*2)*TILE;n.soldierT=1;n.name=(soldiers.length%3===2?"Adventurer ":"Soldier ")+n.name;soldiers.push(n);}}
{const _ok=onKill;onKill=function(e){_ok(e);try{const K=kState();if(e.champOf!=null){K.champ[e.champOf]=true;addNews(KINGDOMS[e.champOf].cap,`The ${e.name||"champion"} has fallen! The throne of ${KINGDOMS[e.champOf].name} lies open.`);toast("The throne is open. Storm it!");}
  if(e.demon&&K.side!=="demon"){P.demonKills=(P.demonKills||0)+1;K.rep=Math.min(100,K.rep+1);if(e.sp==="demongeneral"){guildProgress("demongen");P.titles=P.titles||[];if(!P.titles.includes("Demonbane"))P.titles.push("Demonbane");addNews(-1,"The human kings hail the wanderer as Demonbane!");}
    else if(P.demonKills%10===0)addNews(-1,`The kings praise the wanderer: ${P.demonKills} demons slain!`);}}catch(_){}};}
// guild war jobs
{const _gg=genGuildJobs;genGuildJobs=function(){const J=_gg.apply(this,arguments);try{const K=kState();if(!K.demonPeace&&K.side!=="demon"&&!J.some(j=>j.war)){const b=DEMON_BORDER();
  J.push({id:"w"+(world.nextJobId++),t:"raid",s:b[0],min:1,gold:120,pts:30,war:1,txt:`WAR: Defend ${SETS[b[0]].name} from demon raiders`});
  J.push({id:"w"+(world.nextJobId++),t:"scout",min:2,gold:90,pts:25,war:1,txt:"WAR: Scout the demon border (reach a Nethervale border post)"});
  J.push({id:"w"+(world.nextJobId++),t:"demongen",min:3,gold:300,pts:70,war:1,txt:"WAR: Slay a Demon General"});}}catch(_){}return J;};}
function scoutCheck(){if(frameN%60)return;const g=guild();if(!g.active.some(j=>j.t==="scout"&&!j.ok))return;for(const p of BORDER_POSTS)if((p.a===3||p.b===3)&&nearHero(p.x*TILE,p.y*TILE,80)){guildProgress("scout");toast("Border scouted. Report to the guild.");}}
const _updScout=update;update=function(){_updScout();if(world&&hero&&state==="play"&&!room){scoutCheck();for(const g of world.gjobs||[])if(g.t==="demongen"&&guild().active.some(a=>a.id===g.id)&&!mobs.some(m=>m.sp==="demongeneral"&&!m.dead)){const p=BORDER_POSTS.find(p=>(p.a===3||p.b===3)&&nearHero(p.x*TILE,p.y*TILE,500));if(p)spawnMob("demongeneral",(p.x+8)*TILE,(p.y+6)*TILE,{persist:true,provoked:true});}}};
