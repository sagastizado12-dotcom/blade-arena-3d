// ===== NPC PERSONAL SPACE: soft push-apart, unique idle tiles, room seat de-stacking, keep off the hero =====
const NPC_R=12,HERO_R=13,PUSH_MAX=0.45;
const npcC=n=>[n.x+8,n.y+12];
const freePx=(x,y)=>{const tx=Math.floor(x/TILE),ty=Math.floor(y/TILE);return !solidTile(tx,ty);};
function nudge(n,dx,dy){const nx=n.x+dx,ny=n.y+dy;if(freePx(nx+8,ny+12)){n.x=nx;n.y=ny;}else if(freePx(nx+8,n.y+12))n.x=nx;else if(freePx(n.x+8,ny+12))n.y=ny;}
function separateNpcs(){const L=npcs.filter(n=>n&&n.alive&&!n.inside&&!(n.down>0)&&Math.abs(n.x-hero.x)<700&&Math.abs(n.y-hero.y)<500);
  const grid=new Map(),key=(x,y)=>((x>>5)*4096+(y>>5));
  for(const n of L){const [cx,cy]=npcC(n);const k=key(cx,cy);(grid.get(k)||grid.set(k,[]).get(k)).push(n);n._px=0;n._py=0;}
  for(const n of L){const [cx,cy]=npcC(n);for(let gx=-1;gx<=1;gx++)for(let gy=-1;gy<=1;gy++){const c=grid.get(key(cx+gx*32,cy+gy*32));if(!c)continue;
      for(const m of c){if(m.id<=n.id)continue;const [mx,my]=npcC(m);let dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy);const RR=(n._mv||m._mv)?19:30;if(d>=RR)continue;
        if(d<0.01){const a=(n.id*2.4+m.id)%6.283;dx=Math.cos(a);dy=Math.sin(a);d=0.01;}const f=Math.min(PUSH_MAX,(RR-d)*0.12)/2;
        n._px-=dx/d*f;n._py-=dy/d*f;m._px+=dx/d*f;m._py+=dy/d*f;}}}
  // idle NPCs keep a tile of their own
  const tiles=new Map();for(const n of L){if(n._mv)continue;const [cx,cy]=npcC(n);const tk=Math.floor(cx/TILE)+","+Math.floor(cy/TILE);const o=tiles.get(tk);
    if(!o){tiles.set(tk,n);continue;}const tx=Math.floor(cx/TILE),ty=Math.floor(cy/TILE);let best=null,bd=1e9;
    for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const nx=tx+ox,ny=ty+oy;if(solidTile(nx,ny)||tiles.has(nx+","+ny))continue;const d=Math.hypot((nx+.5)*TILE-cx,(ny+.5)*TILE-cy);if(d<bd){bd=d;best=[nx,ny];}}
    if(best){n._goal=best;tiles.set(best[0]+","+best[1],n);}}
  for(const n of L){if(n._goal&&!n._mv){const [cx,cy]=npcC(n);const gx=(n._goal[0]+.5)*TILE,gy=(n._goal[1]+.5)*TILE,d=Math.hypot(gx-cx,gy-cy);if(d>1.5){n._px+=(gx-cx)/d*Math.min(0.6,d);n._py+=(gy-cy)/d*Math.min(0.6,d);}else n._goal=null;}else if(n._mv)n._goal=null;
    const [cx,cy]=npcC(n),hx=hero.x+6,hy=hero.y+6;let dx=cx-hx,dy=cy-hy,d=Math.hypot(dx,dy);if(d<HERO_R){if(d<0.01){dx=1;dy=0;d=0.01;}const f=Math.min(0.8,(HERO_R-d)*0.25);n._px+=dx/d*f;n._py+=dy/d*f;}
    // smooth: low-pass the push so nobody jitters
    n._sx=(n._sx||0)*0.6+n._px*0.4;n._sy=(n._sy||0)*0.6+n._py*0.4;if(Math.abs(n._sx)+Math.abs(n._sy)>0.02)nudge(n,n._sx,n._sy);}}
const _updSep=update;update=function(){const prev=npcs.map(n=>n?[n.x,n.y]:null);_updSep();if(!hero||state!=="play"||!world)return;
  npcs.forEach((n,i)=>{if(n&&prev[i])n._mv=Math.hypot(n.x-prev[i][0],n.y-prev[i][1])>0.15;});if(!room)separateNpcs();};
// rooms: spread anyone sharing a seat/spot into the nearest free spot
{const _rn=roomNpcs;roomNpcs=function(){const L=_rn.apply(this,arguments);if(!Array.isArray(L))return L;const taken=[];
  const clash=(x,y)=>taken.some(([a,b])=>Math.hypot(a-x,b-y)<12);
  for(const e of L){if(e.x==null)continue;if(clash(e.x,e.y)){let done=false;for(let r=1;r<5&&!done;r++)for(let k=0;k<8&&!done;k++){const a=k/8*Math.PI*2;const x=e.x+Math.round(Math.cos(a)*r*14),y=e.y+Math.round(Math.sin(a)*r*12);if(!clash(x,y)){e.x=x;e.y=y;done=true;if(e.pose==="sit")e.pose="stand";}}}taken.push([e.x,e.y]);}
  return L;};}
