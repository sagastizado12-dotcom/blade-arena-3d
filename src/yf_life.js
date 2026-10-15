// ===== LIVING WORLD: visible adventurer parties, rivals, critters, chatter, mini-events =====
// ---- party routes: town → gate → road leg → site, fight, return with loot ----
function advRoute(a){if(a.route)return a.route;const f=a.from,t=a.to;const gy=f.y+(t.y>f.y?7:-7);a.route=[[f.x,f.y],[f.x,gy],[t.x,gy],[t.x,t.y]].map(p=>[p[0]*TILE,p[1]*TILE]);return a.route;}
function routeAt(R,k){let L=0;const seg=[];for(let i=1;i<R.length;i++){const d=Math.hypot(R[i][0]-R[i-1][0],R[i][1]-R[i-1][1]);seg.push(d);L+=d;}let s=k*L;
  for(let i=0;i<seg.length;i++){if(s<=seg[i]||i===seg.length-1){const u=seg[i]?clamp(s/seg[i],0,1):0;return{x:R[i][0]+(R[i+1][0]-R[i][0])*u,y:R[i][1]+(R[i+1][1]-R[i][1])*u};}s-=seg[i];}return{x:R[0][0],y:R[0][1]};}
function advPhase(a){const p=clamp((absMin()-a.t0)/Math.max(1,a.eta-a.t0),0,1);return p<0.42?"out":p<0.58?"fight":"back";}
advWorldPos=function(n){const a=n.adv;if(a.state!=="travel")return null;const p=clamp((absMin()-a.t0)/Math.max(1,a.eta-a.t0),0,1);const R=advRoute(a);
  const ph=advPhase(a);a.phase=ph;a.carry=ph==="back";const k=ph==="out"?p/0.42:ph==="fight"?1:1-(p-0.58)/0.42;const q=routeAt(R,k);
  const mates=advs().filter(m=>m.adv.team&&m.adv.team===a.team&&m.adv.state==="travel");const idx=Math.max(0,mates.indexOf(n));
  let ox=(idx%3-1)*14,oy=-Math.floor(idx/3)*12;if(ph==="fight"){const t=frameN*0.05+idx*2;ox=Math.cos(t)*22;oy=Math.sin(t)*14;}
  return{x:q.x+ox,y:q.y+oy};};
const _advHourlyL=advHourly;advHourly=function(){const before=new Set(advs().filter(n=>n.adv.state==="travel").map(n=>n.id));_advHourlyL();
  for(const n of advs()){const a=n.adv;if(a.state==="travel"&&!before.has(n.id)){a.route=null;a.fightSpawned=false;a.helped=false;}if(a.state!=="travel"){a.route=null;a.carry=false;}}};
// fights near the player become real, so the player can help
function partyFightTick(){for(const n of advs()){const a=n.adv;if(a.state!=="travel"||a.phase!=="fight"||a.fightSpawned)continue;if(Math.hypot(n.x-hero.x,n.y-hero.y)>420)continue;
  a.fightSpawned=true;const pool=Object.keys(SPECIES).filter(k=>SPECIES[k].mon&&SPECIES[k].beh==="agg"&&!SPECIES[k].rare&&!SPECIES[k].tier);if(!pool.length)continue;
  const sp=pick(pool);for(let i=0;i<2;i++){const m=spawnMob(sp,n.x+(Math.random()-.5)*50,n.y+(Math.random()-.5)*40);if(m)m.partyFoe=a.team||n.name;}
  say(n,pick(["Monsters! Form up!","Here they come!","Watch my back!"]));}}
