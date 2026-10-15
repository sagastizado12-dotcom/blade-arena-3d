// ===== DUEL CHALLENGES =====
const DUEL_STYLES={sword:{w:"longsword",ic:"⚔"},axe:{w:"great axe",ic:"🪓"},spear:{w:"spear",ic:"🔱"},mage:{w:"fire magic",ic:"✦"},twin:{w:"twin daggers",ic:"🗡"},storm:{w:"storm magic",ic:"⚡"}};
const DUEL_TITLES=["the Ambitious","Blade of the East","the Unbroken","Wolfbane","the Red","Stormcaller","Ironhand","the Swift","Oathbreaker","Lionheart"];
const LEG_TITLES=["Grand Duelist of","Champion of","Sword Saint of"];
const TAUNT_CLEAN=["They call you the strongest? I'll be the one who ends that story.","Draw your blade, hero. Today the bards get a new name.","I've crossed three rivers to beat you. Don't disappoint me.","Your fame ends here."];
const TAUNT_PROF=["Strongest hero? What a load of crap. Draw, you bastard.","I'm gonna kick your ass and take that damn reputation.","Hell, I've waited long enough. Fight me!","Your fame is bullshit and I'll prove it."];
const DECLINE_MOCK=["Ha! The great hero runs from a real fight.","Coward. I'll tell every tavern from here to the coast.","Figures. All that fame and no spine."];
let DUEL=null,CHAL=null;
const duelRec=()=>P.duels=P.duels||{won:0,lost:0,spared:0,declined:0};
const heroLv=()=>P.lv||1;
function makeChallenger(legend){const sid0=nearestTown?nearestTown():0;let sid=typeof sid0==="number"?sid0:0,kingName=null,demon=false;
  if(legend){const others=KINGDOMS.filter(k=>k.id!==kOf(sid));const K=pick(others);sid=K.cap;kingName=K.name;demon=!!K.demon;}
  const n=makeAdv(pick(ADV_CLASSES),sid);n.duelist=true;const style=pick(Object.keys(DUEL_STYLES));
  const lvl=Math.max(1,heroLv()+Math.floor(Math.random()*5)-2+(legend?4:0));n.adv.lvl=lvl;
  n.duel={style,lvl,legend:!!legend,demon,title:legend?`${pick(LEG_TITLES)} ${kingName}`:pick(DUEL_TITLES)};if(demon)n.demon=true;
  try{assignSexes&&assignSexes();}catch(_){}n.s=sid;const a=Math.random()*6.28;n.x=hero.x+Math.cos(a)*40;n.y=hero.y+Math.sin(a)*40;if(blocked(n.x,n.y,12,12)){n.x=hero.x+30;n.y=hero.y;}n.pauseT=99999;n.inside=false;return n;}
const tauntOf=()=>pick(P.prof===false?TAUNT_CLEAN:TAUNT_PROF);
const chalName=n=>`${n.name}, ${n.duel.title}`;
function issueChallenge(legend){if(DUEL||CHAL||!hero||room||state!=="play")return null;const n=makeChallenger(legend==null?Math.random()<0.12:legend);CHAL={n,t:absMin()};
  toast(`${n.duel.legend?"🌟 LEGENDARY ":""}${chalName(n)} approaches!`);addNews(n.s,`${chalName(n)} seeks a duel with ${heroName?heroName():"the hero"}.`);showChallenge();return n;}
function showChallenge(){if(!CHAL)return;const n=CHAL.n,d=n.duel,st=DUEL_STYLES[d.style];
  showMenu(`⚔ Challenge: ${n.name}`,`${chalName(n)}\nLevel ${d.lvl} · ${st.ic} ${st.w}${d.demon?" · Demon champion":""}\n\n"${tauntOf()}"\n\nA duel to the death.`,
   [{l:"⚔ Accept",f:()=>startDuel(n,true)},{l:"Decline (-fame)",f:()=>declineDuel(n)},{l:"Ignore",f:()=>ignoreDuel(n)}]);}
