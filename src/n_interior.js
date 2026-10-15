// ===== WALKABLE INTERIORS =====
let room=null;
const ROOMSZ={house:[10,7],inn:[14,9],shop:[12,8],guild:[24,14],forsale:[12,8],castle:[18,11]};
function buildRoom(b){const kind=b.kind==="castle"?"castle":b.kind;const [w,h]=ROOMSZ[kind]||[10,7];const F=[];const sp={beds:[],work:null,stove:null,spots:[]};
  const add=(type,x,y,fw,fh,solid=true,extra={})=>{F.push({type,x,y,w:fw,h:fh,solid,...extra});};
  add("fire",Math.floor(w/2)-1,1,2,1);add("window",2,0,2,1,false);add("window",w-4,0,2,1,false);add("rug",Math.floor(w/2)-2,Math.floor(h/2)-1,4,3,false);
  if(kind==="house"||kind==="forsale"){add("bed",1,2,1,2);add("bed",w-2,2,1,2);sp.beds=[[1,2.4],[w-2,2.4]];add("stove",w-3,1,1,1);sp.stove=[w-3,2.2];add("table",3,4,2,1);add("chair",2,4,1,1,false);add("chair",5,4,1,1,false);sp.spots=[[4,3],[6,5]];
    if(kind==="forsale"){add("chest",1,h-3,1,1,true,{store:true});const deco=P.decor||[];const slots=[[w-2,h-3],[3,2],[7,2],[w-4,h-2]];deco.slice(0,slots.length).forEach((d,i)=>add(d,slots[i][0],slots[i][1],1,1,d!=="rug2"&&d!=="painting"));}}
  if(kind==="inn"){add("counter",2,3,4,1,true,{act:"inn"});sp.work=[3.5,2.2];add("table",9,7,2,1);add("barrel",7,2,1,1);for(let i=0;i<3;i++){add("bed",w-2,2+i*2,1,2,true,{act:"innbed"});sp.beds.push([w-2,2.4+i*2]);}add("table",5,6,2,1);add("table",2,6,2,1);sp.spots=[[4,7],[7,5]];add("shelf",1,1,2,1);}
  if(kind==="shop"){add("counter",3,3,6,1,true,{act:"shop"});sp.work=[6,2.2];add("shelf",1,1,2,1);add("shelf",w-3,1,2,1);add("barrel",1,h-3,1,1);add("barrel",w-2,h-3,1,1);add("crate",w-3,h-3,1,1);sp.spots=[[4,6]];}
  if(kind==="guild"){add("counter",6,3,6,1,true,{act:"guild"});sp.work=[9,2.2];add("bigboard",1,0,5,2,true,{act:"gboard"});add("heads",7,0,1,1,false);add("heads",13,0,1,1,false);add("heads",16,0,1,1,false);add("stairs",w-3,2,2,3,true);add("dummy",w-5,h-4,1,1,true);add("dummy",w-3,h-4,1,1,true);add("rack",w-7,h-3,2,1,true);add("rug",9,5,6,4,false);add("ranks",w-6,1,2,1,true,{act:"granks"});add("banner",4,0,1,1,false);add("banner",w-6,0,1,1,false);
    /* tavern corner */add("table",2,7,3,1);add("table",2,9,3,1);add("barrel",w-2,6,1,1,true);add("barrel",w-2,7,1,1,true);add("table",w-6,7,3,1);sp.spots=[[2.5,6.3],[4,6.3],[2.5,8.3],[4,8.3],[w-6,6.3],[w-4.5,6.3],[9,6]];}
  if(kind==="castle"){F.length=0;for(let i=0;i<3;i++){add("pillar",Math.floor(w/2)-4,3+i*2,1,1,true);add("pillar",Math.floor(w/2)+3,3+i*2,1,1,true);}add("banner",Math.floor(w/2)-3,0,1,1,false);add("banner",Math.floor(w/2)+2,0,1,1,false);add("plant",1,h-2,1,1,true);add("plant",w-2,h-2,1,1,true);add("window",2,0,2,1,false);add("window",w-4,0,2,1,false);add("carpet",Math.floor(w/2)-1,2,2,h-3,false);add("throne",Math.floor(w/2)-1,1,2,2,true,{act:"throne"});
    for(const x of [3,w-4])for(const y of [3,6])add("pillar",x,y,1,1);add("banner",5,0,1,1,false);add("banner",w-6,0,1,1,false);sp.spots=[[4,5],[w-5,5]];}
  return{b,kind,w,h,F,sp,door:{x:Math.floor(w/2),y:h-1}};}