const _hurtEnemyL=hurtEnemy;hurtEnemy=function(e,d,ang,c){const was=!e.dead;const r=_hurtEnemyL(e,d,ang,c);
  if(was&&e.dead&&e.partyFoe&&hero&&Math.hypot(e.x-hero.x,e.y-hero.y)<200){const n=advs().find(m=>(m.adv.team||m.name)===e.partyFoe&&m.adv.state==="travel");
    if(n&&!n.adv.helped){n.adv.helped=true;say(n,"Thanks for the help, friend!");P.helped=(P.helped||0)+1;P.gold+=10;floatText(hero.x,hero.y-10,"+10g","#ffd84a");
      addNews(n.s,`${n.adv.team?"The "+n.adv.team:n.name} say the wanderer saved them in a fight.`);toast("The party thanks you — word will spread.");}}return r;};
// rivals: when the player takes a job, a party may race for the same kind of job
function takeGuildJobX(sid,j){const g=guild();g.active.push({...j});toast("Job accepted: "+j.txt);SFX.ui();
  const rivals=advs().filter(n=>n.adv.state==="town"&&n.adv.rank>=j.min&&!(P.party||[]).includes(n.id));
  if(rivals.length&&Math.random()<(window.__FORCE_RIVAL?1:0.45)){const n=pick(rivals),a=n.adv;a.job={t:j.t,txt:j.txt,gold:j.gold,pts:j.pts,diff:j.min,rival:true};a.from={x:SETS[n.s].x,y:SETS[n.s].y};a.to=advDest(j);a.state="travel";a.t0=absMin();a.eta=absMin()+180+Math.floor(Math.random()*200);a.route=null;a.fightSpawned=false;
    g.active[g.active.length-1].rival=n.name;g.active[g.active.length-1].rivalEta=a.eta;addNews(sid,`${n.name}${a.team?" of the "+a.team:""} is racing the wanderer for the job: ${j.txt}.`);
    setTimeout(()=>toast(`Rival! ${n.name} is racing you for this job.`),400);}
  closeMenu&&closeMenu();}
// ---- speech bubbles ----
const bubbles=[];function say(n,t,life){bubbles.push({n,t,life:life||150});if(bubbles.length>10)bubbles.shift();}
const CHAT=[["Fine weather today.","Good for the crops!"],["Heard about the dragon?","Don't remind me..."],["Fresh bread!","I'll take two."],["The guild is hiring.","Not for me, I like my head."],["Where's my cat?","Try the well."],["Lovely market today.","Prices are steep though."],["Did you see that knight?","The wanderer? Yes!"],["Storm's coming.","My roof leaks again..."],["Another round!","On you this time!"],["Bandits on the road.","Travel with a party."]];
function chatterTick(){if(frameN%120!==0)return;const vis=npcs.filter(n=>n.alive&&!n.inside&&Math.abs(n.x-hero.x)<260&&Math.abs(n.y-hero.y)<180);
  for(let i=0;i<vis.length;i++)for(let j=i+1;j<vis.length;j++){const a=vis[i],b=vis[j];if(Math.hypot(a.x-b.x,a.y-b.y)<44&&Math.random()<0.5){const c=pick(CHAT);say(a,c[0]);setTimeout(()=>say(b,c[1]),1300);return;}}}
