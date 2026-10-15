// ===== HEROIC RECOGNITION =====
function heroicDeed(sid,kind){const S=SETS[sid];const title=(kind==="dragon"?"Dragonslayer":"Defender")+" of "+S.name;
  if(!P.titles)P.titles=[];const fresh=!P.titles.includes(title);if(fresh)P.titles.push(title);P.deeds=(P.deeds||0)+1;
  const until=absMin()+90;for(const n of npcs)if(n.alive&&n.s===sid){n.friend=Math.min(100,n.friend+10);n.cheer=until;n.deed=title;}
  const dmgB=S.bIdx.filter(b=>world.bld[b].dmg>0.05||world.bld[b].burn>0);const owner=npcs.find(n=>n.alive&&n.s===sid&&dmgB.includes(n.home))||npcs.find(n=>n.alive&&n.s===sid&&n.role!=="child");
  const reward=kind==="dragon"?150:60;P.gold+=reward;if(kind==="dragon"){P.inv.dscale=(P.inv.dscale||0)+1;}
  world.sets[sid].safety=Math.min(2,(world.sets[sid].safety||1)+0.3);world.sets[sid].festival=absMin()+600;
  addNews(sid,`HERO! The wanderer ${kind==="dragon"?"slew the dragon":"drove off the raiders"} attacking ${S.name}. They are hailed as ${title}!`);
  SFX.chime();toast(`🏆 Title earned: ${title}!`);
  if(owner)setTimeout(()=>showMenu(`${owner.name} of ${S.name}`,`"You saved my home! I don't know how to thank you... please, take this: ${reward} gold${kind==="dragon"?" and a dragon scale":""}."\n\nThe townsfolk gather around you, cheering!`,[{l:"You're welcome"}]),window.__FAST?0:800);
  checkRank();saveGame();}
// ===== ADVENTURERS' GUILD =====
const GRANKS=["F","E","D","C","B","A","S"],GPTS=[0,30,80,160,300,500,800];
function guild(){if(!P.guild)P.guild={reg:false,rank:0,pts:0,active:[],done:0};return P.guild;}
function genGuildJobs(force){if(!force&&world.gday===world.day&&world.gjobs)return world.gjobs;world.gday=world.day;let id=1;const J=[];
  const add=(o)=>J.push({id:world.day*100+id++,...o});
  const pr=world.regions.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0])[0];
  add({t:"hunt",n:5,have:0,min:0,gold:40,pts:10,txt:"Hunt 5 monsters (population is high in the wild)"});
  add({t:"wood",n:6,min:0,gold:30,pts:8,txt:"Gather 6 Wood for the guild hall"});
  const part=pick(["fang","hide","claw","eye","horn","core"]);add({t:"part",item:part,n:2,min:1,gold:55,pts:14,txt:`Deliver 2 ${ITEMS[part].n} to the alchemists`});
  const to=1+Math.floor(Math.random()*4);add({t:"escort",to,min:1,gold:60,pts:16,txt:`Escort a merchant to ${SETS[to].name}`});
  for(const s of world.sets)if(s.raid)add({t:"raid",s:s.id,min:2,gold:120,pts:30,txt:`Raid defense: protect ${SETS[s.id].name}`});
  if(!P.dungeon)add({t:"dungeon",min:3,gold:200,pts:50,txt:"Clear the Stormcrag dungeon"});
  {const pool=Object.keys(SPECIES).filter(k=>SPECIES[k].mon&&SPECIES[k].biome&&SPECIES[k].beh!=="pea");for(let q=0;q<2;q++){const sp=pool[(Math.random()*pool.length)|0];const d=SPECIES[sp];const tr=d.rare?4:(d.tier||1)-1;add({t:"huntsp",sp,n:d.rare?1:3,have:0,min:tr,gold:d.rare?200:30+tr*40,pts:d.rare?50:8+tr*10,txt:`Bounty: slay ${d.rare?"the":"3"} ${d.name}${d.rare?"":"s"}`});}}
  add({t:"camp",min:2,gold:150,pts:40,txt:"Clear an orc war camp (slay a warchief)"});
  add({t:"dragon",min:4,gold:400,pts:90,txt:"Dragon subjugation: slay any dragon"});
  add({t:"hunt",n:15,have:0,min:3,gold:150,pts:35,txt:"Elite hunt: cull 15 monsters"});
  world.gjobs=J;return J;}