function roomSolid(tx,ty){const R=room;if(tx<=0||tx>=R.w-1||ty<=1)return true;if(ty>=R.h-1)return tx!==R.door.x;for(const f of R.F)if(f.solid&&tx>=f.x&&tx<f.x+f.w&&ty>=f.y&&ty<f.y+f.h)return true;return false;}
function roomBlocked(e){const x0=Math.floor(e.x/TILE),y0=Math.floor(e.y/TILE),x1=Math.floor((e.x+e.w-0.01)/TILE),y1=Math.floor((e.y+e.h-0.01)/TILE);for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++)if(roomSolid(tx,ty))return true;return false;}
function doorLocked(b){const h=hour();const night=h>=22||h<6;if(b.kind==="castle"||b.kind==="inn")return false;if(b.kind==="forsale")return!(P.house===b.id||P.rent===b.id);
  if(b.kind==="shop"||b.kind==="guild")return h<7||h>=20;if(!night)return false;
  const occ=npcs.filter(n=>n.alive&&n.home===b.id);if(P.spouse&&occ.some(n=>n.id===P.spouse))return false;return!occ.some(n=>n.friend>=40);}
function enterBuilding(b){if(doorLocked(b)){SFX.ui();toast(b.kind==="forsale"?"This house is for sale. Buy or rent it from the door sign.":b.kind==="shop"||b.kind==="guild"?"Closed for the night. Opens at 7:00.":"The door is locked for the night. (Friends are let in.)");
    if(b.kind==="forsale")buildingMenu(b);return;}
  fadeQuick(()=>{room=buildRoom(b);room.out={x:hero.x,y:hero.y};hero.x=room.door.x*16+2;hero.y=(room.h-2)*16;hero.dir=3;toast("Entered: "+roomName(b));});SFX.ui();}
function roomName(b){return b.kind==="castle"?"Throne Room":b.kind==="forsale"?(P.house===b.id?"Your Home":"Rented Home"):b.kind==="house"?((npcs.filter(n=>n.alive&&n.home===b.id).map(n=>n.name).join(" & ")||"Empty")+"'s home"):SETS[b.s].name+" "+b.kind[0].toUpperCase()+b.kind.slice(1);}
function leaveRoom(){const o=room.out;fadeQuick(()=>{room=null;hero.x=o.x;hero.y=o.y+6;hero.dir=0;});}
function roomNpcs(){if(!room)return[];const b=room.b,h=hour(),list=[];if(b.kind==="castle")return[{king:true,x:(room.w/2-.5)*16+Math.sin(frameN*0.012)*22,y:2.4*16,name:"King Aldric",sleep:false}];
  let bi=0,si=0;for(const n of npcs){if(!n.alive)continue;
    if(n.work===b.id&&h>=7&&h<20&&room.sp.work){list.push({n,x:room.sp.work[0]*16,y:room.sp.work[1]*16,pose:"work"});continue;}
    if((b.kind==="inn"||b.kind==="guild")&&n.inside&&n.at===b.id&&n.work!==b.id){const seats=b.kind==="guild"?[[2.5,6.3],[4,6.3],[2.5,8.3],[4,8.3],[12,6.3],[13.5,6.3],[2.5,10],[4,10],[9,6.5],[10.5,6.5]]:[[2,5.4],[3.4,5.4],[5,5.4],[6.4,5.4],[2,7.3],[3.4,7.3],[5,7.3],[6.4,7.3],[9,6],[10.5,6]];const p=seats[list.filter(l=>l.pose==="sit").length%seats.length];list.push({n,x:p[0]*16,y:p[1]*16,pose:"sit"});continue;}
    if(n.home===b.id&&n.inside&&(n.at==null||n.at===b.id)){const night=h>=22||h<6;if(night&&room.sp.beds[bi]){const p=room.sp.beds[bi++];list.push({n,x:p[0]*16,y:p[1]*16,pose:"sleep"});}
      else if(room.sp.stove&&si===0&&h>=17){si++;list.push({n,x:room.sp.stove[0]*16,y:room.sp.stove[1]*16,pose:"cook"});}
      else{const p=room.sp.spots[si++%Math.max(1,room.sp.spots.length)]||[4,4];list.push({n,x:p[0]*16+Math.sin(frameN*.01+n.id)*10,y:p[1]*16,pose:"idle"});}}}
  if(P.spouse&&b.id===P.house){const s=npcs.find(n=>n.id===P.spouse);if(s&&!list.some(l=>l.n===s))list.push({n:s,x:5*16,y:4*16,pose:hour()>=22||hour()<6?"idle":"idle"});}
  return list;}