function declineDuel(n){const r=duelRec();r.declined++;P.fame=Math.max(0,(P.fame||0)-8);CHAL=null;bubble(n,pick(DECLINE_MOCK));toast("Fame -8");n.pauseT=0;n.duelist=false;}
function ignoreDuel(n){CHAL=null;world.duelAmbush={id:n.id,at:absMin()+120+Math.floor(Math.random()*480)};n.pauseT=0;bubble(n,"Fine. I'll find you when you least expect it.");}
function bubble(n,t){try{if(typeof say==="function")return say(n,t);}catch(_){}floatText(n.x+8,n.y-8,t,"#fff");}
function startDuel(n,circle){CHAL=null;closeMenu&&closeMenu();const d=n.duel,lvl=d.lvl;const cx=(hero.x+n.x)/2,cy=(hero.y+n.y)/2;
  const e=spawnMob("champion",n.x,n.y,{persist:true,duel:true,duelNpc:n.id,name:n.name});const hp=Math.round(30+lvl*10*(d.legend?1.6:1));e.hp=e.maxHp=hp;e.dmg=Math.max(2,Math.round((hero.maxHp||60)*(d.legend?.16:.11)));e.spd=(e.spd||.6)*1.25;
  n.inside=true;n.duelHide=true;DUEL={e,n,cx,cy,circle:!!circle,t0:absMin(),kneel:false,cd:60};
  if(circle){let c=0;for(const o of npcs){if(!o.alive||o===n||o.inside||o.adv&&o.duelist||Math.hypot(o.x-cx,o.y-cy)>260)continue;o.duelWatch=c++;if(c>=12)break;}}
  toast(circle?"⚔ The duel begins! Onlookers gather.":`⚔ ${n.name} ambushes you!`);try{SFX.roar&&SFX.roar();}catch(_){}return e;}
function endDuel(){if(!DUEL)return;for(const o of npcs)if(o.duelWatch!=null)o.duelWatch=null;DUEL=null;}
function duelWin(killed){const {n,e}=DUEL;const d=n.duel,r=duelRec();const fame=Math.round(10+d.lvl*2*(d.legend?2:1));P.fame=(P.fame||0)+fame;
  const g=guild();const gp=Math.round(8+d.lvl*(d.legend?3:1.5));g.pts+=gp;const gold=40+d.lvl*15*(d.legend?3:1);P.gold+=gold;
  const loot=pick(["ironsword","steelsword","potion","bigpotion","herb"].filter(k=>ITEMS[k]))||null;if(loot)P.inv[loot]=(P.inv[loot]||0)+1;
  if(killed){r.won++;n.inside=false;n.duelHide=false;n.x=e.x;n.y=e.y;try{npcSlain(n,[e.x+6,e.y+6],0,true);}catch(_){n.alive=false;}
    addNews(n.s,`${heroName?heroName():"The hero"} slew ${chalName(n)} in an honorable duel. The crowd roared.`);}
  else{r.spared++;n.inside=false;n.duelHide=false;n.x=e.x;n.y=e.y;n.duelist=false;n.pauseT=0;n.bond=Math.max(n.bond||0,40);P.party=P.party||[];if(P.party.length<3&&!P.party.includes(n.id))P.party.push(n.id);
    addNews(n.s,`${heroName?heroName():"The hero"} spared ${chalName(n)}, who swore to follow him.`);e.dead=true;e.flash=0;}
  floatText(hero.x+6,hero.y-20,`VICTORY! +${fame} fame +${gp} GP`,"#ffd060");toast(`Duel won: +${fame} fame, +${gp} GP, +${gold}g${loot?", "+ITEMS[loot].n:""}`);
  for(const o of npcs)if(o.duelWatch!=null&&Math.random()<.5)floatText(o.x+8,o.y-6,pick(["Bravo!","Honor!","What a fight!","Hurrah!"]),"#fff");endDuel();saveGame&&saveGame();}
function duelLose(){const {n,e}=DUEL;const r=duelRec();r.lost++;const lost=Math.floor(P.gold*0.15);P.gold-=lost;P.fame=Math.max(0,(P.fame||0)-10);
  hero.hp=Math.max(1,Math.round(hero.maxHp*.3));hero.iframes=180;e.dead=true;e.flash=0;n.inside=false;n.duelHide=false;n.x=e.x;n.y=e.y;n.pauseT=0;n.duelist=false;n.duelBeatHero=true;
  try{fadeQuick&&fadeQuick(()=>{});}catch(_){}toast(`You were knocked out! -${lost}g, -10 fame`);addNews(n.s,`${chalName(n)} defeated ${heroName?heroName():"the hero"} in a duel!`);endDuel();}
