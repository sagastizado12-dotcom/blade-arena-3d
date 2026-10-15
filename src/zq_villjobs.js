// ===== VILLAGER JOBS, DAILY ROUTINES, SPREAD-OUT WANDERING, FRIENDSHIP THROUGH WORK =====
const JOBS={farmer:{n:"Farmer",ic:"🌾",anim:"hoe"},blacksmith:{n:"Blacksmith",ic:"⚒️",anim:"hammer"},fisher:{n:"Fisher",ic:"🎣",anim:"fish"},baker:{n:"Baker",ic:"🍞",anim:"knead"},
 merchant:{n:"Merchant",ic:"🧺",anim:"sweep"},woodcutter:{n:"Woodcutter",ic:"🪓",anim:"chop"},herbalist:{n:"Herbalist",ic:"🌿",anim:"gather"},miner:{n:"Miner",ic:"⛏️",anim:"pick"},
 guard:{n:"Guard",ic:"🛡️",anim:null},innkeeper:{n:"Innkeeper",ic:"🍺",anim:null},carpenter:{n:"Carpenter",ic:"🔨",anim:"hammer"},mayor:{n:"Mayor",ic:"📜",anim:null},clerk:{n:"Guild Clerk",ic:"📋",anim:null}};
const ROLE_JOB={farmer:"farmer",smith:"blacksmith",fisher:"fisher",guard:"guard",innkeeper:"innkeeper",shopkeeper:"merchant",leader:"mayor",receptionist:"clerk"};
const EXTRA_JOBS=["baker","woodcutter","herbalist","miner","carpenter","merchant","farmer","fisher"];
function jobOf(n){if(!n||n.role==="child"||n.age<18||n.adv)return null;if(!n.job)n.job=ROLE_JOB[n.role]&&!(n.role==="farmer"&&n.id%3===0)?ROLE_JOB[n.role]:EXTRA_JOBS[(n.id*7)%EXTRA_JOBS.length];return n.job;}
// workplaces: deterministic per villager, spread over the whole town and surroundings
const wpUsed=new Map();const tileCache=new Map();
function tilesFor(S,key,pred,r0,r1){const k=S.id+":"+key;if(tileCache.has(k))return tileCache.get(k);const L=[];for(let y=S.y-r1;y<=S.y+r1;y++)for(let x=S.x-r1;x<=S.x+r1;x++){const d=Math.hypot(x-S.x,y-S.y);if(d<r0||d>r1)continue;if(solidTile(x,y))continue;if(pred(x,y))L.push([x,y]);}tileCache.set(k,L);return L;}
function pickTile(S,L,seed){if(!L.length)return null;const used=wpUsed.get(S.id)||wpUsed.set(S.id,[]).get(S.id);for(let k=0;k<L.length;k++){const t=L[(seed*7919+k*104729)%L.length];if(!used.some(u=>Math.hypot(u[0]-t[0],u[1]-t[1])<2.5)){used.push(t);return t;}}return L[seed%L.length];}
const jT=(x,y)=>(x<0||y<0||x>=WW||y>=WH)?-1:T[y*WW+x];
const nearT=(x,y,types,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(types.includes(jT(x+dx,y+dy)))return true;return false;};
const walkT=t=>t===GRASS||t===FLOWER||t===SAND||t===ROAD||t===COBBLE||t===FOREST||t===FARM||t===PIER||t===MUD||t===BRIDGE||t===DUNE||t===SNOW;
function workplace(n){if(n.wp)return n.wp;const j=jobOf(n);if(!j)return null;const S=SETS[n.s];let t=null;const r=S.r;
  const near=(b,ox,oy)=>{if(b==null)return null;const d=doorOf(buildings[b]);return[Math.round(d.x/TILE)+ox,Math.round(d.y/TILE)+oy];};
  const shops=S.bIdx.filter(b=>buildings[b].kind==="shop"),inn=S.bIdx.find(b=>buildings[b].kind==="inn"),houses=S.bIdx.filter(b=>buildings[b].kind==="house");
  if(j==="farmer")t=pickTile(S,tilesFor(S,"farm",(x,y)=>jT(x,y)===FARM,0,r+8),n.id)||pickTile(S,tilesFor(S,"edge",(x,y)=>walkT(jT(x,y)),r*0.6,r+3),n.id);
  else if(j==="blacksmith")t=near(shops[n.id%Math.max(1,shops.length)],2,1);
  else if(j==="fisher")t=pickTile(S,tilesFor(S,"shore",(x,y)=>walkT(jT(x,y))&&nearT(x,y,[SHAL,DEEP],1),0,r+16),n.id);
  else if(j==="baker")t=near(inn,-2,1);
  else if(j==="merchant")t=pickTile(S,tilesFor(S,"plaza",(x,y)=>[COBBLE,ROAD].includes(jT(x,y)),3,Math.max(6,r*0.5)),n.id);
  else if(j==="woodcutter")t=pickTile(S,tilesFor(S,"wood",(x,y)=>walkT(jT(x,y))&&nearT(x,y,[TREE],1),r,r+16),n.id);
  else if(j==="herbalist")t=pickTile(S,tilesFor(S,"herb",(x,y)=>[GRASS,FOREST,FLOWER].includes(jT(x,y)),r+1,r+12),n.id);
  else if(j==="miner")t=pickTile(S,tilesFor(S,"rock",(x,y)=>walkT(jT(x,y))&&nearT(x,y,[ROCK,MTN,CLIFF],1),r,r+24),n.id)||pickTile(S,tilesFor(S,"herb",(x,y)=>[GRASS,FOREST,FLOWER].includes(jT(x,y)),r+1,r+12),n.id+3);
  else if(j==="carpenter")t=near(houses[(n.id*3)%Math.max(1,houses.length)],3,1);
  if(!t)t=pickTile(S,tilesFor(S,"any",(x,y)=>walkT(jT(x,y)),2,r*0.9),n.id);
  n.wp=t?{x:t[0]*TILE,y:t[1]*TILE-6}:null;return n.wp;}
