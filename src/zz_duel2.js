// ===== Duels happen OUTSIDE town: meet-me-outside flow, duel spot marker, safety during duels =====
let DPEND=null;// {n,x,y,sid,t,watch:[]}
const townOfTile=(tx,ty)=>SETS.find(S=>Math.hypot(tx-S.x,ty-S.y)<=wallR(S)+1)||null;
const SOFT=new Set([GRASS,FLOWER,SAND,FARM,FOREST]);
function duelSpotFor(S){const gates=GATES.concat(typeof GATES2!=="undefined"?GATES2:[]).filter(g=>g.s===S.id);const hx=hero.x/TILE,hy=hero.y/TILE;
  gates.sort((a,b)=>Math.hypot(a.x-hx,a.y-hy)-Math.hypot(b.x-hx,b.y-hy));const cand=gates.length?gates:[{x:S.x,y:S.y+wallR(S),o:[0,1]},{x:S.x,y:S.y-wallR(S),o:[0,-1]},{x:S.x+wallR(S),y:S.y,o:[1,0]},{x:S.x-wallR(S),y:S.y,o:[-1,0]}];
  const ok=(x,y)=>{if(townOfTile(x,y))return false;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const i=(y+dy)*WW+x+dx;const t=T[i];if(!SOFT.has(t)||OCC[i]>0)return false;}
    for(const n of npcs)if(n.alive&&!n.inside&&Math.hypot(n.x/TILE-x,n.y/TILE-y)<4)return false;return !blocked(x*TILE,y*TILE,12,12);};
  for(const g of cand){const o=g.o||[0,1],p=[-o[1],o[0]];for(let d=8;d<=12;d++)for(const l of [3,-3,4,-4,5,-5,6,-6,2,-2,7,-7,0]){const x=Math.round(g.x+o[0]*d+p[0]*l),y=Math.round(g.y+o[1]*d+p[1]*l);if(ok(x,y))return{x,y};}}
  for(let d=8;d<=20;d++)for(let a=0;a<16;a++){const x=Math.round(S.x+Math.cos(a/16*6.283)*(wallR(S)+d)),y=Math.round(S.y+Math.sin(a/16*6.283)*(wallR(S)+d));if(ok(x,y))return{x,y};}
  return{x:Math.round(S.x),y:Math.round(S.y+wallR(S)+10)};}
const MEET_CLEAN=["Not here. Too many innocent folk about. Meet me outside the gates.","Not in the streets. Outside the gates, where nobody else gets hurt.","Follow me outside the walls. I won't spill townsfolk blood."];
const MEET_PROF=["Not here, damn it. Too many people. Meet me outside the gates.","Hell no, not in the street. Outside the gates, hero.","Outside the damn walls. I'm not killing bakers by accident."];
{const _sd=startDuel;startDuel=function(n,circle){if(startDuel._force||!circle||!hero)return _sd.apply(this,arguments);const S=townOfTile(hero.x/TILE,hero.y/TILE);if(!S)return _sd.apply(this,arguments);
  const sp=duelSpotFor(S);CHAL=null;closeMenu&&closeMenu();DPEND={n,x:sp.x,y:sp.y,sid:S.id,t:absMin(),watch:[]};n.pauseT=0;n.duelWalk=true;n.inside=false;
  let c=0;for(const o of npcs){if(!o.alive||o===n||o.inside||o.adv||o.duelist||o.role==="child"||o.age<18||o.s!==S.id||(P.party||[]).includes(o.id))continue;if(Math.hypot(o.x-hero.x,o.y-hero.y)>320)continue;o.duelWatch=c;DPEND.watch.push(o.id);if(++c>=6)break;}
  const line=pick(P.prof===false?MEET_CLEAN:MEET_PROF);
  showMenu(`⚔ ${n.name}`,`"${line}"\n\nThe duel spot is marked ⚔ on your map, outside ${S.name}.`,[{l:"⚔ Go to duel (fast)",f:()=>goToDuel()},{l:"I'll walk there",f:()=>toast("Head to the ⚔ outside the gates.")}]);return null;};}
function goToDuel(){if(!DPEND)return;const D=DPEND;fadeBlack("You follow the challenger out through the gates...",()=>{if(!DPEND)return;D.n.x=(D.x+1.5)*TILE;D.n.y=D.y*TILE;hero.x=(D.x-3)*TILE;hero.y=D.y*TILE;
  for(const id of D.watch){const o=npcs.find(q=>q.id===id);if(!o)continue;const a=o.duelWatch/6*6.283;o.x=(D.x+Math.cos(a)*7)*TILE;o.y=(D.y+Math.sin(a)*7)*TILE;o.inside=false;}});}
function duelBegin(){const D=DPEND;DPEND=null;const n=D.n;n.duelWalk=false;n.x=(D.x+1.5)*TILE-6;n.y=D.y*TILE;hero.x=Math.min(hero.x,(D.x-1)*TILE);
  startDuel._force=true;let e;try{e=startDuel(n,true);}finally{startDuel._force=false;}if(DUEL){DUEL.cx=D.x*TILE;DUEL.cy=D.y*TILE;DUEL.outside=true;for(const o of npcs)if(o.duelWatch!=null&&!D.watch.includes(o.id))o.duelWatch=null;
    let i=0;for(const id of D.watch){const o=npcs.find(q=>q.id===id);if(o)o.duelWatch=i++;}}return e;}
