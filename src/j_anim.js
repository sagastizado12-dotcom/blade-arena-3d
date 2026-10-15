// ===== ANIMATION RIGS & GRAPHICS POLISH =====
const tx0g=()=>Math.floor(camX/TILE),ty0g=()=>Math.floor(camY/TILE);
function sunVec(){if(!world)return{dx:2,dy:1,a:.28};const h=world.min/60;const t=clamp((h-6)/12,0,1);return{dx:(t-.5)*10,dy:1.5+Math.abs(t-.5)*3,a:darkness()>.3?.14:.28};}
function drawShadow(x,y,rx,ry){const s=sunVec();ctx.fillStyle=`rgba(20,0,30,${s.a})`;ctx.beginPath();ctx.ellipse(x+s.dx*rx/12,y+s.dy*.3,rx*(1+Math.abs(s.dx)/14),ry,0,0,7);ctx.fill();
  ctx.fillStyle=`rgba(20,0,30,${s.a*.6})`;ctx.beginPath();ctx.ellipse(x,y,rx*.6,ry*.7,0,0,7);ctx.fill();}
// ---- image monster rig: head / body / legs slices from the same sprite ----
const rigCache=new Map();
function sliceC(im,x,y,w,h){const c=mkCanvas(Math.max(1,w|0),Math.max(1,h|0));c.getContext("2d").drawImage(im,x,y,w,h,0,0,w,h);return c;}
function imgRig(im){let r=rigCache.get(im);if(r)return r;const W2=im.width,H2=im.height,ly=Math.round(H2*.7),hx=Math.round(W2*.38);
  r={W:W2/2,H:H2/2,legsL:sliceC(im,0,ly,W2/2,H2-ly),legsR:sliceC(im,W2/2,ly,W2/2,H2-ly),head:sliceC(im,0,0,hx,ly),body:sliceC(im,hx,0,W2-hx,ly),ly:ly/2,hx:hx/2};rigCache.set(im,r);return r;}
function drawImgMob(e){
  const r=imgRig(e.img);const t=frameN+(e.x|0);const moving=Math.abs(e.x-(e.px||e.x))+Math.abs(e.y-(e.py||e.y))>0.05;e.px=e.x;e.py=e.y;
  const ph=moving?t*0.35*(e.spd||.5)*2:0;const breathe=Math.sin(t*0.06)*0.03;
  const dying=e.dead?clamp(1-e.flash/30,0,1):0;
  drawShadow(e.x+e.w/2,e.y+e.h-1,r.W*.38*(1-dying*.2),3);
  let lean=0,lx=0;if(e.wind>0){lean=-0.12;lx=-2;}if(e.lunge>0){lean=0.12;lx=4*(e.lunge/10);}
  const flinch=e.iframes>0&&!e.dead?Math.sin(e.iframes*2)*1.5:0;
  ctx.save();ctx.translate(Math.floor(e.x+e.w/2)+flinch,Math.floor(e.y+e.h));
  if(e.dir===2)ctx.scale(-1,1);
  if(dying){ctx.rotate(dying*0.5);ctx.scale(1,1-dying*.55);ctx.globalAlpha=1-dying*.7;}
  ctx.translate(-lx,0);
  if(e.flash>0&&!e.dead)ctx.filter="brightness(2.2)";
  const bob=moving?Math.abs(Math.sin(ph))*-1.6:0;const L=Math.sin(ph)*1.8;
  ctx.drawImage(r.legsL,-r.W/2+L*.4,-r.H+r.ly+Math.max(0,L)*-.8,r.W/2,r.H-r.ly);
  ctx.drawImage(r.legsR,0-L*.4,-r.H+r.ly+Math.max(0,-L)*-.8,r.W/2,r.H-r.ly);
  ctx.save();ctx.translate(0,-r.H+r.ly+bob);ctx.rotate(lean);ctx.scale(1+breathe*.5,1+breathe);
  ctx.drawImage(r.body,-r.W/2+r.hx,-r.ly,r.W-r.hx,r.ly);
  if(!e.cutHead){const hb=Math.sin(ph+1)*0.8+Math.sin(t*0.05)*0.5;ctx.drawImage(r.head,-r.W/2,-r.ly+hb,r.hx,r.ly);}
  ctx.restore();ctx.filter="none";ctx.restore();ctx.globalAlpha=1;
  if(!e.dead&&(e.def.rare||e.provoked&&e.hp<e.maxHp)){const y=e.y+e.h-r.H-5;ctx.fillStyle="#300";ctx.fillRect(e.x,y,e.w,2);ctx.fillStyle="#e44";ctx.fillRect(e.x,y,e.w*e.hp/e.maxHp,2);}
}
function rigDeath(e,ang){if(!e.img||e.sp==="dragon")return;e.flash=30;const r=imgRig(e.img);
  if(bloodOn&&!e.cutHead){e.cutHead=true;const sm=mkCanvas(Math.ceil(r.hx),Math.ceil(r.ly));sm.getContext("2d").drawImage(r.head,0,0,sm.width,sm.height);
    parts.push({spr:sm,x:e.x+e.w/2,y:e.y,z:8,vx:Math.cos(ang)*2.2,vy:Math.sin(ang)*2.2,vz:2.5,rot:0,spin:(Math.random()-.5)*.4,life:260,max:260,grounded:false});}}
