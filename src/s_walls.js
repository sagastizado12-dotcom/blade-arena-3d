// ===== SETTLEMENT WALLS & GATES =====
let WALLS=[],GATES=[],TOWERS=[];const WALLIDX=new Map();
function wallR(s){return s.r+3;}
function gateTiles_unused(s){const R=wallR(s);return[{d:"N",t:[[s.x,s.y-R],[s.x+1,s.y-R]],o:[0,-1]},{d:"S",t:[[s.x,s.y+R],[s.x+1,s.y+R]],o:[0,1]},{d:"W",t:[[s.x-R,s.y],[s.x-R,s.y+1]],o:[-1,0]},{d:"E",t:[[s.x+R,s.y],[s.x+R,s.y+1]],o:[1,0]}];}
function genWalls(){WALLS=[];GATES=[];TOWERS=[];WALLIDX.clear();
  for(const s of SETS){const R=wallR(s);const ring=[];
    for(let y=s.y-R-1;y<=s.y+R+1;y++)for(let x=s.x-R-1;x<=s.x+R+1;x++){const d=Math.max(Math.abs(x-s.x-0.5),Math.abs(y-s.y-0.5))*0.55+Math.hypot(x-s.x-0.5,y-s.y-0.5)*0.45;
      if(Math.abs(d-R)>0.6)continue;const i=y*WW+x;if(T[i]===DEEP&&!(x===s.x||x===s.x+1||y===s.y||y===s.y+1))continue;if(OCC[i]>0)continue;ring.push([x,y]);}
    const gs=[{d:"N",f:([x,y])=>(x===s.x||x===s.x+1)&&y<s.y,o:[0,-1]},{d:"S",f:([x,y])=>(x===s.x||x===s.x+1)&&y>s.y,o:[0,1]},{d:"W",f:([x,y])=>(y===s.y||y===s.y+1)&&x<s.x,o:[-1,0]},{d:"E",f:([x,y])=>(y===s.y||y===s.y+1)&&x>s.x,o:[1,0]}];
    const gateSet=new Set();
    for(const g of gs){const t=ring.filter(g.f);t.sort((p,q)=>(p[0]-q[0])||(p[1]-q[1]));for(const [x,y] of t)gateSet.add(x+","+y);
      // outermost tile along the axis is the gate anchor
      const out=t.slice().sort((p,q)=>(q[0]*g.o[0]+q[1]*g.o[1])-(p[0]*g.o[0]+p[1]*g.o[1]));
      const gate={s:s.id,d:g.d,tiles:t,o:g.o,x:out[0][0],y:out[0][1]};GATES.push(gate);
      for(const [x,y] of t){const i=y*WW+x;OCC[i]=0;if(T[i]!==DEEP&&T[i]!==PIER&&T[i]!==SHAL)T[i]=ROAD;ELEV[i]=0;
        for(let k=-4;k<=7;k++){const cx=x+g.o[0]*k,cy=y+g.o[1]*k;if(cx<0||cy<0||cx>=WW||cy>=WH)continue;const j=cy*WW+cx;if(OCC[j]>0||gateSet.has(cx+","+cy))continue;if(ring.some(([a,b2])=>a===cx&&b2===cy)&&k!==0)continue;
          if(T[j]===DEEP||T[j]===SHAL||T[j]===PIER){if(k>0&&k<=3&&T[j]!==PIER)T[j]=PIER;continue;}if(T[j]===CLIFF)T[j]=STAIRS;else if(T[j]!==COBBLE&&T[j]!==PIER)T[j]=ROAD;if(OCC[j]<0)OCC[j]=0;ELEV[j]=ELEV[y*WW+x];}}}
    for(const [x,y] of ring){if(gateSet.has(x+","+y))continue;const i=y*WW+x;if(T[i]===DEEP)continue;
      if(T[i]===TREE||T[i]===BUSH||T[i]===ROCK)T[i]=GRASS;if(T[i]===CLIFF)T[i]=MTN;const w={x,y,s:s.id,i:WALLS.length};WALLS.push(w);WALLIDX.set(i,w.i);OCC[i]=-3;}
    // seal diagonal-only joints
    const isW=(x,y)=>WALLIDX.has(y*WW+x);
    for(const w of WALLS.filter(w=>w.s===s.id))for(const [dx,dy] of [[1,1],[1,-1]]){const x2=w.x+dx,y2=w.y+dy;if(!isW(x2,y2))continue;if(isW(w.x+dx,w.y)||isW(w.x,w.y+dy))continue;
      for(const [cx,cy] of [[w.x+dx,w.y],[w.x,w.y+dy]]){const i=cy*WW+cx;if(gateSet.has(cx+","+cy)||OCC[i]>0||T[i]===DEEP)continue;if(T[i]===TREE||T[i]===BUSH||T[i]===ROCK)T[i]=GRASS;const nw={x:cx,y:cy,s:s.id,i:WALLS.length};WALLS.push(nw);WALLIDX.set(i,nw.i);OCC[i]=-3;break;}}
    if(s.kind.includes("town"))for(const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const tx=Math.round(s.x+dx*R*0.78),ty=Math.round(s.y+dy*R*0.78);TOWERS.push({x:tx,y:ty,s:s.id,cd:0});}}
  // gate-to-gate roads between connected settlements
  const link=(a,b)=>{const ga=pickGate(a,b),gb=pickGate(b,a);let x=ga.x+ga.o[0]*3,y=ga.y+ga.o[1]*3;const ex=gb.x+gb.o[0]*3,ey=gb.y+gb.o[1]*3;
    const lay=(x,y)=>{for(let k=0;k<2;k++){const j=y*WW+x+k;if(OCC[j]||WALLIDX.has(j))continue;const t=T[j];if(t===DEEP||t===SHAL)T[j]=RIVERM[j]?BRIDGE:PIER;else if(t===CLIFF)T[j]=STAIRS;else if(t!==COBBLE&&t!==PIER)T[j]=ROAD;}};
    while(x!==ex){lay(x,y);x+=Math.sign(ex-x);}while(y!==ey){lay(x,y);y+=Math.sign(ey-y);}lay(x,y);};
  link(SETS[0],SETS[1]);link(SETS[0],SETS[2]);link(SETS[0],SETS[3]);link(SETS[0],SETS[4]);}
