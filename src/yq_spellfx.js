// ===== SPELL RANK VISUALS: tiers 1-2 basic, 3-5 bigger, 6-8 glow/trails, 9-10 epic; impact scales with rank =====
const PCAP=650;const spellRank=k=>Math.min(10,spellLv(k));const spellTier=lv=>lv>=9?3:lv>=6?2:lv>=3?1:0;
const TIER_SCALE=[1,1.3,1.65,2.1],TIER_PARTS=[0,10,22,38];
let scorches=[],flashA=0,flashC="255,255,255",healFx=[],boltFx=[];
function capParticles(){if(particles.length>PCAP)particles.splice(0,particles.length-PCAP);}
function softBoom(tier,base){try{for(let i=0;i<=tier;i++)tone(base/(1+i*0.5),0.25+tier*0.08,{type:i?"sine":"triangle",v:0.06+0.02*i,a:0.02,to:base/(2+i)});}catch(e){}}
function rankBadge(k,lv){const b=document.getElementById("sp_"+k);if(!b)return;let s=b.querySelector(".rk");if(!s){s=document.createElement("span");s.className="rk";b.appendChild(s);}s.textContent="Lv"+lv;b.classList.remove("rkglow");void b.offsetWidth;b.classList.add("rkglow");clearTimeout(b._rk);b._rk=setTimeout(()=>b.classList.remove("rkglow"),1300);}
{const st=document.createElement("style");st.textContent=`.sp4 .rk{position:absolute;left:50%;top:-14px;transform:translateX(-50%);font:bold 10px system-ui;color:#ffe9a0;text-shadow:0 1px 2px #000;opacity:0;transition:opacity .3s;pointer-events:none}
.sp4.rkglow .rk{opacity:1}.sp4.rkglow{box-shadow:0 0 0 3px #ffd84aaa,0 0 18px 6px #ffd84a88!important}`;document.head.appendChild(st);}
const _castFX=castSpell;castSpell=function(k){k=k||curSpell;const n0=fx.length,p0=particles.length;const ok=_castFX(k);if(!ok)return ok;const lv=spellRank(k),t=spellTier(lv),S=TIER_SCALE[t];const cx=hero.x+6,cy=hero.y+6;
  for(const f of fx.slice(n0)){f.tier=t;f.lv=lv;if(f.k==="fireball"&&!f.split){f.r*=S;f.vx*=1+t*0.08;f.vy*=1+t*0.08;}if(f.k==="fireball"&&f.split)f.r*=S;if(f.k==="air"){f.sc=S;f.trail=[];}if(f.k==="ring")f.max*=1+t*0.1;}
  const col={fireball:[255,140,40],thunder:[200,180,255],heal:[140,255,160],air:[200,255,230]}[k];
  burst(cx,cy,col,TIER_PARTS[t],1+t*0.5,2+(t>1?1:0));
  if(k==="thunder"){const tg=[];    flashA=Math.max(flashA,0.12+t*0.12);flashC="220,220,255";}
  if(k==="heal"){const nP=t===0?0:2+t*2;for(let i=0;i<nP;i++){const a=i/nP*Math.PI*2;healFx.push({x:cx+Math.cos(a)*(14+t*4),y:cy+Math.sin(a)*(8+t*2),h:20+t*14,life:40+t*8,max:40+t*8});}healFx.push({halo:1,life:50+t*10,max:50+t*10,r:6+t*2});if(t>=2){flashA=Math.max(flashA,.08+t*.04);flashC="200,255,210";}}
  shake=Math.max(shake,2+t*2);if(t>=2)hitStop=Math.max(hitStop,1+t);softBoom(t,{fireball:180,thunder:140,heal:520,air:300}[k]);rankBadge(k,lv);capParticles();
  window.__lastCastFx={k,lv,tier:t,scale:S,particles:particles.length-p0};return ok;};
let liveFire=new Map();
const _updFX=updateMagic;updateMagic=function(){for(const f of fx)if(f.k==="fireball")liveFire.set(f,{x:f.x,y:f.y,t:f.tier||0,r:f.r});_updFX();
  for(const [f,info] of liveFire)if(!fx.includes(f)){liveFire.delete(f);const t=info.t;if(t>0){burst(info.x,info.y,[255,170,60],12+t*12,2+t,3);burst(info.x,info.y,[255,240,180],6+t*4,1,2);}
    scorches.push({x:info.x,y:info.y,r:6+info.r*1.2,life:600});if(scorches.length>24)scorches.shift();shake=Math.max(shake,4+t*3);hitStop=Math.max(hitStop,t);if(t>=2){flashA=Math.max(flashA,.1+t*.08);flashC="255,200,120";}softBoom(t,90);
    for(const o of mobs)if(!o.dead&&Math.hypot(o.x+o.w/2-info.x,o.y+o.h/2-info.y)<26+info.r*2){const a=Math.atan2(o.y-info.y,o.x-info.x);o.knockT=Math.max(o.knockT||0,6+t*2);o.knockVx=Math.cos(a)*(2+t);o.knockVy=Math.sin(a)*(2+t);}}
  for(const f of fx){if(f.k==="fireball"&&f.tier>=1&&frameN%(4-Math.min(3,f.tier))===0)particles.push({x:f.x,y:f.y,z:6,vx:-f.vx*.15+(Math.random()-.5)*.5,vy:-f.vy*.15+(Math.random()-.5)*.5,vz:.3,life:16+f.tier*6,max:16+f.tier*6,col:[255,120+Math.random()*100|0,30],size:2,kind:"magic"});
    if(f.k==="air"&&f.sc){f.trail.push({x:f.x,y:f.y});if(f.trail.length>2+f.tier*2)f.trail.shift();const rr=6+f.tier*4;
      for(const e of mobs){if(e.dead||f.hit.has(e))continue;if(Math.hypot(e.x+e.w/2-f.x,e.y+e.h/2-f.y)<rr+e.w/2){f.hit.add(e);spellHit(e,f.dmg,f.ang);e.knockT=6+f.tier*2;e.knockVx=Math.cos(f.ang)*(1.5+f.tier);e.knockVy=Math.sin(f.ang)*(1.5+f.tier);}}
      if(f.tier>=1&&frameN%3===0)particles.push({x:f.x,y:f.y,z:4+Math.random()*8,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2,vz:.4,life:30,max:30,col:Math.random()<.5?[90,170,60]:[160,120,70],size:2});}}
  for(const s of scorches)s.life--;scorches=scorches.filter(s=>s.life>0);for(const h of healFx)h.life--;healFx=healFx.filter(h=>h.life>0);for(const b of boltFx)b.life--;boltFx=boltFx.filter(b=>b.life>0);if(flashA>0)flashA=Math.max(0,flashA-0.02);capParticles();};