// ---- pixel monsters (goblins etc.): bob, squash, windup lunge, collapse ----
function drawEnemy(e){const spr=enemySprite(e);const t=frameN+(e.x|0);const moving=Math.abs(e.x-(e.px||e.x))+Math.abs(e.y-(e.py||e.y))>0.05;e.px=e.x;e.py=e.y;
  drawShadow(e.x+e.w/2,e.y+e.h-1,e.w*.4,2.5);const dying=e.dead?clamp(1-e.flash/6,0,1):0;
  ctx.save();ctx.translate(Math.floor(e.x+e.w/2),Math.floor(e.y+e.h+2));if(e.dir===1)ctx.scale(-1,1);
  const sq=moving?Math.abs(Math.sin(t*.3))*.08:Math.sin(t*.07)*.03;const win=e.state==="windup"||e.state==="slam"?.1:0;
  ctx.rotate(dying*1.2+(e.state==="charge"?.15:0));ctx.scale(1+sq-win*.5,1-sq+win);
  if(e.flash>0)ctx.filter="brightness(2)";if(e.state==="windup")ctx.filter="brightness(1.4) saturate(1.6)";
  const off=e.type==="boss"?24:16;ctx.drawImage(spr,-off/2-(e.type==="boss"?2:0),-off-(moving?Math.abs(Math.sin(t*.3))*1.5:0));ctx.filter="none";ctx.restore();
  if(e.type==="boss"&&!e.dead){ctx.fillStyle="#200";ctx.fillRect(e.x-2,e.y-8,24,4);ctx.fillStyle="#c44";ctx.fillRect(e.x-1,e.y-7,22*(e.hp/e.maxHp),2);}}