// spread wandering across all districts with a crowd cap per 6x6-tile cell
const crowd=new Map();
function wanderSpot(n){const S=SETS[n.s];const now=absMin();if(n.wspot&&n.wspot.until>now&&n.wspot.s===n.s)return n.wspot;
  const L=tilesFor(S,"any",(x,y)=>walkT(jT(x,y)),2,S.r*0.92);if(!L.length)return null;const cnt=new Map();for(const o of npcs)if(o!==n&&o.wspot&&o.wspot.until>now){const k=(o.wspot.x/TILE/6|0)+","+(o.wspot.y/TILE/6|0);cnt.set(k,(cnt.get(k)||0)+1);}
  let pickT=null;for(let k=0;k<30;k++){const t=L[(n.id*131+Math.floor(now/90)*977+k*7919)%L.length];const key=(t[0]/6|0)+","+(t[1]/6|0);if((cnt.get(key)||0)<2){pickT=t;break;}}if(!pickT)pickT=L[(n.id*131)%L.length];
  n.wspot={x:pickT[0]*TILE,y:pickT[1]*TILE-6,until:now+80+(n.id%5)*15,s:n.s};return n.wspot;}
const workHours=h=>(h>=7&&h<11)||(h>=13&&h<17);
{const _nt=npcTarget;npcTarget=function(n){const t=_nt(n);if(!world||t.inside||n.adv||n.engage||n.chasingHero||n.followT>0)return t;const ws=world.sets[n.s];if(ws.raid||ws.dragon||ws.festival)return t;
  const h=hour();if(n.cheer&&absMin()<n.cheer)return t;const j=jobOf(n);
  if(j&&workHours(h)&&!["guard","innkeeper","mayor","clerk"].includes(j)&&!(n.work!=null&&j==="merchant")){const w=workplace(n);if(w)return{x:w.x,y:w.y,work:j};}
  if(j==="guard")return t;const w=wanderSpot(n);return w?{x:w.x,y:w.y}:t;};}
