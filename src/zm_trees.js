// ===== SPELLS VS TREES: fire burns (and spreads a little), air cuts, thunder splits; heal does nothing =====
const treeBurns=new Map();
const bigTree=(tx,ty)=>Math.floor(hash2(tx,ty,5)*4)>=2;
function fellTree(tx,ty,how){const i=ty*WW+tx;if(T[i]!==TREE)return false;T[i]=STUMP;invalidateTile(tx,ty);world.trees[i]={st:0,d:world.day,charred:how==="fire"?1:0};
  const cx=tx*16+8,cy=ty*16+6;if(how!=="fire")fallers.push({x:tx*16-4,y:ty*16-12,v:Math.floor(hash2(tx,ty,5)*4),dir:hero.x<cx?1:-1,t:0});
  const n=how==="fire"?1:2+(bigTree(tx,ty)?1:0);for(let k=0;k<n;k++)pickups.push({x:cx-6+k*7,y:cy+10+Math.random()*4,item:"wood",t:0});
  if(how==="split"){burst(cx,cy,[255,250,200],14,2,2);}else if(how==="cut")burst(cx,cy,[120,180,90],12,1.6,2);return true;}
function spellTreeHit(tx,ty,lv,k){const i=ty*WW+tx;if(T[i]!==TREE||k==="heal")return null;if(townTree(tx,ty))return"town";
  const need=bigTree(tx,ty)?5:3;if(lv<need){burst(tx*16+8,ty*16+6,[200,170,120],4,1,1.2);return"resist";}
  if(k==="fireball"){if(!treeBurns.has(i))treeBurns.set(i,{t:0,gen:0});return"burn";}
  fellTree(tx,ty,k==="thunder"?"split":"cut");return"fell";}
const _updTrees=update;update=function(){_updTrees();if(!world||!hero||state!=="play"||room)return;
  for(const f of fx){if((f.k!=="fireball"&&f.k!=="air")||f.life<=0)continue;const tx=f.x/TILE|0,ty=(f.y+4)/TILE|0;const r=spellTreeHit(tx,ty,f.lv||spellLv(f.k),f.k);if(r==="burn"||r==="resist"&&f.k==="fireball")f.life=0;}
  for(const b of tbolts){if(b.done)continue;const tx=b.x/TILE|0,ty=(b.y+4)/TILE|0;const r=spellTreeHit(tx,ty,b.lv,"thunder");if(r==="fell"||r==="resist")b.done=1;}
  for(const [i,b] of treeBurns){b.t++;const tx=i%WW,ty=(i/WW)|0;if(b.t%4===0)burst(tx*16+8,ty*16-4,[255,140+Math.random()*80|0,40],2,0.6,2);
    if(b.t===70&&b.gen<2)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[2,0],[-2,0]]){const j=(ty+dy)*WW+tx+dx;if(T[j]===TREE&&!treeBurns.has(j)&&!townTree(tx+dx,ty+dy)&&Math.random()<0.25)treeBurns.set(j,{t:0,gen:b.gen+1});}
    if(b.t>=150){treeBurns.delete(i);fellTree(tx,ty,"fire");}}};
const _drawTrees=draw;draw=function(){_drawTrees();if(!hero||!world||room||state!=="play")return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);
  for(const [i,b] of treeBurns){const x=(i%WW)*16+8,y=((i/WW)|0)*16;for(let k=0;k<4;k++){const fl=Math.sin(frameN*.3+k*1.7)*2;ctx.fillStyle=k%2?"rgba(255,200,60,.85)":"rgba(255,90,30,.8)";ctx.beginPath();ctx.moveTo(x-6+k*4,y+10);ctx.lineTo(x-4+k*4+fl,y-8-k%2*6);ctx.lineTo(x-2+k*4,y+10);ctx.fill();}}
  const x0=camX/TILE|0,y0=camY/TILE|0;for(let ty=y0;ty<y0+H/TILE+2;ty++)for(let tx=x0;tx<x0+W/TILE+2;tx++){const r=world.trees[ty*WW+tx];if(!r||!r.charred||r.st!==0)continue;ctx.fillStyle="rgba(20,14,12,.85)";ctx.fillRect(tx*16+4,ty*16+7,8,6);ctx.fillStyle="rgba(255,90,30,.5)";if(frameN%40<20)ctx.fillRect(tx*16+7,ty*16+8,2,1);}
  ctx.restore();};
