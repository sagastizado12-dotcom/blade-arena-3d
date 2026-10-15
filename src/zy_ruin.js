// ===== FULL CITY DESTRUCTION, RUINS, REFUGEES, REBUILDING =====
const townWalls=sid=>WALLS.filter(w=>w.s===sid),townGates=sid=>GATES.filter(g=>g.s===sid),townBlds=sid=>buildings.filter(b=>b&&b.s===sid&&!b.cabin);
const RUIN_PROPS=new Set(["fountain","stall","well","statue","gazebo","arch","bench","lamp"]);
function propDmgMap(){world.pdmg=world.pdmg||{};return world.pdmg;}
function townProps(sid){const S=SETS[sid];return PROPS.map((p,i)=>[p,i]).filter(([p])=>RUIN_PROPS.has(p.type)&&!p.cabin&&Math.hypot(p.x-S.x,p.y-S.y)<=S.r+1);}
function townDestruction(sid){if(!world)return 0;let sum=0,n=0;const add=(v,wt)=>{sum+=Math.max(0,Math.min(1,v))*wt;n+=wt;};
  for(const b of townBlds(sid))add((world.bld[b.id]||{}).dmg||0,b.kind==="castle"||b.kind==="guild"?3:2);
  for(const w of townWalls(sid))add(1-wallHp(w.i)/10,.25);for(const g of townGates(sid))add(g.hp==null?0:1-g.hp/12,1);
  const pd=propDmgMap();for(const [p,i] of townProps(sid))add(pd[i]||0,.5);
  if(CASTLES.some(c=>c.s===sid)||(sid===0&&castleObj))add((world.cdmg||{})[sid]||0,4);return n?sum/n:0;}
const ruinOf=sid=>world&&world.sets[sid]&&world.sets[sid].ruin;
// props (fountain, stalls...) can be smashed too
{const _sh=spellStructHit;spellStructHit=function(px,py,lv,power){let r=_sh(px,py,lv,power);if(!r&&lv>=4){const tx=px/TILE,ty=py/TILE;const pd=propDmgMap();
    for(let i=0;i<PROPS.length;i++){const p=PROPS[i];if(!RUIN_PROPS.has(p.type)||p.cabin||Math.abs(p.x+.5-tx)>1.2||Math.abs(p.y+.5-ty)>1.2)continue;pd[i]=Math.min(1,(pd[i]||0)+0.25+0.05*(lv-4)+(power||0)*.05);burst(px,py,[150,140,130],8,1.4,2);r="prop";
      const S=SETS.find(s=>Math.hypot(p.x-s.x,p.y-s.y)<=s.r+1);if(S)ruinCheck(S.id);break;}}
  else if(r){let best=null,bd=1e9;for(const S of SETS){const d=Math.hypot(px/TILE-S.x,py/TILE-S.y);if(d<bd){bd=d;best=S;}}if(best&&bd<=best.r+4)ruinCheck(best.id);}return r;};}
{const _dp=drawProp;drawProp=function(p){const pd=world&&world.pdmg;const i=pd?PROPS.indexOf(p):-1;const d=i>=0?pd[i]||0:0;if(d>=1){const x=p.x*16,y=p.y*16;ctx.fillStyle="#5a5048";ctx.fillRect(x+1,y+9,6,4);ctx.fillRect(x+8,y+11,6,3);ctx.fillStyle="#3a322c";ctx.fillRect(x+3,y+13,10,2);return;}
  _dp(p);if(d>0.3){ctx.strokeStyle="rgba(20,10,8,.8)";ctx.beginPath();ctx.moveTo(p.x*16+4,p.y*16+3);ctx.lineTo(p.x*16+8,p.y*16+8);ctx.lineTo(p.x*16+6,p.y*16+12);ctx.stroke();}};}
// ---- ruin state machine ----
function ruinCheck(sid){if(!world)return;const ws=world.sets[sid];const pct=townDestruction(sid);ws.dpct=pct;
  if(pct>=0.5&&!ws.warn50){ws.warn50=1;toast(`⚠ ${SETS[sid].name} is half destroyed. Keep going and it will fall to ruin.`);}
  if(pct>=0.9&&!ws.ruin)ruinTown(sid);}
