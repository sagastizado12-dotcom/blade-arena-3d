// ===== PROPERTY: town houses for sale, wilderness cabins, owned-home life =====
const CABINS=[];
const owns=b=>!!P&&(P.homes||[]).includes(b.id);
function homePrice(b){return b.price||(b.cabin?400:250);}
function genCabins(){const land=(x,y)=>{const t=T[y*WW+x];return (t===GRASS||t===FOREST||t===TREE||t===FLOWER||t===BUSH||t===SAND)&&!OCC[y*WW+x]&&!RIVERM[y*WW+x];};
  const okPlot=(cx,cy)=>{for(let y=cy-4;y<=cy+4;y++)for(let x=cx-5;x<=cx+5;x++){if(x<2||y<2||x>=WW-2||y>=WH-2||!land(x,y))return false;}
    if(SETS.some(s=>Math.hypot(cx-s.x,cy-s.y)<s.r+16))return false;if(CABINS.some(c=>Math.hypot(cx-c.x,cy-c.y)<40))return false;if(LAIRS.some(L=>Math.hypot(cx-L.x,cy-L.y)<14))return false;if(CAMPS.some(L=>Math.hypot(cx-L.x,cy-L.y)<16))return false;return true;};
  const names=["Mossy Hollow","Fernbrook","Birchwatch","Owl's Rest","Pinecone Lodge","Foxglove Croft","Amberleaf","Stillwater","Thistledown","Gull's Perch"];
  // one on an island first
  for(const I of ISLES){if(CABINS.length)break;for(let k=0;k<200&&!CABINS.length;k++){const a=k*2.4,rr=(k%9)/9*I.r*0.8;const cx=Math.round(I.x+Math.cos(a)*rr),cy=Math.round(I.y+Math.sin(a)*rr);if(okPlot(cx,cy))CABINS.push({x:cx,y:cy,island:true});}}
  for(let k=0;k<4000&&CABINS.length<8;k++){const cx=6+Math.floor(hash2(k,7,301)*(WW-12)),cy=6+Math.floor(hash2(k,9,302)*(WH-12));if(okPlot(cx,cy))CABINS.push({x:cx,y:cy});}
  CABINS.forEach((c,i)=>{c.name=names[i];let sid=0,bd=1e9;for(const s of SETS){const d=Math.hypot(s.x-c.x,s.y-c.y);if(d<bd){bd=d;sid=s.id;}}c.s=sid;
    for(let y=c.y-4;y<=c.y+4;y++)for(let x=c.x-5;x<=c.x+5;x++){const i2=y*WW+x;T[i2]=GRASS;}
    for(let y=c.y+2;y<=c.y+5;y++)T[y*WW+c.x]=ROAD;T[(c.y+2)*WW+c.x-1]=ROAD;
    const b={id:buildings.length,s:sid,x:c.x-2,y:c.y-2,w:4,h:3,kind:"forsale",cabin:true,cabinName:c.name,price:380+i*40+(c.island?150:0),dmg:0,burn:0,district:"wild"};
    for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){OCC[y*WW+x]=b.id+1;}c.b=b.id;buildings.push(b);
    for(let y=c.y-1;y<=c.y;y++)for(let x=c.x+3;x<=c.x+4;x++)T[y*WW+x]=FARM;});
  for(const s of SETS)for(const id of s.bIdx||[]){const b=buildings[id];if(b.kind==="forsale"&&!b.price)b.price=s.kind.includes("town")?300:220;}}
function genCabinProps(){for(const c of CABINS){const put=(type,x,y,solid=true)=>{PROPS.push({type,x,y,cabin:c.b});if(solid)OCC[y*WW+x]=-1;};
    for(let x=c.x-5;x<=c.x+5;x++){put("fence",x,c.y-4);if(Math.abs(x-c.x)>1)put("fence",x,c.y+4);}
    for(let y=c.y-3;y<=c.y+3;y++){put("fencev",c.x-5,y);put("fencev",c.x+5,y);}
    put("well",c.x-4,c.y-1);put("block",c.x-3,c.y+2);put("logs",c.x-4,c.y+2);put("salesign",c.x+2,c.y+3);}}
