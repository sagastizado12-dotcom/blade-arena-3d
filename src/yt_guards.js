// ===== GUARDS DEFEND THE TOWN: spot monsters, shout, run to engage, sword swings, knockdowns; villagers flee =====
const GUARD_RUN=2.1,GUARD_SIGHT=7*TILE,GUARD_HP=8;
const hostile=e=>e&&!e.dead&&e.def&&e.def.beh!=="pea"&&e.def.beh!=="neu"&&e.def.beh!=="flee"||(e&&!e.dead&&e.provoked&&e.def&&e.def.beh!=="pea");
function guardShout(n){const L=prof()?["Monster! To arms, damn it!","Hell no, not in our town! To arms!","Get behind me, dammit!","Monster! Bloody hell, move!"]:["Monster! To arms!","Protect the villagers!","Stand back, everyone!","For the town! Charge!"];say(n,pick(L),110);}
const solidPx=(x,y)=>solidTile(Math.floor(x/TILE),Math.floor(y/TILE));
function stepTo(n,tx,ty,sp){const dx=tx-n.x,dy=ty-n.y,d=Math.hypot(dx,dy);if(d<0.5)return d;const v=Math.min(sp,d);const nx=n.x+dx/d*v,ny=n.y+dy/d*v;if(!solidPx(nx+8,ny+12)){n.x=nx;n.y=ny;}else if(!solidPx(nx+8,n.y+12))n.x=nx;else if(!solidPx(n.x+8,ny+12))n.y=ny;return d;}
function guardTick(n){if(n.ghp==null)n.ghp=GUARD_HP;
  if(n.down>0){n.down--;n.engage=null;if(n.down===0){n.ghp=GUARD_HP;say(n,prof()?"Damn, that hurt... back on my feet.":"Ugh... back on my feet.",100);}return;}
  if(n.swing>0)n.swing--;if(n.hurtT>0)n.hurtT--;
  const S=SETS[n.s],cx=S.x*TILE,cy=S.y*TILE,raid=world.sets[n.s]&&world.sets[n.s].raid;
  let tgt=n.engage&&!n.engage.dead?n.engage:null;
  if(!tgt||Math.hypot(tgt.x-n.x,tgt.y-n.y)>GUARD_SIGHT*1.5){tgt=null;let bd=GUARD_SIGHT;for(const e of mobs){if(!hostile(e))continue;const d=Math.hypot(e.x+e.w/2-n.x-8,e.y+e.h/2-n.y-8);if(d<bd&&(n.soldierT||Math.hypot(e.x-cx,e.y-cy)<(S.r+8)*TILE)){bd=d;tgt=e;}}}
  if(tgt&&!n.engage){guardShout(n);n.alarmT=180;}n.engage=tgt;
  if(tgt){const ex=tgt.x+tgt.w/2-8,ey=tgt.y+tgt.h/2-10,d=Math.hypot(ex-n.x,ey-n.y);n.dir=Math.abs(ex-n.x)>Math.abs(ey-n.y)?(ex<n.x?1:2):(ey<n.y?3:0);
    if(d>12)stepTo(n,ex,ey,GUARD_RUN);
    else{n.atkT=(n.atkT||0)+1;if(n.atkT%34===0){n.swing=10;tgt._byGuard=true;const a=Math.atan2(ey-n.y,ex-n.x);window.__guardSwing=1;try{hurtEnemy(tgt,1,a,false);}finally{window.__guardSwing=0;}tgt.iframes=0;try{SFX.hit();}catch(_){}}
      if(n.atkT%50===25&&!tgt.dead&&!(tgt.stun>0)){n.ghp--;n.hurtT=10;const a=Math.atan2(n.y-ey,n.x-ex);stepTo(n,n.x+Math.cos(a)*6,n.y+Math.sin(a)*6,6);floatText(n.x+8,n.y-4,"-1","#ff7a6a");
        if(n.ghp<=0){n.down=720;n.engage=null;say(n,prof()?"Argh! Dammit...":"Argh! I'm down...",120);}}}
    return true;}
  {const ws=world.sets[n.s];if(ws&&ws.angryUntil>absMin()&&!hero.dead){const hx=hero.x-2,hy=hero.y-4,d=Math.hypot(hx-n.x,hy-n.y);if(d<GUARD_SIGHT){if(!n._angrySaid){n._angrySaid=1;say(n,prof()?"Murderer! Get the hell over here!":"Murderer! Halt in the name of the law!",120);}
    n.dir=Math.abs(hx-n.x)>Math.abs(hy-n.y)?(hx<n.x?1:2):(hy<n.y?3:0);if(d>12)stepTo(n,hx,hy,GUARD_RUN);else{n.atkT=(n.atkT||0)+1;if(n.atkT%40===0){n.swing=10;hurtHero(1,Math.atan2(hy-n.y,hx-n.x));}}n.chasingHero=true;return true;}}else n._angrySaid=0;n.chasingHero=false;}
  if(raid&&GATES.length){let g=n._gate;if(!g||g.s!==n.s){const gs=GATES.filter(q=>q.s===n.s);g=n._gate=gs[n.id%Math.max(1,gs.length)];}
    if(g){stepTo(n,g.x*TILE+(n.id%2?-14:14),g.y*TILE-6,GUARD_RUN);n.dir=0;n.holdGate=true;return true;}}
  n.holdGate=false;return false;}
const _updGuards=update;update=function(){_updGuards();if(!hero||state!=="play"||room||!world)return;
  for(const n of npcs){if(!n||!n.alive||n.inside||n.adv)continue;
    if(n.role==="guard"&&!(n.spouse===-1&&nightHome(n))){if(Math.hypot(n.x-hero.x,n.y-hero.y)>900&&!n.engage)continue;guardTick(n);continue;}
    let th=null,bd=80;for(const e of mobs){if(!hostile(e))continue;const d=Math.hypot(e.x-n.x,e.y-n.y);if(d<bd){bd=d;th=e;}}
    if(th){if(!n.fleeing&&Math.random()<0.3)say(n,pick(["Help!","Monster!","Run!","Guards!"]),80);n.fleeing=60;const a=Math.atan2(n.y-th.y,n.x-th.x);stepTo(n,n.x+Math.cos(a)*4,n.y+Math.sin(a)*4,1.7);}
    else if(n.fleeing>0)n.fleeing--;}};
const _drawNpcG=drawNpc;drawNpc=function(n){if(n.down>0){ctx.save();ctx.translate(n.x+8,n.y+14);ctx.rotate(Math.PI/2);ctx.translate(-n.x-8,-n.y-14);_drawNpcG(n);ctx.restore();ctx.fillStyle="#ffe060";ctx.font="7px sans-serif";ctx.fillText("✦",n.x+4+Math.sin(frameN*.1)*4,n.y+2);return;}
  if(n.hurtT>0){ctx.save();ctx.globalAlpha=frameN%4<2?0.5:1;_drawNpcG(n);ctx.restore();}else _drawNpcG(n);
  if(n.role==="guard"&&n.engage){if(n.swing>0){const a=[Math.PI/2,Math.PI,0,-Math.PI/2][n.dir||0];const u=(10-n.swing)/10;ctx.strokeStyle=`rgba(230,240,255,${1-u*.6})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(n.x+8,n.y+8,11,a-1.2+u*2.4-0.5,a-1.2+u*2.4+0.5);ctx.stroke();}
    if(n.ghp<GUARD_HP){ctx.fillStyle="#200";ctx.fillRect(n.x+1,n.y-6,14,3);ctx.fillStyle="#4c4";ctx.fillRect(n.x+2,n.y-5,12*n.ghp/GUARD_HP,1);}}};