// ---- dragon rig: head, wings, tail, body from one image; severable ----
function spawnDragon(kind,x,y,extra){
  const e=spawnMob("dragon",x,y,extra);e.dk=kind;e.dmg=2;e.hp=e.maxHp=40;
  const src=IMG["dragon_"+kind];const W2=src?src.width:224,H2=src?src.height:126;const full=mkCanvas(W2,H2);if(src)full.getContext("2d").drawImage(src,0,0);
  const R2={head:[0,.04,.38,.55],wings:[.45,0,.55,.55],tail:[0,.58,.5,.42]};const rig={W:W2/2,H:H2/2,p:{},r:R2};
  const body=mkCanvas(W2,H2);const bg=body.getContext("2d");bg.drawImage(full,0,0);
  for(const k in R2){const [a,b,c,d]=R2[k];rig.p[k]=sliceC(full,a*W2,b*H2,c*W2,d*H2);bg.clearRect(a*W2,b*H2,c*W2,d*H2);}
  rig.body=body;e.rig=rig;e.img=full;
  e.parts={wings:true,tail:true,horns:true};e.phase=1;e.fly=0;e.persist=true;e.name=DRAGONS[kind].name;e.breathT=0;return e;
}
function severDragon(e,part,ang){
  const rig=e.rig;let piece;
  if(part==="horns"){const h=rig.p.head;piece=sliceC(h,0,0,h.width*.6,h.height*.35);h.getContext("2d").clearRect(0,0,h.width*.6,h.height*.35);}
  else piece=rig.p[part];
  e.parts[part]=false;toast(e.name+"'s "+part+" severed!");SFX.roar();onSever(e,part);
  if(bloodOn){const sm=mkCanvas(Math.ceil(piece.width/2),Math.ceil(piece.height/2));sm.getContext("2d").drawImage(piece,0,0,sm.width,sm.height);
    parts.push({spr:sm,x:e.x+e.w/2,y:e.y+e.h/2,z:14,vx:Math.cos(ang)*2.5,vy:Math.sin(ang)*2.5,vz:3,rot:0,spin:.15,life:420,max:420,grounded:false});spray(e.x+e.w/2,e.y+e.h/2,12,ang,2);}
  else for(let i=0;i<10;i++){const a=Math.random()*7;particles.push({x:e.x+e.w/2,y:e.y+e.h/2,z:6,vx:Math.cos(a)*2,vy:Math.sin(a)*2,vz:2,life:25,max:25,col:C.dust,size:2,kind:"spark"});}
  if(part==="wings")e.fly=0;
}
function breath(e,ang,n){e.breathT=34;e.breathAng=ang;const col=DRAGONS[e.dk].breath;setTimeout(()=>{for(let i=0;i<n;i++){const a=ang+(i-(n-1)/2)*0.12;
  projectiles.push({x:e.x+e.w/2+Math.cos(ang)*20,y:e.y+e.h/2+Math.sin(ang)*10,vx:Math.cos(a)*2.4,vy:Math.sin(a)*2.4,life:80,r:3,dmg:1,col});}},window.__FAST?0:300);}