// ---- drawing extras ----
const _drawPropH=drawProp;drawProp=function(p){const x=p.x*16,y=p.y*16,g=ctx;const S=(a,b2,w,h,c)=>{g.fillStyle=c;g.fillRect(x+a,y+b2,w,h);};const POL2="#2a1a10";
  if(p.type==="fencev"){S(6,0,4,16,POL2);S(7,0,2,16,"#c88a50");S(5,2,6,3,POL2);S(6,3,4,1,"#e0a868");return;}
  if(p.type==="well"){S(1,14,14,2,"rgba(0,0,0,.2)");S(1,7,14,8,POL2);S(2,8,12,6,"#9aa0a8");S(2,8,12,1,"#c8ccd0");S(4,9,8,3,"#2a4a8a");S(2,1,2,8,POL2);S(12,1,2,8,POL2);S(1,0,14,3,POL2);S(2,0,12,2,"#b0503a");return;}
  if(p.type==="block"){S(2,13,12,2,"rgba(0,0,0,.2)");S(3,7,10,7,POL2);S(4,8,8,5,"#9a5e30");S(4,8,8,2,"#e8c890");S(9,1,2,8,POL2);S(7,1,6,3,"#a0a8b0");return;}
  if(p.type==="salesign"){const b=buildings[p.cabin];S(7,6,2,10,POL2);S(0,0,16,8,POL2);S(1,1,14,6,owns(b)?"#5ac85a":"#f0e0b0");g.fillStyle="#2a1a10";g.font="bold 5px monospace";g.fillText(owns(b)?"HOME":homePrice(b)+"g",x+2,y+6);return;}
  return _drawPropH(p);};
const _bsH=buildingSprite;buildingSprite=function(b){const c=_bsH(b);if(!b||!b.cabin||c._cab)return c;try{const g=c.getContext("2d");const w=c.width,h=c.height;
  g.globalCompositeOperation="source-atop";g.fillStyle="rgba(120,70,30,.28)";g.fillRect(0,h*0.55,w,h*0.45);g.strokeStyle="rgba(60,30,10,.5)";for(let yy=Math.round(h*0.58);yy<h-4;yy+=4){g.beginPath();g.moveTo(0,yy+.5);g.lineTo(w,yy+.5);g.stroke();}g.globalCompositeOperation="source-over";c._cab=1;}catch(_){}return c;};
// ---- buying ----
function buyHome(b){if(owns(b))return true;const pr=homePrice(b);if(P.gold<pr){toast("Not enough gold ("+pr+"g).");return false;}
  P.gold-=pr;P.homes=P.homes||[];P.homes.push(b.id);if(P.house<0)P.house=b.id;b.owned=true;if(P.rent===b.id)P.rent=-1;
  if(!P.homeStore)P.homeStore={};P.homeStore[b.id]=P.homeStore[b.id]||{};const sp=npcs.find(n=>n.id===P.spouse);if(sp&&P.homes.length===1)sp.home=b.id;
  addNews(b.s,`The wanderer bought ${b.cabin?b.cabinName+" cabin":"a house in "+SETS[b.s].name}.`);SFX.coin&&SFX.coin();checkRank();saveGame();toast((b.cabin?b.cabinName:"The house")+" is yours! Here are the keys.");return true;}
