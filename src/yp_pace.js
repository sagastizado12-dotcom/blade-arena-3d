// ===== NPC PACE: nobody walks faster than the hero's normal walk; eased starts/stops =====
const HERO_WALK=1.15;let npcMaxStep=0;
function onScreen(x,y){return x>camX-40&&x<camX+W+40&&y>camY-40&&y<camY+H+40;}
const _updPace=update;update=function(){const prev=npcs.map(n=>[n.x,n.y]);_updPace();if(!hero||state!=="play")return;
  for(let i=0;i<npcs.length;i++){const n=npcs[i];if(!n||!prev[i])continue;const [px,py]=prev[i];if(px==null)continue;const dx=n.x-px,dy=n.y-py,d=Math.hypot(dx,dy);
    if(d<1e-4){n._sp=Math.max(0,(n._sp||0)-0.1);continue;}
    const exempt=n.flee>0||n.fleeing||n.engage||n.down>0||n.holdGate||n.chasingHero||(n.adv&&n.adv.phase==="fight")||n.inside;
    if(d>40&&(!onScreen(px,py)||!onScreen(n.x,n.y))){n._sp=0;continue;} // offscreen jump/teleport
    if(exempt){continue;}
    const cap=Math.min(HERO_WALK,(n._sp||0)+0.08);if(d>cap){n.x=px+dx/d*cap;n.y=py+dy/d*cap;}n._sp=Math.min(d,cap);if(onScreen(n.x,n.y))npcMaxStep=Math.max(npcMaxStep,Math.min(d,cap));}};