// challenger and onlookers head to the spot; arrival starts the duel; no-show = coward
{const _u=update;update=function(){_u();if(!DPEND||!hero||state!=="play")return;const D=DPEND,n=D.n;if(!n.alive){DPEND=null;return;}
  if(!room){const tx=(D.x+1.5)*TILE,ty=D.y*TILE;if(Math.hypot(n.x-tx,n.y-ty)>4){if(typeof stepTo==="function")stepTo(n,tx,ty,1.1);else{n.x+=Math.sign(tx-n.x);n.y+=Math.sign(ty-n.y);}}
    if(Math.hypot(hero.x+6-D.x*TILE,hero.y+8-D.y*TILE)<2.5*TILE)duelBegin();}
  if(DPEND&&absMin()-D.t>60){DPEND=null;n.duelWalk=false;P.fame=Math.max(0,(P.fame||0)-5);duelRec().declined++;for(const id of D.watch){const o=npcs.find(q=>q.id===id);if(o)o.duelWatch=null;}
    toast(`${n.name}: "${P.prof===false?"Coward! You never showed.":"You damn coward! You never showed."}" (fame -5)`);addNews(n.s,`${n.name} waited outside the gates, but the hero never came. "Coward!"`);
    if(Math.random()<.6)world.duelAmbush={id:n.id,at:absMin()+180+Math.floor(Math.random()*400)};}};}
{const _nt=npcTarget;npcTarget=function(n){if(DPEND&&n.duelWatch!=null&&DPEND.watch.includes(n.id)){const a=n.duelWatch/6*6.283;return{x:(DPEND.x+Math.cos(a)*7)*TILE,y:(DPEND.y+Math.sin(a)*7)*TILE};}
  if(DPEND&&n===DPEND.n)return{x:(DPEND.x+1.5)*TILE,y:DPEND.y*TILE};return _nt(n);};}
// onlookers watch from outside the circle (circle radius ~76px -> stand at ~7 tiles)
{const _nt=npcTarget;npcTarget=function(n){if(DUEL&&DUEL.outside&&n.duelWatch!=null){const a=n.duelWatch/6*6.283;return{x:DUEL.cx+Math.cos(a)*7*TILE,y:DUEL.cy+Math.sin(a)*7*TILE};}return _nt(n);};}
// SAFETY during a duel (and while heading to one): no building/tree damage, no NPC harm except the challenger
const duelSafe=()=>!!(DUEL||DPEND);
{const _sh=spellStructHit;spellStructHit=function(){if(duelSafe())return null;return _sh.apply(this,arguments);};}
{const _th=typeof spellTreeHit==="function"?spellTreeHit:null;if(_th)spellTreeHit=function(){if(DUEL)return null;return _th.apply(this,arguments);};}
{const _nh=npcHurt;npcHurt=function(n){if(duelSafe()&&!(DUEL&&n===DUEL.n))return false;return _nh.apply(this,arguments);};}
{const _ns=npcSlain;npcSlain=function(n,c,a,ex){if(DUEL&&n!==DUEL.n&&!ex)return;if(DPEND&&!ex)return;return _ns.apply(this,arguments);};}
// map + minimap marker
let duelStash=null;{const _dh=drawHomesMap;drawHomesMap=function(g,P2,txt,z){duelStash={g,P2,txt};return _dh.apply(this,arguments);};}
function duelMarkPos(){if(DPEND)return{x:DPEND.x,y:DPEND.y};if(DUEL&&DUEL.outside)return{x:DUEL.cx/TILE,y:DUEL.cy/TILE};return null;}
{const _df=drawFullMap;drawFullMap=function(){const r=_df.apply(this,arguments);try{const p=duelMarkPos();if(p&&duelStash){const {g,P2,txt}=duelStash;const [x,y]=P2(p.x,p.y);g.fillStyle="rgba(0,0,0,.6)";g.beginPath();g.arc(x,y,11,0,7);g.fill();g.strokeStyle="#ffd060";g.lineWidth=2;g.stroke();txt("⚔",x,y+5,"#ffe08a",14);txt("Duel",x,y+24,"#ffe08a",11);}}catch(_){}return r;};}
{const _dm=drawMini;drawMini=function(){_dm.apply(this,arguments);try{const p=duelMarkPos();if(!p||room)return;const R=MINI_R[miniZ],sx=mini.width/(R*2),sy=mini.height/(R*1.5);const W=mini.width/2,H=mini.height/2;let dx=(p.x-hero.x/TILE)*sx,dy=(p.y-hero.y/TILE)*sy;
  const k=Math.max(Math.abs(dx)/(W-7),Math.abs(dy)/(H-7),1);dx/=k;dy/=k;mg.save();mg.font="bold 12px system-ui";mg.textAlign="center";mg.fillStyle="#ffd060";mg.strokeStyle="#000";mg.lineWidth=3;mg.strokeText("⚔",W+dx,H+dy+4);mg.fillText("⚔",W+dx,H+dy+4);mg.restore();}catch(_){}};}