function pickGate(a,b){const dx=b.x-a.x,dy=b.y-a.y;const d=Math.abs(dx)>Math.abs(dy)?(dx>0?"E":"W"):(dy>0?"S":"N");return GATES.find(g=>g.s===a.id&&g.d===d);}
const wallHp=i=>world&&world.walls&&world.walls[i]!=null?world.walls[i]:10;
function applyWalls(){if(!world.walls)world.walls={};for(const w of WALLS){OCC[w.y*WW+w.x]=wallHp(w.i)>0?-3:0;}}
function gateClosed(g){const h=hour();return world.sets[g.s].raid||world.sets[g.s].dragon||h>=22||h<6;}
function gateAt(tx,ty){for(const g of GATES)for(const [x,y] of g.tiles)if(x===tx&&y===ty)return g;return null;}
function damageWall(i,n){if(!world.walls)world.walls={};const hp=wallHp(i)-n;world.walls[i]=Math.max(0,hp);if(hp<=0){const w=WALLS[i];OCC[w.y*WW+w.x]=0;invalidateTile(w.x,w.y);addNews(w.s,`Raiders broke through the wall of ${SETS[w.s].name}!`);}}
function wallDaily(){if(!world.walls)return;for(const k in world.walls){const hp=world.walls[k];if(hp<10){world.walls[k]=Math.min(10,hp+3);if(world.walls[k]>0){const w=WALLS[k];OCC[w.y*WW+w.x]=-3;}}}}
function wallHourly(){}
function raiderAI(e){const S=SETS[e.raidOf];if(!S)return false;const R=wallR(S);const tx=(e.x+e.w/2)/TILE,ty=(e.y+e.h/2)/TILE;const dC=Math.hypot(tx-S.x,ty-S.y);const inside=dC<R-0.5;if(inside){if(dC>S.r*0.6&&Math.hypot(e.x-hero.x,e.y-hero.y)>260){const dx=S.x*TILE-e.x,dy=S.y*TILE-e.y,l=dC*TILE||1;moveEntity(e,dx/l*e.spd,dy/l*e.spd);return true;}return false;}
  // head for nearest gate; batter it if closed, else walk through
  let g=null,bd=1e9;for(const q of GATES.concat(typeof GATES2!=='undefined'?GATES2:[]))if(q.s===S.id){const d=Math.hypot(q.x-tx,q.y-ty);if(d<bd){bd=d;g=q;}}if(!g){const dx=S.x*TILE-e.x,dy=S.y*TILE-e.y,l=Math.hypot(dx,dy)||1;e.state='raid';moveEntity(e,dx/l*e.spd,dy/l*e.spd);return true;}
  const gx=(g.x+0.5+g.o[0]*1.2)*TILE,gy=(g.y+0.5+g.o[1]*1.2)*TILE;const dx=gx-e.x,dy=gy-e.y,l=Math.hypot(dx,dy);
  if(l>10){moveEntity(e,dx/l*e.spd,dy/l*e.spd);if(e.atkCd>0)e.atkCd--;
    // blocked by a wall section? batter it
    if(Math.abs(e.x-(e.lx||0))+Math.abs(e.y-(e.ly||0))<0.05){for(const w of WALLS)if(w.s===S.id&&Math.hypot(w.x*16+8-e.x,w.y*16+8-e.y)<22&&wallHp(w.i)>0){if((e.atkCd||0)<=0){e.atkCd=60;damageWall(w.i,1);e.gest=10;shake=1;}break;}}
    e.lx=e.x;e.ly=e.y;return true;}
  if(gateClosed(g)){g.hp=(g.hp==null?12:g.hp);if((e.atkCd||0)<=0){e.atkCd=60;g.hp--;SFX.hit();if(g.hp<=0){g.broken=world.day;addNews(S.id,`Raiders smashed the ${g.d} gate of ${S.name}!`);}}else e.atkCd--;
    if(!(g.hp<=0))return true;}
  moveEntity(e,-g.o[0]*e.spd*1.2,-g.o[1]*e.spd*1.2);return true;}
