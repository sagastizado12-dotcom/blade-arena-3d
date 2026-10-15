// ===== NPC FAMILIES, SPELL CASUALTIES (adults only), RESPAWN =====
const isKid=n=>n.role==="child"||n.age<18;
const NPC_HP=6;
function babyFor(a,b){const kid=makeNpc(a.s,"child",0);kid.home=a.home;const d=doorOf(buildings[a.home]);kid.x=d.x;kid.y=d.y;kid.parents=[a.id,b?b.id:0];kid.born=world.day;kid.spouse=0;kid.partner=0;
  if(b&&b.look!=null)kid.look=(a.look+b.look)>>1;addNews(a.s,`${a.name}${b?" and "+b.name:""} welcomed a baby, little ${kid.name}!`);return kid;}
function familyDay(){const seen=new Set();
  for(const a of npcs){if(!a.alive||isKid(a))continue;const pid=a.spouse>0?a.spouse:a.partner>0?a.partner:0;if(!pid||seen.has(a.id))continue;const b=npcs.find(x=>x.id===pid);if(!b||!b.alive||isKid(b))continue;seen.add(a.id);seen.add(b.id);
    const kids=npcs.filter(k=>k.alive&&k.parents&&k.parents.includes(a.id)&&isKid(k)).length;if(kids<3&&a.age<48&&b.age<48&&Math.random()<(a.spouse?0.04:0.015))babyFor(a,b);}
  for(const k of npcs){if(!k.alive||k.role!=="child")continue;if(k.born!=null){k.age=Math.max(k.age,Math.floor((world.day-k.born)/2));}else if(world.day%3===0)k.age++;
    if(k.age>=18){k.role=pick(["farmer","fisher","smith","farmer"]);addNews(k.s,`${k.name} of ${SETS[k.s].name} has grown up and become a ${k.role}.`);}}}
{const _dt=dailyTick;dailyTick=function(){_dt.apply(this,arguments);try{familyDay();}catch(_){}};}
// kids play near home
const _updKids=update;update=function(){_updKids();if(!hero||state!=="play"||room||!world)return;const h=hour();if(h<8||h>=19)return;
  for(const k of npcs){if(!k.alive||k.inside||k.role!=="child"||k.engage)continue;if(Math.abs(k.x-hero.x)>500||Math.abs(k.y-hero.y)>400)continue;const d=doorOf(buildings[k.home]);if(!d)continue;
    const dd=Math.hypot(k.x-d.x,k.y-d.y);if(dd>90){const v=0.6;k.x+=(d.x-k.x)/dd*v;k.y+=(d.y-k.y)/dd*v;}}};
// ---- spell damage to adults ----
const corpses=[];let lastMonHitF=-1e9;
{const _he=hurtEnemy;hurtEnemy=function(e){if(!window.__guardSwing&&e&&!e.dead)lastMonHitF=frameN;return _he.apply(this,arguments);};}
function inMonsterFight(x,y){if(frameN-lastMonHitF<300)return true;const R=6*TILE;for(const e of mobs){if(e.dead||!e.def||e.def.beh==="pea")continue;if(!(e.def.beh==="agg"||e.provoked||e.def.beh==="neu"&&e.provoked))continue;const ex=e.x+e.w/2,ey=e.y+e.h/2;if(Math.hypot(ex-hero.x-6,ey-hero.y-6)<R||Math.hypot(ex-x,ey-y)<R)return true;}return false;}
function npcHurt(n,dmg,ang){if(!n||!n.alive||n.inside||isKid(n)||n.adv)return false; // children are immune, always
  if(n.hp==null)n.hp=NPC_HP;n.hp-=dmg;n.hurtT=12;const c=[n.x+8,n.y+10];if(typeof bloodOn!=="undefined"&&bloodOn){spray(c[0],c[1],4,ang||0,0.8);}else burst(c[0],c[1],[255,255,255],5,1,1.5);
  try{SFX.hurt();}catch(_){}floatText(c[0],c[1]-10,"-"+dmg,"#ff8a7a");const excused=inMonsterFight(c[0],c[1]);n._excused=excused;
  say(n,excused?pick(["Watch it!","Whoa! Careful!","Eek! Watch it!"]):pick(["Ow! Watch it!","Hey! Stop that!","Ahh!"]),90);
  if(!excused)P.infamy=(P.infamy||0)+1;
  if(n.hp<=0)npcSlain(n,c,ang,excused);else if(!excused){for(const g of npcs)if(g.alive&&g.role==="guard"&&g.s===n.s&&Math.hypot(g.x-n.x,g.y-n.y)<160)say(g,"Hey! Cut that out!",90);n.friend=Math.max(0,n.friend-10);}return true;}
