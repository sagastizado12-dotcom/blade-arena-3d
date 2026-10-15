// ===== MARRIED LIFE: WIVES AT HOME, SEVERAL WIVES, PREGNANCY & CHILDREN =====
const wives=()=>{if(!P)return[];P.wives=P.wives||(P.spouse?[P.spouse]:[]);if(P.spouse&&!P.wives.includes(P.spouse))P.wives.unshift(P.spouse);return P.wives.map(id=>npcs.find(n=>n.id===id)).filter(n=>n&&n.alive);};
const isWife=n=>!!n&&wives().includes(n);
function primaryHome(){const h=P.homes||[];return P.house>=0&&h.includes(P.house)?P.house:h.length?h[0]:-1;}
function capitalHome(){const H=(P.homes||[]).map(id=>buildings[id]).filter(b=>b&&!b.cabin);const caps=(typeof KINGDOMS!=="undefined"?KINGDOMS:[]).filter(k=>!k.demon).map(k=>k.cap);
  const inCap=c=>H.find(b=>b.s===c&&!b.cabin);const a=inCap(0);if(a)return a.id;for(const c of caps){const b=inCap(c);if(b)return b.id;}return -1;}
function defaultWifeHome(){const c=capitalHome();return c>=0?c:primaryHome();}
function homeDist(bid,x,y){const b=buildings[bid];return b?Math.hypot(b.x+b.w/2-x,b.y+b.h/2-y):1e9;}
function nearestHomeFor(n){const H=P.homes||[];if(!H.length)return null;const ref=(n.wp&&n.inside&&n.at!=null&&!H.includes(n.at))?{x:n.wp.x/TILE,y:n.wp.y/TILE}:{x:(n.x+8)/TILE,y:(n.y+12)/TILE};
  const cap=capitalHome();let best=null,bd=1e9;for(const id of H){const d=homeDist(id,ref.x,ref.y);if(d<bd-1||(Math.abs(d-bd)<=1&&id===cap)){bd=d;best=id;}}return best;}
function pickWifeHome(n){n.wifeHome=nearestHomeFor(n);n.pickDay=world?world.day:0;return n.wifeHome;}
// default rule: a house the hero owns in HER town; wives spread one per house (stable by id); else nearest home + hint
const hintDay={};
function townHomeFor(n){const H=(P.homes||[]).filter(id=>buildings[id]&&!buildings[id].cabin&&buildings[id].s===n.s).sort((a,b)=>a-b);if(!H.length)return null;
  const same=wives().filter(w=>w.s===n.s&&!w.wifeManual).sort((a,b)=>a.id-b.id);const k=Math.max(0,same.indexOf(n));return H[k%H.length];}
function settleWife(n){const H=P.homes||[];
  if(n.wifeManual&&H.includes(n.wifeHome)){}
  else{n.wifeManual=false;const t=townHomeFor(n);if(t!=null)n.wifeHome=t;else if(H.length){const S=SETS[n.s];let best=null,bd=1e9;for(const id of H){const d=homeDist(id,S.x,S.y);if(d<bd){bd=d;best=id;}}n.wifeHome=best;
      if(world&&hintDay[n.id]!==world.day){hintDay[n.id]=world.day;setTimeout(()=>toast(`Buy a house in ${S.name} so ${n.name} can stay home.`),0);}}else n.wifeHome=null;}
  if(n.wifeHome!=null){n.ownHome=n.ownHome??n.home;n.home=n.wifeHome;}else if(n.ownHome!=null)n.home=n.ownHome;return n.wifeHome;}
function assignWifeHome(n,bid){if(bid==null){n.wifeManual=false;n.wifeHome=null;settleWife(n);saveGame&&saveGame();return;}n.wifeHome=bid;n.wifeManual=true;settleWife(n);saveGame&&saveGame();}
// marry more than one: each needs In Love (aff >= 80) + confession + ring
{const _pr=propose;propose=function(n){if(isWife(n))return"You're already married to her.";if(!(n.age>=18)||n.role==="child")return"That isn't possible.";
  if(P.spouse&&(n.aff||0)<80)return`"I... I'm not there yet."`;const keep=P.spouse;if(keep)P.spouse=0;let r;try{r=_pr(n);}finally{if(keep&&P.spouse===n.id){P.spouse=keep;}else if(keep&&!P.spouse)P.spouse=keep;}
  if(n.spouse===-1){wives();if(!P.wives.includes(n.id))P.wives.push(n.id);settleWife(n);
    if(n.wifeHome==null)r+=" (You don't own a home yet, so she stays at her own house. Buy one at any shop's Real Estate board!)";
    else r+=` She moves into ${homeName(n.wifeHome)}.`;}
  return r;};}