function drawDragon(e){const rig=e.rig;if(!rig)return;const t=frameN+e.uid0;const fly=e.fly>0?18+Math.sin(frameN*.1)*4:0;const dying=e.dead?clamp(1-e.flash/12,0,1):0;
  drawShadow(e.x+e.w/2,e.y+e.h,rig.W*.4*(fly?0.8:1),6);
  const flip=hero.x>e.x;const W2=rig.W,H2=rig.H,R2=rig.r;
  ctx.save();ctx.translate(Math.floor(e.x+e.w/2),Math.floor(e.y+e.h-fly));if(flip)ctx.scale(-1,1);if(dying){ctx.rotate(dying*.4);ctx.globalAlpha=1-dying*.5;}
  if(e.flash>0&&!e.dead)ctx.filter="brightness(1.9)";
  const ox=-W2/2,oy=-H2+4,br=Math.sin(t*.05)*.02;
  const P=(k,dx,dy,rot,sx,sy,px,py)=>{const [a,b,c,d]=R2[k];const x=ox+a*W2,y=oy+b*H2,w=c*W2,h=d*H2;ctx.save();ctx.translate(x+px*w+dx,y+py*h+dy);ctx.rotate(rot);ctx.scale(sx,sy);ctx.drawImage(rig.p[k],-px*w,-py*h,w,h);ctx.restore();};
  if(e.parts.tail)P("tail",0,0,Math.sin(t*.04)*.12,1,1,.85,.2);
  ctx.save();ctx.scale(1+br,1-br);ctx.drawImage(rig.body,ox,oy,W2,H2);ctx.restore();
  const flapSp=fly?.3:.06;const flap=Math.sin(t*flapSp);
  if(e.parts.wings)P("wings",0,fly?flap*2:0,fly?flap*.1:flap*.03,1,fly?.75+.35*flap:.96+.04*flap,.1,.95);
  const bt=e.breathT>0?Math.sin((34-e.breathT)/34*Math.PI):0;
  P("head",-bt*3,Math.sin(t*.07)*1.5-bt*4,-bt*.18+Math.sin(t*.05)*.03,1,1,.85,.75);
  ctx.filter="none";
  if(e.breathT>0){e.breathT--;ctx.globalCompositeOperation="lighter";const col=DRAGONS[e.dk].breath;const mx=ox+W2*.05-bt*3,my=oy+H2*.3-bt*4;
    const g=ctx.createRadialGradient(mx,my,1,mx,my,14+bt*10);g.addColorStop(0,`rgba(255,255,220,${bt})`);g.addColorStop(.5,`rgba(${col[0]},${col[1]},${col[2]},${bt*.7})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,24,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";}
  ctx.restore();ctx.globalAlpha=1;
  if(!e.dead){const bw=60;ctx.fillStyle="#200";ctx.fillRect(e.x+e.w/2-bw/2-1,e.y-H2-fly+2,bw+2,5);ctx.fillStyle="#f43";ctx.fillRect(e.x+e.w/2-bw/2,e.y-H2-fly+3,bw*e.hp/e.maxHp,3);
    ctx.font="bold 7px system-ui";ctx.textAlign="center";ctx.fillStyle="#ffe";ctx.fillText(e.name+" · phase "+e.phase,e.x+e.w/2,e.y-H2-fly-1);}}
function drawMob(e){if(e.dead&&e.flash<=0)return;if(e.chibi)return drawFoe(e);if(e.sp==="dragon"){if(e.uid0==null)e.uid0=(Math.random()*999)|0;return drawDragon(e);}if(e.img)return drawImgMob(e);drawEnemy(e);}
// ---- hero / NPC animation ----
function drawNpc(n){const s=npcSprites(n)[n.frame];const child=n.age<15;const t=frameN+n.id*13;const mv=Math.abs(n.x-(n.px||n.x))+Math.abs(n.y-(n.py||n.y))>0.05;n.px=n.x;n.py=n.y;
  drawShadow(n.x+8,n.y+15,5,2);ctx.save();ctx.translate(Math.floor(n.x+8),Math.floor(n.y+16));if(n.dir===1)ctx.scale(-1,1);
  const sc=child?0.72:1;const bob=mv?-Math.abs(Math.sin(t*.25))*1.4:0;const br=mv?0:Math.sin(t*.05)*.025;ctx.scale(sc,sc*(1+br));ctx.rotate(mv?Math.sin(t*.25)*.05:0);ctx.drawImage(s,-8,-16+bob);ctx.restore();
  if(n.spouse===-1||P.dating.includes(n.id)){ctx.fillStyle="#ff6a9a";ctx.font="7px system-ui";ctx.textAlign="center";ctx.fillText("♥",n.x+8,n.y-(child?0:2)+Math.sin(t*.08));}
  if(n.role==="leader"){ctx.fillStyle="#ffd84a";ctx.fillRect(n.x+6,n.y-1,4,2);}
  if(n.cheer&&world&&absMin()<n.cheer){ctx.font="8px system-ui";ctx.textAlign="center";ctx.fillStyle="#ffe060";ctx.fillText(pick(["♪","!","★"]),n.x+8,n.y-6-Math.abs(Math.sin(frameN*.2+n.id))*4);}}
function drawHeroFull(){const t=frameN;const mv=Math.abs(hero.x-(hero.px||hero.x))+Math.abs(hero.y-(hero.py||hero.y))>0.05;hero.px=hero.x;hero.py=hero.y;
  if(hero.castT>0)hero.castT--;
  if(hero.boat){ctx.save();ctx.translate(hero.x-8+14,hero.y-6+20);ctx.rotate(Math.sin(t*.05)*.05);ctx.drawImage(SPR2.boat,-14,-20+Math.sin(t*.08));ctx.restore();
    if(mv&&t%6===0)particles.push({x:hero.x+6,y:hero.y+14,z:0,vx:-(hero.x-hero.px)*.3,vy:0,vz:0,life:30,max:30,col:[230,250,255],size:2,kind:"spark"});}
  if(hero.dead)return;if(hero.iframes>0&&Math.floor(hero.iframes/3)%2===0)return;
  const WS=walkState(hero,hero.swim||hero.boat?0:Math.hypot(hero.vx||0,hero.vy||0),true);const spr=chibi(HERO_LOOK,hero.dir,hero.castT>0?6:hero.swinging>=0?4:hero.iframes>28&&!(hero.dodgeT>0)?7:hero.swim?0:WS.fr);
  const clipH=hero.swim?10:hero.boat?13:99;
  if(!hero.boat&&!hero.swim)drawShadow(hero.x+6,hero.y+12,6+WS.bob*.5,2.5);
  ctx.save();if(clipH<99){ctx.beginPath();ctx.rect(hero.x-10,hero.y-26,34,clipH+26);ctx.clip();}
  const bob=(hero.jumpT>0?-Math.sin(hero.jumpT/16*Math.PI)*6:0)+(hero.swim?Math.sin(t*(hero.sprinting?.3:.12))*1.2:WS.bob);const br=WS.spd>0.2?0:Math.sin(t*.06)*.03;
  ctx.translate(Math.floor(hero.x+6),Math.floor(hero.y+12));ctx.scale(1,1+br-(hero.castT>0?-.06:0));ctx.rotate(hero.swim?0:WS.lean);
  ctx.drawImage(spr,-CW/2,-CHH+2+bob-(hero.castT>0?2:0));ctx.restore();
  if(hero.swim){ctx.strokeStyle="rgba(255,255,255,.75)";const s=Math.sin(t*(hero.sprinting?.4:.15));ctx.beginPath();ctx.ellipse(hero.x+6,hero.y+8,8+s,3,0,0,7);ctx.stroke();
    ctx.strokeStyle="rgba(220,240,255,.8)";ctx.beginPath();ctx.arc(hero.x+6+s*6,hero.y+5,3,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.arc(hero.x+6-s*6,hero.y+5,3,Math.PI,0);ctx.stroke();}
  if(hero.swinging>=0&&hero.swinging<4){const cx=hero.x+6,cy=hero.y+4;const dirs=[[0,1],[-1,0],[1,0],[0,-1]];const [dx,dy]=dirs[hero.dir];const base=Math.atan2(dy,dx);
    ctx.globalCompositeOperation="lighter";const blade=P.mag&&P.mag.blade>0;for(let i=0;i<4;i++){ctx.strokeStyle=blade?`rgba(255,110,230,${.5-i*.11})`:`rgba(210,230,255,${.55-i*.12})`;ctx.lineWidth=3-i*.5;ctx.beginPath();
      ctx.arc(cx,cy,15-i*1.5,base-1.1+hero.swinging*.45-i*.12,base-0.3+hero.swinging*.45-i*.12);ctx.stroke();}ctx.lineWidth=1;ctx.globalCompositeOperation="source-over";}
  if(hero.castT>0){ctx.globalCompositeOperation="lighter";const c=SPELLS[curSpell].col,a=hero.castT/20;const g=ctx.createRadialGradient(hero.x+6,hero.y-4,1,hero.x+6,hero.y-4,14);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(.4,`rgba(${c[0]},${c[1]},${c[2]},${a*.8})`);g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(hero.x+6,hero.y-4,14,0,7);ctx.fill();
    ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},${a})`;ctx.beginPath();ctx.ellipse(hero.x+6,hero.y+12,10*(1.2-a*.2),4,0,0,7);ctx.stroke();ctx.globalCompositeOperation="source-over";}
  if(P.king){ctx.fillStyle="#ffd84a";ctx.beginPath();ctx.moveTo(hero.x+1,hero.y-3);ctx.lineTo(hero.x+3,hero.y-7);ctx.lineTo(hero.x+6,hero.y-4);ctx.lineTo(hero.x+9,hero.y-7);ctx.lineTo(hero.x+11,hero.y-3);ctx.fill();}}
// ---- ground FX: animated water, grass sway ----
const waveTex=(()=>{const c=mkCanvas(64,32),g=c.getContext("2d");g.strokeStyle="rgba(200,240,255,.55)";g.lineWidth=1.2;for(let i=0;i<5;i++){const y=4+i*6;g.beginPath();for(let x=0;x<=64;x+=2)g.lineTo(x,y+Math.sin(x/64*Math.PI*4+i)*1.6);g.stroke();}return c;})();
function wind(){return Math.sin(frameN*.013)*.6+Math.sin(frameN*.031)*.3+(world&&world.weather==="storm"?1:0);}
function drawGroundFX(tx0,ty0){const tx1=tx0+Math.ceil(W/TILE)+1,ty1=ty0+Math.ceil(H/TILE)+1;const wv=wind();const off=(frameN*.25)%32;
  ctx.globalAlpha=.35;ctx.globalCompositeOperation="lighter";
  for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){const t=tAt(x,y);if(t===DEEP||t===SHAL){const sx=((x*16+off+y*7)%48+48)%48;ctx.drawImage(waveTex,sx,(y%4)*6,16,16,x*16,y*16+Math.sin(frameN*.03+x)*1.2,16,16);}}
  ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;
  const G=GRASSC[season()];ctx.strokeStyle=G[2];ctx.lineWidth=.8;ctx.beginPath();
  for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){const t=tAt(x,y);if(t!==GRASS&&t!==FLOWER)continue;for(let k=0;k<2;k++){const h=hash2(x,y,300+k);if(h>.55)continue;
    const bx=x*16+hash2(x,y,310+k)*16,by=y*16+hash2(x,y,320+k)*16;const sw=(wv+Math.sin(frameN*.05+bx*.1))*1.6;ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+sw*.4,by-2.5,bx+sw,by-5);ctx.moveTo(bx+2,by);ctx.quadraticCurveTo(bx+2+sw*.4,by-2,bx+2+sw*.8,by-4);}}
  ctx.stroke();ctx.strokeStyle=G[1];ctx.beginPath();
  for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){const t=tAt(x,y);if(t!==GRASS)continue;const h=hash2(x,y,340);if(h>.3)continue;const bx=x*16+8,by=y*16+12;const sw=(wv+Math.sin(frameN*.05+bx*.1))*1.4;ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+sw*.4,by-3,bx+sw,by-6);}
  ctx.stroke();ctx.lineWidth=1;}
