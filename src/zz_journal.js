// ===== v22: Hero's life while away + Hero Journal =====
const J_MAX=300;
function jAdd(t,k){if(!P)return;P.journal=P.journal||[];const day=world?world.day:1;const last=P.journal[P.journal.length-1];if(last&&last.t===t)return;P.journal.push({d:day,t,k:k||"life",ts:Date.now()});if(P.journal.length>J_MAX)P.journal.splice(0,P.journal.length-J_MAX);}
const nmOf=id=>{const n=npcs.find(o=>o.id===id);return n?n.name:null;};
// snapshot watcher: turns state changes into first-person memories
function jSnap(){const K=world&&world.kw?world.kw:{};return{lv:P.lv||1,titles:(P.titles||[]).slice(),wives:(typeof wives==="function"?wives():[]).map(n=>n.id),kids:(P.kids||[]).slice(),homes:(P.homes||[]).slice(),done:(P.guild&&P.guild.done)||0,raids:P.raidsDefended||0,
  duels:(P.duels&&P.duels.won)||0,spared:(P.duels&&P.duels.spared)||0,fallen:!!K.demonFallen,ruins:world?world.sets.filter(s=>s.ruin).map(s=>s.id):[],crowns:(K.crowns||[]).slice()};}
let jPrev=null;
function jDiff(){if(!P||!world)return;const s=jSnap();const p=jPrev;jPrev=s;if(!p)return;
  if(s.lv>p.lv)jAdd(`I reached level ${s.lv}. I can feel the power growing in my arms.`,"level");
  for(const t of s.titles)if(!p.titles.includes(t))jAdd(t==="Destroyer"?`They call me "Destroyer" now. I'm not sure I like what that says about me.`:`People have started calling me "${t}".`,"title");
  for(const id of s.wives)if(!p.wives.includes(id))jAdd(`I married ${nmOf(id)||"the woman I love"}. Best day of my life in this world.`,"family");
  for(const id of s.kids)if(!p.kids.includes(id))jAdd(`My child ${nmOf(id)||""} was born. I held them and forgot every battle I've fought.`,"family");
  for(const id of s.homes)if(!p.homes.includes(id)){const b=buildings[id];jAdd(`I bought a ${b&&b.cabin?"cabin":"house"}${b&&SETS[b.s]?" in "+SETS[b.s].name:""}. A place to call home.`,"home");}
  if(s.done>p.done)jAdd(`Finished a guild job${s.done-p.done>1?"s":""}. ${s.done} completed so far.`,"quest");
  if(s.raids>p.raids)jAdd(`I helped beat back a raid. The townsfolk cheered my name.`,"raid");
  if(s.duels>p.duels)jAdd(`Another challenger fell to my blade in a duel. ${s.duels} wins now.`,"duel");
  if(s.spared>p.spared)jAdd(`I spared a defeated duelist today. Mercy felt stronger than the killing blow.`,"duel");
  if(s.fallen&&!p.fallen)jAdd(`I slew Malzareth, the Demon King. Nethervale has fallen. The raids are over.`,"boss");
  for(const id of s.ruins)if(!p.ruins.includes(id))jAdd(`${SETS[id].name} lies in ruins because of me.`,"war");
  for(const k of s.crowns)if(!p.crowns.includes(k))jAdd(`I took the crown of ${KINGDOMS[k].name}.`,"war");}
{const _ok=onKill;onKill=function(e){_ok(e);try{const d=e.def||{};if(e.sp==="dragon")jAdd("I killed a dragon. My hands are still shaking.","boss");else if(e.champOf!=null)jAdd(`I defeated the champion of ${KINGDOMS[e.champOf].name}.`,"boss");
  else if(e.sp==="demongeneral"&&!e.malz)jAdd("I cut down a Demon General.","boss");}catch(_){}};}
