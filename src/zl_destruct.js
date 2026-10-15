// ===== CASTLE/POST DRAWING, DEMON LAND MOOD, MAP TINT, DESTRUCTIBLE STRUCTURES =====
function drawCapCastle(c){const k=KINGDOMS[c.k];const x=c.x*16,y=(c.y+3)*16-88;ctx.save();if(k.demon)ctx.filter="hue-rotate(250deg) saturate(1.6) brightness(.55)";ctx.drawImage(SPR2.castle,x,y,96,88);ctx.restore();
  if(k.demon){ctx.fillStyle="#1a0814";for(const [sx,h] of [[6,40],[22,54],[48,64],[74,54],[90,40]]){ctx.beginPath();ctx.moveTo(x+sx-6,y+30);ctx.lineTo(x+sx,y+30-h);ctx.lineTo(x+sx+6,y+30);ctx.fill();}
    ctx.fillStyle=`rgba(255,60,40,${0.5+0.3*Math.sin(frameN*.08)})`;ctx.fillRect(x+44,y+44,8,6);ctx.fillRect(x+20,y+50,4,4);ctx.fillRect(x+72,y+50,4,4);}
  else{for(const fx of [8,86]){ctx.fillStyle="#5a4030";ctx.fillRect(x+fx,y-6,1,14);ctx.fillStyle=k.col;ctx.fillRect(x+fx+1,y-6+Math.sin(frameN*.1+fx)*1,7,5);}}
  const d=(world.cdmg||{})[c.s]||0;if(d>0.05)drawDamage({x,y:y+20,w:96,h:68,id:c.s+900},d);}
function drawBorderPost(p){const x=p.x*16+8,y=p.y*16;ctx.fillStyle="#5a3a22";ctx.fillRect(x-14,y-18,3,26);ctx.fillRect(x+12,y-18,3,26);ctx.fillRect(x-14,y-18,29,3);
  const A=KINGDOMS[p.a],B=KINGDOMS[p.b];const w=Math.sin(frameN*.1)*1;ctx.fillStyle=A.col;ctx.fillRect(x-11,y-15+w,9,6);ctx.fillStyle=B.col;ctx.fillRect(x+3,y-15-w,9,6);ctx.fillStyle="#f4e8c8";ctx.font="5px sans-serif";ctx.textAlign="center";ctx.fillText("BORDER",x,y-20);}