function homeLabel(b){return b.cabin?`${b.cabinName} cabin (wilds near ${SETS[b.s].name})`:`House in ${SETS[b.s].name} — ${b.district||"residential"} district`;}
function homePreview(b){try{const c=buildingSprite(b);return c.toDataURL();}catch(_){return null;}}
function homeOffer(b,back){const own=owns(b);const btn=[];
  if(own){btn.push({l:"Go inside",f:()=>enterBuilding(b)});}
  else{btn.push({l:`Buy for ${homePrice(b)}g`,dis:P.gold<homePrice(b),f:()=>{buyHome(b);}});if(!b.cabin&&P.rent!==b.id)btn.push({l:"Rent (15g / 3 days)",f:()=>{if(P.gold<15)return toast("Not enough gold.");P.gold-=15;P.rent=b.id;P.rentUntil=world.day+3;checkRank();toast("Rented for 3 days.");}});}
  if(back)btn.push({l:"Back",f:back});btn.push({l:"Close"});
  showMenu(own?"Your Home":(b.cabin?"Cabin for sale":"House for sale"),`${homeLabel(b)}\nSize: ${b.cabin?"12×8 log cabin, fenced yard, garden, well, chopping block":"12×8 timber house, hearth and garden"}\nRooms: bedroom, kitchen, workshop corner, storage\nPrice: ${homePrice(b)}g${own?" (owned)":""}`,btn);
  const src=homePreview(b);if(src){const im=document.createElement("img");im.src=src;im.className="homePrev";im.style.cssText="display:block;margin:4px auto 8px;width:128px;image-rendering:pixelated;border:2px solid #b08a3a;border-radius:4px;background:#4fb53a";const p=menuEl.querySelector("p");p&&p.after(im);}}
function realEstate(sid){const list=buildings.filter(b=>b.kind==="forsale"&&(b.s===sid));
  showMenu("Real Estate — "+SETS[sid].name,`Homes for sale near ${SETS[sid].name}. You own ${(P.homes||[]).length}.`,list.map(b=>({l:`${owns(b)?"🏠 ":""}${b.cabin?b.cabinName+" cabin":"Town house #"+b.id} — ${owns(b)?"owned":homePrice(b)+"g"}`,f:()=>homeOffer(b,()=>realEstate(sid))}))
    .concat([{l:"Furniture catalogue",f:()=>furnShop(sid)},{l:"Close"}]));}
const FURN={plant:{n:"Potted plant",p:25},bookshelf:{n:"Bookshelf",p:60},painting:{n:"Painting",p:45},rug2:{n:"Fancy rug",p:40},lamp:{n:"Floor lamp",p:35},armchair:{n:"Armchair",p:50}};
function furnShop(sid){showMenu("Furniture","Delivered to your furniture box. Place it inside any home you own.",Object.keys(FURN).map(k=>({l:`${FURN[k].n} — ${FURN[k].p}g`,dis:P.gold<FURN[k].p,f:()=>{P.gold-=FURN[k].p;P.decor=P.decor||[];P.decor.push(k);toast("Bought "+FURN[k].n+".");furnShop(sid);}})).concat([{l:"Back",f:()=>realEstate(sid)}]));}
const _shopMenuH=shopMenu;shopMenu=function(sid){_shopMenuH(sid);const w=menuEl.querySelector(".mbtns");if(w){const e=document.createElement("button");e.type="button";e.id="btnRealEstate";e.textContent="🏠 Real Estate / Buy a House";e.onclick=ev=>{ev.stopPropagation();closeMenu();realEstate(sid);};w.prepend(e);}};
const _bmH=buildingMenu;buildingMenu=function(b,inside){if(b&&b.kind==="forsale"&&!inside)return homeOffer(b);return _bmH.apply(this,arguments);};
const _dlH=doorLocked;doorLocked=function(b){if(b.kind==="forsale")return!(owns(b)||P.rent===b.id);return _dlH(b);};
const _rnH=roomName;roomName=function(b){if(b.kind==="forsale"&&owns(b))return b.cabin?b.cabinName+" Cabin":"Your Home";return _rnH(b);};
const _interactH=interact;interact=function(){if(!room){const hx=hero.x+6,hy=hero.y+8;for(const p of PROPS){if(p.type!=="salesign")continue;if(Math.abs(p.x*16+8-hx)<22&&Math.abs(p.y*16+8-hy)<22){homeOffer(buildings[p.cabin]);return true;}}}return _interactH.apply(this,arguments);};
// ---- home interior ----
const _brH=buildRoom;buildRoom=function(b){if(b.kind!=="forsale")return _brH(b);const w=12,h=8,F=[];const add=(type,x,y,fw,fh,solid=true,extra={})=>F.push({type,x,y,w:fw,h:fh,solid,...extra});
  add("window",2,0,2,1,false);add("window",w-4,0,2,1,false);add("fire",5,1,2,1,true,{act:"cook"});add("bed",1,2,1,2,true,{act:"sleep"});add("bed",2,2,1,2,true,{act:"sleep"});
  add("chest",1,h-3,1,1,true,{act:"store"});add("chest",2,h-3,1,1,true,{act:"store"});add("bench",w-3,h-3,2,1,true,{act:"craft"});add("stove",8,1,1,1,true,{act:"cook"});
  add("trophy",w-3,0,2,1,false,{act:"trophy"});add("wardrobe",w-2,2,1,2,true,{act:"wardrobe"});add("shelf",3,0,2,1,false,{act:"display"});add("lampsw",w-2,h-3,1,1,true,{act:"light"});
  add("rug",4,4,4,2,false);add("table",5,3,2,1);
  for(const d of homeDecor(b))add(d.t,d.x,d.y,1,1,d.t!=="rug2"&&d.t!=="painting",{decor:d});
  return{b,kind:"forsale",w,h,F,sp:{beds:[[1,2.4],[2,2.4]],work:null,stove:[8,2.2],spots:[[4,5],[7,5]]},door:{x:Math.floor(w/2),y:h-1}};};