function guildRankUp(){const g=guild();let r=g.rank;while(r<6&&g.pts>=GPTS[r+1])r++;if(r>g.rank){g.rank=r;toast(`Guild rank up! You are now ${GRANKS[r]}-rank.`);SFX.chime();addNews(-1,`The guild promoted the wanderer to ${GRANKS[r]}-rank.`);checkRank();}}
function guildProgress(type,sid){const g=guild();for(const j of g.active){if(j.t===type&&(j.t!=="raid"||j.s===sid)){if(j.t==="hunt")j.have=(j.have||0)+1;else if(j.t==="escort"){if(sid===j.to)j.ok=true;}else j.ok=true;}}}
function jobReady(j){if(j.t==="huntsp")return(j.have||0)>=j.n;if(j.t==="hunt")return(j.have||0)>=j.n;if(j.t==="wood")return(P.inv.wood||0)>=j.n;if(j.t==="part")return have(j.item)>=j.n;if(j.t==="dungeon")return P.dungeon;return!!j.ok;}
function guildTurnIn(){const g=guild();let paid=0;for(const j of g.active.slice()){if(!jobReady(j))continue;
  if(j.t==="wood")P.inv.wood-=j.n;if(j.t==="part")for(let i=0;i<j.n;i++){if((P.inv[j.item]||0)>0)P.inv[j.item]--;else P.inv[j.item+"+"]--;}
  P.gold+=j.gold;g.pts+=j.pts;g.done++;const bonus=pick(["fang","claw","hide","eye","core"]);P.inv[bonus]=(P.inv[bonus]||0)+1;paid+=j.gold;g.active.splice(g.active.indexOf(j),1);
  toast(`Job complete: +${j.gold}g, +${j.pts} GP, +1 ${ITEMS[bonus].n}`);}
  if(paid){SFX.coin();guildRankUp();saveGame();}return paid;}
function guildCard(){const g=guild();return g.reg?`ADVENTURER'S GUILD CARD\nRank: ${GRANKS[g.rank]}   Points: ${g.pts}${g.rank<6?" / "+GPTS[g.rank+1]:""}\nJobs completed: ${g.done}\nTitles: ${(P.titles||[]).join(", ")||"none"}\nActive: ${g.active.map(j=>j.txt+(j.t==="hunt"?` (${j.have||0}/${j.n})`:"")+(jobReady(j)?" ✔":"")).join("; ")||"none"}`:"Not registered. Visit a Guild Hall in Aldmoor, Saltmere or Highcrest.";}
function guildMenu(sid){const g=guild();
  if(!g.reg)return showMenu("Adventurers' Guild","RECEPTIONIST MIRA: \"Welcome! Register as an adventurer? Jobs, pay and glory await. Registration is free.\"",[{l:"Register",f:()=>{g.reg=true;toast("Registered! You are an F-rank adventurer.");addNews(sid,"A new adventurer registered at the guild.");guildMenu(sid);}},{l:"Leave"}]);
  const jobs=genGuildJobs();const paid=guildTurnIn();
  showMenu("Adventurers' Guild",`MIRA: "${paid?`Great work! Here's your pay: ${paid}g.`:g.rank>=4?"Our star adventurer returns!":"How can the guild help you today?"}"\n\n`+guildCard(),
   jobs.filter(j=>!g.active.some(a=>a.id===j.id)).map(j=>({l:`[${GRANKS[j.min]}] ${j.txt} — ${j.gold}g${j.claimed?" (claimed by "+j.claimed+")":""}`,cls:"job",f:()=>guildJobDetail(sid,j)})).concat([{l:"Leave"}]));}
const guildDiscount=()=>P&&P.guild&&P.guild.reg?P.guild.rank*0.03:0;

function guildJobDetail(sid,j){const g=guild();const why=j.claimed?"Already claimed by "+j.claimed+".":j.min>g.rank?"Requires rank "+GRANKS[j.min]+" (you are "+GRANKS[g.rank]+").":g.active.length>=3?"You already have 3 active guild jobs.":"";
  showMenu("Job: "+j.txt,`Rank: ${GRANKS[j.min]}\nReward: ${j.gold}g · ${j.pts} guild points${j.part?" · parts":""}\nType: ${j.t}\n${why}`,[{l:"Accept job",dis:!!why,f:()=>{if(typeof takeGuildJobX==="function")return takeGuildJobX(sid,j);g.active.push({...j});toast("Guild job accepted: "+j.txt);guildMenu(sid);}},{l:"Back to board",f:()=>guildMenu(sid)}]);}