function homeName(bid){const b=buildings[bid];return b?(b.cabin?b.cabinName+" cabin":"your house in "+SETS[b.s].name):"her house";}
// propose button for extra wives
{const _rt=romanceTalk;romanceTalk=function(n,msg){if(!P.spouse||isWife(n)||!n.confessed||!P.dating.includes(n.id))return _rt(n,msg);
  const sm=showMenu;showMenu=function(t,x,b){showMenu=sm;if(Array.isArray(b)&&!b.some(q=>/Propose/.test(q.l))){b=b.slice();b.splice(Math.max(0,b.length-2),0,{l:"💍 Propose",f:()=>showMenu(n.name,propose(n),[{l:"OK"}])});}return sm(t,x,b);};try{return _rt(n,msg);}finally{showMenu=sm;}};}
// daily routine: keep the day job, home around 19:00, inside at night
{const _nt=npcTarget;npcTarget=function(n){if(n.spouse===-1&&isWife(n)){settleWife(n);const h=hour();if(n.wifeHome!=null&&(h>=19||h<7)){const b=buildings[n.wifeHome];if(b)return{...doorOf(b),inside:true,b:n.wifeHome};}}return _nt(n);};}
const HOME_ACTS=["is cooking a stew","is curled up reading","is sitting by the hearth","is mending a shirt","is setting the table"];
{const _eb=enterBuilding;enterBuilding=function(b){const r=_eb.apply(this,arguments);try{const here=wives().filter(w=>w.wifeHome===b.id);if(here.length&&(hour()>=19||hour()<7)){
  toast(here.map((w,i)=>`${w.name} ${HOME_ACTS[(w.id+world.day+i)%HOME_ACTS.length]}. "Welcome home!"`).join(" "));}}catch(_){}return r;};}
// sleeping at home with a wife: well rested + chance of pregnancy (fade to black only)
let lastPregRoll=null;
function pregRoll(b,force){const here=wives().filter(w=>w.wifeHome===b.id&&!w.preg);for(const w of here){
  const kids=npcs.filter(k=>k.alive&&k.parents&&k.parents.includes(w.id)&&k.heroKid&&isKid(k)).length;if(kids>=4)continue;
  if(force||Math.random()<0.25){w.preg={due:world.day+10,since:world.day};addNews(w.s,`Happy news: ${w.name} is expecting a baby!`);toast(`${w.name} shares happy news — a baby is on the way!`);return w;}}return null;}
{const _sl=sleep;sleep=function(b){const withWife=b&&wives().some(w=>w.wifeHome===b.id);_sl(b);if(!withWife)return;setTimeout(()=>{P.rested=world.day+1;toast("💤 Well rested! (less damage taken today)");lastPregRoll=pregRoll(b);},(window.__FAST?60:1650));};}
{const _hh=hurtHero;hurtHero=function(d,...a){if(P&&P.rested>=world.day&&typeof d==="number")d=d*0.85;return _hh(d,...a);};}
function familyBirths(){for(const w of wives())if(w.preg&&world.day>=w.preg.due){w.preg=null;const kid=babyFor(w,null);kid.parents=[w.id,-1];kid.heroKid=true;kid.home=w.home;kid.spouse=0;kid.partner=0;
  P.kids=P.kids||[];P.kids.push(kid.id);addNews(w.s,`${w.name} and the wanderer welcomed a baby, little ${kid.name}!`);toast(`👶 ${w.name} gave birth to little ${kid.name}!`);}}
{const _ht=hourlyTick;hourlyTick=function(){_ht.apply(this,arguments);if(world&&hour()===8)familyBirths();};}
// modest maternity look (a slightly rounder dress)
{const _d=drawNpc;drawNpc=function(n){_d(n);if(!n.preg||n.inside)return;const c=(n.lookObj&&n.lookObj.cloth)||"#c86a8a";ctx.save();ctx.fillStyle="rgba(0,0,0,.18)";ctx.beginPath();ctx.ellipse(n.x+8+(n.dir===1?-1:n.dir===2?1:0),n.y+14,4,3,0,0,7);ctx.fill();ctx.restore();};}
// hearts on the map at homes where wives live
function drawFamilyMap(g,P2,txt,z){const seen=new Set();for(const w of wives()){if(w.wifeHome==null||seen.has(w.wifeHome))continue;seen.add(w.wifeHome);const b=buildings[w.wifeHome];if(!b)continue;const [x,y]=P2(b.x+b.w/2,b.y+b.h/2);txt("❤",x+10,y-8,"#ff5a8a",12);}}
// light jealousy flavour
{const _tk=talk;talk=function(n){if(isWife(n)&&wives().length>1&&Math.random()<0.3){const o=wives().find(w=>w!==n);setTimeout(()=>say(n,pick([`Spending time with ${o.name} again, hm?`,`Don't forget about me, dear.`,`${o.name} got flowers last week... just saying.`]),160),50);}return _tk(n);};}
// Family tab in the Friends menu
function familyMenu(){const W=wives();const kids=npcs.filter(k=>k.alive&&k.heroKid);
  const lines=W.map(w=>`💍 ${w.name} — lives at ${w.wifeHome!=null?homeName(w.wifeHome):"her own house (buy a home!)"}${w.preg?` · expecting (due day ${w.preg.due})`:""}`).concat(kids.map(k=>`👶 ${k.name}, age ${k.age} — child of ${(npcs.find(m=>m.id===k.parents[0])||{}).name||"?"}`));
  const btns=W.filter(()=>(P.homes||[]).length>=1).map(w=>({l:`🏠 Move ${w.name} to…`,f:()=>showMenu("Choose a home",`Where should ${w.name} live?`,[{l:"🏘 Her town"+(!w.wifeManual?" ✓":""),f:()=>{assignWifeHome(w,null);familyMenu();}}].concat(P.homes.map(h=>({l:homeName(h)+(w.wifeManual&&w.wifeHome===h?" ✓":""),f:()=>{assignWifeHome(w,h);familyMenu();}}))).concat([{l:"Back",f:familyMenu}]))}));
  showMenu("👪 Family",lines.length?lines.join("\n"):"No family yet. Win a heart, confess, and propose with a ring.",btns.concat([{l:"🤝 Friends",f:friendsMenu},{l:"Close"}]));}
{const _fm=friendsMenu;friendsMenu=function(){const sm=showMenu;showMenu=function(t,x,b){showMenu=sm;if(Array.isArray(b)){b=b.slice();b.unshift({l:"👪 Family",f:familyMenu});}return sm(t,x,b);};try{return _fm();}finally{showMenu=sm;}};}
// long commutes / hard guarantee: by 21:00 every wife is inside her assigned home, wherever it is
function wifeNight(){const h=hour();return h>=21||h<6;}
function enforceWives(){if(!world||!P)return;for(const w of wives()){settleWife(w);if(w.wifeHome==null||!wifeNight())continue;const b=buildings[w.wifeHome];if(!b)continue;
  if(w.inside&&w.at===w.wifeHome)continue;const d=doorOf(b);w.x=d.x;w.y=d.y;w.inside=true;w.at=w.wifeHome;w.followT=0;w.engage=null;w.fleeing=false;w.cheer=0;}}
