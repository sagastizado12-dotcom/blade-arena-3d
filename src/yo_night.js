// ===== LIVELY NIGHTS: lantern glow, lit windows, torch-bearing guard patrols, night owls, busy tavern =====
const isNight=()=>{const h=world.min/60;return h>=19.5||h<5.5;};
function nightTick(){if(!isNight()){for(const n of npcs)if(n._nightOut){n._nightOut=false;}return;}
  const t=absMin()+frameN/600;
  for(const n of npcs){if(!n.alive||n.adv||(P.party||[]).includes(n.id))continue;const s=SETS[n.s];if(!s)continue;
    const guard=n.role==="guard"&&!(n.spouse===-1&&nightHome(n)),owl=!guard&&n.age>=18&&n.age<60&&n.role!=="leader"&&n.role!=="child"&&n.role!=="innkeeper"&&(n.id%7===0)&&!(n.spouse===-1&&nightHome(n));if(!guard&&!owl)continue;
    if(!room||room.b.s!==n.s||!n.inside){n.inside=false;n._nightOut=true;n.torch=guard;const R=(guard?Math.max(4,s.r-3):3+(n.id%3))*TILE,sp=guard?0.004:0.0016;const a=(n.id*1.7)+t*sp*60*(n.id%2?1:-1);
      const tx=s.x*TILE+Math.cos(a)*R,ty=s.y*TILE+Math.sin(a)*R*0.8;const dx=tx-n.x,dy=ty-n.y,d=Math.hypot(dx,dy);if(d>60){n.x=tx;n.y=ty;}else if(d>0.5){const v=Math.min(d,guard?0.55:0.4);n.x+=dx/d*v;n.y+=dy/d*v;}}}}
const NIGHT_CHAT_CLEAN=["Quiet night.","Lovely stars tonight.","Can't sleep either?","Off to the tavern!"],NIGHT_CHAT_ROUGH=["Damn, it's cold tonight.","Hell of a party at the tavern!","Who stole my damn lantern?"];
const _updN=update;update=function(){_updN();if(!hero||state!=="play")return;try{nightTick();if(isNight()&&!room&&frameN%240===0){const o=npcs.filter(n=>n._nightOut&&!n.torch&&Math.hypot(n.x-hero.x,n.y-hero.y)<220);if(o.length){const L=prof()?NIGHT_CHAT_CLEAN.concat(NIGHT_CHAT_ROUGH):NIGHT_CHAT_CLEAN;say(pick(o),pick(L));}}
  if(room&&room.b.kind==="inn"&&isNight())tavernTick();}catch(e){console.warn(e);}};
// tavern life
let tavFx=[];
const TAV_CLEAN=["Cheers!","Ha ha ha!","Another round!","To the hero!","Great song!","Ha! Good one!"],TAV_ROUGH=["Damn fine ale!","Hell yeah, another round!","Ha! You lucky bastard!","Shit, I spilled my drink!"];
const TAV_FLIRT=["Buy me a drink, hero~","Dance with me?","Hey there, handsome~","*wink*"];
function tavernTick(){const list=roomNpcs().filter(r=>r.n);if(frameN%70===0&&list.length){const r=pick(list);const L=prof()?TAV_CLEAN.concat(TAV_ROUGH):TAV_CLEAN;tavFx.push({x:r.x+8,y:r.y-14,t:pick(L),life:120});}
  if(frameN%18===0)tavFx.push({x:(room.w/2)*16+(Math.random()-.5)*60,y:2.4*16,t:pick(["♪","♫","♪♪"]),life:70,note:1});
  for(const r of list){const n=r.n;if(!isFlirty(n))continue;if(Math.hypot(r.x+8-hero.x-6,r.y+8-hero.y-6)>48||(n.flirtCd||0)>frameN)continue;n.flirtCd=frameN+60*20;n.flirted=(n.flirted||0)+1;n.friend=Math.min(100,(n.friend||0)+1);tavFx.push({x:r.x+8,y:r.y-16,t:pick(TAV_FLIRT),life:150},{x:r.x+8,y:r.y-28,t:"♥",life:90,heart:1});}
  for(const f of tavFx)f.life--;tavFx=tavFx.filter(f=>f.life>0).slice(-14);}