// ---- critters ----
const critters=[];
function critterTick(){const day=world.min>=360&&world.min<1140;if(critters.length<26&&frameN%20===0){const x=hero.x+(Math.random()-.5)*640,y=hero.y+(Math.random()-.5)*440;const t=tAt(Math.floor(x/TILE),Math.floor(y/TILE));
    let k=null;if(t===DEEP||t===SHAL)k=Math.random()<0.5?"fish":null;else if(t===GRASS||t===FLOWER)k=pick(day?["butterfly","butterfly","rabbit","bird","deer"]:["rabbit","bird"]);else if(t===FOREST||t===TREE)k=pick(["bird","deer"]);
    if(k)critters.push({k,x,y,vx:0,vy:0,z:k==="bird"?0:0,t:0,life:900+Math.random()*900,c:k==="butterfly"?pick(["#ffe14a","#ff8ad8","#8ad8ff","#fff"]):null,flee:0});}
  for(let i=critters.length-1;i>=0;i--){const c=critters[i];c.t++;c.life--;const d=Math.hypot(c.x-hero.x,c.y-hero.y);
    if(c.k==="fish"){if(c.t%160===0){c.jump=40;}if(c.jump>0)c.jump--;}
    else if(c.k==="butterfly"){c.x+=Math.sin(c.t*.07)*.6;c.y+=Math.cos(c.t*.05)*.4;}
    else{if(d<70&&!c.flee){c.flee=1;const a=Math.atan2(c.y-hero.y,c.x-hero.x);const sp=c.k==="bird"?2.2:c.k==="deer"?2:2.4;c.vx=Math.cos(a)*sp;c.vy=Math.sin(a)*sp;}
      if(c.flee){c.x+=c.vx;c.y+=c.vy;if(c.k==="bird")c.z=Math.min(60,c.z+1);}else if(c.t%90<20){c.x+=Math.sin(c.t)*.4;}}
    if(c.life<=0||d>700)critters.splice(i,1);}}
function drawCritter(c){const x=Math.round(c.x),y=Math.round(c.y);ctx.fillStyle="rgba(0,0,0,.18)";
  if(c.k==="fish"){if(c.jump>0){const h=Math.sin((40-c.jump)/40*Math.PI)*12;ctx.fillStyle="#9cc8e8";ctx.fillRect(x-3,y-h-1,6,2);ctx.fillRect(x+3,y-h-2,2,4);if(c.jump===1||c.jump===39){ctx.fillStyle="#e8f6ff";ctx.fillRect(x-4,y,8,1);}}return;}
  if(c.k==="butterfly"){const f=Math.sin(c.t*.5)>0;ctx.fillStyle=c.c;ctx.fillRect(x-(f?2:1),y-8,f?2:1,2);ctx.fillRect(x+1,y-8,f?2:1,2);ctx.fillStyle="#333";ctx.fillRect(x,y-8,1,2);return;}
  if(c.k==="bird"){ctx.fillRect(x-2,y,4,1);const f=Math.sin(c.t*.4)>0&&c.flee;ctx.fillStyle="#5a4636";ctx.fillRect(x-2,y-3-c.z,4,2);ctx.fillRect(x-(f?4:2),y-(f?5:3)-c.z,2,1);ctx.fillRect(x+2,y-(f?5:3)-c.z,2,1);ctx.fillStyle="#e8a020";ctx.fillRect(x+2,y-3-c.z,1,1);return;}
  if(c.k==="rabbit"){const h=c.flee?Math.abs(Math.sin(c.t*.3))*3:0;ctx.fillRect(x-3,y,6,1);ctx.fillStyle="#c8b8a0";ctx.fillRect(x-2,y-4-h,5,3);ctx.fillRect(x+2,y-7-h,1,3);ctx.fillStyle="#fff";ctx.fillRect(x-3,y-4-h,1,1);return;}
  if(c.k==="deer"){const s=c.vx<0?-1:1;ctx.fillRect(x-6,y,12,2);ctx.fillStyle="#9a6a3a";ctx.fillRect(x-5,y-8,10,4);const l=c.flee&&(c.t>>2)%2;ctx.fillRect(x-4,y-4,1,4-l);ctx.fillRect(x+3,y-4,1,4-(1-l));ctx.fillRect(x+4*s,y-12,3,5);ctx.fillStyle="#6a4a2a";ctx.fillRect(x+4*s,y-15,1,3);ctx.fillRect(x+6*s,y-15,1,3);ctx.fillStyle="#fff";ctx.fillRect(x-5*s,y-8,1,2);}}