function homeDecor(b){P.homeDecor=P.homeDecor||{};return P.homeDecor[b.id]=P.homeDecor[b.id]||[];}
const HOME_ACT={
  sleep:()=>sleep(room.b),
  store:()=>homeStorage(room.b),
  craft:()=>craftMenu(),
  cook:()=>cookMenu(),
  trophy:()=>{const t=(P.trophies||[]);showMenu("Trophy Wall",t.length?t.map(x=>"🏆 "+x).join("\n"):"Empty hooks wait for dragon horns and boss crowns. Slay a dragon or demon lord!",[{l:"Close"}]);},
  wardrobe:()=>{const O=[["Hero blue",[60,110,200]],["Forest green",[60,150,70]],["Royal red",[190,50,60]],["Night black",[50,50,70]],["Noble purple",[130,70,180]]];showMenu("Wardrobe","Pick an outfit.",O.map(([n,c])=>({l:n,f:()=>{P.outfit=c;applyOutfit();toast("You changed into "+n+".");}})).concat([{l:"Close"}]));},
  display:()=>{const parts=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]&&ITEMS[k].part);showMenu("Display Shelf",(P.shelf||[]).length?"On display: "+P.shelf.map(k=>ITEMS[k]?ITEMS[k].n:k).join(", "):"Nothing displayed yet.",parts.slice(0,8).map(k=>({l:"Display "+ITEMS[k].n,f:()=>{P.inv[k]--;(P.shelf=P.shelf||[]).push(k);toast("Displayed "+ITEMS[k].n+".");}})).concat([{l:"Close"}]));},
  light:()=>{room.dark=!room.dark;P.lightsOff=P.lightsOff||{};P.lightsOff[room.b.id]=room.dark;SFX.ui();toast(room.dark?"Lights off.":"Lights on.");},
};
function applyOutfit(){try{if(P.outfit&&typeof HERO_LOOK!=="undefined"){HERO_LOOK.shirt=P.outfit;if(typeof chibiCache!=="undefined")chibiCache.clear&&chibiCache.clear();}}catch(_){}}
function homeStorage(b){P.homeStore=P.homeStore||{};const st=P.homeStore[b.id]=P.homeStore[b.id]||{};if(!P.storage)P.storage={};
  const show=(box,label)=>{const inv=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]),s=Object.keys(box).filter(k=>box[k]>0&&ITEMS[k]);
    showMenu(label,`Stored: ${s.map(k=>ITEMS[k].n+" x"+box[k]).join(", ")||"nothing"}`,
      inv.map(k=>({l:`Deposit ${ITEMS[k].n} (${P.inv[k]})`,f:()=>{box[k]=(box[k]||0)+P.inv[k];P.inv[k]=0;show(box,label);}}))
      .concat(s.map(k=>({l:`Withdraw ${ITEMS[k].n} (${box[k]})`,f:()=>{P.inv[k]=(P.inv[k]||0)+box[k];box[k]=0;show(box,label);}})))
      .concat([{l:label.includes("Shared")?"This home's chest":"Shared storage (all homes)",f:()=>label.includes("Shared")?show(st,"Home Chest"):show(P.storage,"Shared Storage")},{l:"Close"}]));};
  show(st,"Home Chest");}
