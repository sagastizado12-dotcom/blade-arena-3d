// ===== LAIRS =====
const LAIRS=[{sp:"fire",x:156,y:30,name:"Ember Hollow"},{sp:"frost",x:60,y:44,name:"Rime Glade"},{sp:"forest",x:34,y:160,name:"Elder Grove"},{sp:"storm",x:346,y:234,name:"Thunder Shoal"},{sp:"frost",x:476,y:110,name:"Glacier Maw"},{sp:"fire",x:470,y:300,name:"Ashen Mesa"},{sp:"forest",x:110,y:376,name:"Rotroot Mire"}];
function genLairs(){for(const L of LAIRS)for(let y=-5;y<=5;y++)for(let x=-5;x<=5;x++){const d=Math.hypot(x,y);if(d>5.3)continue;const i=(L.y+y)*WW+L.x+x;
  T[i]=d>4.6?(hash2(x,y,51)<0.5?ROCK:RUIN):RUIN;if(L.sp==="fire"||L.sp==="frost")ELEV[i]=3;}
  // castle site (built on coronation) north of Aldmoor
}
// ===== IMAGES =====
const IMG={};
const IMGNAMES=[];
function loadImages(){return Promise.all(IMGNAMES.map(n=>new Promise(r=>{const i=new Image();i.onload=()=>{IMG[n]=i;r()};i.onerror=()=>r();i.src="assets/"+n+".png";})));}
// ===== PROCEDURAL SPRITES =====
function personSprite(p,frame,child){
  return makeImg(16,16,img=>{
    const lo=frame?1:0;
    fillRect(img,5,12,3,3,p.leg);fillRect(img,8,12,3,3,p.leg);
    fillRect(img,5+lo,14,2,2,[60,40,30]);fillRect(img,9-lo,14,2,2,[60,40,30]);
    fillRect(img,4,6,8,7,p.cloth);fillRect(img,4,6,8,1,p.trim);fillRect(img,7,7,2,5,p.trim);
    fillRect(img,3,7,1,4,p.cloth);fillRect(img,12,7,1,4,p.cloth);
    fillRect(img,5,2,6,5,p.skin);fillRect(img,5,1,6,2,p.hair);
    if(p.long){fillRect(img,4,2,1,6,p.hair);fillRect(img,11,2,1,6,p.hair);}else{fillRect(img,4,2,1,3,p.hair);fillRect(img,11,2,1,3,p.hair);}
    if(p.hat){fillRect(img,4,0,8,2,p.hat);fillRect(img,3,2,10,1,p.hat);}
    px(img,6,4,C.pupil);px(img,9,4,C.pupil);px(img,7,6,[200,110,100]);px(img,8,6,[200,110,100]);
  });
}
const SKINS=[[240,200,160],[220,170,120],[180,125,85],[130,90,60],[250,215,185]];
const HAIRS=[[60,40,20],[30,25,25],[200,150,60],[160,60,30],[220,220,220],[90,60,120]];
const CLOTH=[[200,60,80],[60,120,200],[80,170,90],[220,170,50],[150,80,190],[40,160,170],[230,120,60],[120,90,60]];
function npcLook(seed){const h=k=>Math.floor(hash2(seed,k,91)*997);
  return{skin:SKINS[h(1)%5],hair:HAIRS[h(2)%6],cloth:CLOTH[h(3)%8],trim:[240,210,110],leg:[70,60,90],long:h(4)%2===0,hat:h(5)%4===0?CLOTH[h(6)%8]:null};}