function npcSlain(n,c,ang,excused){n.alive=false;n.slain=true;n.slainAt=absMin();n.hp=0;n.engage=null;n.followT=0;if(typeof bloodOn!=="undefined"&&bloodOn){addSplat(c[0],c[1]+4);}
  corpses.push({n,x:n.x,y:n.y,life:900});
  if(excused){for(const m of npcs)if(m.alive&&!m.inside&&m.s===n.s&&Math.hypot(m.x-n.x,m.y-n.y)<140){say(m,pick(["Watch it!","Oh no, "+n.name+"!","Careful with that magic!"]),120);if(m.role!=="guard")m.fleeing=120;}
    addNews(n.s,`${n.name} of ${SETS[n.s].name} was caught in the crossfire of a monster fight.`);toast(`${n.name} was caught in the crossfire.`);return;}
  const ws=world.sets[n.s];ws.angryUntil=absMin()+360;P.infamy=(P.infamy||0)+10;
  for(const m of npcs){if(m.s!==n.s)continue;m.friend=Math.max(0,m.friend-(m.id===n.spouse||(n.parents&&n.parents.includes(m.id))?40:15));
    if(m.alive&&!m.inside&&Math.hypot(m.x-n.x,m.y-n.y)<140){if(m.role==="guard")say(m,prof()?"You bastard! Seize them!":"Murderer! Seize them!",130);else{say(m,pick(["No! Somebody help!","Oh gods, no!","They killed "+n.name+"!"]),130);m.fleeing=180;}}}
  addNews(n.s,`${n.name} of ${SETS[n.s].name} was struck down by the wanderer's magic. The town is in shock.`);toast(`${n.name} has fallen. The guards of ${SETS[n.s].name} are furious!`);
  if(typeof P.rep==="number")P.rep-=10;}
function npcRespawnCheck(){for(const n of npcs){if(!n.slain||n.alive)continue;if(absMin()>=n.slainAt+1440){n.alive=true;n.slain=false;n.hp=NPC_HP;n.inside=false;const d=doorOf(buildings[n.home]);n.x=d.x;n.y=d.y;
  addNews(n.s,`${n.name} has recovered and is back home in ${SETS[n.s].name}.`);}}}
{const _ht=hourlyTick;hourlyTick=function(){_ht.apply(this,arguments);try{npcRespawnCheck();}catch(_){}};}
function npcAt(x,y,r){for(const n of npcs){if(!n.alive||n.inside||n.adv)continue;if(Math.hypot(n.x+8-x,n.y+10-y)<r)return n;}return null;}
const _updMagN=updateMagic;updateMagic=function(){_updMagN();if(room||!world)return;
  for(const f of fx){if((f.k!=="fireball"&&f.k!=="air")||f.life<=0)continue;f.npcHit=f.npcHit||new Set();for(const n of npcs){if(!n.alive||n.inside||n.adv||f.npcHit.has(n.id))continue;
      if(Math.hypot(n.x+8-f.x,n.y+10-f.y)<(f.r||6)+6){f.npcHit.add(n.id);if(isKid(n))continue; // spells pass straight through children
        npcHurt(n,f.k==="fireball"?(f.dmg||2)+1:(f.dmg||1),Math.atan2(f.vy||0,f.vx||1));if(f.k==="fireball")f.life=0;}}}
  for(const b of tbolts){if(b.done)continue;const n=npcAt(b.x,b.y,10);if(n&&!isKid(n)){npcHurt(n,b.dmg+1,b.ang);b.done=1;tarcs.push({pts:zig(b.x0,b.y0,n.x+8,n.y+10,b.seed,5),life:14,w:1.5,t:0});}}
  for(let i=corpses.length-1;i>=0;i--)if(--corpses[i].life<=0||corpses[i].n.alive)corpses.splice(i,1);};
const _drawCorpse=draw;draw=function(){_drawCorpse();if(!hero||!world||room||state!=="play"||!corpses.length)return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);
  for(const c of corpses){const n=c.n;const ox=n.x,oy=n.y;n.x=c.x;n.y=c.y;ctx.save();ctx.globalAlpha=Math.min(1,c.life/60);ctx.translate(c.x+8,c.y+14);ctx.rotate(Math.PI/2);ctx.translate(-c.x-8,-c.y-14);const dn=n.down;n.down=0;try{drawNpc(n);}catch(_){}n.down=dn;ctx.restore();n.x=ox;n.y=oy;}ctx.restore();};