function cookMenu(){const R=[["Fish stew","fish",{hp:2,buff:"def"}],["Roast meat","meat",{hp:2,buff:"atk"}],["Berry tart","berry",{hp:1,buff:"mp"}]];
  showMenu("Cooking",`Cook food for a buff that lasts until evening.${P.buff?"\nActive buff: "+P.buff.k:""}`,R.map(([n,k,e])=>({l:`${n} (1 ${ITEMS[k].n})`,dis:!(P.inv[k]>0),f:()=>{P.inv[k]--;hero.hp=Math.min(hero.maxHp,hero.hp+e.hp);P.hunger=Math.min(100,P.hunger+40);P.buff={k:e.buff,until:world.day*1440+world.min+600};if(e.buff==="mp")P.mag.mp=P.mag.max;updateHearts();SFX.chime();toast(`You cook ${n}. ${e.buff==="atk"?"+1 sword damage":e.buff==="def"?"Toughened skin":"Mana restored"} until evening.`);}})).concat([{l:"Decorate",f:()=>decorMenu()},{l:"Close"}]));}
function decorMenu(){if(!room||room.b.kind!=="forsale")return;const b=room.b,D=homeDecor(b);const dirs=[[0,1],[-1,0],[1,0],[0,-1]];const [dx,dy]=dirs[hero.dir];const tx=Math.floor((hero.x+6)/16)+dx,ty=Math.floor((hero.y+8)/16)+dy;
  const near=D.map((d,i)=>({d,i,dist:Math.hypot(d.x-tx,d.y-ty)})).sort((a,b2)=>a.dist-b2.dist)[0];const inv=P.decor||[];
  const free=!roomSolid(tx,ty)&&ty<room.h-1;
  showMenu("Decorate",`Furniture box: ${inv.map(k=>FURN[k]?FURN[k].n:k).join(", ")||"empty (craft or buy furniture)"}\nPlaced here: ${D.length}`,
    [...new Set(inv)].map(k=>({l:`Place ${FURN[k]?FURN[k].n:k} in front of you`,dis:!free,f:()=>{inv.splice(inv.indexOf(k),1);D.push({t:k,x:tx,y:ty});room=buildRoom(b);toast("Placed.");saveGame();}}))
    .concat(near&&near.dist<2.5?[{l:`Move ${near.d.t} here`,dis:!free,f:()=>{near.d.x=tx;near.d.y=ty;room=buildRoom(b);}},{l:`Remove ${near.d.t}`,f:()=>{D.splice(near.i,1);inv.push(near.d.t);room=buildRoom(b);}}]:[])
    .concat(partyMembers().filter(n=>n.home!==b.id).map(n=>({l:`Invite ${n.name} to live here`,f:()=>{n.home=b.id;toast(n.name+" moves in!");}})))
    .concat([{l:"Close"}]));}
const _riH=roomInteract;roomInteract=function(){if(room&&room.b.kind==="forsale"){const hx=hero.x+6,hy=hero.y+6;for(const f of room.F){if(!f.act||!HOME_ACT[f.act])continue;const cx=(f.x+f.w/2)*16,cy=(f.y+f.h/2)*16;if(Math.abs(cx-hx)>f.w*8+14||Math.abs(cy-hy)>f.h*8+14)continue;
    for(const r of roomNpcs())if(Math.hypot(r.x+8-hx,r.y+8-hy)<16)return talk(r.n);return HOME_ACT[f.act](f);}}return _riH();};