let wcT=0;{const _u=update;update=function(){_u();if(!world||(++wcT)%20)return;enforceWives();};}
{const _lg=loadGame;loadGame=function(){const r=_lg.apply(this,arguments);try{enforceWives();}catch(_){}return r;};}
{const _bh=buyHome;buyHome=function(b){const r=_bh.apply(this,arguments);try{enforceWives();}catch(_){}return r;};}
{const _tr=travel;travel=function(w){const r=_tr.apply(this,arguments);setTimeout(()=>{try{enforceWives();}catch(_){}},window.__FAST?80:1700);return r;};}
{const _th=travelHome;travelHome=function(b){const r=_th.apply(this,arguments);setTimeout(()=>{try{enforceWives();}catch(_){}},window.__FAST?80:1700);return r;};}
{const _am=advanceMinutes;advanceMinutes=function(m){const r=_am.apply(this,arguments);try{enforceWives();}catch(_){}return r;};}
function nightHome(n){if(!world||n.wifeHome==null||!isWife(n))return false;const h=hour();return h>=19||h<7;}
// quest turn-in works whichever conversation path the giver uses (romance talk included)
{const _tk2=talk;talk=function(n){try{if(n&&(P.jobs||[]).some(j=>j.giver===n.id))tryCompleteJobs(n.s,n);}catch(_){}return _tk2(n);};}
// wives drawn at home: stove, table (sitting), reading, then bed late at night
{const _rn=roomNpcs;roomNpcs=function(){const L=_rn.apply(this,arguments);if(!room||!Array.isArray(L))return L;const h=hour();let k=0;
  for(const e of L){if(!e.n||!isWife(e.n)||e.n.wifeHome!==room.b.id||e.pose==="sleep")continue;const sp=room.sp||{};
    if(k===0&&sp.stove){e.x=sp.stove[0]*16;e.y=sp.stove[1]*16;e.pose="cook";}else if(sp.spots&&sp.spots.length){const p=sp.spots[(k+1)%sp.spots.length];e.x=p[0]*16;e.y=p[1]*16;e.pose=k%2?"sit":"idle";}
    e.wife=true;e.act=["cooking","sitting at the table","reading by the fire"][k%3];k++;}
  // a wife who is home but missing from the list (e.g. at[] mismatch) is still drawn
  for(const w of wives())if(w.wifeHome===room.b.id&&w.inside&&!L.some(e=>e.n===w)){const sp=room.sp||{};const p=(h>=22||h<6)&&sp.beds&&sp.beds[L.filter(e=>e.pose==="sleep").length]||(sp.spots&&sp.spots[L.length%Math.max(1,sp.spots.length)])||[4,4];
    L.push({n:w,x:p[0]*16,y:p[1]*16,pose:(h>=22||h<6)&&sp.beds&&sp.beds.length?"sleep":"idle",wife:true});}
  return L;};}