// back-fill a journal for existing saves
function jBackfill(){if(!P||P.journalInit)return;P.journalInit=true;P.journal=P.journal||[];const s=jSnap();
  jAdd("I was summoned to this world by King Aldric. These pages are what I remember since.","life");
  if(s.lv>1)jAdd(`I've grown strong: level ${s.lv} already.`,"level");for(const t of s.titles)jAdd(`People call me "${t}".`,"title");
  for(const id of s.homes){const b=buildings[id];jAdd(`I own a ${b&&b.cabin?"cabin":"house"}${b&&SETS[b.s]?" in "+SETS[b.s].name:""}.`,"home");}
  for(const id of s.wives)jAdd(`I'm married to ${nmOf(id)||"a wonderful woman"}.`,"family");for(const id of s.kids)jAdd(`My child ${nmOf(id)||""} is part of my life now.`,"family");
  if(s.done)jAdd(`I've finished ${s.done} guild jobs.`,"quest");if(s.duels)jAdd(`I've won ${s.duels} duels.`,"duel");if(s.fallen)jAdd("I slew Malzareth, the Demon King.","boss");}
// ---- away simulation ----
const AWAY_MIN_MS=20*60*1000;// at least 20 real minutes away
function awaySim(ms,rng){rng=rng||Math.random;if(!P||!world)return null;const realH=ms/3600000;const hrs=Math.min(72,Math.floor(realH*4));if(hrs<1)return null;// 1 real hour = 4 in-game hours, cap 3 days
  const K=world.kw||{},lv=P.lv||1,L=[],R={gold:0,xp:0,gp:0,parts:{},love:[],kids:[]};const days=Math.max(1,Math.round(hrs/24));
  const slots=Math.max(1,Math.min(9,Math.floor(hrs/8)));const W=(typeof wives==="function"?wives():[]).filter(n=>n.alive);const kids=(P.kids||[]).map(id=>npcs.find(n=>n.id===id&&n.alive)).filter(Boolean);
  const demonsLive=!K.demonFallen&&K.side!=="demon";const atWarAny=KINGDOMS.some(k=>!k.demon&&atWar(k.id));const reg=P.guild&&P.guild.reg;
  const partKeys=Object.keys(PARTDEF).filter(k=>!/^d/.test(k));
  for(let i=0;i<slots;i++){const r=rng();
    if(W.length&&r<0.3){const w=W[Math.floor(rng()*W.length)];const spot=["the river","the tavern","the market","the hills at sunset","the flower fields"][Math.floor(rng()*5)];w.aff=Math.min(100,(w.aff||0)+3);w.bond=Math.min(100,(w.bond||0)+4);R.love.push(w.id);
      const gift=rng()<0.35;if(gift){P.inv.flowers=(P.inv.flowers||0)+1;}L.push(`I took ${w.name} to ${spot}. ${gift?"She gave me flowers on the way home.":"We talked until the stars came out."}`);continue;}
    if(kids.length&&r<0.45){const c=kids[Math.floor(rng()*kids.length)];c.bond=Math.min(100,(c.bond||0)+3);R.kids.push(c.id);L.push(`I spent an afternoon with ${c.name}. ${pick(["We built a little wooden sword together.","They showed me a frog they caught.","I taught them to skip stones."])}`);continue;}
    if(reg&&r<0.7){const g=Math.round((25+lv*6)*(0.7+rng()*0.6)),gp=Math.round(4+lv*0.8);R.gold+=g;R.gp+=gp;R.xp+=Math.round(12+lv*4);P.guild.done=(P.guild.done||0)+1;
      L.push(`I finished a guild job: ${pick(["escorting a merchant cart","clearing rats from a cellar","hunting a wolf pack","recovering a stolen heirloom","guarding a farm through the night"])}. (+${g}g, +${gp} GP)`);continue;}
    const n=1+Math.floor(rng()*3),g=Math.round((10+lv*4)*n*(0.7+rng()*0.5)),pk=partKeys[Math.floor(rng()*partKeys.length)];R.gold+=g;R.xp+=Math.round((8+lv*3)*n);if(reg)R.gp+=n*2;R.parts[pk]=(R.parts[pk]||0)+1;
    const where=demonsLive&&atWarAny&&rng()<0.2?"near the border, keeping clear of bounty hunters":demonsLive&&rng()<0.25?"against demon scouts near the Nethervale border":pick(["in the forest","along the river","in the hills","near the old ruins"]);
    L.push(`I hunted ${where} and brought down ${n} monster${n>1?"s":""}. (+${g}g, +1 ${ITEMS[pk].n})`);}
  // modest caps
  R.gold=Math.min(R.gold,150+lv*60);R.xp=Math.min(R.xp,100+lv*40);R.gp=Math.min(R.gp,60);
  P.gold+=R.gold;if(R.gp&&P.guild)P.guild.pts=(P.guild.pts||0)+R.gp;for(const k in R.parts)P.inv[k]=(P.inv[k]||0)+R.parts[k];try{if(R.xp)gainExp(R.xp);}catch(_){}
  return{hrs,days,lines:L,R};}
