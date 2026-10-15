// ===== GAME FEEL: easing, sliding, camera, interpolation, hit-stop, pacing =====
let hitStop=0,camFX=null,camFY=null,camT=0;
// move with corner sliding: if an axis is blocked, nudge sideways around tile corners
function slideMove(e,dx,dy){const x0=e.x,y0=e.y;moveEntity(e,dx,dy);
  if(dx&&Math.abs(e.x-(x0+dx))>0.01&&Math.abs(dy)<Math.abs(dx)*0.6){for(const s of [1,-1])for(let k=1;k<=6;k++){const oy=e.y;e.y=oy+s*k;e.x+=Math.sign(dx)*0.6;const free=!blockedE(e);e.x-=Math.sign(dx)*0.6;e.y=oy;if(free){moveEntity(e,0,s*Math.min(k,Math.abs(dx)));return;}}}
  if(dy&&Math.abs(e.y-(y0+dy))>0.01&&Math.abs(dx)<Math.abs(dy)*0.6){for(const s of [1,-1])for(let k=1;k<=6;k++){const ox=e.x;e.x=ox+s*k;e.y+=Math.sign(dy)*0.6;const free=!blockedE(e);e.y-=Math.sign(dy)*0.6;e.x=ox;if(free){moveEntity(e,s*Math.min(k,Math.abs(dy)),0);return;}}}}
// fixed-step interpolation for rendering
let interpList=[];
function snapPrev(){if(!hero)return;hero._ox=hero.x;hero._oy=hero.y;for(const m of mobs){m._ox=m.x;m._oy=m.y;}for(const n of npcs){n._ox=n.x;n._oy=n.y;}}
function interpOn(a){interpList.length=0;if(!hero||state!=="play"||paused)return;const L=[hero,...mobs];if(npcs)for(const n of npcs)if(n.alive)L.push(n);
  for(const e of L){if(e._ox==null)continue;const dx=e.x-e._ox,dy=e.y-e._oy;if(!dx&&!dy)continue;if(Math.abs(dx)>24||Math.abs(dy)>24)continue;interpList.push(e,e.x,e.y);e.x=e._ox+dx*a;e.y=e._oy+dy*a;}}
function interpOff(){for(let i=0;i<interpList.length;i+=3){const e=interpList[i];e.x=interpList[i+1];e.y=interpList[i+2];}interpList.length=0;}
// frame pacing: watch frame times and trim effects on slow devices
let paceAvg=16.7,lowFX=false;
function framePace(fd){paceAvg=paceAvg*0.95+fd*0.05;const want=paceAvg>22;if(want!==lowFX){lowFX=want;}const cap=lowFX?140:420;if(particles.length>cap)particles.splice(0,particles.length-cap);}
// short fade for doors
function fadeQuick(cb){const f=document.getElementById("fade");f.textContent="";f.style.transition="opacity .18s";f.classList.add("on");paused=true;
  setTimeout(()=>{cb&&cb();camFX=null;setTimeout(()=>{f.classList.remove("on");paused=false;setTimeout(()=>{f.style.transition="";},200);},window.__FAST?10:60);},window.__FAST?20:180);}
// dodge roll rendering + combo swing variety
const _drawHeroFullF=drawHeroFull;
drawHeroFull=function(){if(hero.dodgeT>0&&!hero.boat&&!hero.swim){const p=1-hero.dodgeT/(hero.dodgeMax||12);ctx.save();ctx.translate(hero.x+6,hero.y+8);ctx.rotate(p*Math.PI*2*(hero.rollDir||1));ctx.scale(1,0.85+0.15*Math.cos(p*Math.PI*2));ctx.translate(-hero.x-6,-hero.y-8);_drawHeroFullF();ctx.restore();
    if(frameN%2===0)particles.push({x:hero.x+6,y:hero.y+12,z:0,vx:(Math.random()-.5),vy:(Math.random()-.5),vz:.3,life:14,max:14,col:[220,200,160],size:2,kind:"spark"});return;}
  if(hero.swinging>=0&&hero.combo){ctx.save();const d=[[0,1],[-1,0],[1,0],[0,-1]][hero.dir];ctx.translate(d[0]*hero.combo,d[1]*hero.combo);_drawHeroFullF();ctx.restore();
    if(hero.combo===2&&hero.swinging===2){ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle="rgba(255,240,180,.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(hero.x+6+d[0]*10,hero.y+8+d[1]*10,13,0,7);ctx.stroke();ctx.restore();}return;}
  _drawHeroFullF();};
// gates swing open/closed smoothly
function gateOpenAmt(g){const want=gateClosed(g)&&!(g.hp<=0)?1:0;g._cl=g._cl==null?want:g._cl+(want-g._cl)*0.08;return g._cl;}