function towersTick(){if(frameN%20)return;for(const t of TOWERS){if(Math.hypot(t.x*16-hero.x,t.y*16-hero.y)>420)continue;t.cd=(t.cd||0)-20;if(t.cd>0)continue;
  let tgt=null,bd=150;for(const m of mobs){if(m.dead||!m.def||m.def.beh!=="agg")continue;const d=Math.hypot(m.x-t.x*16,m.y-t.y*16);if(d<bd){bd=d;tgt=m;}}
  if(tgt){t.cd=90;const ang=Math.atan2(tgt.y-t.y*16+10,tgt.x-t.x*16);fx.push({k:"ice",x:t.x*16+8,y:t.y*16-10,vx:Math.cos(ang)*4.5,vy:Math.sin(ang)*4.5,life:50,dmg:1,pierce:false,hit:new Set(),ang,ally:1});}}}
function drawWallsList(list,vis){const town=new Set(SETS.filter(s=>s.kind.includes("town")).map(s=>s.id));
  for(const w of WALLS){if(!vis(w.x*16,w.y*16,40))continue;list.push({y:w.y*16+15,f:()=>{const x=w.x*16,y=w.y*16,hp=wallHp(w.i);
    if(hp<=0){ctx.fillStyle="#8a8078";for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(x+3+k*3.5,y+12+(k%2)*2,2.5,1.8,0,0,7);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=.6;ctx.stroke();}return;}
    if(town.has(w.s)){ctx.fillStyle="rgba(30,15,10,.25)";ctx.fillRect(x+2,y+12,16,5);ctx.fillStyle="#b8b0b0";ctx.fillRect(x,y-8,16,22);for(let r=0;r<4;r++)for(let c=0;c<2;c++){ctx.fillStyle=(r+c)%2?"#cfc8c4":"#a8a09c";ctx.fillRect(x+c*8+(r%2?4:0)-(r%2?4:0)+.5,y-8+r*5.5+.5,7,5);}
      ctx.fillStyle="#d8d2ce";for(let c=0;c<3;c++)ctx.fillRect(x+c*6,y-12,4,4);ctx.strokeStyle=OL;ctx.lineWidth=1;ctx.strokeRect(x,y-8,16,22);for(let c=0;c<3;c++)ctx.strokeRect(x+c*6,y-12,4,4);}
    else{ctx.fillStyle="rgba(30,15,10,.25)";ctx.fillRect(x+2,y+12,16,4);for(let k=0;k<4;k++){const sx=x+k*4;ctx.fillStyle=k%2?"#a8743e":"#946232";ctx.fillRect(sx,y-6,4,19);ctx.beginPath();ctx.moveTo(sx,y-6);ctx.lineTo(sx+2,y-10);ctx.lineTo(sx+4,y-6);ctx.fill();
      ctx.strokeStyle=OL;ctx.lineWidth=.7;ctx.strokeRect(sx,y-6,4,19);}ctx.fillStyle="#6e4422";ctx.fillRect(x,y+1,16,2);}
    if(hp<10){ctx.strokeStyle="#3a2010";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+3,y-4);ctx.lineTo(x+8,y+3);ctx.lineTo(x+6,y+8);ctx.stroke();}}});}
  for(const g of GATES){const x=g.tiles[0][0]*16,y=g.tiles[0][1]*16;if(!vis(x,y,50))continue;const horiz=g.d==="N"||g.d==="S";const town2=town.has(g.s);
    list.push({y:y+16+(horiz?0:16),f:()=>{const closed=gateClosed(g)&&!(g.hp<=0);ctx.lineJoin="round";
      const post=(px,py)=>{ctx.fillStyle=town2?"#c8c0bc":"#8a5a2e";ctx.fillRect(px,py-18,7,30);ctx.strokeStyle=OL;ctx.lineWidth=1;ctx.strokeRect(px,py-18,7,30);ctx.fillStyle=town2?"#5a4a8a":"#6e4422";ctx.beginPath();ctx.moveTo(px-2,py-18);ctx.lineTo(px+3.5,py-26);ctx.lineTo(px+9,py-18);ctx.closePath();ctx.fill();ctx.stroke();};
      if(horiz){post(x-6,y+2);post(x+31,y+2);ctx.fillStyle=town2?"#d8d0c8":"#a8743e";ctx.fillRect(x-4,y-18,40,6);ctx.strokeRect(x-4,y-18,40,6);
        if(closed){ctx.fillStyle="#8a4e22";ctx.fillRect(x+1,y-12,30,26);ctx.strokeRect(x+1,y-12,30,26);ctx.strokeStyle="#5a3010";for(let k=1;k<5;k++){ctx.beginPath();ctx.moveTo(x+1+k*6,y-12);ctx.lineTo(x+1+k*6,y+14);ctx.stroke();}ctx.fillStyle="#3a3040";ctx.fillRect(x+1,y-4,30,2);ctx.fillRect(x+1,y+6,30,2);}}
      else{post(x+4,y-6);post(x+4,y+33);if(closed){ctx.fillStyle="#8a4e22";ctx.fillRect(x+5,y-4,6,36);ctx.strokeStyle=OL;ctx.strokeRect(x+5,y-4,6,36);}}
      // gate guards
      const gl=chibiLook(g.s*13+(g.d.charCodeAt(0)),"guard","human");if(horiz){drawChibi(gl,x-10,y+18,0,0);drawChibi(gl,x+42,y+18,0,0);}else{drawChibi(gl,x+8+g.o[0]*14,y-6,0,0);drawChibi(gl,x+8+g.o[0]*14,y+40,0,0);}}});}
  for(const t of TOWERS){const x=t.x*16,y=t.y*16;if(!vis(x,y,60))continue;list.push({y:y+16,f:()=>{ctx.fillStyle="rgba(30,15,10,.28)";ctx.beginPath();ctx.ellipse(x+10,y+15,12,4,0,0,7);ctx.fill();
    ctx.fillStyle="#c0b8b4";ctx.fillRect(x-2,y-22,20,36);for(let r=0;r<6;r++){ctx.fillStyle=r%2?"#d0c8c4":"#aaa29e";ctx.fillRect(x-2,y-22+r*6,20,3);}ctx.strokeStyle=OL;ctx.lineWidth=1.2;ctx.strokeRect(x-2,y-22,20,36);
    ctx.beginPath();ctx.moveTo(x-5,y-22);ctx.lineTo(x+8,y-40);ctx.lineTo(x+21,y-22);ctx.closePath();ctx.fillStyle="#5a4a8a";ctx.fill();ctx.stroke();ctx.fillStyle="#2a1a3a";ctx.fillRect(x+5,y-12,6,8);
    drawChibi(chibiLook(t.x*7+t.y,"archer","human"),x+8,y-20,0,0,0.8);}});}}