let awayPending=null;
{const _lg=loadGame;loadGame=function(){const r=_lg.apply(this,arguments);if(r){try{jBackfill();jPrev=jSnap();const last=P.lastSaved||0;const ms=last?Date.now()-last:0;
  if(ms>=AWAY_MIN_MS){const a=awaySim(ms);if(a&&a.lines.length){awayPending=a;jAdd(`While I was away (${a.hrs>=24?Math.round(a.hrs/24)+" day"+(Math.round(a.hrs/24)>1?"s":""):a.hrs+" hours"}): ${a.lines.join(" ")}`,"away");jPrev=jSnap();}}
  P.lastSaved=Date.now();}catch(err){console.warn(err);}}return r;};}
{const _sg=saveGame;saveGame=function(){if(P&&state==="play")P.lastSaved=Date.now();return _sg.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);try{P.journal=[];P.journalInit=false;jBackfill();jPrev=jSnap();P.lastSaved=Date.now();}catch(_){}return r;};}
// UI: parchment scroll
(function(){const st=document.createElement("style");st.textContent=`#awayScroll{position:fixed;inset:0;z-index:150;background:rgba(10,5,15,.75);display:flex;align-items:center;justify-content:center;padding:14px}
#awayScroll .sc{max-width:480px;width:100%;max-height:82vh;overflow:auto;background:linear-gradient(#f3e3bf,#e6cf9c);color:#3a2410;border:3px solid #8a6030;border-radius:10px;box-shadow:0 8px 30px #000a;padding:16px 18px;font:15px Georgia,serif}
#awayScroll h2{margin:0 0 8px;text-align:center;color:#6a3a10;font:700 20px Georgia,serif}#awayScroll li{margin:6px 0}#awayScroll .rw{margin-top:10px;padding-top:8px;border-top:1px dashed #8a6030;font:600 14px system-ui;color:#5a3810}
#awayScroll button{display:block;margin:12px auto 0;background:#6a3a10;color:#ffe6b8;border:0;border-radius:8px;padding:9px 18px;font:700 15px system-ui}`;document.head.appendChild(st);})();
function showAway(a){a=a||awayPending;if(!a)return;awayPending=null;const d=document.createElement("div");d.id="awayScroll";const R=a.R;const parts=Object.entries(R.parts).map(([k,n])=>`${n} ${ITEMS[k].n}`).join(", ");
  const span=a.hrs>=24?`${Math.round(a.hrs/24)} day${Math.round(a.hrs/24)>1?"s":""}`:`${a.hrs} hours`;
  d.innerHTML=`<div class="sc"><h2>📜 While you were away</h2><div><i>From my journal, ${span}:</i></div><ul>${a.lines.map(l=>`<li>${l.replace(/</g,"&lt;")}</li>`).join("")}</ul>
  <div class="rw">Gained: ${R.gold}g · ${R.xp} XP${R.gp?` · ${R.gp} GP`:""}${parts?` · ${parts}`:""}${R.love.length?` · ❤ with ${[...new Set(R.love)].map(nmOf).join(", ")}`:""}</div><button id="awayOk">Back to it</button></div>`;
  document.body.appendChild(d);paused=true;document.getElementById("awayOk").onclick=()=>{d.remove();paused=false;};}
