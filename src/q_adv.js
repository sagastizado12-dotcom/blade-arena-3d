// ===== NPC ADVENTURERS & PARTY =====
const ADV_CLASSES=["warrior","mage","archer","rogue","cleric","berserker","knight"];
const RIVALS=["Iron Wolves","Silver Arrows","Crimson Oath","Dawn Blades"];
const CLS_ICON={warrior:"⚔",mage:"✦",archer:"🏹",rogue:"🗡",cleric:"✚",berserker:"🪓",knight:"🛡"};
function makeAdv(cls,sid){const n=makeNpc(sid==null?pick([0,1,2]):sid,"adventurer",20+Math.floor(Math.random()*25));n.adv={cls:cls||pick(ADV_CLASSES),race:"human",lvl:1+Math.floor(Math.random()*4),rank:Math.floor(Math.random()*3),xp:0,hp:10,state:"town",job:null,eta:0,from:null,to:null,gold:20,team:null,kills:0};
  n.adv.hp=n.adv.max=8+n.adv.lvl*2;return n;}
function initAdvs(){const list=[];for(let i=0;i<14;i++)list.push(makeAdv(ADV_CLASSES[i%ADV_CLASSES.length]));
  for(let t=0;t<3;t++){const team=RIVALS[t];list.slice(t*3,t*3+3).forEach(n=>n.adv.team=team);}}
const advs=()=>npcs.filter(n=>n.alive&&n.adv);
function advPower(n){return n.adv.lvl*2+n.adv.rank*3+(n.adv.cls==="berserker"||n.adv.cls==="knight"?2:0);}
function advDest(j){if(j.t==="dragon"){const L=pick(LAIRS);return{x:L.x,y:L.y};}if(j.t==="escort")return{x:SETS[j.to].x,y:SETS[j.to].y};if(j.t==="dungeon")return{x:CAVE_POS.x,y:CAVE_POS.y};
  if(j.t==="raid")return{x:SETS[j.s].x,y:SETS[j.s].y};const c=pick(CAMPS);return{x:c.x+Math.floor((Math.random()-.5)*20),y:c.y+Math.floor((Math.random()-.5)*20)};}
function advHourly(){const jobs=genGuildJobs();for(const n of advs()){const a=n.adv;if(P.party&&P.party.includes(n.id))continue;const h=hour();
  if(a.state==="town"&&h>=8&&h<16&&Math.random()<0.25){const ok=jobs.filter(j=>j.min<=a.rank&&!j.claimed&&!j.reserved&&!(P.guild&&P.guild.active.some(x=>x.id===j.id)));if(!ok.length)continue;const j=pick(ok);j.claimed=n.name+(a.team?` (${a.team})`:"");
    a.job={t:j.t,txt:j.txt,gold:j.gold,pts:j.pts,diff:j.min};a.from={x:SETS[n.s].x,y:SETS[n.s].y};a.to=advDest(j);a.state="travel";a.t0=absMin();a.eta=absMin()+120+Math.floor(Math.random()*240);
    if(a.team)for(const m of advs())if(m.adv.team===a.team&&m.adv.state==="town"&&m!==n&&!(P.party&&P.party.includes(m.id))){Object.assign(m.adv,{job:a.job,from:a.from,to:a.to,state:"travel",t0:a.t0,eta:a.eta});}}
  else if(a.state==="travel"&&absMin()>=a.eta){const pw=advPower(n)+(a.team?4:0),diff=a.job.diff*4+3+(a.job.t==="dragon"?8:0);const roll=pw+Math.random()*10-diff;
    if(roll>0){a.gold+=a.job.gold;a.xp+=a.job.pts;a.kills+=3;if(a.xp>=a.lvl*20){a.xp=0;a.lvl++;a.max+=2;addNews(n.s,`${n.name} the ${a.cls} reached level ${a.lvl}!`);}
      if(a.xp>0&&Math.random()<0.25&&a.rank<6){a.rank++;}
      addNews(n.s,`${n.name}${a.team?" of the "+a.team:""} completed a job: ${a.job.txt}.`);if(a.job.t==="dragon"){world.dragonsSlainByNpc=(world.dragonsSlainByNpc||0)+1;addNews(-1,`The ${a.team||n.name} brought down a dragon! The guild is abuzz.`);}}
    else if(roll<-8&&Math.random()<0.15){n.alive=false;addNews(n.s,`Tragedy: ${n.name} the ${a.cls} fell on a job (${a.job.txt}). The tavern raises a mug in their memory.`);}
    else addNews(n.s,`${n.name} returned injured from: ${a.job.txt}.`);
    a.state="town";a.job=null;}}}
function advDaily(){for(const n of advs()){if(n.age>58&&Math.random()<0.05&&!(P.party||[]).includes(n.id)){n.alive=false;addNews(n.s,`${n.name} the ${n.adv.cls} retired from adventuring.`);}}
  if(advs().length<14&&Math.random()<0.5){const n=makeAdv();addNews(n.s,`A new adventurer, ${n.name} the ${n.adv.cls}, registered at the guild.`);}}
