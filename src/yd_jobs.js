// ===== JOB SUPPLY: guild board always stocked, reserved player jobs, town odd jobs =====
const JOB_MIN_OPEN=6,JOB_ABOVE=2;
const nearSets=(sid,n)=>{const s=SETS[sid]||SETS[0];return SETS.filter(o=>o.id!==s.id&&!o.island).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y)).slice(0,n);};
let _jobSeq=0;
function makeJob(r,sid,opt){opt=opt||{};r=clamp(r,0,6);const id=world.day*1000+500+(++_jobSeq%499);const near=nearSets(sid||0,3);const T=[];
  T.push(()=>({t:"hunt",n:3+r*2,have:0,gold:25+r*25,pts:6+r*6,txt:`Hunt ${3+r*2} monsters near ${SETS[near[0].id].name}`}));
  T.push(()=>({t:"wood",n:4+r,gold:20+r*12,pts:5+r*4,txt:`Gather ${4+r} Wood for repairs`}));
  T.push(()=>{const it=pick(["herb","berry","fish"]);return{t:"part",item:it,n:3+r,gold:22+r*14,pts:5+r*5,txt:`Gather ${3+r} ${ITEMS[it].n} for the healers`};});
  T.push(()=>{const it=pick(["fang","hide","claw","eye","horn","core"]);return{t:"part",item:it,n:2,gold:45+r*20,pts:12+r*5,txt:`Deliver 2 ${ITEMS[it].n} to the alchemists`};});
  T.push(()=>{const to=pick(near);return{t:"escort",to:to.id,gold:50+r*20,pts:14+r*5,txt:`Escort a traveller to ${to.name}`};});
  T.push(()=>{const pool=Object.keys(SPECIES).filter(k=>SPECIES[k].mon&&SPECIES[k].biome&&!SPECIES[k].rare&&SPECIES[k].beh!=="pea"&&((SPECIES[k].tier||1)-1)<=r);if(!pool.length)return null;const sp=pick(pool);return{t:"huntsp",sp,n:3,have:0,gold:30+r*35,pts:8+r*9,txt:`Bounty: slay 3 ${SPECIES[sp].name}s`};});
  if(r>=2)T.push(()=>({t:"camp",gold:150,pts:40,txt:"Clear an orc war camp (slay a warchief)"}));
  if(r>=3&&!P.dungeon)T.push(()=>({t:"dungeon",gold:200,pts:50,txt:"Clear the Stormcrag dungeon"}));
  if(r>=4)T.push(()=>({t:"dragon",gold:400,pts:90,txt:"Dragon subjugation: slay any dragon"}));
  let o=null;for(let k=0;k<6&&!o;k++)o=(opt.type?T.find(f=>{const x=f();return x&&x.t===opt.type;}):pick(T))();
  return{id,min:r,...o,...(opt.extra||{})};}
const jobTaken=j=>P.guild&&P.guild.active.some(a=>a.id===j.id);
const openFor=(J,r)=>J.filter(j=>!j.claimed&&!jobTaken(j)&&j.min<=r);
function stockBoard(J){const g=guild(),r=g.rank||0;let add=JOB_MIN_OPEN+1-openFor(J,r).length;let guard=0;
  while(openFor(J,r).length<JOB_MIN_OPEN+1&&guard++<20)J.push(makeJob(Math.max(0,r-(guard%2)),0,{extra:{reserved:true}}));
  // always some reserved ones even when the board is full
  if(J.filter(j=>j.reserved&&!j.claimed&&!jobTaken(j)).length<3)for(let i=0;i<3;i++)J.push(makeJob(Math.max(0,r-i%2),0,{extra:{reserved:true}}));
  if(r<6)while(J.filter(j=>j.min===r+1&&!j.claimed&&!jobTaken(j)).length<JOB_ABOVE)J.push(makeJob(r+1,0));
  // type mix: ensure each core type is on the board
  for(const t of ["hunt","wood","part","escort","huntsp"])if(!openFor(J,6).some(j=>j.t===t))J.push(makeJob(Math.min(r,t==="huntsp"?r:r),0,{type:t}));
  return J;}
const _genGJ=genGuildJobs;genGuildJobs=function(force){const J=_genGJ(force);return stockBoard(J);};
const _guildMenuJ=guildMenu;guildMenu=function(sid){genGuildJobs();_guildMenuJ(sid);
  // highlight jobs at or below the player's rank
  const g=guild();for(const b of document.querySelectorAll("#menu button.job")){const m=b.textContent.match(/^\[([FEDCBAS])\]/);if(m){const rk=GRANKS.indexOf(m[1]);if(rk<=g.rank){b.classList.add("ok");if(!b.textContent.startsWith("★"))b.textContent="★ "+b.textContent;}}}};
// town odd jobs: per settlement, daily, open to everyone (no rank needed)
function oddJobs(sid){world.odd=world.odd||{};const o=world.odd[sid];if(o&&o.day===world.day&&o.jobs.filter(j=>!jobTaken(j)).length>=3)return o.jobs;
  const keep=o&&o.day===world.day?o.jobs.filter(j=>!jobTaken(j)):[];const who=["the baker","old Tamsin","the blacksmith","a farmer","the innkeeper","a fisherwife","the miller"];
  while(keep.length<4){const j=makeJob(0,sid,{type:pick(["wood","part","escort","hunt"])});j.min=0;j.odd=true;j.gold=Math.round(j.gold*0.8);j.pts=Math.round(j.pts*0.5);j.txt=j.txt+" for "+pick(who);keep.push(j);}
  world.odd[sid]={day:world.day,jobs:keep};return keep;}
function oddJobsMenu(sid){const g=guild();const paid=guildTurnIn();const J=oddJobs(sid).filter(j=>!jobTaken(j));
  showMenu("Odd jobs — "+SETS[sid].name,(paid?`Thanks! You earned ${paid}g.\n\n`:"")+"Townsfolk need a hand. Anyone may help — no guild rank needed.",
    J.map(j=>({l:`★ ${j.txt} — ${j.gold}g`,cls:"job ok",f:()=>showMenu("Task: "+j.txt,`Reward: ${j.gold}g\nType: ${j.t}`,[{l:"Accept job",dis:g.active.length>=5,f:()=>{g.active.push({...j});toast("Task accepted: "+j.txt);SFX.ui();}},{l:"Back",f:()=>oddJobsMenu(sid)}])})).concat([{l:"Leave"}]));}
const nearestTown=()=>{let b=SETS[0],bd=1e9;for(const s of SETS){const d=Math.hypot(s.x*TILE-hero.x,s.y*TILE-hero.y);if(d<bd){bd=d;b=s;}}return b.id;};