setInterval(()=>{try{if(awayPending&&state==="play"&&!document.getElementById("awayScroll")&&menuEl.classList.contains("hidden"))showAway();if(state==="play")jDiff();}catch(_){}},800);
function journalMenu(page){page=page||0;const J=(P.journal||[]).slice().reverse();const per=12,pg=J.slice(page*per,page*per+per);
  const ic={level:"⭐",title:"🏅",family:"❤",home:"🏠",quest:"📜",raid:"🛡",duel:"⚔",boss:"💀",war:"🔥",away:"🌙",life:"✒"};
  showMenu("📖 Hero Journal",pg.length?pg.map(e=>`${ic[e.k]||"✒"} ${calOf(e.d)}: ${e.t}`).join("\n\n"):"Nothing written yet.",[...(page>0?[{l:"◀ Newer",f:()=>journalMenu(page-1)}]:[]),...((page+1)*per<J.length?[{l:"Older ▶",f:()=>journalMenu(page+1)}]:[]),{l:"Close"}]);}
{const _sm=showMenu;showMenu=function(t,x,b){if(t==="Paused"&&Array.isArray(b)){b=b.slice();b.splice(1,0,{l:"📖 Journal",f:()=>journalMenu(0)});}return _sm.call(this,t,x,b);};}
// ===== v22 calendar: 4 seasons x 7 days = 28-day year; 1 game year = 30 real days while away =====
const YEAR_DAYS=28,REAL_YEAR_MS=30*86400000,MS_PER_GAME_MIN=REAL_YEAR_MS/(YEAR_DAYS*1440);// ≈64.3 real s per game minute away (≈25.7 real h per game day)
const calYear=()=>Math.floor(world.day/YEAR_DAYS)+1,calDay=()=>world.day%7+1;
const calStr=()=>`${SEASONS[season()]} ${calDay()}, Year ${calYear()}`;
{const _uh=updateHud;updateHud=function(){_uh.apply(this,arguments);try{const h=hour(),m=world.min%60;document.getElementById("clock").textContent=`${calStr()} · ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} · ${world.weather}`;}catch(_){}};}
{const _sm=showMenu;showMenu=function(t,x,b){if(t==="Paused"&&world)x=`📅 ${calStr()} (day ${world.day+1})\n${x||""}`;return _sm.call(this,t,x,b);};}
// fast-forward the world by real time away; ticks drive kids aging, rebuilding, respawns, pregnancies, reputation recovery
let AWAY_TICK=false;
{const _t=toast;toast=function(){if(AWAY_TICK)return;return _t.apply(this,arguments);};}
{const _ic=issueChallenge;issueChallenge=function(){if(AWAY_TICK)return null;return _ic.apply(this,arguments);};}
const SIM_CAP_MIN=YEAR_DAYS*1440;// simulate at most one year tick-by-tick; the rest of the calendar jumps
function awayAdvance(ms){const mins=Math.floor(ms/MS_PER_GAME_MIN);if(mins<=0)return 0;const sim=Math.min(mins,SIM_CAP_MIN);AWAY_TICK=true;
  try{const ws=mobs.length;advanceMinutes(sim);mobs.length=Math.min(mobs.length,ws);}catch(e){console.warn(e);}finally{AWAY_TICK=false;}
  if(mins>sim){const extra=mins-sim;world.day+=Math.floor((world.min+extra)/1440);world.min=(world.min+extra)%1440;}
  for(const ws of world.sets)if(ws.raid)ws.raid=null;return mins;}