function jag(g,x0,y0,x1,y1,seed){g.beginPath();g.moveTo(x0,y0);const n=7;for(let i=1;i<n;i++){const u=i/n;g.lineTo(x0+(x1-x0)*u+Math.sin(seed+i*7.3)*6,y0+(y1-y0)*u+Math.cos(seed*1.3+i*5.1)*3);}g.lineTo(x1,y1);g.stroke();}
const _drawFX=draw;draw=function(){_drawFX();if(!hero||!world||room||state!=="play")return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);
  for(const s of scorches){ctx.globalAlpha=Math.min(.45,s.life/300);ctx.fillStyle="#1a0e08";ctx.beginPath();ctx.ellipse(s.x,s.y+4,s.r,s.r*.45,0,0,7);ctx.fill();}ctx.globalAlpha=1;
  ctx.globalCompositeOperation="lighter";
  for(const f of fx){const t=f.tier||0;
    if(f.k==="fireball"&&t>=2){const L=t===3?5:3;for(let i=L;i>=1;i--){const x=f.x-f.vx*i*2,y=f.y-6-f.vy*i*2;const g=ctx.createRadialGradient(x,y,0,x,y,f.r*(1.6-i*.2));g.addColorStop(0,`rgba(255,${180-i*20},60,${.35-i*.05})`);g.addColorStop(1,"rgba(255,60,0,0)");ctx.fillStyle=g;ctx.fillRect(x-f.r*2,y-f.r*2,f.r*4,f.r*4);}
      const g=ctx.createRadialGradient(f.x,f.y-6,0,f.x,f.y-6,f.r*4);g.addColorStop(0,t===3?"rgba(255,255,230,.6)":"rgba(255,220,120,.4)");g.addColorStop(1,"rgba(255,80,0,0)");ctx.fillStyle=g;ctx.fillRect(f.x-f.r*4,f.y-6-f.r*4,f.r*8,f.r*8);}
    if(f.k==="air"&&f.sc){for(let i=0;i<f.trail.length;i++){const p=f.trail[i];ctx.save();ctx.translate(p.x,p.y-6);ctx.rotate(f.ang);ctx.scale(f.sc,f.sc);ctx.globalAlpha=.15+.5*i/f.trail.length;ctx.strokeStyle=t>=2?"#9ff":"#cfe";ctx.lineWidth=2;ctx.beginPath();ctx.arc(-2,0,10,-1.1,1.1);ctx.stroke();ctx.restore();}ctx.globalAlpha=1;
      ctx.save();ctx.translate(f.x,f.y-6);ctx.rotate(f.ang);ctx.scale(f.sc,f.sc);ctx.strokeStyle=t===3?"rgba(160,255,255,.9)":"rgba(200,255,230,.8)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(-2,0,11,-1.2,1.2);ctx.stroke();if(t>=2){ctx.strokeStyle="rgba(255,255,255,.6)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(-6,0,9,-1,1);ctx.stroke();}ctx.restore();}}
  for(const b of boltFx){ctx.strokeStyle=`rgba(220,210,255,${Math.min(1,b.life/8)})`;ctx.lineWidth=b.w;if(b.chain){const [a,c]=b.chain;jag(ctx,a.x+a.w/2,a.y+a.h/2,c.x+c.w/2,c.y+c.h/2,b.seed+frameN*.3);}else{jag(ctx,b.x+(Math.sin(b.seed)*20),b.y-140,b.x,b.y,b.seed+frameN*.2);ctx.strokeStyle=`rgba(255,255,255,${Math.min(1,b.life/10)})`;ctx.lineWidth=Math.max(1,b.w-1);jag(ctx,b.x+(Math.sin(b.seed)*20),b.y-140,b.x,b.y,b.seed+frameN*.2);}}
  for(const h of healFx){const a=h.life/h.max;if(h.halo){ctx.strokeStyle=`rgba(255,240,150,${a})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(hero.x+6,hero.y-12,h.r,h.r*.35,0,0,7);ctx.stroke();continue;}
    const g=ctx.createLinearGradient(0,h.y-h.h,0,h.y);g.addColorStop(0,"rgba(180,255,190,0)");g.addColorStop(1,`rgba(180,255,190,${.45*a})`);ctx.fillStyle=g;ctx.fillRect(h.x-3,h.y-h.h*(1.2-a*.2),6,h.h);if(frameN%4===0)particles.push({x:h.x+(Math.random()-.5)*6,y:h.y,z:4,vx:0,vy:0,vz:.6,life:24,max:24,col:[255,255,200],size:1,kind:"spark"});}
  ctx.globalCompositeOperation="source-over";ctx.restore();
  if(flashA>0){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(${flashC},${flashA})`;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();}};