const _drawN=draw;draw=function(){_drawN();if(!hero||!world||state!=="play")return;const dk=darkness();
  if(room){if(room.b.kind!=="inn"||!tavFx.length)return;const Wp=room.w*16,Hp=room.h*16;const ox=Math.round(Math.max(0,(W-Wp)/2)-(Wp>W?clamp(hero.x+6-W/2,0,Wp-W):0)),oy=Math.round(Math.max(0,(H-Hp)/2)-(Hp>H?clamp(hero.y+6-H/2,0,Hp-H):0));
    ctx.save();ctx.setTransform(RS,0,0,RS,ox*RS,oy*RS);ctx.textAlign="center";for(const f of tavFx){ctx.globalAlpha=Math.min(1,f.life/20);const y=f.y-(f.note?(70-f.life)*.25:(120-f.life)*.05);
      if(f.note||f.heart){ctx.font="9px system-ui";ctx.fillStyle=f.heart?"#ff5a8a":"#ffd84a";ctx.fillText(f.t,f.x,y);}else{ctx.font="bold 7px system-ui";const w=ctx.measureText(f.t).width+8;ctx.fillStyle="#fffdf4";ctx.fillRect(f.x-w/2,y-9,w,11);ctx.strokeStyle="#3a2a1a";ctx.strokeRect(f.x-w/2+.5,y-8.5,w-1,10);ctx.fillStyle="#2a1a10";ctx.fillText(f.t,f.x,y-1);}}ctx.restore();return;}
  if(dk<0.12)return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx.globalCompositeOperation="lighter";const vis=(x,y)=>x>camX-60&&x<camX+W+60&&y>camY-60&&y<camY+H+60;
  const glow=(x,y,r,a,c)=>{const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);};
  const fl=f=>0.85+Math.sin(frameN*.3+f)*.08+Math.random()*.05;
  for(const p of PROPS)if(p.type==="lamp"&&vis(p.x*16,p.y*16)){glow(p.x*16+8,p.y*16+2,38,dk*0.85*fl(p.x),"255,190,100");glow(p.x*16+8,p.y*16+2,8,dk,"255,240,180");}
  for(const b of buildings)if(vis(b.x*16,b.y*16)){const y=(b.y+b.h)*16-20;for(const wx of [12,52])glow(b.x*16+wx,y,12,dk*0.55,"255,200,110");}
  for(const n of npcs)if(n.torch&&n._nightOut&&vis(n.x,n.y)){glow(n.x+14,n.y-2,44,dk*0.9*fl(n.id),"255,160,60");}
  ctx.globalCompositeOperation="source-over";
  for(const n of npcs)if(n.torch&&n._nightOut&&vis(n.x,n.y)){const x=Math.round(n.x+13),y=Math.round(n.y);ctx.fillStyle="#5a3a1a";ctx.fillRect(x,y-2,2,10);const f=Math.sin(frameN*.4+n.id);ctx.fillStyle="#ff9a30";ctx.fillRect(x-1,y-6+f,4,5);ctx.fillStyle="#fff0a0";ctx.fillRect(x,y-5+f,2,3);}
  ctx.restore();};
// busy tavern: regulars fill the seats at night; up to two clothed dancers on the rug
const INN_SEATS=[[2,5.4],[3.4,5.4],[5,5.4],[6.4,5.4],[2,7.3],[3.4,7.3],[5,7.3],[6.4,7.3],[9,6],[10.5,6]];
const _roomNpcsN=roomNpcs;roomNpcs=function(){const L=_roomNpcsN();if(!room||room.b.kind!=="inn"||!isNight())return L;const b=room.b;
  if(!b._regs||b._regs.day!==world.day){const used=new Set(L.map(r=>r.n&&r.n.id));const cand=npcs.filter(n=>n.alive&&n.s===b.s&&!n.adv&&n.age>=18&&!used.has(n.id)&&!["guard","leader","child","innkeeper","receptionist"].includes(n.role)&&!n._nightOut);
    b._regs={day:world.day,ids:cand.sort((a,c)=>((a.id*31)%17)-((c.id*31)%17)).slice(0,Math.max(0,8-L.filter(r=>r.n).length)).map(n=>n.id)};}
  let si=L.filter(r=>r.pose==="sit").length;const have=new Set(L.map(r=>r.n&&r.n.id));for(const id of b._regs.ids){const n=npcs.find(m=>m.id===id);if(!n||have.has(id))continue;have.add(id);const s=INN_SEATS[si++%INN_SEATS.length];L.push({n,x:s[0]*16,y:s[1]*16,pose:"sit"});}
  if(!L.some(r=>r.pose==="dance")){let k=0;for(const r of L){if(k>=2)break;if(r.n&&r.pose==="sit"&&isWoman(r.n)){r.pose="dance";r.x=(room.w/2-1.5+k*3)*16;r.y=(room.h/2)*16;k++;}}}return L;};
