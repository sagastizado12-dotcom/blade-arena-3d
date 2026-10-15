// ===== QUEST MARKERS & QUEST LOG =====
// red = accepted, go do it; green = requirements met, return to the giver; yellow = objective location
function pickGiver(sid,pref){const c=npcs.filter(n=>n.alive&&n.s===sid&&!n.adv&&n.age>=16);return (c.find(n=>n.role===pref)||c[0]||{}).id;}
const _takeJob0=takeJob;
takeJob=function(j){const before=P.jobs.length;_takeJob0(j);if(P.jobs.length>before&&j.giver==null){j.giver=j.t==="deliver"?pickGiver(j.to,"shopkeeper"):pickGiver(j.s,j.t==="gather"||j.t==="fish"?"shopkeeper":"leader");}};
const _tcj0=tryCompleteJobs;
tryCompleteJobs=function(sid,n){const held=[];if(n)for(const j of P.jobs)if(j.giver!=null&&j.giver!==n.id&&npcs.some(q=>q.id===j.giver&&q.alive)){held.push(j);}
  P.jobs=P.jobs.filter(j=>!held.includes(j));const r=_tcj0(sid);P.jobs=P.jobs.concat(held);return r;};
function npcById(id){return npcs.find(n=>n.id===id&&n.alive);}
function questReady(q){const j=q.j;if(q.kind==="guild")return jobReady(j);
  if(j.t==="gather"||j.t==="fish")return have(j.item)>=j.n;if(j.t==="hunt")return(j.have||0)>=j.n;if(j.t==="deliver")return true;return false;}
function questTarget(q){const j=q.j,S=SETS[j.s]||SETS[0];
  switch(j.t){case "deliver":return null;
   case "gather":case "wood":case "part":{const want=j.item==="wood"||j.t==="wood"?[TREE]:j.item==="fish"?[SHAL]:[GRASS,FOREST];const p=findTile(want,S.x,S.y,40);return p&&{x:p.x/TILE,y:p.y/TILE};}
   case "fish":{const p=findTile([SHAL],S.x,S.y,40);return p&&{x:p.x/TILE,y:p.y/TILE};}
   case "hunt":case "huntsp":return{x:S.x+(S.x>128?-28:28),y:S.y+(S.y>96?-16:16)};
   case "camp":return CAMPS&&CAMPS[0]?{x:CAMPS[0].x,y:CAMPS[0].y}:null;
   case "dragon":return LAIRS[0]?{x:LAIRS[0].x,y:LAIRS[0].y}:null;
   case "dungeon":return{x:CAVE_POS.x,y:CAVE_POS.y};
   case "raid":return{x:S.x,y:S.y};case "escort":return j.to!=null&&SETS[j.to]?{x:SETS[j.to].x,y:SETS[j.to].y}:null;}
  return null;}
function quests(){const out=[];if(!P||!world)return out;
  for(const j of P.jobs||[])out.push({j,kind:"town",giver:npcById(j.giver),title:jobText(j)});
  try{const g=guild();for(const j of g.active||[]){if(j.giver==null){const rs=npcs.find(n=>n.alive&&n.role==="receptionist"&&n.s===(j.s!=null?j.s:0))||npcs.find(n=>n.alive&&n.role==="receptionist");j.giver=rs&&rs.id;}out.push({j,kind:"guild",giver:npcById(j.giver),title:j.txt});}}catch(_){}
  for(const q of out){q.ready=!!questReady(q);q.color=q.ready?"#3ee05a":"#ff3a3a";q.pos=q.giver?giverPos(q.giver):null;
    if(q.kind==="guild"){const sid=q.giver?q.giver.s:(q.j.s!=null?q.j.s:0);const gb=buildings.find(b=>b.kind==="guild"&&b.s===sid)||buildings.find(b=>b.kind==="guild");if(gb){const d=doorOf(gb);q.hall={x:d.x/TILE,y:d.y/TILE};if(!q.pos)q.pos=q.hall;}}}return out;}