// replace away simulation scaling: driven by game minutes elapsed; rewards capped, calendar not
awaySim=function(ms,rng){rng=rng||Math.random;if(!P||!world)return null;const mins=Math.floor(ms/MS_PER_GAME_MIN);if(mins<60)return null;const hrs=Math.floor(mins/60),days=mins/1440;
  const K=world.kw||{},lv=P.lv||1,L=[],R={gold:0,xp:0,gp:0,parts:{},love:[],kids:[]};
  const slots=Math.max(1,Math.min(40,Math.round(days*1.5)));const W=(typeof wives==="function"?wives():[]).filter(n=>n.alive);const kids=(P.kids||[]).map(id=>npcs.find(n=>n.id===id&&n.alive)).filter(Boolean);
  const demonsLive=!K.demonFallen&&K.side!=="demon";const atWarAny=KINGDOMS.some(k=>!k.demon&&atWar(k.id));const reg=P.guild&&P.guild.reg;const partKeys=Object.keys(PARTDEF).filter(k=>!/^d/.test(k));
  for(let i=0;i<slots;i++){const r=rng();
    if(W.length&&r<0.3){const w=W[Math.floor(rng()*W.length)];const spot=["the river","the tavern","the market","the hills at sunset","the flower fields"][Math.floor(rng()*5)];w.aff=Math.min(100,(w.aff||0)+2);w.bond=Math.min(100,(w.bond||0)+3);R.love.push(w.id);
      const gift=rng()<0.3;if(gift)P.inv.flowers=(P.inv.flowers||0)+1;L.push(`I took ${w.name} to ${spot}. ${gift?"She gave me flowers on the way home.":"We talked until the stars came out."}`);continue;}
    if(kids.length&&r<0.45){const c=kids[Math.floor(rng()*kids.length)];c.bond=Math.min(100,(c.bond||0)+2);R.kids.push(c.id);L.push(`I spent an afternoon with ${c.name}. ${pick(["We built a little wooden sword together.","They showed me a frog they caught.","I taught them to skip stones."])}`);continue;}
    if(reg&&r<0.7){const g=Math.round((25+lv*6)*(0.7+rng()*0.6)),gp=Math.round(4+lv*0.8);R.gold+=g;R.gp+=gp;R.xp+=Math.round(12+lv*4);P.guild.done=(P.guild.done||0)+1;
      L.push(`I finished a guild job: ${pick(["escorting a merchant cart","clearing rats from a cellar","hunting a wolf pack","recovering a stolen heirloom","guarding a farm through the night"])}.`);continue;}
    const n=1+Math.floor(rng()*3),g=Math.round((10+lv*4)*n*(0.7+rng()*0.5)),pk=partKeys[Math.floor(rng()*partKeys.length)];R.gold+=g;R.xp+=Math.round((8+lv*3)*n);if(reg)R.gp+=n*2;R.parts[pk]=(R.parts[pk]||0)+1;
    const where=demonsLive&&atWarAny&&rng()<0.2?"near the border, keeping clear of bounty hunters":demonsLive&&rng()<0.25?"against demon scouts near the Nethervale border":pick(["in the forest","along the river","in the hills","near the old ruins"]);
    L.push(`I hunted ${where} and brought down ${n} monster${n>1?"s":""}.`);}
  const capD=Math.min(Math.max(1,days),10);R.gold=Math.min(R.gold,Math.round((60+lv*25)*capD));R.xp=Math.min(R.xp,Math.round((40+lv*15)*capD));R.gp=Math.min(R.gp,25*capD);
  for(const k in R.parts)R.parts[k]=Math.min(R.parts[k],3+Math.round(capD));
  P.gold+=R.gold;if(R.gp&&P.guild)P.guild.pts=(P.guild.pts||0)+R.gp;for(const k in R.parts)P.inv[k]=(P.inv[k]||0)+R.parts[k];try{if(R.xp)gainExp(R.xp);}catch(_){}
  const shown=L.length>12?L.slice(0,12).concat([`...and ${L.length-12} more days like these.`]):L;return{hrs,days:Math.floor(days),mins,lines:shown,R};};
// rewire load: compute away first, then advance the calendar (ticks), then summary
{const _lg=loadGame;loadGame=function(){const last=(()=>{try{const d=JSON.parse(localStorage.getItem(SAVEKEY));return d&&d.P&&d.P.lastSaved||0;}catch(_){return 0;}})();
  const r=_lg.apply(this,arguments);if(r&&last){try{const ms=Date.now()-last;if(ms>=MS_PER_GAME_MIN*60){const before=calStr();const mins=awayAdvance(ms);if(awayPending){awayPending.cal=`${before} → ${calStr()}`;const je=(P.journal||[]).filter(e=>e.k==="away").pop();if(je)je.d=world.day;}P.lastSaved=Date.now();}}catch(e){console.warn(e);}}return r;};}
{const _sa=showAway;showAway=function(a){const x=a||awayPending;const cal=x&&x.cal;_sa.apply(this,arguments);if(cal){const s=document.getElementById("awayScroll");if(s){const p=document.createElement("div");p.className="awayCal";p.style.cssText="text-align:center;font-style:italic;margin:4px 0";p.textContent="📅 "+cal;const h=s.querySelector("h2,h3,b")||s.firstChild;h&&h.after?h.after(p):s.prepend(p);}}};}
function calOf(d){d=d|0;return`${SEASONS[Math.floor(d/7)%4]} ${d%7+1}, Y${Math.floor(d/YEAR_DAYS)+1}`;}