const npcSprCache=new Map();
function npcSprites(n){let s=npcSprCache.get(n.look);if(!s){const L=npcLook(n.look);s=[personSprite(L,0),personSprite(L,1)];npcSprCache.set(n.look,s);}return s;}
const bldCache=new Map();
function buildingSprite(b){
  const key=b.id+":"+b.kind+":"+(b.owned?1:0);let c=bldCache.get(key);if(c)return c;
  const s=SETS[b.s]||{roof:["#c8a040","#6a4a20"],wall:"#e8e0d0",gem:"#ff6"};
  const w=b.w*16,h=b.h*16+16;c=mkCanvas(w*2,h*2);const g=c.getContext("2d");g.scale(2,2);c.lw=w;c.lh=h;
  const wy=h-30;
  g.fillStyle=s.wall;g.fillRect(2,wy,w-4,30);
  for(let i=0;i<18;i++){g.globalAlpha=.18;g.fillStyle=i%2?"#fff":"#a08060";g.beginPath();g.ellipse(4+hash2(i,b.id,1)*(w-8),wy+3+hash2(i,b.id,2)*24,3,2,0,0,7);g.fill();}g.globalAlpha=1;
  g.fillStyle="#5a3a22";g.fillRect(2,wy,w-4,2);g.fillRect(2,wy,2,30);g.fillRect(w-4,wy,2,30);g.fillRect(w/2-14,wy,2,30);g.fillRect(w/2+12,wy,2,30);
  const dx=w/2-6;g.fillStyle="#3a2412";g.beginPath();g.moveTo(dx,h);g.lineTo(dx,wy+12);g.arc(dx+6,wy+12,6,Math.PI,0);g.lineTo(dx+12,h);g.fill();
  g.fillStyle="#7a4a26";g.fillRect(dx+2,wy+12,8,18);g.fillStyle="#e8c060";g.fillRect(dx+8,wy+20,2,2);
  for(const wx of [8,w-18]){g.fillStyle="#3a2a1a";g.fillRect(wx-1,wy+7,12,11);g.fillStyle="#ffd878";g.fillRect(wx,wy+8,10,9);g.fillStyle="#ffefb0";g.fillRect(wx,wy+8,4,4);g.fillStyle="#3a2a1a";g.fillRect(wx+4,wy+8,1,9);g.fillRect(wx,wy+12,10,1);
    g.fillStyle="#d0405a";g.fillRect(wx,wy+18,10,2);}
  const gr=g.createLinearGradient(0,0,0,wy+4);gr.addColorStop(0,s.roof[0]);gr.addColorStop(1,s.roof[1]);
  g.fillStyle=gr;g.beginPath();g.moveTo(-0,wy+4);g.lineTo(10,2);g.lineTo(w-10,2);g.lineTo(w,wy+4);g.fill();
  g.strokeStyle="rgba(0,0,0,.25)";for(let y=8;y<wy;y+=5){g.beginPath();for(let x=4;x<w;x+=6)g.arc(x,y,3,0,Math.PI);g.stroke();}
  g.strokeStyle="rgba(255,255,255,.3)";g.beginPath();g.moveTo(12,4);g.lineTo(w-12,4);g.stroke();
  g.strokeStyle="#f0c850";g.lineWidth=1.5;g.beginPath();g.moveTo(0,wy+4);g.lineTo(10,2);g.lineTo(w-10,2);g.lineTo(w,wy+4);g.stroke();
  g.lineWidth=1;g.beginPath();for(let x=12;x<w-12;x+=8){g.moveTo(x,2);g.bezierCurveTo(x+2,-1,x+4,5,x+8,2);}g.stroke();
  g.fillStyle=s.gem;g.shadowColor=s.gem;g.shadowBlur=6;g.beginPath();g.arc(w/2,8,2.5,0,7);g.fill();g.shadowBlur=0;
  const sign={inn:"INN",shop:"SHOP",harbor:"⚓ DOCK",forsale:b.owned?"HOME":"FOR SALE",castle:"♛",guild:"GUILD"}[b.kind];
  if(sign){g.font="bold 7px system-ui";const tw=g.measureText(sign).width+6;g.fillStyle="#2a1a10";g.fillRect(w/2-tw/2,wy-9,tw,9);g.strokeStyle="#e8c060";g.strokeRect(w/2-tw/2+.5,wy-8.5,tw-1,8);
    g.fillStyle="#ffe8a0";g.textAlign="center";g.fillText(sign,w/2,wy-2);}
  bldCache.set(key,c);return c;
}
function castleSprite(){const c=mkCanvas(192,176),g=c.getContext("2d");g.scale(2,2);
  g.fillStyle="#d8d0e0";g.fillRect(8,30,80,58);for(let x=8;x<88;x+=10){g.fillRect(x,24,6,8);}
  g.fillStyle="#b8b0c8";g.fillRect(0,14,20,74);g.fillRect(76,14,20,74);g.fillStyle="#6a3ac8";
  for(const x of [0,76]){g.beginPath();g.moveTo(x-2,16);g.lineTo(x+10,-2);g.lineTo(x+22,16);g.fill();}
  g.fillStyle="#3a2412";g.beginPath();g.moveTo(38,88);g.lineTo(38,62);g.arc(48,62,10,Math.PI,0);g.lineTo(58,88);g.fill();
  g.strokeStyle="#f0c850";g.lineWidth=2;g.strokeRect(8,30,80,58);g.fillStyle="#f0c850";g.font="bold 16px serif";g.textAlign="center";g.fillText("♛",48,50);
  g.fillStyle="#ffd878";for(const [x,y] of [[6,40],[82,40],[22,44],[68,44]])g.fillRect(x,y,6,8);return c;}