const _enterH=enterBuilding;enterBuilding=function(b){const r=_enterH(b);if(room&&b.kind==="forsale")room.dark=!!(P.lightsOff&&P.lightsOff[b.id]);return r;};
const _drawRoomH=drawRoom;drawRoom=function(){_drawRoomH();if(room&&room.dark){ctx.fillStyle="rgba(10,10,40,.55)";ctx.fillRect(0,0,W,H);}};
// sleeping in your own bed: morning, full HP and MP, save
sleep=function(b){fadeBlack("Zzz...",()=>{const toMorning=((24-hour()+7)%24||24)*60-world.min%60;advanceMinutes(toMorning);hero.hp=hero.maxHp;if(P.mag)P.mag.mp=P.mag.max;updateHearts();const d=doorOf(b);P.respawn={x:d.x,y:d.y+4};toast("You feel rested. Day "+(world.day+1));saveGame();});};
// ---- fast travel to owned homes ----
const _dfmH=drawFullMap;drawFullMap=function(){_dfmH();const g=mapC.getContext("2d");g.font="bold 14px system-ui";g.textAlign="center";for(const c of CABINS){const b=buildings[c.b];g.fillStyle=owns(b)?"#5aff6a":"#d8c090";g.fillText(owns(b)?"🏠":"⌂",c.x*3,c.y*3+5);}
  for(const id of P.homes||[]){const b=buildings[id];if(b.cabin)continue;g.fillStyle="#5aff6a";g.fillText("🏠",(b.x+2)*3,(b.y+1)*3);}};
mapC.addEventListener("click",e=>{const r=mapC.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*WW,y=(e.clientY-r.top)/r.height*WH;
  for(const id of P.homes||[]){const b=buildings[id];if(Math.hypot(b.x+2-x,b.y+1-y)<5){e.stopImmediatePropagation();travelHome(b);return;}}},true);
function travelHome(b){if(!owns(b))return false;mapEl.classList.add("hidden");paused=false;const d=doorOf(b);fadeQuick(()=>{hero.x=d.x;hero.y=d.y+6;hero.boat=false;hero.swim=false;snapPrev&&snapPrev();toast("You travel home to "+(b.cabin?b.cabinName:SETS[b.s].name)+".");});return true;}
// ---- cabin raids (random event) ----
function cabinRaidTick(){for(const id of P.homes||[]){const b=buildings[id];if(!b.cabin||Math.random()>0.12)continue;const d=doorOf(b);
  if(Math.hypot(d.x-hero.x,d.y-hero.y)<700){for(let i=0;i<3;i++)spawnMob(i?"goblin":"orc",d.x+(i-1)*30,d.y+60,{persist:true});toast("⚔ Raiders are attacking your cabin!");}
  else{world.bld[b.id].dmg=Math.min(1,(world.bld[b.id].dmg||0)+0.3);const st=(P.homeStore||{})[b.id];if(st){const k=Object.keys(st).find(k=>st[k]>0);if(k)st[k]=Math.max(0,st[k]-1);}}
  addNews(b.s,`Raiders struck ${b.cabinName} cabin in the wilds!`);}}
const _wallDailyH=wallDaily;wallDaily=function(){_wallDailyH();try{cabinRaidTick();}catch(_){}};
// ---- King path: estates ----
const _achH=achievements;achievements=function(){const a=_achH();const n=(P.homes||[]).length;const h=a.find(x=>x.k==="home");if(h)h.ok=n>0||P.house>=0;a.push({k:"estates",n:"Landowner: own 3 homes",ok:n>=3});return a;};
const _onKillHm=onKill;onKill=function(e){_onKillHm(e);try{const d=e.def||{};if(e.sp==="dragon"||d.boss||d.big&&d.rare){(P.trophies=P.trophies||[]).push((d.name||monName(e.sp)||e.sp)+(e.sp==="dragon"?" horn":" trophy"));}}catch(_){}};
const _swordDmgH=swordDmg;swordDmg=function(){const b=P.buff&&P.buff.until>world.day*1440+world.min?P.buff.k:null;return _swordDmgH()+(b==="atk"?1:0);};
