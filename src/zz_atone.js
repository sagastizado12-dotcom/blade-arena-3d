// ===== MAKE THE WORLD LIKE ME AGAIN: restore reputation + atonement =====
function calmAll(){for(const ws of world.sets){ws.angryUntil=0;ws.bounty=0;}world.fearUntil=0;world.bountyBoost=0;for(const m of mobs)if(m.hunter&&!m.dead){m.dead=true;m.flash=0;}
  for(const n of npcs){n._angrySaid=0;if(n.chasingHero)n.chasingHero=false;if(n.role==="guard"||n.guard){n.engage=null;n.atkT=0;}}}
function restoreReputation(){const K=kState();K.side="human";K.war={};K.rep=Math.max(K.rep||0,85);K.peaceQ=0;P.infamy=0;P.titles=(P.titles||[]).filter(t=>t!=="Destroyer");
  for(const k in K.rel)if(K.rel[k]==="war")K.rel[k]="peace";syncWar();calmAll();for(const n of npcs)if((n.friend||0)<0)n.friend=0;P.lastCrime=0;
  addNews(-1,"Heralds proclaim the wanderer a friend of every human realm once more.");toast("🕊 Your reputation is restored. The realms welcome you as a hero.");try{saveGame();}catch(_){}}
const repLabel=()=>{const r=kState().rep||0;return r>=80?"Heroic":r>=55?"Friendly":r>=35?"Neutral":r>=15?"Distrusted":"Hated";};
function gainRep(n,why){const K=kState();K.rep=Math.min(100,(K.rep||0)+n);P.infamy=Math.max(0,(P.infamy||0)-n*2);if(K.rep>=60)for(const ws of world.sets)if(ws.angryUntil<1e12)ws.angryUntil=0;
  if(K.rep>=50)P.titles=(P.titles||[]).filter(t=>t!=="Destroyer");floatText(hero.x+6,hero.y-16,`+${n} reputation`,"#9cf");if(why)toast(why);}
// --- atonement jobs ---
const ATONE=[{id:"slay",t:"Slay 6 monsters threatening the roads",need:6,rep:8,gold:60},{id:"wood",t:"Bring 10 wood for the rebuilders",need:10,rep:6,gold:30,item:"wood"},{id:"herb",t:"Bring 3 herbs to the healers",need:3,rep:5,gold:30,item:"herb"}];
function atoneMenu(){P.atone=P.atone||{};const A=P.atone;showMenu("⚖ Atonement jobs",`Reputation: ${kState().rep|0} (${repLabel()})\nHonest work to win people back.`,
  ATONE.map(j=>{const a=A[j.id];const have=j.item?(P.inv[j.item]||0):(a?a.have:0);if(!a)return{l:`Accept: ${j.t}`,f:()=>{A[j.id]={have:0};toast("Atonement job accepted.");atoneMenu();}};
    const ready=have>=j.need;return{l:`${ready?"✔ Turn in":"…"} ${j.t} (${Math.min(have,j.need)}/${j.need})`,dis:!ready,f:()=>{if(j.item)P.inv[j.item]-=j.need;delete A[j.id];P.gold+=j.gold;gainRep(j.rep,`Atonement done: +${j.rep} reputation, +${j.gold}g`);atoneMenu();}};}).concat([{l:"Close"}]));}
{const _ok=onKill;onKill=function(e){_ok(e);try{const a=P.atone&&P.atone.slay;if(a&&!e.duel&&!(e.def&&e.def.beh==="pea"))a.have++;}catch(_){}};}
// --- donations & peace offerings ---
function donateTown(sid){showMenu(`Donate to ${SETS[sid].name}`,`Reputation: ${kState().rep|0} (${repLabel()})`,[
  {l:"Donate 100g",dis:P.gold<100,f:()=>{P.gold-=100;gainRep(3);if(ruinOf(sid))ruinOf(sid).donated+=100;donateTown(sid);}},
  {l:`Donate 10 wood (${P.inv.wood||0})`,dis:(P.inv.wood||0)<10,f:()=>{P.inv.wood-=10;gainRep(3);if(ruinOf(sid))ruinOf(sid).donated+=120;donateTown(sid);}},{l:"Close"}]);}
function peaceOffering(){const K=kState();const war=KINGDOMS.filter(k=>!k.demon&&atWar(k.id));const cost=k=>200+80*k.id;
  showMenu("🕊 Peace offering",war.length?"Send a chest of gold and an apology to a ruler at war with you:":"You are at peace with every human realm. A gift still warms a ruler's heart.",
   (war.length?war:KINGDOMS.filter(k=>!k.demon)).map(k=>({l:`${k.ruler} (${k.name}) — ${cost(k)}g`,dis:P.gold<cost(k),f:()=>{P.gold-=cost(k);if(K.war[k.id]){delete K.war[k.id];syncWar();calmAll();addNews(k.cap,`${k.ruler} accepts the wanderer's peace offering. The war is over.`);}gainRep(10,`${k.ruler} accepts your offering.`);peaceOffering();}})).concat([{l:"Close"}]));}
function amendsMenu(){const s=typeof nearestTown==="function"?nearestTown():0;showMenu("🕊 Make amends",`Reputation: ${kState().rep|0} (${repLabel()}) · Infamy ${P.infamy|0}\nReputation also recovers slowly while you commit no new crimes.`,
  [{l:`Donate to ${SETS[s].name}`,f:()=>donateTown(s)},{l:"⚖ Atonement jobs",f:atoneMenu},{l:"🕊 Peace offering to a ruler",f:peaceOffering},
   {l:"Restore Reputation (instant)…",f:confirmRestore},{l:"Back"}]);}
function confirmRestore(){showMenu("Restore Reputation?","Reset your standing with every kingdom and town to heroic, end the wars with the human kingdoms, clear bounties and the Destroyer title. The demon war continues unless Nethervale has fallen. Friendships and marriages are kept.",
  [{l:"Yes, restore",f:()=>{restoreReputation();closeMenu();}},{l:"Cancel"}]);}
// Pause menu entries + guild & castle hooks
{const _sm=showMenu;showMenu=function(t,x,b){if(Array.isArray(b)){if(t==="Paused"){b=b.slice();const i=Math.max(1,b.length-1);b.splice(i,0,{l:"🕊 Make amends",f:amendsMenu},{l:"Restore Reputation",f:confirmRestore});}
  else if(/Guild/.test(t)&&!/Card/.test(t)){b=b.slice();b.splice(Math.max(0,b.length-1),0,{l:"⚖ Atonement jobs",f:atoneMenu});}
  else if(KINGDOMS.some(k=>(t===k.ruler||t===k.name)&&!k.demon)){b=b.slice();b.splice(Math.max(0,b.length-1),0,{l:"🕊 Peace offering",f:peaceOffering});}}return _sm.call(this,t,x,b);};}
// slow natural recovery
{const _hr=hourlyTick;hourlyTick=function(){_hr.apply(this,arguments);try{const inf=P.infamy||0;if(inf>(P._lastInf||0))P.lastCrime=absMin();P._lastInf=inf;
  if(absMin()-(P.lastCrime||0)>=12*60){const K=kState();if((K.rep||0)<60)K.rep=Math.min(60,(K.rep||0)+0.5);if(P.infamy>0)P.infamy=Math.max(0,P.infamy-1);P._lastInf=P.infamy;}}catch(_){}};}