// player repairs damaged walls and gates with wood
function wallRepairCheck(){if(room||!WALLS.length)return false;const hx=hero.x+6,hy=hero.y+8;let best=null,bd=26;
  for(const w of WALLS){if(wallHp(w.i)>=10)continue;const d=Math.hypot(w.x*16+8-hx,w.y*16+8-hy);if(d<bd){bd=d;best=w;}}
  let gate=null;for(const g of GATES){if(g.hp==null||g.hp>=12)continue;const d=Math.hypot(g.x*16+8-hx,g.y*16+8-hy);if(d<bd+6){gate=g;}}
  if(!best&&!gate)return false;const need=gate?3:2;
  if((P.inv.wood||0)<need){toast(`Repairing needs ${need} wood (you have ${P.inv.wood||0}). Chop some trees!`);return true;}
  P.inv.wood-=need;if(gate){gate.hp=12;gate.broken=0;}else{world.walls[best.i]=10;OCC[best.y*WW+best.x]=-3;invalidateTile(best.x,best.y);}
  SFX.hit();floatText(hx,hy-12,"Repaired!","#ffd860");burst(hx,hy,[200,160,100],12,1.4,2);
  const sid=gate?gate.s:best.s;for(const n of npcs)if(n.s===sid&&n.alive)n.friend=Math.min(100,n.friend+1);if(typeof gainExp==="function")gainExp(5);return true;}
const _interactW=interact;interact=function(){if(wallRepairCheck())return true;return _interactW.apply(this,arguments);};