function roomUpdate(){if(hero.iframes>0)hero.iframes--;const {mx,my}=getMoveInput();const spd=1.1;
  if(mx||my){moveEntity(hero,mx*spd,my*spd);hero.anim++;if(hero.anim%6===0){hero.frame^=1;if(hero.frame)SFX.step(10);}if(Math.abs(mx)>Math.abs(my))hero.dir=mx<0?1:2;else hero.dir=my<0?3:0;}
  if(hero.y+12>=(room.h-1)*16&&Math.abs(hero.x+6-(room.door.x*16+8))<10&&my>0)return leaveRoom();
  if(wantAttack())roomInteract();wantDodge();}
function roomInteract(){const hx=hero.x+6,hy=hero.y+6;
  for(const r of roomNpcs()){if(Math.hypot(r.x+8-hx,r.y+8-hy)<24){if(r.king){castleMenu();return;}if(r.pose==="sleep"){toast(r.n.name+" is fast asleep. Zzz...");return;}
    if(r.pose==="work"){const k=room.b.kind;if(k==="shop")return shopMenu(room.b.s);if(k==="guild")return guildMenu(room.b.s);if(k==="inn")return buildingMenu(room.b,true);}return talk(r.n);}}
  for(const f of room.F){const cx=(f.x+f.w/2)*16,cy=(f.y+f.h/2)*16;if(Math.abs(cx-hx)>f.w*8+14||Math.abs(cy-hy)>f.h*8+14)continue;
    if(f.act==="throne")return castleMenu();
    if(f.act==="inn"||f.act==="shop"||f.act==="guild"){toast("Nobody is at the counter right now.");return;}
    if(f.act==="gboard")return guildMenu(room.b.s);
    if(f.act==="granks"){const g=guild();return showMenu("Guild Ranks",GRANKS.map((r,i)=>`${i===g.rank&&g.reg?"▶ ":"   "}${r}-rank — ${GPTS[i]} pts`).join("\n")+"\n\nTop adventurers:\n"+advs().filter(n=>n.alive).sort((a,b)=>b.adv.rank-a.adv.rank||b.adv.lvl-a.adv.lvl).slice(0,5).map(n=>`${GRANKS[n.adv.rank]}  ${n.name} (Lv ${n.adv.lvl} ${n.adv.cls})`).join("\n"),[{l:"Close"}]);}
    if(f.act==="innbed")return buildingMenu(room.b,true);
    if(f.type==="bed"&&room.b.kind==="forsale")return sleep(room.b);
    if(f.store)return storageMenu();
    if(f.type==="fire"){toast("The fire crackles warmly.");return;}}}