const SPR2={};
function makeMiscSprites(){
  SPR2.boat=(()=>{const c=mkCanvas(28,26),g=c.getContext("2d");g.fillStyle="#7a4a22";g.beginPath();g.moveTo(1,16);g.lineTo(27,16);g.lineTo(22,25);g.lineTo(6,25);g.fill();
    g.fillStyle="#a8743a";g.fillRect(3,16,22,3);g.strokeStyle="#f0c850";g.beginPath();g.moveTo(3,19);g.lineTo(25,19);g.stroke();
    g.fillStyle="#5a3a1a";g.fillRect(13,1,2,16);g.fillStyle="#f4ecd8";g.beginPath();g.moveTo(15,2);g.lineTo(25,14);g.lineTo(15,14);g.fill();g.fillStyle="#d04060";g.fillRect(15,8,6,2);return c;})();
  SPR2.way=[false,true].map(on=>{const c=mkCanvas(12,24),g=c.getContext("2d");g.fillStyle="#5a5468";g.beginPath();g.moveTo(2,24);g.lineTo(3,6);g.lineTo(6,1);g.lineTo(9,6);g.lineTo(10,24);g.fill();
    g.strokeStyle="#e8c060";g.beginPath();g.moveTo(4,20);g.bezierCurveTo(2,14,10,14,8,8);g.stroke();g.fillStyle=on?"#5ff":"#2a4a5a";if(on){g.shadowColor="#5ff";g.shadowBlur=8;}g.beginPath();g.arc(6,10,2.4,0,7);g.fill();return c;});
  SPR2.board=(()=>{const c=mkCanvas(16,18),g=c.getContext("2d");g.fillStyle="#5a3a1a";g.fillRect(2,8,2,10);g.fillRect(12,8,2,10);g.fillStyle="#9a6a3a";g.fillRect(0,1,16,10);g.strokeStyle="#e8c060";g.strokeRect(.5,1.5,15,9);
    g.fillStyle="#f4ecd8";g.fillRect(2,3,5,6);g.fillRect(9,3,5,5);return c;})();
  SPR2.chest=[0,1].map(o=>{const c=mkCanvas(14,12),g=c.getContext("2d");g.fillStyle="#8a4a1a";g.fillRect(1,o?5:3,12,o?7:9);g.fillStyle="#e8c060";g.fillRect(1,6,12,1);g.fillRect(6,5,2,3);
    if(!o){g.fillStyle="#a8602a";g.fillRect(1,2,12,4);}else{g.fillStyle="#3a1a0a";g.fillRect(2,3,10,3);}return c;});
  SPR2.wreck=(()=>{const c=mkCanvas(40,22),g=c.getContext("2d");g.fillStyle="#5a3a1a";g.save();g.translate(20,14);g.rotate(-.25);g.fillRect(-18,-4,36,9);g.fillStyle="#7a5a32";g.fillRect(-14,-6,4,4);g.fillRect(4,-14,2,12);g.restore();
    g.fillStyle="#d8d0c0";g.beginPath();g.moveTo(26,2);g.lineTo(34,8);g.lineTo(25,9);g.fill();return c;})();
  SPR2.cart=(()=>{const c=mkCanvas(30,20),g=c.getContext("2d");g.fillStyle="#8a5a2a";g.fillRect(8,6,20,9);g.fillStyle="#e8d8b0";g.beginPath();g.ellipse(18,6,10,6,0,Math.PI,0);g.fill();
    g.fillStyle="#3a2a1a";g.beginPath();g.arc(12,16,3,0,7);g.arc(24,16,3,0,7);g.fill();g.fillStyle="#a07850";g.fillRect(0,8,8,6);g.fillRect(1,5,3,3);return c;})();
  SPR2.castle=castleSprite();
  SPR2.partChunk=makeImg(6,6,img=>{fillRect(img,1,1,4,4,[150,40,50]);px(img,2,2,[200,90,90]);});
}
// ===== SPECIES =====
const SPECIES={
 goblin:{base:"grunt",beh:"agg",hp:3,aggro:90,biome:["forest","meadow"],gold:[2,6],drop:"trinket"},
 crawler:{base:"crawler",beh:"agg",hp:2,aggro:100,biome:["forest"],gold:[1,4],drop:"pelt"},
 spitter:{base:"spitter",beh:"agg",hp:2,aggro:130,biome:["mountain","ruins"],gold:[2,5],drop:"gem",dropP:.15},
 charger:{base:"charger",beh:"agg",hp:4,aggro:110,biome:["mountain"],gold:[3,7],drop:"horn"},
 scorchrat:{img:1,beh:"agg",hp:2,spd:.8,aggro:80,biome:["meadow","shore"],gold:[1,3],drop:"pelt"},
 umbrawl:{img:1,beh:"agg",hp:3,spd:.7,aggro:110,biome:["forest","meadow"],night:1,gold:[3,6],drop:"pelt"},
 gloomote:{img:1,beh:"agg",hp:4,spd:.5,aggro:120,biome:["ruins"],gold:[4,9],drop:"gem",dropP:.3},
 thornback:{img:1,beh:"neu",hp:5,spd:.45,biome:["forest"],gold:[2,5],drop:"pelt"},
 voltusk:{img:1,beh:"neu",hp:6,spd:.5,biome:["meadow"],herd:1,gold:[2,5],drop:"meat"},
 puffalo:{img:1,beh:"pea",hp:3,spd:.35,biome:["meadow"],herd:1,drop:"meat"},
 fluffin:{img:1,beh:"flee",hp:1,spd:.8,biome:["meadow"],drop:"meat"},
 mossnail:{img:1,beh:"pea",hp:2,spd:.15,biome:["forest"],drop:"herb"},
 sprigling:{img:1,beh:"flee",hp:2,spd:.7,biome:["forest"],drop:"herb"},
 lilyleap:{img:1,beh:"flee",hp:1,spd:.7,biome:["shore"],drop:"meat"},
 pondhop:{img:1,beh:"pea",hp:1,spd:.5,biome:["shore","meadow"],drop:"meat"},
 grovegiant:{img:1,beh:"neu",hp:20,spd:.4,rare:1,gold:[30,50],drop:"gem",w:28,h:18},
 tidemaw:{img:1,beh:"agg",hp:20,spd:.6,aggro:150,rare:1,swims:1,gold:[30,50],drop:"pearl",w:30,h:18},
 boss:{base:"boss",beh:"agg",hp:16,aggro:130,gold:[40,60],drop:"gem"},
 dragon:{beh:"agg",hp:40,spd:.5,aggro:170,gold:[120,200],drop:"scale",w:44,h:26}
};
let mobs=[];
function spawnMob(sp,x,y,extra){if(P)bestiary(sp);
  const d=SPECIES[sp];let e;
  if(d.base){e=spawnEnemy(d.base,x,y);if(d.base!=="boss")e.hp=e.maxHp=d.hp;}
  else{e={type:sp,x,y,w:d.w||12,h:d.h||10,vx:0,vy:0,hp:d.hp,maxHp:d.hp,dir:0,frame:0,anim:0,state:"wander",timer:0,atkCd:0,iframes:0,knockT:0,knockVx:0,knockVy:0,parts:{},dead:false,flash:0,spd:d.spd||.5,dmg:d.rare?2:1};
    if(d.img)e.img=IMG[sp];}
  e.sp=sp;e.def=d;if(d.chibi)foeSetup(e,d);e.hx=x;e.hy=y;e.swims=!!d.swims;e.wt=0;e.wx=x;e.wy=y;
  Object.assign(e,extra||{});mobs.push(e);return e;
}
// ===== DRAGONS =====
const DRAGONS={fire:{name:"Blazewyrm",breath:[255,140,40]},frost:{name:"Rimefang",breath:[160,230,255]},storm:{name:"Stormcoil",breath:[200,170,255]},forest:{name:"Verdant Wyrm",breath:[120,240,90]}};
function spawnDragon(kind,x,y,extra){
  const e=spawnMob("dragon",x,y,extra);e.dk=kind;e.dmg=2;e.hp=e.maxHp=40;
  const src=IMG["dragon_"+kind];const c=mkCanvas(src?src.width:112,src?src.height:63);if(src)c.getContext("2d").drawImage(src,0,0);e.img=c;
  e.parts={wings:true,tail:true,horns:true};e.phase=1;e.fly=0;e.persist=true;e.name=DRAGONS[kind].name;return e;
}
function severDragon(e,part,ang){
  const g=e.img.getContext("2d");const W2=e.img.width,H2=e.img.height;
  const reg={wings:[W2*0.55,0,W2*0.45,H2*0.55],tail:[0,H2*0.6,W2*0.35,H2*0.4],horns:[W2*0.18,H2*0.05,W2*0.25,H2*0.25]}[part];
  const piece=mkCanvas(reg[2]|0,reg[3]|0);piece.getContext("2d").drawImage(e.img,reg[0],reg[1],reg[2],reg[3],0,0,reg[2],reg[3]);
  g.globalCompositeOperation="destination-out";g.beginPath();g.ellipse(reg[0]+reg[2]/2,reg[1]+reg[3]/2,reg[2]/2,reg[3]/2,0,0,7);g.fill();g.globalCompositeOperation="source-over";
  e.parts[part]=false;toast(e.name+"'s "+part+" severed!");
  if(bloodOn){const sm=mkCanvas(Math.max(8,piece.width/2|0),Math.max(6,piece.height/2|0));sm.getContext("2d").drawImage(piece,0,0,sm.width,sm.height);
    parts.push({spr:sm,x:e.x+e.w/2,y:e.y+e.h/2,z:12,vx:Math.cos(ang)*2.5,vy:Math.sin(ang)*2.5,vz:3,rot:0,spin:.2,life:400,max:400,grounded:false});
    spray(e.x+e.w/2,e.y+e.h/2,12,ang,2);}
  else for(let i=0;i<10;i++){const a=Math.random()*7;particles.push({x:e.x+e.w/2,y:e.y+e.h/2,z:6,vx:Math.cos(a)*2,vy:Math.sin(a)*2,vz:2,life:25,max:25,col:C.dust,size:2,kind:"spark"});}
  SFX.roar();if(part==="wings"){e.fly=0;}
}
function updateDragon(e,dist,ang){
  if(e.iframes>0)e.iframes--;if(e.flash>0)e.flash--;if(e.atkCd>0)e.atkCd--;e.timer++;
  const r=e.hp/e.maxHp;const np=r>0.66?1:r>0.33?2:3;
  if(np!==e.phase){e.phase=np;toast(e.name+(np===2?" takes to the sky!":" is enraged!"));if(np===2&&e.parts.wings)e.fly=240;shake=8;}
  if(e.knockT>0){moveEntity(e,e.knockVx*.4,e.knockVy*.4);e.knockT--;return;}
  const sp=e.spd*(e.phase===3?1.5:1)*(e.parts.tail?1:0.8);
  if(e.fly>0){e.fly--;e.iframes=Math.max(e.iframes,2);e.x+=Math.cos(ang+Math.sin(e.timer*.03))*1.6;e.y+=Math.sin(ang+Math.sin(e.timer*.03))*1.6;
    if(e.timer%50===0)breath(e,ang,6);return;}
  if(dist>40)moveEntity(e,Math.cos(ang)*sp,Math.sin(ang)*sp);
  if(e.atkCd<=0){
    if(dist<38){e.atkCd=50;hurtHero(e.dmg+(e.parts.horns?1:0),ang);}
    else if(dist<150){e.atkCd=e.phase===3?45:80;breath(e,ang,e.phase===3?10:7);}
  }
  if(e.parts.tail&&dist<50&&e.timer%120===0){hurtHero(1,ang);shake=5;}
  if(e.parts.wings&&e.phase>=2&&e.timer%600===0)e.fly=150;
}
function breath(e,ang,n){const col=DRAGONS[e.dk].breath;for(let i=0;i<n;i++){const a=ang+(i-(n-1)/2)*0.12;
  projectiles.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:Math.cos(a)*2.4,vy:Math.sin(a)*2.4,life:80,r:3,dmg:1,col});}}
// overhead flying dragons (ambient)
let flyers=[];
function maybeFlyer(){if(flyers.length||Math.random()>0.0015)return;const k=pick(Object.keys(DRAGONS));const a=Math.random()*7;
  flyers.push({k,x:hero.x-Math.cos(a)*500,y:hero.y-Math.sin(a)*400,vx:Math.cos(a)*1.8,vy:Math.sin(a)*1.4,life:600});}