function giverPos(n){if(n.inside){const b=n.at!=null?buildings[n.at]:n.home!=null?buildings[n.home]:null;if(b){const d=doorOf(b);return{x:d.x/TILE,y:d.y/TILE,inside:true};}}return{x:(n.x+8)/TILE,y:(n.y+8)/TILE};}
function questMarkerOf(id){const q=quests().find(q=>q.j.id===id);return q?(q.ready?"green":"red"):null;}
// world: marker above the giver's head (or their door if indoors), bouncing
function drawQuestMarkers(){const qs=quests();for(const q of qs){if(!q.pos)continue;const x=q.pos.x*TILE,y=q.pos.y*TILE-(q.pos.inside?26:30)+Math.sin(frameN*.12)*2;
  ctx.save();ctx.fillStyle=q.color;ctx.strokeStyle="#1a0a0a";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y-7);ctx.lineTo(x+5,y-1);ctx.lineTo(x,y+5);ctx.lineTo(x-5,y-1);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle="#fff";ctx.font="bold 7px system-ui";ctx.textAlign="center";ctx.fillText(q.ready?"?":"!",x,y+1.5);ctx.restore();}
  for(const q of qs){if(q.ready)continue;const t=questTarget(q);if(!t)continue;const x=t.x*TILE,y=t.y*TILE;if(Math.abs(x-hero.x)>300||Math.abs(y-hero.y)>200)continue;
    ctx.save();ctx.strokeStyle="#ffd84a";ctx.lineWidth=1.5;ctx.globalAlpha=.7+Math.sin(frameN*.1)*.3;ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.stroke();ctx.restore();}}
function questDots(g,P2,r){const qs=quests();for(const q of qs){if(!q.ready){const t=questTarget(q);if(t){const [x,y]=P2(t.x,t.y);g.strokeStyle="#ffd84a";g.lineWidth=1.5;g.strokeRect(x-r,y-r,r*2,r*2);}}}
  for(const q of qs){if(q.hall){const [x,y]=P2(q.hall.x,q.hall.y);g.fillStyle="#000";g.fillRect(x-r-1.5,y-r-1.5,r*2+3,r*2+3);g.fillStyle=q.color;g.fillRect(x-r,y-r,r*2,r*2);}if(!q.pos)continue;const [x,y]=P2(q.pos.x,q.pos.y);g.fillStyle="#000";g.beginPath();g.arc(x,y,r+1.2,0,7);g.fill();g.fillStyle=q.color;g.beginPath();g.arc(x,y,r,0,7);g.fill();}}
const _drawMini0=drawMini;drawMini=function(){_drawMini0();if(room)return;const R=40;const tx=hero.x/TILE,ty=hero.y/TILE;const sx=mini.width/(R*2),sy=mini.height/(R*1.5);
  questDots(mg,(x,y)=>[clamp((x-tx+R)*sx,3,mini.width-3),clamp((y-ty+R*0.75)*sy,3,mini.height-3)],2.5);};
const _drawFullMap0=drawFullMap;drawFullMap=function(){_drawFullMap0();questDots(mapC.getContext("2d"),(x,y)=>[x*3,y*3],5);};
function questLog(tab){tab=tab||"town";const qs=quests().filter(q=>q.kind===tab);
  const fmt=q=>`${q.ready?"🟢 READY — return to "+(q.giver?q.giver.name:tab==="guild"?"the guild receptionist":"the giver")+"\n   ":"🔴 "}${q.title}${q.giver&&!q.ready?"\n   "+(tab==="guild"?"Turn in at the Guild Hall ("+SETS[q.giver.s].name+")":"Giver: "+q.giver.name+" ("+SETS[q.giver.s].name+")"):""}`;
  showMenu("Quest Log — "+(tab==="guild"?"Guild":"Town Tasks"),qs.length?qs.map(fmt).join("\n\n"):(tab==="guild"?"No active guild jobs. Visit a Guild Hall job board.":"No active town tasks. Check notice boards."),
    [{l:(tab==="town"?"▸ ":"")+"Town Tasks",f:()=>questLog("town")},{l:(tab==="guild"?"▸ ":"")+"Guild",f:()=>questLog("guild")},{l:"Close"}]);}