// working animation
const _drawNpcJ=drawNpc;drawNpc=function(n){if(n.wp&&!n.inside&&workHours(hour())&&Math.hypot(n.x-n.wp.x,n.y-n.wp.y)<5){const j=JOBS[n.job];if(j&&j.anim){n.pauseT=Math.max(n.pauseT||0,2);if(frameN%40<12)n.gest=2;}}
  _drawNpcJ(n);if(!(n.wp&&!n.inside&&n.job&&workHours(hour())&&Math.hypot(n.x-n.wp.x,n.y-n.wp.y)<5))return;const a=JOBS[n.job]&&JOBS[n.job].anim;if(!a)return;
  const t=frameN+n.id*11,cx=n.x+8,cy=n.y+6,sw=Math.sin(t*0.16);ctx.save();ctx.lineCap="round";
  if(a==="hammer"||a==="pick"){ctx.fillStyle="#3a3a40";ctx.fillRect(cx+6,cy+8,8,4);ctx.fillRect(cx+8,cy+12,4,3);ctx.translate(cx+5,cy+2);ctx.rotate(-0.9+Math.max(0,sw)*1.5);ctx.strokeStyle="#7a5232";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(7,-1);ctx.stroke();ctx.fillStyle="#9aa";ctx.fillRect(6,-3,a==="pick"?1:3,a==="pick"?6:4);
    if(sw>0.95){ctx.restore();ctx.save();ctx.fillStyle="#ffd060";ctx.fillRect(cx+10,cy+7,2,2);ctx.fillRect(cx+13,cy+6,1,1);}}
  else if(a==="hoe"||a==="sweep"){ctx.translate(cx+2,cy+4);ctx.rotate(0.5+sw*0.45);ctx.strokeStyle="#7a5232";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,12);ctx.stroke();ctx.fillStyle=a==="hoe"?"#8a8a90":"#c8a860";ctx.fillRect(-3,11,a==="hoe"?5:6,2);if(a==="sweep"&&sw>0.8){ctx.restore();ctx.save();ctx.fillStyle="rgba(200,180,140,.7)";ctx.fillRect(cx-4,cy+14,2,1);}}
  else if(a==="fish"){ctx.strokeStyle="#6a4a2a";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx+3,cy+4);ctx.lineTo(cx+16,cy-6);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,.7)";ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(cx+16,cy-6);ctx.lineTo(cx+19,cy+12+Math.sin(t*.1));ctx.stroke();ctx.fillStyle="#e33";ctx.fillRect(cx+18,cy+12+Math.sin(t*.1),2,2);}
  else if(a==="chop"){ctx.fillStyle="#7a5232";ctx.fillRect(cx+8,cy+10,6,4);ctx.translate(cx+5,cy+2);ctx.rotate(-1+Math.max(0,sw)*1.4);ctx.strokeStyle="#7a5232";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(8,0);ctx.stroke();ctx.fillStyle="#aab";ctx.fillRect(7,-3,2,5);}
  else if(a==="knead"){ctx.fillStyle="#d8b880";ctx.beginPath();ctx.ellipse(cx,cy+11+Math.abs(sw),4,2,0,0,7);ctx.fill();}
  else if(a==="gather"){ctx.fillStyle="#8a6a3a";ctx.fillRect(cx+4,cy+10,6,4);ctx.fillStyle="#5c5";if(sw>0)ctx.fillRect(cx+5,cy+9,2,2);}
  ctx.restore();};
// ---- friendship (separate from romance) ----
const BOND_LV=[[0,"Stranger"],[15,"Acquaintance"],[35,"Friend"],[60,"Good Friend"],[85,"Best Friend"]];
const bondLv=b=>{let i=0;BOND_LV.forEach(([v],k)=>{if((b||0)>=v)i=k;});return i;};
const heroName=()=>P&&P.heroName||"Wanderer";
function bondBar(n){const b=Math.round(n.bond||0),f=Math.round(b/10);return`🤝 ${"■".repeat(f)}${"□".repeat(10-f)} ${b}/100 · ${BOND_LV[bondLv(b)][1]}`;}
const TASKS={blacksmith:{t:"Bring the smith 3 wood or 1 gem for the forge",need:[["wood",3],["gem",1]]},farmer:{t:"Help harvest the fields (1 hour)",time:60,give:{berry:2,bread:1}},
 fisher:{t:"Fish together at the water (1 hour)",time:60,give:{fish:2}},baker:{t:"Deliver a loaf of bread to a neighbor",deliver:1},merchant:{t:"Mind the stall for a while (1 hour)",time:60,gold:15},
 woodcutter:{t:"Bring 3 wood to the woodpile",need:[["wood",3]]},herbalist:{t:"Bring 2 herbs or berries",need:[["herb",2],["berry",2]]},miner:{t:"Help haul ore from the dig (1 hour)",time:60,give:{gem:1}},
 carpenter:{t:"Bring 3 wood for repairs",need:[["wood",3]]},guard:{t:"Walk the patrol route together (1 hour)",time:60},innkeeper:{t:"Wash dishes in the kitchen (1 hour)",time:60,give:{pie:1}},
 mayor:{t:"Copy the town ledgers (1 hour)",time:60,gold:10},clerk:{t:"Sort the job board (1 hour)",time:60,gold:10}};