function drawCanopies(){const tx0=tx0g()-1,ty0=ty0g()-1,tx1=tx0+Math.ceil(W/TILE)+3,ty1=ty0+Math.ceil(H/TILE)+3;const wv=wind();const cs=TILESET.canopy;
  const hx=hero.x+6,hy=hero.y+6;
  for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){if(tAt(x,y)!==TREE)continue;const v=Math.floor(hash2(x,y,5)*4);const sh=chopShake.get(y*WW+x)||0;const sw=(wv+Math.sin(frameN*.04+x*.7+y*.3))*.9+Math.sin(sh*1.8)*sh*.25;
    const cx=x*16-4+sw,cy=y*16-12;const behind=hy<y*16+4&&hy>y*16-18&&Math.abs(hx-(x*16+8))<12;if(behind)ctx.globalAlpha=.55;
    ctx.drawImage(cs[v],cx,cy,24,22);ctx.globalAlpha=1;}}
// ---- torches & glow ----
let torchList=null;
function drawTorches(){if(!torchList){torchList=[];for(const s of SETS)for(const [dx,dy] of [[-4,-3],[4,-3],[-4,3],[4,3]])torchList.push({x:(s.x+dx)*16+8,y:(s.y+dy)*16+8});if(castleObj)torchList.push({x:castleObj.x*16+30,y:(castleObj.y+3)*16},{x:castleObj.x*16+66,y:(castleObj.y+3)*16});}
  const dk=darkness();
  for(const t of torchList){if(t.x<camX-40||t.x>camX+W+40||t.y<camY-40||t.y>camY+H+40)continue;
    ctx.fillStyle="#4a3020";ctx.fillRect(t.x-1,t.y-10,2,10);ctx.fillStyle="#e8c060";ctx.fillRect(t.x-2,t.y-11,4,2);
    const f=Math.sin(frameN*.3+t.x)*.5+Math.random()*.4;ctx.globalCompositeOperation="lighter";
    ctx.fillStyle="#ff9a30";ctx.beginPath();ctx.ellipse(t.x,t.y-13-f,2,3.5+f,0,0,7);ctx.fill();ctx.fillStyle="#fff2a0";ctx.beginPath();ctx.ellipse(t.x,t.y-12.5,1,2,0,0,7);ctx.fill();
    if(dk>0.05){const r=46+f*4;const g=ctx.createRadialGradient(t.x,t.y-10,2,t.x,t.y-10,r);g.addColorStop(0,`rgba(255,170,80,${dk*.75})`);g.addColorStop(1,"rgba(255,120,40,0)");ctx.fillStyle=g;ctx.fillRect(t.x-r,t.y-10-r,r*2,r*2);}
    ctx.globalCompositeOperation="source-over";if(Math.random()<.05)particles.push({x:t.x,y:t.y,z:14,vx:(Math.random()-.5)*.2,vy:0,vz:.3,life:30,max:30,col:[255,200,90],size:1,kind:"spark"});}
  // gem bloom on buildings
  ctx.globalCompositeOperation="lighter";for(const b of buildings){const x=b.x*16+32,y=(b.y+b.h)*16-56;if(x<camX-40||x>camX+W+40||y<camY-40||y>camY+H+40)continue;
    const g=ctx.createRadialGradient(x,y+8,0,x,y+8,9);g.addColorStop(0,`rgba(255,255,255,${.35+.15*Math.sin(frameN*.05+b.id)})`);g.addColorStop(1,"rgba(150,200,255,0)");ctx.fillStyle=g;ctx.fillRect(x-9,y-1,18,18);}
  ctx.globalCompositeOperation="source-over";}