function storageMenu(){if(!P.storage)P.storage={};const inv=Object.keys(P.inv).filter(k=>P.inv[k]>0),st=Object.keys(P.storage).filter(k=>P.storage[k]>0);
  showMenu("Storage Chest",`Stored: ${st.map(k=>(ITEMS[k].ic||"")+ITEMS[k].n+" x"+P.storage[k]).join(", ")||"nothing"}`,
   inv.map(k=>({l:`Store all ${ITEMS[k].n} (${P.inv[k]})`,f:()=>{P.storage[k]=(P.storage[k]||0)+P.inv[k];P.inv[k]=0;storageMenu();}})).concat(st.map(k=>({l:`Take ${ITEMS[k].n} (${P.storage[k]})`,f:()=>{P.inv[k]=(P.inv[k]||0)+P.storage[k];P.storage[k]=0;storageMenu();}}))).concat([{l:"Close"}]));}
function skyCol(){const h=world.min/60;if(h<5||h>=21)return["#0a1238","#1a2458"];if(h<7)return["#f8a070","#ffd0a0"];if(h>=18)return["#e86a50","#ffb070"];return["#6ac8ff","#c8f0ff"];}
function drawRoom(){const R=room,Wp=R.w*16,Hp=R.h*16;const ox=Math.round(Math.max(0,(W-Wp)/2)-(Wp>W?clamp(hero.x+6-W/2,0,Wp-W):0)),oy=Math.round(Math.max(0,(H-Hp)/2)-(Hp>H?clamp(hero.y+6-H/2,0,Hp-H):0));
  ctx.fillStyle="#120a10";ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(ox,oy);
  const castle=R.kind==="castle";
  for(let y=2;y<R.h;y++)for(let x=0;x<R.w;x++){ctx.fillStyle=castle?((x+y)%2?"#d8d0e0":"#b8b0c8"):((y%2?x+1:x)%3?"#a8703c":"#946030");ctx.fillRect(x*16,y*16,16,16);if(!castle){ctx.fillStyle="rgba(0,0,0,.18)";ctx.fillRect(x*16,y*16+15,16,1);ctx.fillStyle="rgba(255,230,180,.12)";ctx.fillRect(x*16+((y*7)%16),y*16,1,16);}}
  const wg=ctx.createLinearGradient(0,0,0,32);wg.addColorStop(0,castle?"#8a7ab0":"#f0dcb0");wg.addColorStop(1,castle?"#6a5a90":"#d8bc88");ctx.fillStyle=wg;ctx.fillRect(0,0,Wp,32);
  ctx.fillStyle=castle?"#4a3a70":"#6a4020";ctx.fillRect(0,22,Wp,10);ctx.strokeStyle="#e8c060";ctx.beginPath();ctx.moveTo(0,22.5);ctx.lineTo(Wp,22.5);ctx.stroke();
  ctx.fillStyle="#3a2010";ctx.fillRect(0,0,6,Hp);ctx.fillRect(Wp-6,0,6,Hp);ctx.fillRect(0,Hp-6,Wp,6);ctx.fillStyle="#5a3a1a";ctx.fillRect(R.door.x*16,Hp-8,16,8);ctx.fillStyle="#ffe8a0";ctx.fillRect(R.door.x*16+4,Hp-3,8,2);
  const sky=skyCol();
  for(const f of R.F){const x=f.x*16,y=f.y*16,w=f.w*16,h=f.h*16;
    switch(f.type){
    case "window":{const g=ctx.createLinearGradient(0,y+3,0,y+19);g.addColorStop(0,sky[0]);g.addColorStop(1,sky[1]);ctx.fillStyle="#4a2a14";ctx.fillRect(x+3,y+2,w-6,18);ctx.fillStyle=g;ctx.fillRect(x+5,y+4,w-10,14);ctx.fillStyle="#4a2a14";ctx.fillRect(x+w/2-1,y+4,2,14);ctx.fillRect(x+5,y+10,w-10,2);
      if(darkness()>.3){ctx.fillStyle="#fff";ctx.fillRect(x+8,y+6,1,1);ctx.fillRect(x+w-10,y+8,1,1);}break;}
    case "fire":{ctx.fillStyle="#6a5a5a";ctx.fillRect(x,y-4,w,h+6);ctx.fillStyle="#2a1a1a";ctx.fillRect(x+6,y+2,w-12,h-2);ctx.globalCompositeOperation="lighter";for(let i=0;i<3;i++){const fl=Math.sin(frameN*.3+i)*2;ctx.fillStyle=["#ff6a20","#ffb040","#fff0a0"][i];ctx.beginPath();ctx.ellipse(x+w/2+(i-1)*3,y+h-2-fl,3-i*.5,6-i,0,0,7);ctx.fill();}
      const g=ctx.createRadialGradient(x+w/2,y+h,2,x+w/2,y+h,60);g.addColorStop(0,"rgba(255,160,60,.35)");g.addColorStop(1,"rgba(255,120,40,0)");ctx.fillStyle=g;ctx.fillRect(x+w/2-60,y+h-60,120,120);ctx.globalCompositeOperation="source-over";ctx.fillStyle="#e8c060";ctx.fillRect(x-2,y-6,w+4,3);break;}
    case "rug":case "rug2":{ctx.fillStyle="#a02a3a";ctx.fillRect(x+2,y+2,w-4,h-4);ctx.strokeStyle="#e8c060";ctx.strokeRect(x+4.5,y+4.5,w-9,h-9);ctx.fillStyle="#3a6ad0";ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,w/5,h/5,0,0,7);ctx.fill();break;}
    case "carpet":ctx.fillStyle="#b01a2a";ctx.fillRect(x+2,y,w-4,h);ctx.strokeStyle="#e8c060";ctx.strokeRect(x+3.5,y,w-7,h);break;
    case "bed":ctx.fillStyle="#5a3418";ctx.fillRect(x+1,y,w-2,h);ctx.fillStyle="#f4ecd8";ctx.fillRect(x+2,y+2,w-4,8);ctx.fillStyle=["#3a6ad0","#c03050","#4aa060"][f.x%3];ctx.fillRect(x+2,y+10,w-4,h-12);break;
    case "stove":ctx.fillStyle="#3a3a44";ctx.fillRect(x+1,y,w-2,h);ctx.fillStyle="#ff8a30";ctx.fillRect(x+4,y+9,w-8,3);break;
    case "table":ctx.fillStyle="#7a4a24";ctx.fillRect(x,y+2,w,h-4);ctx.fillStyle="#a06a3a";ctx.fillRect(x,y+2,w,3);ctx.fillStyle="#fff6e0";ctx.beginPath();ctx.ellipse(x+6,y+6,3,1.6,0,0,7);ctx.fill();ctx.fillStyle="#c86a2a";ctx.beginPath();ctx.arc(x+6,y+5.5,1.6,0,7);ctx.fill();ctx.fillStyle="#b07030";ctx.fillRect(x+w-7,y+3,3,4);ctx.strokeStyle=OL;ctx.lineWidth=.8;ctx.strokeRect(x+.5,y+2.5,w-1,h-5);break;
    case "chair":ctx.fillStyle="#6a3a1a";ctx.fillRect(x+4,y+4,8,8);break;
    case "counter":{const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#b07a40");g.addColorStop(1,"#6a4020");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.strokeStyle="#e8c060";ctx.strokeRect(x+.5,y+.5,w-1,h-1);
      if(f.act==="shop"){ctx.fillStyle="#ff5a7a";ctx.fillRect(x+6,y+3,4,4);ctx.fillStyle="#5aff9a";ctx.fillRect(x+14,y+3,4,4);}break;}
    case "shelf":ctx.fillStyle="#5a3418";ctx.fillRect(x,y-8,w,h+8);for(let i=0;i<3;i++){ctx.fillStyle=["#c03050","#3a6ad0","#e8c060","#4aa060"][(i+f.x)%4];ctx.fillRect(x+3+i*9,y-6,6,6);ctx.fillRect(x+5+i*8,y+3,5,6);}break;
    case "barrel":ctx.fillStyle="#8a5a2a";ctx.beginPath();ctx.ellipse(x+8,y+8,6,7,0,0,7);ctx.fill();ctx.strokeStyle="#3a2010";ctx.beginPath();ctx.moveTo(x+2,y+6);ctx.lineTo(x+14,y+6);ctx.stroke();break;
    case "crate":ctx.fillStyle="#a07040";ctx.fillRect(x+2,y+2,12,12);ctx.strokeStyle="#5a3a1a";ctx.strokeRect(x+2.5,y+2.5,11,11);break;
    case "chest":ctx.drawImage(SPR2.chest[0],x+1,y+2);break;
    case "bigboard":{ctx.fillStyle="#3a2010";ctx.fillRect(x,y+2,w,h-6);ctx.fillStyle="#7a4a24";ctx.fillRect(x+2,y+4,w-4,h-10);for(let i=0;i<14;i++){const px=x+5+(i%7)*((w-12)/7),py=y+6+Math.floor(i/7)*9;ctx.fillStyle=["#f4ecd8","#fff8c0","#e8f0ff"][i%3];ctx.fillRect(px,py,8,7);ctx.fillStyle="#c03030";ctx.fillRect(px+3,py,2,1);ctx.fillStyle="#8a7a6a";ctx.fillRect(px+1,py+3,6,1);}ctx.fillStyle="#e8c060";ctx.font="bold 6px monospace";ctx.textAlign="center";ctx.fillText("JOB BOARD",x+w/2,y+h-5);break;}
    case "heads":{ctx.fillStyle="#5a3a1a";ctx.beginPath();ctx.ellipse(x+8,y+12,7,6,0,0,7);ctx.fill();ctx.fillStyle=["#8a6a4a","#6a8a4a","#7a4a8a"][(x>>4)%3];ctx.fillRect(x+4,y+7,8,8);ctx.fillStyle="#e8e0c8";ctx.fillRect(x+2,y+4,2,5);ctx.fillRect(x+12,y+4,2,5);ctx.fillStyle="#200";ctx.fillRect(x+5,y+10,2,2);ctx.fillRect(x+9,y+10,2,2);break;}
    case "stairs":{for(let i=0;i<6;i++){ctx.fillStyle=i%2?"#7a4a24":"#8a5a2c";ctx.fillRect(x,y+i*8,w,8);ctx.fillStyle="#3a2010";ctx.fillRect(x,y+i*8+7,w,1);}ctx.fillStyle="#3a2010";ctx.fillRect(x-2,y,2,h);ctx.fillStyle="#c89050";for(let i=0;i<h;i+=8)ctx.fillRect(x-2,y+i,2,2);break;}
    case "dummy":{ctx.fillStyle="#5a3a1a";ctx.fillRect(x+7,y+4,2,14);ctx.fillRect(x+2,y+7,12,2);ctx.fillStyle="#c8a070";ctx.fillRect(x+4,y-2,8,8);ctx.fillRect(x+3,y+6,10,7);ctx.fillStyle="#b02a2a";ctx.fillRect(x+6,y+8,4,3);break;}
    case "rack":{ctx.fillStyle="#5a3a1a";ctx.fillRect(x,y+2,w,2);ctx.fillRect(x,y+12,w,2);for(let i=0;i<5;i++){ctx.fillStyle="#c8ccd8";ctx.fillRect(x+3+i*6,y-4,1,16);ctx.fillStyle="#7a5636";ctx.fillRect(x+2+i*6,y+8,3,1);}break;}
    case "board":ctx.drawImage(SPR2.board,x+8,y-6,20,22);break;
    case "ranks":ctx.fillStyle="#2a1808";ctx.fillRect(x-1,y-5,34,20);ctx.fillStyle="#6a4a2a";ctx.fillRect(x,y-4,32,18);ctx.fillStyle="#f0d890";ctx.font="bold 5px monospace";ctx.fillText("RANKS",x+8,y+1);for(let i=0;i<7;i++){ctx.fillStyle=["#c0c0c0","#a0d0ff","#7ad860","#f0c040","#ff8a3a","#d050e0","#fff060"][i];ctx.fillRect(x+3+i*4,y+5,3,6);}break;
    case "bench":ctx.fillStyle="#2a1808";ctx.fillRect(x,y+2,w,h-2);ctx.fillStyle="#a8703a";ctx.fillRect(x+1,y+3,w-2,5);ctx.fillStyle="#c8c8d0";ctx.fillRect(x+4,y,4,4);ctx.fillStyle="#7a4a20";ctx.fillRect(x+14,y,8,3);break;
    case "trophy":ctx.fillStyle="#5a3a1a";ctx.fillRect(x,y+4,w,12);ctx.fillStyle="#8a5a2a";ctx.fillRect(x+1,y+5,w-2,10);{const n=(P.trophies||[]).length;for(let i=0;i<Math.min(4,n);i++){ctx.fillStyle=["#e84a2a","#8ad0ff","#ffe060","#6ad04a"][i];ctx.beginPath();ctx.moveTo(x+4+i*7,y+14);ctx.lineTo(x+7+i*7,y+6);ctx.lineTo(x+10+i*7,y+14);ctx.fill();}if(!n){ctx.fillStyle="#3a2210";for(let i=0;i<4;i++)ctx.fillRect(x+5+i*7,y+9,2,2);}}break;
    case "wardrobe":ctx.fillStyle="#2a1808";ctx.fillRect(x,y-6,w,h+6);ctx.fillStyle="#8a5a2a";ctx.fillRect(x+1,y-5,w-2,h+4);ctx.fillStyle="#6a3a1a";ctx.fillRect(x+7,y-5,1,h+4);ctx.fillStyle="#f0d060";ctx.fillRect(x+5,y+8,1,2);ctx.fillRect(x+9,y+8,1,2);break;
    case "lampsw":case "lamp":ctx.fillStyle="#2a1808";ctx.fillRect(x+7,y+2,2,13);ctx.fillRect(x+4,y+14,8,2);ctx.fillStyle=room&&room.dark?"#6a6040":"#ffe070";ctx.fillRect(x+3,y-4,10,7);break;
    case "armchair":ctx.fillStyle="#2a1808";ctx.fillRect(x+1,y,14,15);ctx.fillStyle="#a83a4a";ctx.fillRect(x+2,y+1,12,13);ctx.fillStyle="#c85a6a";ctx.fillRect(x+4,y+6,8,6);break;
    case "banner":ctx.fillStyle="#8a2ac8";ctx.fillRect(x+3,y+2,10,18);ctx.fillStyle="#e8c060";ctx.fillRect(x+6,y+8,4,4);break;
    case "pillar":{const g=ctx.createLinearGradient(x,0,x+16,0);g.addColorStop(0,"#b08a3a");g.addColorStop(.5,"#ffe08a");g.addColorStop(1,"#8a6a2a");ctx.fillStyle=g;ctx.fillRect(x+3,y-16,10,h+16);break;}
    case "throne":{ctx.fillStyle="#3a2a20";ctx.fillRect(x-2,y+h-4,w+4,6);ctx.fillStyle="#c8b8a0";ctx.fillRect(x-1,y+h-3,w+2,4);ctx.fillStyle="#3a2408";ctx.fillRect(x+3,y-15,w-6,h+12);ctx.fillStyle="#ffd23a";ctx.fillRect(x+4,y-14,w-8,h+10);ctx.fillStyle="#c83040";ctx.fillRect(x+6,y-11,w-12,h+3);ctx.fillStyle="#e85060";ctx.fillRect(x+6,y-11,2,h+3);ctx.fillStyle="#ffd23a";for(const px of [x+4,x+w/2-1,x+w-6])ctx.fillRect(px,y-18,2,4);ctx.fillStyle="#5ad0ff";ctx.fillRect(x+w/2-1,y-12,2,2);break;}
    case "_":break;
    case "plant":ctx.fillStyle="#8a4a2a";ctx.fillRect(x+5,y+9,6,6);ctx.fillStyle="#3aa040";ctx.beginPath();ctx.arc(x+8,y+6,5,0,7);ctx.fill();break;
    case "bookshelf":ctx.fillStyle="#5a3418";ctx.fillRect(x,y-6,16,20);for(let i=0;i<4;i++){ctx.fillStyle=["#c03050","#3a6ad0","#e8c060","#4aa060"][i];ctx.fillRect(x+2+i*3,y-4,2,7);ctx.fillRect(x+2+i*3,y+5,2,7);}break;
    case "painting":ctx.fillStyle="#e8c060";ctx.fillRect(x,y-2,16,12);ctx.fillStyle="#5ab0e0";ctx.fillRect(x+2,y,12,8);ctx.fillStyle="#3a9a3a";ctx.fillRect(x+2,y+5,12,3);break;
    }}
  const ents=roomNpcs().map(r=>({y:r.y,f:()=>{if(r.king){{const v=Math.cos(frameN*0.012),mv=Math.abs(v)>0.25;drawChibi(KING_LOOK,r.x+8,r.y+16,mv?(v>0?2:1):0,mv?10+(Math.floor(frameN/7)%8):0,1);}return;}
    const L=npcLookC(r.n);const ph=Math.floor((frameN+r.n.id*37)/50)%4;const fr=r.pose==="sit"?(ph===1?5:ph===3?4:3):r.pose==="work"?(ph===2?4:0):r.pose==="idle"?(ph%2?1:0):0;
    if(r.pose==="sleep"){ctx.save();ctx.translate(r.x+8,r.y+12);ctx.rotate(-Math.PI/2);ctx.drawImage(chibi(L,0,0),-10,-14,20,30);ctx.restore();ctx.fillStyle="#cfe";ctx.font="7px system-ui";ctx.fillText("z",r.x+14,r.y-2-((frameN/8)%8));return;}
    if(r.pose==="dance"){const t=frameN+r.n.id*13;drawChibi(L,r.x+8+Math.sin(t*.08)*6,r.y+14-Math.abs(Math.sin(t*.16))*2,[0,2,0,1][Math.floor(t/24)%4],10+Math.floor(t/5)%8);if(t%60<30){ctx.fillStyle="#ffd84a";ctx.font="8px system-ui";ctx.fillText("♪",r.x+14,r.y-4-(t%30)/6);}return;}
    drawChibi(L,r.x+8,r.y+14+(r.pose==="cook"?Math.sin(frameN*.2):0),r.pose==="sit"?0:0,fr);
    if(r.pose==="sit"&&ph!==1){ctx.fillStyle="#b07030";ctx.fillRect(r.x+12,r.y+6,3,4);ctx.fillStyle="#fffbe8";ctx.fillRect(r.x+12,r.y+5,3,1);}if(r.pose==="cook"&&Math.random()<.2)particles.push({x:r.x+8,y:r.y-2,z:0,vx:0,vy:-.2,vz:.3,life:30,max:30,col:[230,230,230],size:2,kind:"spark"});}}));
  ents.push({y:hero.y,f:()=>{drawChibi(HERO_LOOK,hero.x+6,hero.y+14,hero.dir,hero.anim%24<12&&hero.frame?1:0);}});
  ents.sort((a,b)=>a.y-b.y);for(const e of ents)e.f();
  if(darkness()>.2){ctx.fillStyle=`rgba(20,20,60,${darkness()*.35})`;ctx.fillRect(0,0,Wp,Hp);}
  ctx.restore();
  ctx.font="bold 9px Georgia,serif";ctx.textAlign="center";ctx.fillStyle="#ffe08a";ctx.fillText(roomName(R.b),W/2,12);
  const near=roomNpcs().find(r=>Math.hypot(r.x+8-hero.x-6,r.y+8-hero.y-6)<24);if(near){ctx.font="bold 8px system-ui";ctx.fillStyle="#ffe8a0";ctx.fillText(near.king?"A: Audience":near.pose==="sleep"?"Zzz":"A: Talk",hero.x+6+ox,hero.y-6+oy);}
}
