// ===== TOWN LEADERS STAND BY THE PLAZA FOUNTAIN =====
function fountainOf(S){return S._fnt||(S._fnt=PROPS.find(p=>p.type==="fountain"&&Math.hypot(p.x-S.x,p.y-S.y)<=6)||null);}
function ensureFountains(){for(const S of SETS){S._fnt=null;if(fountainOf(S))continue;
  const well=PROPS.find(p=>p.type==="well"&&!p.cabin&&Math.hypot(p.x-S.x,p.y-S.y)<=4);if(well){well.type="fountain";S._fnt=well;continue;}
  for(let r=0;r<=5&&!S._fnt;r++)for(let dy=-r;dy<=r&&!S._fnt;dy++)for(let dx=-r;dx<=r;dx++){const x=S.x+dx,y=S.y+dy;if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
    if(solidTile(x,y)||solidTile(x,y+1)||solidTile(x,y+2))continue;const p={type:"fountain",x,y};PROPS.push(p);OCC[y*WW+x]=-1;S._fnt=p;break;}}}
{const _gp=genProps;genProps=function(){const r=_gp.apply(this,arguments);ensureFountains();return r;};}
const leaderDay=()=>{const h=hour();return h>=7&&h<20;};
function leaderSpot(n){const f=fountainOf(SETS[n.s]);if(!f)return null;const t=Math.floor(absMin()/20)%4;// pacing loop, <=2 tiles
  const loop=[[0,2],[1,2],[1,1.6],[-1,2]][(t+n.id)%4];return{x:(f.x+loop[0])*TILE,y:(f.y+loop[1])*TILE-6,fx:f.x*TILE,fy:f.y*TILE};}
{const _nt=npcTarget;npcTarget=function(n){const t=_nt(n);if(!world)return t;const S=SETS[n.s];const ws=world.sets[n.s];
  if(n.role==="leader"&&n.alive&&leaderDay()&&!(ws&&(ws.raid||ws.dragon))&&!n.engage&&!n.fleeing){const sp=leaderSpot(n);if(sp)return{x:sp.x,y:sp.y};}
  if(n.role!=="leader"&&!t.inside){const f=fountainOf(S);if(f){const dx=t.x/TILE-f.x,dy=t.y/TILE-f.y,d=Math.hypot(dx,dy);if(d<3.5){const a=d>0.1?Math.atan2(dy,dx):(n.id%6);return{...t,x:(f.x+Math.cos(a)*5)*TILE,y:(f.y+Math.sin(a)*5)*TILE};}}}
  return t;};}
// face outward when idle near the fountain
{const _u=update;update=function(){_u();if(!world)return;for(const n of npcs){if(n.role!=="leader"||!n.alive||n.inside||n._mv)continue;const f=fountainOf(SETS[n.s]);if(!f||Math.hypot(n.x/TILE-f.x,n.y/TILE-f.y)>3)continue;
  const dx=n.x/TILE-f.x,dy=n.y/TILE-f.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?2:1):(dy>0?0:3);}};}
// star above the leader's head
{const _d=drawNpc;drawNpc=function(n){_d(n);if(n.role!=="leader"||n.inside||!n.alive)return;const x=n.x+8,y=n.y-12+Math.sin(frameN*0.08)*1.5;ctx.save();ctx.fillStyle="#ffd84a";ctx.strokeStyle="#5a3a08";ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?2:4.5;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();};}
function drawLeadersMap(g,P2,txt,z){if(z<3)return;for(const n of npcs)if(n.role==="leader"&&n.alive&&!n.inside){const [x,y]=P2((n.x+8)/TILE,(n.y+12)/TILE);txt("★",x,y+4,"#ffd84a",13);if(z>=4)txt(n.name.split(" ")[0],x,y+16,"#ffe8b0",10);}}