// damage stages: cracks -> holes+smoke -> rubble; scaffolding + workers while repairing
function drawDamage(b,dmg){const {x,y,w,h,id}=b;ctx.save();ctx.strokeStyle="rgba(30,15,10,.85)";ctx.lineWidth=1;
  for(let i=0;i<4+Math.floor(dmg*6);i++){const sx=x+6+hash2(id,i,3)*(w-12),sy=y+6+hash2(id,i,4)*(h-16);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+4,sy+5);ctx.lineTo(sx+1,sy+9);ctx.lineTo(sx+5,sy+13);ctx.stroke();}
  if(dmg>=0.35){ctx.fillStyle="#140a08";for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x+10+hash2(id,i,5)*(w-20),y+10+hash2(id,i,6)*(h-24),5,4,0,0,7);ctx.fill();}
    if(frameN%6===0)burst(x+w*hash2(id,frameN,7),y+h*0.3,[90,90,90],1,0.3,2);}
  if(dmg>=0.7){ctx.fillStyle="#6a5a4a";for(let i=0;i<9;i++){const rx=x+hash2(id,i,8)*w,ry=y+h-6-hash2(id,i,9)*10;ctx.fillRect(rx,ry,6+hash2(id,i,10)*6,4+hash2(id,i,11)*3);}ctx.fillStyle="#3a3028";ctx.fillRect(x+4,y+h-4,w-8,4);}
  const h2=hour();if(h2>=7&&h2<19){ctx.strokeStyle="#9a7448";ctx.lineWidth=1.5;for(const sx of [x+2,x+w-4]){ctx.beginPath();ctx.moveTo(sx,y+h);ctx.lineTo(sx,y+4);ctx.stroke();}for(let yy=y+10;yy<y+h;yy+=14){ctx.beginPath();ctx.moveTo(x+2,yy);ctx.lineTo(x+w-4,yy);ctx.stroke();}
    const L=chibiLook(id*31,"smith","human");const hm=Math.floor(frameN/10)%2;drawChibi(L,x+w-10,y+h+2,1,hm?4:0,0.8);if(hm&&frameN%20===0){ctx.fillStyle="#ffd860";ctx.fillRect(x+w-18,y+h-12,2,2);}}
  ctx.restore();}
{const _db=drawBuilding;drawBuilding=function(b){_db(b);const st=world.bld[b.id];if(st&&st.dmg>0.05){const s0=buildingSprite(b);drawDamage({x:b.x*16,y:(b.y+b.h)*16-s0.lh,w:s0.lw,h:s0.lh,id:b.id},st.dmg);}};}
// demon land mood: red sky tint + lava cracks + ash
const inDemonLand=()=>hero&&kAtTile(hero.x/TILE|0,hero.y/TILE|0)===3&&hero.y/TILE>420;
const _drawMood=draw;draw=function(){_drawMood();if(!hero||!world||room||state!=="play")return;if(!inDemonLand())return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);
  const x0=camX/TILE|0,y0=camY/TILE|0;for(let ty=y0;ty<y0+H/TILE+2;ty++)for(let tx=x0;tx<x0+W/TILE+2;tx++){if(tAt(tx,ty)!==MUD||hash2(tx,ty,606)>0.06)continue;const g=0.55+0.35*Math.sin(frameN*.05+tx);ctx.strokeStyle=`rgba(255,${80+hash2(tx,ty,1)*60|0},30,${g})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tx*16+2,ty*16+4);ctx.lineTo(tx*16+7,ty*16+9);ctx.lineTo(tx*16+5,ty*16+13);ctx.lineTo(tx*16+12,ty*16+15);ctx.stroke();}
  ctx.setTransform(1,0,0,1,0,0);const CWd=ctx.canvas.width,CHd=ctx.canvas.height;ctx.fillStyle="rgba(110,10,60,.26)";ctx.fillRect(0,0,CWd,CHd);const gr=ctx.createLinearGradient(0,0,0,CHd*0.5);gr.addColorStop(0,"rgba(170,20,50,.35)");gr.addColorStop(1,"rgba(170,20,50,0)");ctx.fillStyle=gr;ctx.fillRect(0,0,CWd,CHd*0.5);ctx.setTransform(RS,0,0,RS,0,0);
  ctx.fillStyle="rgba(200,190,190,.6)";for(let i=0;i<24;i++){const ax=(i*53+frameN*0.3)%W,ay=(i*37+frameN*0.5)%H;ctx.fillRect(ax,ay,1,1);}ctx.restore();};
// map tint: kingdom colors + borders
{const _bw=buildWorldMap;buildWorldMap=function(){_bw();try{if(!KGRID)buildKGrid();const g=worldMapC.getContext("2d");const id=g.getImageData(0,0,WW,WH),d=id.data;
  for(let y=0;y<WH;y++)for(let x=0;x<WW;x++){const t=T[y*WW+x];if(t===DEEP||t===SHAL)continue;const k=kAtTile(x,y),c=KINGDOMS[k].rgb,i=(y*WW+x)*4;const edge=kAtTile(x+3,y)!==k||kAtTile(x,y+3)!==k;const a=edge?0.6:0.14;
    d[i]=d[i]*(1-a)+(edge?40:c[0])*a;d[i+1]=d[i+1]*(1-a)+(edge?20:c[1])*a;d[i+2]=d[i+2]*(1-a)+(edge?20:c[2])*a;}g.putImageData(id,0,0);}catch(e){console.warn(e);}};}
{const _dfm=drawFullMap;drawFullMap=function(){_dfm();const g=mapC.getContext("2d");g.font="bold 22px system-ui";g.textAlign="center";const K=kState();
  for(const k of KINGDOMS){const S=SETS[k.cap];g.lineWidth=5;g.strokeStyle="#000";const t=(k.demon?"😈 ":"♛ ")+k.name+(atWar(k.id)?" ⚔":"");g.strokeText(t,S.x*3,S.y*3-40);g.fillStyle=k.col;g.fillText(t,S.x*3,S.y*3-40);}
  for(const p of BORDER_POSTS){g.fillStyle="#fff";g.fillRect(p.x*3-2,p.y*3-2,4,4);}};}
// ---- destructible structures ----
function spellStructHit(px,py,lv,power){let did=null;const tx=px/TILE|0,ty=py/TILE|0;
  for(const b of buildings){const s0=buildingSprite(b);const x=b.x*16,y=(b.y+b.h)*16-s0.lh;if(px<x+4||px>x+s0.lw-4||py<y+s0.lh*0.35||py>y+s0.lh-4)continue;
    if(lv<4){sparkNo(px,py);return"resist";}const st=world.bld[b.id];st.dmg=Math.min(1,(st.dmg||0)+0.1+0.03*(lv-4)+(power||0)*0.02);did={kind:"bld",b,sid:b.s};
    for(const n of npcs)if(n.alive&&n.inside&&(n.home===b.id||n.at===b.id||n.work===b.id)){n.inside=false;n.at=null;const d=doorOf(b);n.x=d.x+(n.id%3-1)*10;n.y=d.y+6;n.fleeing=120;say(n,pick(["Everybody out!","The house is coming down!","Run!"]),120);}
    burst(px,py,[140,110,90],10+lv,1.6,2);shake=Math.max(shake,3);break;}
  if(!did){const g=gateAt(tx,ty);if(g){if(lv<6){sparkNo(px,py);return"resist";}g.hp=(g.hp==null?12:g.hp)-(1+Math.floor((lv-6)/2));if(g.hp<=0){g.hp=0;g.broken=1;}did={kind:"gate",g,sid:g.s};}}
  if(!did){for(const w of WALLS){if(w.x!==tx||w.y!==ty)continue;if(wallHp(w.i)<=0)break;if(lv<6){sparkNo(px,py);return"resist";}damageWall(w.i,2+Math.floor((lv-6)/2));invalidateTile(w.x,w.y);did={kind:"wall",w,sid:w.s};break;}}
  if(!did){const cs=[...(castleObj?[{x:castleObj.x,y:castleObj.y,s:0}]:[]),...CASTLES];for(const c of cs){if(px<c.x*16||px>(c.x+6)*16||py<(c.y-3)*16||py>(c.y+3)*16)continue;if(lv<6){sparkNo(px,py);return"resist";}world.cdmg=world.cdmg||{};world.cdmg[c.s]=Math.min(1,(world.cdmg[c.s]||0)+0.08);did={kind:"castle",sid:c.s};break;}}
  if(!did)return null;burst(px,py,[160,140,120],12,1.8,2);
  if(!inMonsterFight(px,py)){const K=kState();P.infamy=(P.infamy||0)+3;K.rep=Math.max(0,K.rep-3);const ws=world.sets[did.sid];if(ws&&!(ws.angryUntil>=1e12))ws.angryUntil=absMin()+240;if(!world._lastWreck||absMin()-world._lastWreck>60){world._lastWreck=absMin();addNews(did.sid,`The wanderer wrecked property in ${SETS[did.sid].name}! The guards are furious.`);toast("Deliberate destruction! The guards are after you.");}}
  return did.kind;}
function sparkNo(x,y){burst(x,y,[230,230,255],4,1,1.2);}
const _updStruct=update;update=function(){_updStruct();if(!world||!hero||state!=="play"||room)return;
  for(const f of fx){if((f.k!=="fireball"&&f.k!=="air")||f.life<=0||f.structDone)continue;if(Math.hypot(f.x-hero.x-6,f.y-hero.y-6)<14)continue;const r=spellStructHit(f.x,f.y,f.lv||spellLv(f.k),f.tier||0);if(r){f.structDone=1;if(f.k==="fireball")f.life=0;}}
  for(const b of tbolts){if(b.done||b.structDone)continue;const r=spellStructHit(b.x,b.y,b.lv,0);if(r){b.structDone=1;b.done=1;}}};
function repairHourly(){const h=hour();const rate=1/40;for(let i=0;i<world.bld.length;i++){const st=world.bld[i];if(!(st.dmg>0)||st.burn>0)continue;const own=P.house===i||P.rent===i;st.dmg=Math.max(0,st.dmg-(own?rate*2:(h>=6&&h<20?rate*1.6:rate*0.4)));}
  if(world.walls)for(const k in world.walls){if(world.walls[k]<10){world.walls[k]=Math.min(10,world.walls[k]+0.3);if(world.walls[k]>0){const w=WALLS[k];OCC[w.y*WW+w.x]=-3;}}}
  for(const g of GATES)if(g.hp!=null&&g.hp<12){g.hp=Math.min(12,g.hp+0.4);if(g.hp>3)g.broken=0;}
  if(world.cdmg)for(const k in world.cdmg)world.cdmg[k]=Math.max(0,world.cdmg[k]-1/40);}