function nearTownR(sid,exclude){const S=SETS[sid];let best=null,bd=1e9;for(const T of SETS){if(T.id===sid||(exclude&&exclude(T)))continue;const d=Math.hypot(T.x-S.x,T.y-S.y);if(d<bd){bd=d;best=T;}}return best;}
function ruinTown(sid){const S=SETS[sid],ws=world.sets[sid];ws.ruin={since:absMin(),day:world.day,donated:0,progress:0};ws.raid=null;
  const dest=nearTownR(sid,T=>!!ruinOf(T.id)||!!T.demon!==!!S.demon)||nearTownR(sid,T=>!!ruinOf(T.id));
  let fled=0,fell=0,kids=0;
  for(const n of npcs){if(!n.alive||n.s!==sid||n.adv)continue;const child=n.role==="child"||n.age<18;
    if(!child&&Math.random()<0.25&&typeof npcSlain==="function"){const d=doorOf(buildings[n.home]||buildings[S.bIdx[0]]);try{npcSlain(n,[d.x,d.y],0,true);}catch(_){n.alive=false;}fell++;continue;}
    if(!dest)continue;n.refugee={from:sid,home:n.home,work:n.work};n.s=dest.id;const hs=dest.bIdx.filter(b=>buildings[b].kind==="house"||buildings[b].kind==="inn");n.home=hs[(n.id)%Math.max(1,hs.length)];n.work=null;n.inside=false;n.wp=null;n.wspot=null;
    const d=doorOf(buildings[n.home]);n.x=d.x;n.y=d.y+6;if(child)kids++;else fled++;}
  const k=kOf(sid),K=kState(),KD=KINGDOMS[k];
  P.infamy=(P.infamy||0)+60;K.rep=Math.max(0,(K.rep||0)-45);P.titles=P.titles||[];if(!P.titles.includes("Destroyer"))P.titles.push("Destroyer");
  world.fearUntil=world.day+12;
  addNews(sid,`${S.name} lies in ruins! ${fled} townsfolk fled to ${dest?dest.name:"the wilds"}${kids?`, ${kids} children evacuated safely`:""}.`);
  if(!KD.demon){try{if(!atWar(k))declareWar(k,true);}catch(_){}addNews(sid,`${KD.ruler} of ${KD.name} declares war on the Destroyer!`);
    const dk=KINGDOMS.find(q=>q.demon);if(dk)addNews(dk.cap,`The demons of ${dk.name} sing the Destroyer's praises over the ashes of ${S.name}!`);}
  else{addNews(sid,`Even the demons recoil: ${S.name} is ash.`);}
  for(const q of KINGDOMS)if(q.id!==k&&!q.demon)addNews(q.cap,`Fear spreads through ${q.name}. Merchants raise their prices.`);
  if(KD.cap===sid){K.toppled=K.toppled||{};K.toppled[k]=world.day;addNews(sid,`${KD.ruler} has fallen with the capital! The crown of ${KD.name} is there for the taking.`);try{takeCrown(k);}catch(_){}}
  ws.bounty=(ws.bounty||0)+1;world.bountyBoost=world.day+7;
  toast(`🔥 ${S.name} is in RUINS. You are now known as the Destroyer.`);try{SFX.roar&&SFX.roar();}catch(_){}
  for(const w of wives())settleWife(w);saveGame&&saveGame();}