// ---- parallax clouds ----
const cloudSpr=(()=>{const c=mkCanvas(120,60),g=c.getContext("2d");for(let i=0;i<9;i++){const x=20+hash2(i,1,9)*80,y=20+hash2(i,2,9)*20,r=12+hash2(i,3,9)*14;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,"rgba(255,255,255,.9)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}return c;})();
function drawClouds(){const wth=world.weather;const n=wth==="clear"?4:7;const dk=darkness();
  for(let i=0;i<n;i++){const span=W+260;const sx=((hash2(i,7,1)*span+frameN*(.15+i*.03)-camX*.25)%span+span)%span-130;const sy=((hash2(i,8,1)*(H+120)-camY*.25)%(H+120)+H+120)%(H+120)-60;
    ctx.globalAlpha=.10;ctx.filter="none";ctx.drawImage(cloudSpr,sx+30,sy+40,160,80);// ground shadow tint
    ctx.globalAlpha=(wth==="clear"?.16:.28)*(1-dk);ctx.drawImage(cloudSpr,sx,sy,170,85);}ctx.globalAlpha=1;}
// ---- elevation parallax: peak highlights shift slightly with the camera; lookouts ----
function drawPeaks(){const tx0=tx0g(),ty0=ty0g(),tx1=tx0+Math.ceil(W/TILE)+1,ty1=ty0+Math.ceil(H/TILE)+1;const ccx=camX+W/2,ccy=camY+H/2;const snow=season()===3||true;
  for(let y=ty0;y<=ty1;y++)for(let x=tx0;x<=tx1;x++){const e=elevAt(x,y);if(e<2)continue;const t=tAt(x,y);if(t!==MTN&&t!==ROCK)continue;
    const px=x*16+8,py=y*16+8;const ox=(px-ccx)*0.02*e,oy=(py-ccy)*0.02*e-e;
    ctx.fillStyle=e===3?"rgba(250,252,255,.55)":"rgba(255,245,220,.18)";ctx.beginPath();ctx.ellipse(px+ox,py+oy,6,4,0,0,7);ctx.fill();}}
function drawLookout(o){const x=o.x*16,y=o.y*16;drawShadow(x+8,y+15,6,2);ctx.fillStyle="#5a3a1a";ctx.fillRect(x+7,y+4,2,12);ctx.fillRect(x+3,y+14,10,2);
  ctx.save();ctx.translate(x+8,y+4);ctx.rotate(-.5+Math.sin(frameN*.01)*.2);ctx.fillStyle="#c8a040";ctx.fillRect(-2,-2,12,4);ctx.fillStyle="#7ff";ctx.fillRect(9,-1.5,2,3);ctx.restore();
  ctx.globalCompositeOperation="lighter";ctx.fillStyle=`rgba(120,255,255,${.25+.15*Math.sin(frameN*.06)})`;ctx.beginPath();ctx.arc(x+8,y+4,7,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";}
function drawNpc(n){const t=frameN+n.id*13;const mv=Math.abs(n.x-(n.px||n.x))+Math.abs(n.y-(n.py||n.y))>0.05;if(!(n.pauseT>0))n.vdir=dir4(n.x-(n.px||n.x),n.y-(n.py||n.y),n.vdir||0);n.px=n.x;n.py=n.y;
  const child=n.age<15;drawShadow(n.x+8,n.y+15,5,2);const WN=walkState(n,Math.hypot(n.x-(n.px0==null?n.x:n.px0),n.y-(n.py0==null?n.y:n.py0)),false);n.px0=n.x;n.py0=n.y;const fr=n.gest>0?4:WN.fr>=10?WN.fr:(n.cheer&&world&&absMin()<n.cheer?(Math.floor(t/12)%2?4:0):0);
  const bob=WN.spd>0.05?WN.bob:Math.sin(t*.05)*.4;const LK=npcLookC(n);const sway=LK.fem?WN.sway:0;if(sway||WN.lean){ctx.save();ctx.translate(n.x+8,n.y+16);ctx.rotate(WN.lean+sway*.04);ctx.translate(-(n.x+8)+sway*.6,-(n.y+16));drawChibi(LK,n.x+8,n.y+16+bob,n.vdir,fr,child?0.75:1);ctx.restore();}else drawChibi(LK,n.x+8,n.y+16+bob,n.vdir,fr,child?0.75:1);
  if(n.spouse===-1||P.dating.includes(n.id)){ctx.fillStyle="#ff6a9a";ctx.font="7px system-ui";ctx.textAlign="center";ctx.fillText("♥",n.x+8,n.y-14+Math.sin(t*.08));}
  if(n.adv&&(P.party||[]).includes(n.id)){ctx.font="bold 6px system-ui";ctx.textAlign="center";ctx.fillStyle="#9ef";ctx.fillText(n.name,n.x+8,n.y-15);}
  if(n.cheer&&world&&absMin()<n.cheer){ctx.font="8px system-ui";ctx.textAlign="center";ctx.fillStyle="#ffe060";ctx.fillText("★",n.x+8,n.y-16-Math.abs(Math.sin(frameN*.2+n.id))*4);}}