function raiseBond(n,amt){const b0=bondLv(n.bond);n.bond=Math.min(100,(n.bond||0)+amt);n.metHero=true;const b1=bondLv(n.bond);floatText(n.x+8,n.y-12,"🤝+"+amt,"#8fe0ff");
  if(b1>b0){toast(`${n.name} is now your ${BOND_LV[b1][1]}!`);addNews(n.s,`${n.name} the ${JOBS[n.job]?JOBS[n.job].n.toLowerCase():"villager"} and the wanderer have become ${BOND_LV[b1][1].toLowerCase()}s.`);}return b1>b0;}
function helpJob(n){const j=jobOf(n),T=TASKS[j];if(!T)return{ok:false,msg:"They don't need help right now."};if(n.helpDay===world.day)return{ok:false,msg:`"You've already helped me today, ${bondLv(n.bond)>=1?heroName():"friend"}. Come back tomorrow!"`};
  if(T.need){const opt=T.need.find(([k,c])=>(P.inv[k]||0)>=c);if(!opt)return{ok:false,msg:`"I need ${T.need.map(([k,c])=>c+" "+ITEMS[k].n).join(" or ")}."`};P.inv[opt[0]]-=opt[1];}
  if(T.deliver){if(!P.delivery||P.delivery.from!==n.id){const to=npcs.find(o=>o.alive&&o.s===n.s&&o!==n&&o.role!=="child"&&o.id%5===(n.id+world.day)%5)||npcs.find(o=>o.alive&&o.s===n.s&&o!==n);P.delivery={from:n.id,to:to.id,day:world.day};P.inv.parcel=(P.inv.parcel||0)+1;return{ok:false,started:true,msg:`"Take this loaf to ${to.name}, would you?" (Bread parcel added)`};}return{ok:false,msg:`"Did you deliver it to ${(npcs.find(o=>o.id===P.delivery.to)||{}).name}?"`};}
  if(T.time)advanceMinutes(T.time);if(T.give)for(const k in T.give)P.inv[k]=(P.inv[k]||0)+T.give[k];if(T.gold)P.gold+=T.gold;
  n.helpDay=world.day;const up=raiseBond(n,12);return{ok:true,up,msg:`"Thanks, ${bondLv(n.bond)>=1?heroName():"stranger"}! Couldn't have done it without you."`};}
ITEMS.parcel=ITEMS.parcel||{n:"Bread Parcel",p:0,ic:"📦"};
function finishDelivery(n){if(!P.delivery||P.delivery.to!==n.id||!(P.inv.parcel>0))return false;P.inv.parcel--;const from=npcs.find(o=>o.id===P.delivery.from);P.delivery=null;raiseBond(n,5);if(from){from.helpDay=world.day;raiseBond(from,12);}toast(`Delivered! ${n.name} thanks you${from?" and "+from.name+" will hear of it":""}.`);return true;}
const UNIQUE={blacksmith:"Smith's Signet",farmer:"Golden Seed",fisher:"Lucky Lure",baker:"Hearth Charm",merchant:"Merchant's Coin",woodcutter:"Heartwood Token",herbalist:"Evergreen Sprig",miner:"Glow Crystal",carpenter:"Carved Owl",guard:"Watchman's Badge",innkeeper:"Tavern Key",mayor:"Town Seal",clerk:"Guild Quill"};
function perkButtons(n){const L=bondLv(n.bond),j=n.job,btns=[];
  if(L>=2&&n.giftDay!==world.day)btns.push({l:"🎁 Accept a small gift",f:()=>{n.giftDay=world.day;const it=pick(["bread","berry","herb","flowers","fish"]);P.inv[it]=(P.inv[it]||0)+1;toast(`${n.name} gives you ${ITEMS[it].n}.`);}});
  if(L>=3&&(j==="innkeeper"||j==="baker")&&n.mealDay!==world.day)btns.push({l:"🍲 Free meal",f:()=>{n.mealDay=world.day;P.hunger=100;hero.hp=hero.maxHp;updateHearts();toast("A hearty meal on the house!");}});
  if(L>=3&&j==="blacksmith"&&!n.forged)btns.push({l:"⚔ Ask for crafted gear",f:()=>{n.forged=1;P.gear.sword=Math.max(P.gear.sword||0,(P.gear.sword||0)+1);toast(`${n.name} forges you a finer blade! (sword +1)`);}});
  if(L>=4&&!n.uniqueGiven){btns.push({l:"✨ Receive a keepsake",f:()=>{n.uniqueGiven=1;const nm=UNIQUE[j]||"Friendship Charm";const k="u_"+(j||"f");ITEMS[k]=ITEMS[k]||{n:nm,p:0,ic:"🎖️",gift:0};P.inv[k]=(P.inv[k]||0)+1;toast(`${n.name} gives you the ${nm}! A true friend.`);}});}
  return btns;}