function advWorldPos(n){const a=n.adv;if(a.state!=="travel")return null;const p=clamp((absMin()-a.t0)/Math.max(1,a.eta-a.t0),0,1);const k=p<0.5?p*2:(1-p)*2;return{x:(a.from.x+(a.to.x-a.from.x)*k)*TILE,y:(a.from.y+(a.to.y-a.from.y)*k)*TILE};}
// ---- party ----
function inviteParty(n){if(!P.party)P.party=[];if(P.party.includes(n.id))return"Already in your party.";if(P.party.length>=3)return"Your party is full (3).";
  if(n.friend<25)return`"I don't know you well enough yet."`;if(n.adv.team&&n.friend<50)return`"I ride with the ${n.adv.team}. Maybe when we're closer friends."`;
  P.party.push(n.id);n.adv.state="party";n.adv.job=null;n.x=hero.x-10;n.y=hero.y;n.inside=false;updatePartyHud();return`"Let's go! Lead the way."`;}
function dismissParty(n){P.party=(P.party||[]).filter(i=>i!==n.id);n.adv.state="town";updatePartyHud();}
function partyMembers(){return(P.party||[]).map(id=>npcs.find(n=>n.id===id)).filter(n=>n&&n.alive);}
function updateParty(){const ms=partyMembers();ms.forEach((n,i)=>{const a=n.adv;n.inside=false;if(a.cd>0)a.cd--;
  const fx0=hero.x-14+i*14,fy0=hero.y+14;let tgt=null,bd=140;for(const m of mobs){if(m.dead||!m.def||m.def.beh==="pea"||m.def.beh==="flee")continue;const d=Math.hypot(m.x-n.x,m.y-n.y);if(d<bd&&Math.hypot(m.x-hero.x,m.y-hero.y)<220){bd=d;tgt=m;}}
  if(Math.hypot(n.x-hero.x,n.y-hero.y)>300){n.x=fx0;n.y=fy0;}
  let gx=fx0,gy=fy0;const ranged=a.cls==="mage"||a.cls==="archer"||a.cls==="cleric";
  if(tgt){const ang=Math.atan2(tgt.y-n.y,tgt.x-n.x);if(ranged){gx=tgt.x-Math.cos(ang)*70;gy=tgt.y-Math.sin(ang)*70;}else{gx=tgt.x-Math.cos(ang)*12;gy=tgt.y-Math.sin(ang)*8;}
    if((a.cd||0)<=0){if(ranged&&bd<160){a.cd=a.cls==="archer"?45:70;fx.push({k:a.cls==="archer"?"air":"fireball",x:n.x+8,y:n.y+6,vx:Math.cos(ang)*4,vy:Math.sin(ang)*4,life:50,dmg:1+Math.floor(a.lvl/3),r:3,pierce:a.cls==="archer",hit:new Set(),ang,ally:1});n.gest=12;}
      else if(!ranged&&bd<22){a.cd=36;n.gest=10;if(tgt.sp==="dragon"){tgt.iframes=0;tgt._spell=1;hitDragon(tgt,ang);}else{tgt.iframes=0;hurtEnemy(tgt,1+Math.floor(a.lvl/4),ang,true);}a.kills+=tgt.dead?1:0;}}}
  if(a.cls==="cleric"&&hero.hp<hero.maxHp/2&&(a.hcd||0)<=0){a.hcd=360;hero.hp=Math.min(hero.maxHp,hero.hp+2);updateHearts();burst(hero.x+6,hero.y+6,[255,240,140],20,1.2,2);toast(n.name+" heals you!");}if(a.hcd>0)a.hcd--;
  const dx=gx-n.x,dy=gy-n.y,l=Math.hypot(dx,dy);if(l>3){const sp=Math.min(l*0.1,1.6);const ent={x:n.x+2,y:n.y+4,w:10,h:8};moveEntity(ent,dx/l*sp,dy/l*sp);if(Math.abs(ent.x-2-n.x)+Math.abs(ent.y-4-n.y)<0.05&&l>40){n.x+=dx/l*sp;n.y+=dy/l*sp;}else{n.x=ent.x-2;n.y=ent.y-4;}}
  n.dir=dx<0?1:2;if(n.gest>0)n.gest--;});}
function partyShare(g){const ms=partyMembers();if(!ms.length||g<=0)return;const cut=Math.max(1,Math.floor(g*0.1));for(const n of ms){n.adv.gold+=cut;n.adv.xp+=1;n.friend=Math.min(100,n.friend+0.3);}}
function updatePartyHud(){const el=document.getElementById("party");if(!el)return;const ms=partyMembers();el.innerHTML=ms.map(n=>`<div class="pm"><b>${CLS_ICON[n.adv.cls]||"•"} ${n.name}</b> <small>Lv${n.adv.lvl} ${GRANKS[n.adv.rank]}</small><i style="width:${Math.round(100)}%"></i></div>`).join("");}