function duelSpareMenu(){const n=DUEL.n;DUEL.kneel=true;showMenu(`${n.name} kneels`,`"${P.prof===false?"Enough... you win. Finish it, or let me live.":"Damn it... you win. Finish it, or let me live."}"`,
  [{l:"Finish the duel",f:()=>{const e=DUEL.e;e.hp=0;e.dead=true;e.flash=12;spray(e.x+6,e.y+6,bloodOn?8:3,0,1);onKill(e);}},{l:"Spare them (+friend)",f:()=>duelWin(false)}]);}
{const _ok=onKill;onKill=function(e){_ok(e);try{if(e.duel&&DUEL&&DUEL.e===e)duelWin(true);}catch(err){console.error(err);}};}
{const _hh=hurtHero;hurtHero=function(dmg,ang){if(DUEL&&hero.iframes<=0&&hero.dodgeT<=0&&!hero.dead){const before=hero.hp;_hh(dmg,ang);if(hero.hp<=0||hero.dead){hero.dead=false;duelLose();}return;}return _hh(dmg,ang);};}
// duelist AI extras: dodge, magic, kneel
{const _um=updateMob;updateMob=function(e){if(e.duel&&DUEL&&DUEL.e===e){if(DUEL.kneel)return;const n=DUEL.n,st=n.duel.style;const cx=e.x+e.w/2,cy=e.y+e.h/2,dist=Math.hypot(hero.x+6-cx,hero.y+6-cy),ang=Math.atan2(hero.y+6-cy,hero.x+6-cx);
    if(hero.swinging>=0&&dist<34&&!e.dodgeCd&&Math.random()<.08){const s=Math.random()<.5?1:-1;slideMove(e,Math.cos(ang+s*1.57)*14,Math.sin(ang+s*1.57)*14);e.dodgeCd=50;floatText(cx,cy-12,"dodge!","#ccc");}
    if(e.dodgeCd>0)e.dodgeCd--;
    if((st==="mage"||st==="storm")&&--DUEL.cd<=0&&dist<220){DUEL.cd=70;const col=st==="mage"?[255,120,40]:[160,200,255];for(const k of [-.15,0,.15])projectiles.push({x:cx,y:cy,vx:Math.cos(ang+k)*2.6,vy:Math.sin(ang+k)*2.6,life:90,r:3,dmg:Math.max(1,Math.round(e.dmg*.6)),col});}
    if(e.hp>0&&e.hp<=e.maxHp*.15&&!DUEL.kneelAsked&&Math.random()<.6){DUEL.kneelAsked=true;duelSpareMenu();return;}DUEL.kneelAsked=DUEL.kneelAsked||e.hp<=e.maxHp*.15;}
  return _um(e);};}
{const _dm=drawMob;drawMob=function(e){if(e.duel&&!e.dead){const n=npcs.find(o=>o.id===e.duelNpc);if(n){const sx=n.x,sy=n.y,si=n.inside;n.x=e.x-2;n.y=e.y-4;n.inside=false;n.dir=hero.x<e.x?1:2;try{drawNpc(n);}finally{n.x=sx;n.y=sy;n.inside=si;}
    if(e.flash>0){ctx.fillStyle="rgba(255,255,255,.5)";ctx.fillRect(e.x-2,e.y-6,16,22);}const w=24;ctx.fillStyle="#000a";ctx.fillRect(e.x-6,e.y-14,w,3);ctx.fillStyle=n.duel.legend?"#ffd060":"#e04848";ctx.fillRect(e.x-6,e.y-14,w*Math.max(0,e.hp/e.maxHp),3);
    if(DUEL&&DUEL.kneel){ctx.fillStyle="#fff";ctx.font="6px monospace";ctx.fillText("yields",e.x-4,e.y-16);}return;}}return _dm(e);};}
// duel circle and onlookers
{const _nt=npcTarget;npcTarget=function(n){if(DUEL&&n.duelWatch!=null&&DUEL.circle){const a=n.duelWatch/12*6.283;return{x:DUEL.cx+Math.cos(a)*88,y:DUEL.cy+Math.sin(a)*88};}return _nt(n);};}
{const _d=draw;draw=function(){_d();if(!DUEL||!DUEL.circle||room)return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx.strokeStyle="rgba(255,220,120,.55)";ctx.setLineDash([4,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(DUEL.cx+6,DUEL.cy+6,76,0,7);ctx.stroke();ctx.restore();
  if(frameN%90===0)for(const o of npcs)if(o.duelWatch!=null&&Math.random()<.25)floatText(o.x+8,o.y-6,pick(["Go!","Fight!","Ooh!","Strike!","Hah!"]),"#ffe");};}
// scheduling: ~1-2 days, more often with fame/level; ambush after ignoring
{const _hr=hourlyTick;hourlyTick=function(){_hr.apply(this,arguments);try{if(!P||!hero||room||state!=="play"||DUEL||CHAL)return;const A=world.duelAmbush;
  if(A&&absMin()>=A.at){world.duelAmbush=null;const n=npcs.find(o=>o.id===A.id&&o.alive);if(n){n.x=hero.x+36;n.y=hero.y;startDuel(n,false);}return;}
  const rate=(1/36)*(1+heroLv()/15+(P.fame||0)/150);if(Math.random()<Math.min(.15,rate))issueChallenge();}catch(_){}};}
{const _gc=guildCard;guildCard=function(){const r=duelRec();return _gc()+`\nDuels: ${r.won} won · ${r.lost} lost · ${r.spared} spared · ${r.declined} declined\nFame: ${P.fame||0}`;};}
// walking away from an unanswered challenge counts as ignoring
{const _u=update;update=function(){_u();if(CHAL&&hero&&Math.hypot(CHAL.n.x-hero.x,CHAL.n.y-hero.y)>220&&menuEl.classList.contains("hidden"))ignoreDuel(CHAL.n);};}