// rebuilding: ~8 days (faster with donations); during the first day the ruins smoulder
const REBUILD_DAYS=8;
function rebuildHourly(){for(const S of SETS){const ws=world.sets[S.id],R=ws.ruin;if(!R)continue;const age=absMin()-R.since;if(age<24*60)continue;
  const boost=1+Math.min(3,R.donated/400);const step=boost/(REBUILD_DAYS*24);R.progress=Math.min(1,R.progress+step);
  for(const b of townBlds(S.id)){const st=world.bld[b.id];if(st&&st.dmg>0)st.dmg=Math.max(0,Math.min(st.dmg,1-R.progress));}
  for(const w of townWalls(S.id))world.walls&&(world.walls[w.i]=Math.max(wallHp(w.i),10*R.progress));for(const g of townGates(S.id)){g.hp=Math.max(g.hp==null?12:g.hp,12*R.progress);if(g.hp>3)g.broken=0;}
  const pd=propDmgMap();for(const [p,i] of townProps(S.id))if(pd[i])pd[i]=Math.min(pd[i],1-R.progress);if(world.cdmg&&world.cdmg[S.id])world.cdmg[S.id]=Math.min(world.cdmg[S.id],1-R.progress);
  if(R.progress>=1||townDestruction(S.id)<0.08){ws.ruin=null;ws.warn50=0;ws.dpct=townDestruction(S.id);let back=0;for(const n of npcs)if(n.refugee&&n.refugee.from===S.id){n.s=S.id;n.home=n.refugee.home;n.work=n.refugee.work;n.refugee=null;n.wp=null;n.wspot=null;back++;}
    addNews(S.id,`${S.name} has been rebuilt! ${back} refugees have returned home.`);toast(`🏗 ${S.name} has been rebuilt.`);for(const w of wives())settleWife(w);}}}
{const _rh=repairHourly;repairHourly=function(){const keep=[];for(const S of SETS)if(ruinOf(S.id))for(const b of townBlds(S.id)){if(owns(b))continue;keep.push([b.id,(world.bld[b.id]||{}).dmg]);}
  const keepW=[];for(const S of SETS)if(ruinOf(S.id))for(const w of townWalls(S.id))keepW.push([w.i,wallHp(w.i)]);
  _rh.apply(this,arguments);for(const [i,d] of keep)if(world.bld[i])world.bld[i].dmg=d;for(const [i,h] of keepW)world.walls[i]=h;rebuildHourly();};}
// ruins are closed for business; wives don't stay in a ruined town
{const _dl=doorLocked;doorLocked=function(b){if(b&&ruinOf(b.s)&&!owns(b)&&b.kind!=="castle")return true;return _dl(b);};}
{const _sm=shopMenu;shopMenu=function(sid){if(ruinOf(sid)){showMenu("Ruins",`The market of ${SETS[sid].name} is ashes. Nobody is selling anything here.`,[{l:"OK"}]);return;}return _sm(sid);};}
{const _gm=guildMenu;guildMenu=function(sid){if(ruinOf(sid)){showMenu("Ruins",`The guild hall of ${SETS[sid].name} is rubble.`,[{l:"OK"}]);return;}return _gm.apply(this,arguments);};}
{const _po=priceOf;priceOf=function(sid,k,sell){const p=_po(sid,k,sell);if(!sell&&world&&world.fearUntil>=world.day)return Math.max(1,Math.round(p*1.3));return p;};}
{const _th=townHomeFor;townHomeFor=function(n){const t=_th(n);if(t!=null&&ruinOf(buildings[t].s))return null;return t;};}
{const _sw=settleWife;settleWife=function(n){const r=_sw(n);if(n.wifeHome!=null&&ruinOf(buildings[n.wifeHome].s)&&!n.wifeManual){const H=(P.homes||[]).filter(id=>!ruinOf(buildings[id].s));if(H.length){let best=H[0],bd=1e9;for(const id of H){const d=homeDist(id,n.x/TILE,n.y/TILE);if(d<bd){bd=d;best=id;}}n.wifeHome=best;n.home=best;}}return r;};}
// smoke and fire linger (capped)
let ruinFx=0;{const _u=update;update=function(){_u();if(!world||!hero||room||state!=="play")return;if((++ruinFx)%6)return;if(particles.length>260)return;
  for(const S of SETS){const R=ruinOf(S.id);if(!R)continue;if(Math.hypot(S.x*TILE-hero.x,S.y*TILE-hero.y)>420)continue;const B=townBlds(S.id);if(!B.length)continue;const b=B[(ruinFx/6|0)%B.length];const st=world.bld[b.id];if(!st||st.dmg<0.5)continue;
    const x=(b.x+Math.random()*b.w)*16,y=(b.y+b.h*.5)*16;burst(x,y,[70,66,64],2,0.35,3);if(absMin()-R.since<36*60&&Math.random()<.6)burst(x,y+6,[255,140,40],2,0.6,1.6);}};}
{const _db=drawBuilding;drawBuilding=function(b){_db(b);const R=ruinOf(b.s);if(!R)return;const st=world.bld[b.id];if(!st||st.dmg<0.7)return;if(absMin()-R.since>36*60)return;const s0=buildingSprite(b);const x=b.x*16,y=(b.y+b.h)*16;
  for(let i=0;i<3;i++){const fx=x+8+hash2(b.id,i,77)*(s0.lw-16),f=Math.sin(frameN*.3+i*2)*2;ctx.fillStyle="rgba(255,110,20,.85)";ctx.fillRect(fx,y-10-f,4,8+f);ctx.fillStyle="rgba(255,220,90,.9)";ctx.fillRect(fx+1,y-6-f,2,4+f);}};}
