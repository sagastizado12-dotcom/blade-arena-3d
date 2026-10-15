// ===== DIRECTIONAL THUNDER: bolt flies where you face, chains between nearby foes =====
const CHAIN_R=4*TILE;
function chainFrom(first,dmg,jumps,range,stun){const hit=[first],links=[];let cur=first,d=dmg;
  for(let j=0;j<jumps;j++){d=Math.max(1,Math.round(d*0.7));let best=null,bd=CHAIN_R*range;const cx=cur.x+cur.w/2,cy=cur.y+cur.h/2;
    for(const e of mobs){if(e.dead||hit.includes(e)||!e.def||e.def.beh==="pea")continue;const dd=Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy);if(dd<bd){bd=dd;best=e;}}
    if(!best)break;hit.push(best);links.push([cur,best,d]);cur=best;}
  return{hit,links};}
function zig(x0,y0,x1,y1,seed,amp){const pts=[[x0,y0]];const n=8,L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L;
  for(let i=1;i<n;i++){const u=i/n,o=Math.sin(seed+i*2.7)*amp*(i%2?1:-1);pts.push([x0+(x1-x0)*u+nx*o,y0+(y1-y0)*u+ny*o]);}pts.push([x1,y1]);return pts;}
const _updTB=updateMagic;updateMagic=function(){_updTB();
  for(const b of tbolts){if(b.done)continue;const t=spellTier(b.lv);b.life--;b.x+=b.vx;b.y+=b.vy;b.seed+=0.7;
    if(frameN%2===0)burst(b.x,b.y,[200,190,255],1+t,1,1.5);
    for(const p of projectiles)if(!p.friendly&&!p.dead&&Math.hypot(p.x-b.x,p.y-b.y)<10+t*2){p.dead=true;burst(p.x,p.y,[200,180,255],8,1.5,2);if(typeof clashCount!=="undefined")clashCount++;}
    let first=null;for(const e of mobs){if(e.dead||!e.def||e.def.beh==="pea")continue;if(Math.abs(e.x+e.w/2-b.x)<e.w/2+5+t*2&&Math.abs(e.y+e.h/2-b.y)<e.h/2+5+t*2){first=e;break;}}
    if(first){b.done=1;b.hitAt={x:first.x+first.w/2,y:first.y+first.h/2};spellHit(first,b.dmg,b.ang);if(b.stun&&!first.dead){first.stun=90;}
      tarcs.push({pts:zig(b.x0,b.y0,b.hitAt.x,b.hitAt.y,b.seed,4+t*2),life:14+t*3,w:1.5+t*.6,t});
      const c=chainFrom(first,b.dmg,b.jumps,b.range||1,b.stun);b.chain=c.hit;window.__lastChain={hit:c.hit.length,dmgs:[b.dmg,...c.links.map(l=>l[2])]};
      c.links.forEach(([a,e,d],i)=>{const ax=a.x+a.w/2,ay=a.y+a.h/2,ex=e.x+e.w/2,ey=e.y+e.h/2;
        tarcs.push({pts:zig(ax,ay,ex,ey,Math.random()*99,5+t*2),life:16+t*3+i*2,w:1.2+t*.5,t,delay:i*3});spellHit(e,d,Math.atan2(ey-ay,ex-ax));if(b.stun&&!e.dead)e.stun=90;burst(ex,ey,[210,200,255],6+t*3,2,2);});
      burst(b.hitAt.x,b.hitAt.y,[230,220,255],10+t*5,2.2,2);shake=Math.max(shake,3+t*2);if(t>=2)hitStop=Math.max(hitStop,1+t);}
    else if(b.life<=0){b.done=1;tarcs.push({pts:zig(b.x0,b.y0,b.x,b.y,b.seed,4+t*2),life:10,w:1.2+t*.5,t});}}
  for(let i=tbolts.length-1;i>=0;i--)if(tbolts[i].done)tbolts.splice(i,1);
  for(let i=tarcs.length-1;i>=0;i--){const a=tarcs[i];if(a.delay>0){a.delay--;continue;}if(--a.life<=0)tarcs.splice(i,1);else if(a.life%4===0)a.pts=zig(a.pts[0][0],a.pts[0][1],a.pts[a.pts.length-1][0],a.pts[a.pts.length-1][1],Math.random()*99,4+a.t*2);}};
const _drawTB=draw;draw=function(){_drawTB();if(!hero||!world||room||state!=="play")return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx.lineCap="round";ctx.lineJoin="round";
  const line=(pts,w,c)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts)ctx.lineTo(p[0],p[1]);ctx.stroke();};
  for(const b of tbolts){const t=spellTier(b.lv);const pts=zig(b.x0,b.y0,b.x,b.y,b.seed,3+t*2);const col=t>=2?"170,150,255":"200,190,255";
    line(pts,(3+t*2),`rgba(${col},0.35)`);line(pts,1.5+t*.4,"#fff");ctx.fillStyle=`rgba(${col},0.6)`;ctx.beginPath();ctx.arc(b.x,b.y,3+t*1.5,0,7);ctx.fill();}
  for(const a of tarcs){if(a.delay>0)continue;const al=Math.min(1,a.life/8);const col=a.t>=2?"170,150,255":"200,190,255";line(a.pts,a.w*3,`rgba(${col},${0.35*al})`);line(a.pts,a.w,`rgba(255,255,255,${al})`);}
  ctx.restore();};