// talk: name tag with job, friendship meter, help button, greetings by name
{const _tk=talk;talk=function(n){if(n&&P.delivery&&P.delivery.to===n.id&&finishDelivery(n)){}
  const j=jobOf(n);if(!j)return _tk(n);const sm=showMenu;showMenu=function(t,x,b){showMenu=sm;const L=bondLv(n.bond);const greet=L>=2?`"${pick(["Hey","Good to see you","There you are"])}, ${heroName()}!"\n`:L>=1?`"Oh, ${heroName()}! Hello."\n`:"";
    t=t.replace(n.name,`${n.name} · ${JOBS[j].ic} ${JOBS[j].n}`);x=greet+x+`\n\n${bondBar(n)}`;if(Array.isArray(b)){b=b.slice();const add=[{l:`🛠 Help with work: ${TASKS[j]?TASKS[j].t:"…"}`,f:()=>{const r=helpJob(n);(T=>T)(0);if(r.ok&&TASKS[j].time)fadeBlack("You lend a hand...",()=>showMenu(n.name,r.msg+`\n\n${bondBar(n)}`,[{l:"OK"}]));else showMenu(n.name,r.msg+`\n\n${bondBar(n)}`,[{l:"OK"}]);}},...perkButtons(n)];b.splice(0,0,...add);}
    return sm(t,x,b);};try{return _tk(n);}finally{showMenu=sm;}};}
// discounts from shopkeeper friends
{const _po=priceOf;priceOf=function(sid,k,sell){const p=_po(sid,k,sell);if(sell||!world)return p;const sk=npcs.find(n=>n.alive&&n.s===sid&&(n.role==="shopkeeper"||n.job==="merchant"||n.job==="baker")&&bondLv(n.bond)>=2);return sk?Math.max(1,Math.round(p*(bondLv(sk.bond)>=4?0.8:0.9))):p;};}
// friends cheer you on in fights
const _updCheer=update;update=function(){_updCheer();if(!world||!hero||room||state!=="play"||frameN%90)return;if(frameN-(typeof lastMonHitF==="number"?lastMonHitF:-1e9)>120)return;
  for(const n of npcs)if(n.alive&&!n.inside&&bondLv(n.bond)>=3&&Math.hypot(n.x-hero.x,n.y-hero.y)<180&&Math.random()<0.4){say(n,pick([`Go get 'em, ${heroName()}!`,`You've got this, ${heroName()}!`,"Woo! Nice one!"]),90);break;}};
// friends list in pause menu
function friendsMenu(){const L=npcs.filter(n=>n.alive&&(n.bond||0)>0).sort((a,b)=>b.bond-a.bond);
  showMenu("🤝 Friends",(L.length?L.map(n=>`${n.name} — ${JOBS[n.job]?JOBS[n.job].ic+" "+JOBS[n.job].n:"Villager"} of ${SETS[n.s].name}\n   ${bondBar(n)}`).join("\n"):"No friends yet. Help villagers at their work to befriend them!")+`\n\nYour name: ${heroName()}`,[{l:"✏️ Set your name",f:()=>{const v=(window.prompt?prompt("Your name?",heroName()):null);if(v&&v.trim())P.heroName=v.trim().slice(0,16);friendsMenu();}},{l:"Close"}]);}
{const _bh=buildHUD;buildHUD=function(){_bh.apply(this,arguments);const b=document.getElementById("btnPause");if(!b)return;const old=b.onclick;if(old&&old.__inj&&old.__inj.has("fr"))return;b.onclick=e=>{const sm=showMenu;showMenu=function(t,x,bb){showMenu=sm;if(t==="Paused"&&Array.isArray(bb)){bb=bb.slice();bb.splice(1,0,{l:"🤝 Friends",f:friendsMenu});}return sm(t,x,bb);};try{old&&old(e);}finally{showMenu=sm;}};b.onclick.__inj=new Set([...((old&&old.__inj)||[]),"fr"]);};}