// map: destruction % and "Ruins of X"
function drawRuinMap(g,P2,txt,z){for(const S of SETS){const ws=world.sets[S.id];const p=ws.ruin?Math.max(ws.dpct||0,.9):ws.dpct||0;if(p<0.02&&!ws.ruin)continue;const [x,y]=P2(S.x,S.y);
  if(ws.ruin){g.fillStyle="rgba(0,0,0,.6)";g.fillRect(x-58,y-34,116,18);txt("🔥 Ruins of "+S.name,x,y-20,"#ff8a5a",12);txt(ws.ruin.progress>0?`rebuilding ${Math.round(ws.ruin.progress*100)}%`:"smouldering",x,y+22,"#ffcf9a",10);}
  else txt(`💥 ${Math.round(p*100)}% destroyed`,x,y+22,"#ffb07a",10);}}
{const _dh=drawHomesMap;drawHomesMap=function(g,P2,txt,z){_dh(g,P2,txt,z);try{drawRuinMap(g,P2,txt,z);}catch(_){}};}
{const _hr=hourlyTick;hourlyTick=function(){_hr.apply(this,arguments);if(world)for(const S of SETS)world.sets[S.id].dpct=townDestruction(S.id);};}
// donations to speed up rebuilding: talk to anyone from the ruined town, or interact inside the ruins
function donateMenu(sid){const R=ruinOf(sid);if(!R)return;showMenu(`Rebuild ${SETS[sid].name}`,`Rebuilding: ${Math.round(R.progress*100)}%. Donations so far: ${R.donated}.\nGold and wood speed up the work.`,
  [{l:"Donate 100g",dis:P.gold<100,f:()=>{P.gold-=100;R.donated+=100;K_rep(2);donateMenu(sid);}},{l:"Donate 500g",dis:P.gold<500,f:()=>{P.gold-=500;R.donated+=500;K_rep(8);donateMenu(sid);}},
   {l:`Donate 10 wood (${P.inv.wood||0})`,dis:(P.inv.wood||0)<10,f:()=>{P.inv.wood-=10;R.donated+=120;K_rep(2);donateMenu(sid);}},{l:"Close"}]);}
function K_rep(n){const K=kState();K.rep=Math.min(100,(K.rep||0)+n);}
{const _tk=talk;talk=function(n){if(n&&n.refugee&&ruinOf(n.refugee.from)){const sm=showMenu;showMenu=function(t,x,b){showMenu=sm;if(Array.isArray(b)){b=b.slice();b.unshift({l:`🏗 Donate to rebuild ${SETS[n.refugee.from].name}`,f:()=>donateMenu(n.refugee.from)});x=`(A refugee from ${SETS[n.refugee.from].name}.)\n`+x;}return sm(t,x,b);};try{return _tk(n);}finally{showMenu=sm;}}return _tk(n);};}
{const _in=interact;interact=function(){if(world&&hero&&!room){for(const S of SETS){if(!ruinOf(S.id))continue;const f=typeof fountainOf==="function"?fountainOf(S):null;const cx=f?f.x:S.x,cy=f?f.y:S.y;if(Math.hypot(hero.x/TILE-cx,hero.y/TILE-cy)<4){donateMenu(S.id);return;}}}return _in.apply(this,arguments);};}