// ---- mini-events ----
const events=[];
function miniEventTick(){if(frameN%600!==0||Math.random()>0.45)return;const near=SETS.find(s=>Math.hypot(s.x*TILE-hero.x,s.y*TILE-hero.y)<260);if(!near)return;
  const vis=npcs.filter(n=>n.alive&&!n.inside&&!n.adv&&n.age>=15&&Math.hypot(n.x-hero.x,n.y-hero.y)<240);if(vis.length<2)return;const k=pick(["fight","pet","party","busker"]);const a=pick(vis),b=pick(vis.filter(v=>v!==a));
  if(k==="fight"){say(a,"You cheated me!");setTimeout(()=>{say(b,"Did not!");a.gest=30;b.gest=30;},1200);setTimeout(()=>say(pick(vis),"Break it up, you two!"),2600);}
  if(k==="pet"){say(a,"Has anyone seen my dog?!",240);critters.push({k:"rabbit",x:a.x+(Math.random()-.5)*300,y:a.y+(Math.random()-.5)*200,t:0,life:2400,lostPet:a.name});addNews(near.id,`${a.name} lost a pet near ${near.name}.`);}
  if(k==="party"){say(a,"Happy name-day!",200);setTimeout(()=>say(b,"Cheers! 🎉"),900);for(let i=0;i<40;i++)particles.push({x:a.x+8,y:a.y,z:10,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,vz:Math.random()*3,life:60,max:60,col:[pick([255,120,80]),pick([80,200,255]),pick([255,90,160])],size:2});}
  if(k==="busker"){a.cheer=absMin()+60;say(a,"♪ A song for the wanderer! ♪",240);}}
// ---- hook into the loop ----
const _updateL=update;update=function(){_updateL();if(!hero||state!=="play")return;try{critterTick();chatterTick();partyFightTick();miniEventTick();
  for(let i=critters.length-1;i>=0;i--){const c=critters[i];if(c.lostPet&&Math.hypot(c.x-hero.x,c.y-hero.y)<20){critters.splice(i,1);P.gold+=20;floatText(hero.x,hero.y-12,"+20g","#ffd84a");toast(`You found ${c.lostPet}'s lost pet!`);}}
  for(const b of bubbles)b.life--;for(let i=bubbles.length-1;i>=0;i--)if(bubbles[i].life<=0)bubbles.splice(i,1);}catch(e){console.warn(e);}};
const _drawL=draw;draw=function(){_drawL();if(!hero||room)return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);
for(const c of critters)drawCritter(c);
  ctx.font="bold 7px system-ui";ctx.textAlign="center";
  const bub=(x,y,t,a)=>{const w=ctx.measureText(t).width+8;ctx.globalAlpha=a;ctx.fillStyle="#fffdf4";ctx.strokeStyle="#3a2a1a";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect?ctx.roundRect(x-w/2,y-12,w,11,3):ctx.rect(x-w/2,y-12,w,11);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-2,y-1);ctx.lineTo(x,y+2);ctx.lineTo(x+2,y-1);ctx.fill();ctx.fillStyle="#2a1a10";ctx.fillText(t,x,y-4);ctx.globalAlpha=1;};
  for(const b of bubbles)if(!b.n.inside)bub(b.n.x+8,b.n.y-14,b.t,Math.min(1,b.life/20));
  for(const n of advs())if(n.adv.state==="travel"&&n.adv.carry&&!n.inside){ctx.fillStyle="#b08850";ctx.fillRect(n.x+12,n.y+2,6,6);ctx.fillStyle="#ffd84a";ctx.fillRect(n.x+14,n.y+1,2,2);}
  ctx.restore();};
const _drawMiniL=drawMini;drawMini=function(){_drawMiniL();const R=40,tx=hero.x/TILE,ty=hero.y/TILE,sx=mini.width/(R*2),sy=mini.height/(R*1.5);
  for(const n of advs())if(n.alive&&!n.inside){const x=(n.x/TILE-tx+R)*sx,y=(n.y/TILE-ty+R*0.75)*sy;if(x<0||y<0||x>mini.width||y>mini.height)continue;mg.fillStyle="#3aa0ff";mg.fillRect(x-1.5,y-1.5,3,3);}};
