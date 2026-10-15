// ===== ZOOMABLE WORLD MAP + MINIMAP ARROW =====
const MAPM={z:2,cx:0,cy:0,legend:false,ptrs:new Map(),pinch:null,drag:null,moved:false};
const MAP_MULT=[1,2,4,8,16];
{const st=document.createElement("style");st.textContent=`
#mapov{position:fixed!important;inset:0;background:#0c0712!important;z-index:45!important;padding:max(6px,env(safe-area-inset-top)) 6px max(6px,env(safe-area-inset-bottom));justify-content:flex-start!important;box-sizing:border-box}
#mapov .mhead{width:100%;max-width:1100px;display:flex;align-items:center;gap:8px}
#mapov .minfo{flex:1;color:#ffe6a8;font:600 13px system-ui;line-height:1.25;text-shadow:0 1px 2px #000}
#mapov .minfo b{color:#ffd040}
#mapX{width:38px;height:38px;border-radius:50%;border:2px solid #e8c060;background:#2a1830;color:#ffe6a8;font-size:20px;flex:none}
#mapwrap{position:relative;flex:1;width:100%;max-width:1100px;min-height:0;border:3px solid #e8c060;border-radius:8px;overflow:hidden;touch-action:none;background:#16305a}
#mapc{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;border:0!important;display:block;touch-action:none}
#mapctl{position:absolute;right:8px;bottom:8px;display:flex;flex-direction:column;gap:6px}
#mapctl button,#mapctl2 button{min-width:42px;height:42px;border-radius:10px;border:2px solid #e8c060;background:rgba(40,22,48,.9);color:#ffe6a8;font:700 18px system-ui}
#mapctl2{position:absolute;left:8px;bottom:8px;display:flex;gap:6px}#mapctl2 button{font-size:13px;padding:0 10px}
#mapzl{position:absolute;right:58px;bottom:12px;color:#ffe6a8;font:600 12px system-ui;text-shadow:0 1px 2px #000}
#maplegend{position:absolute;left:8px;top:8px;background:rgba(20,10,25,.88);border:1px solid #e8c060;border-radius:8px;padding:8px 10px;color:#ffe6a8;font:12px system-ui;line-height:1.6}
#maplegend.hidden{display:none}
#mapClose{display:none!important}#mapov .t{display:none}
#mini{pointer-events:auto!important;cursor:pointer}#miniz{position:absolute;pointer-events:auto;width:22px;height:22px;border-radius:50%;border:1px solid #e8c060;background:rgba(40,22,48,.9);color:#ffe6a8;font:700 13px system-ui;padding:0;z-index:6}`;document.head.appendChild(st);}
(function buildMapUI(){const ov=document.getElementById("mapov");const c=document.getElementById("mapc");
  const head=document.createElement("div");head.className="mhead";head.innerHTML=`<div class="minfo" id="mapinfo"></div><button id="mapX" type="button" aria-label="Close">✕</button>`;
  const wrap=document.createElement("div");wrap.id="mapwrap";ov.insertBefore(head,ov.firstChild);ov.insertBefore(wrap,c);wrap.appendChild(c);
  wrap.insertAdjacentHTML("beforeend",`<div id="mapctl"><button id="mapZin" type="button">+</button><button id="mapZout" type="button">−</button></div><div id="mapzl"></div>
   <div id="mapctl2"><button id="mapMe" type="button">◎ Center on me</button><button id="mapLeg" type="button">Legend</button></div>
   <div id="maplegend" class="hidden"><div>➤ <b>You</b> (arrow = facing)</div><div><span style="color:#ffd84a">■</span> Town · ♛ capital</div><div><span style="color:#5ff">●</span> Waystone (tap to travel)</div><div><span style="color:#ffd23a">⌂</span> My Homes (tap for travel) · <span style="color:#aaa">⌂</span> for sale</div><div><span style="color:#ffd84a">★</span> Town leader (zoomed in)</div><div><span style="color:#ff3a3a">●</span> Quest to do · <span style="color:#3ee05a">●</span> ready to turn in</div><div>▲ Lookout · ✦ Point of interest · 🐉 Lair</div><div><span style="color:#fff">▪</span> Border post · colored tint = kingdom</div></div>`);
  const stop=e=>e.stopPropagation();for(const id of ["mapX","mapZin","mapZout","mapMe","mapLeg"])document.getElementById(id).addEventListener("pointerdown",stop);
  document.getElementById("mapX").onclick=e=>{e.stopPropagation();toggleMap();};
  document.getElementById("mapZin").onclick=e=>{e.stopPropagation();mapZoom(1);};document.getElementById("mapZout").onclick=e=>{e.stopPropagation();mapZoom(-1);};
  document.getElementById("mapMe").onclick=e=>{e.stopPropagation();mapCenterMe();};
  document.getElementById("mapLeg").onclick=e=>{e.stopPropagation();MAPM.legend=!MAPM.legend;document.getElementById("maplegend").classList.toggle("hidden",!MAPM.legend);};
  // gestures: drag to pan, pinch / wheel to zoom, tap waystone to travel
  c.addEventListener("pointerdown",e=>{e.preventDefault();c.setPointerCapture&&c.setPointerCapture(e.pointerId);MAPM.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});MAPM.moved=false;
    if(MAPM.ptrs.size===2){const [a,b]=[...MAPM.ptrs.values()];MAPM.pinch={d:Math.hypot(a.x-b.x,a.y-b.y)};MAPM.drag=null;}else MAPM.drag={x:e.clientX,y:e.clientY};});
  c.addEventListener("pointermove",e=>{if(!MAPM.ptrs.has(e.pointerId))return;MAPM.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(MAPM.pinch&&MAPM.ptrs.size>=2){const [a,b]=[...MAPM.ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(d/MAPM.pinch.d>1.35){mapZoom(1);MAPM.pinch.d=d;}else if(d/MAPM.pinch.d<0.74){mapZoom(-1);MAPM.pinch.d=d;}MAPM.moved=true;return;}
    if(MAPM.drag){const dx=e.clientX-MAPM.drag.x,dy=e.clientY-MAPM.drag.y;if(Math.abs(dx)+Math.abs(dy)>3)MAPM.moved=true;const s=mapScaleCss();MAPM.cx-=dx/s;MAPM.cy-=dy/s;MAPM.drag={x:e.clientX,y:e.clientY};mapClamp();drawFullMap();}});
  const up=e=>{const was=MAPM.ptrs.has(e.pointerId);MAPM.ptrs.delete(e.pointerId);if(MAPM.ptrs.size<2)MAPM.pinch=null;if(MAPM.ptrs.size===0){MAPM.drag=null;if(was&&!MAPM.moved&&e.type==="pointerup")mapTap(e);}};
  c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);
  c.addEventListener("wheel",e=>{e.preventDefault();mapZoom(e.deltaY<0?1:-1);},{passive:false});
  addEventListener("resize",()=>{if(!document.getElementById("mapov").classList.contains("hidden"))drawFullMap();});
  if(window.visualViewport)visualViewport.addEventListener("resize",()=>{if(!document.getElementById("mapov").classList.contains("hidden"))drawFullMap();});})();
function mapFit(){const c=document.getElementById("mapc");const w=c.clientWidth||300,h=c.clientHeight||300;return Math.min(w/WW,h/WH);}
const mapScaleCss=()=>mapFit()*MAP_MULT[MAPM.z];
function mapClamp(){const c=document.getElementById("mapc");const s=mapScaleCss(),hw=c.clientWidth/2/s,hh=c.clientHeight/2/s;
  MAPM.cx=hw*2>=WW?WW/2:clamp(MAPM.cx,hw,WW-hw);MAPM.cy=hh*2>=WH?WH/2:clamp(MAPM.cy,hh,WH-hh);}
function mapZoom(d){MAPM.z=clamp(MAPM.z+d,0,MAP_MULT.length-1);mapClamp();drawFullMap();}
function mapCenterMe(){MAPM.cx=(hero.x+6)/TILE;MAPM.cy=(hero.y+8)/TILE;mapClamp();drawFullMap();}
function mapToScreen(tx,ty){const c=document.getElementById("mapc");const s=mapScaleCss();return{x:c.clientWidth/2+(tx-MAPM.cx)*s,y:c.clientHeight/2+(ty-MAPM.cy)*s};}
function mapTap(e){const c=document.getElementById("mapc");const r=c.getBoundingClientRect();if(homeTap(e.clientX-r.left,e.clientY-r.top))return;const s=mapScaleCss();const tx=MAPM.cx+(e.clientX-r.left-c.clientWidth/2)/s,ty=MAPM.cy+(e.clientY-r.top-c.clientHeight/2)/s;
  for(const w of waystones)if(w.found&&Math.hypot(w.x-tx,w.y-ty)<Math.max(3,14/s)){toggleMap();travel(w);return;}}
function regionName(tx,ty){const rk=regionKind(tx,ty);for(const I of ISLES)if(Math.hypot(tx-I.x,ty-I.y)<I.r)return I.name;
  if(kAtTile(tx,ty)===3&&ty>420)return"Ashlands";return rk?{tundra:"Frostreach Tundra",desert:"Sunscar Desert",swamp:"Mirefen Swamp",lakes:"Lakelands"}[rk]:biomeName(tx,ty);}
function biomeName(tx,ty){const t=tAt(tx,ty);return t===FOREST||t===TREE?"Wildwood":t===SAND?"Coast":t===DEEP||t===SHAL?"Open Water":"Heartland Plains";}
function mapInfo(){const tx=(hero.x+6)/TILE|0,ty=(hero.y+8)/TILE|0;const k=KINGDOMS[kAtTile(tx,ty)];let best=SETS[0],bd=1e9;for(const s of SETS){const d=Math.hypot(s.x-tx,s.y-ty);if(d<bd){bd=d;best=s;}}
  return{region:regionName(tx,ty),kingdom:k.name,town:best.name,dist:Math.round(bd),inTown:bd<best.r};}
drawFullMap=function(){const c=document.getElementById("mapc");if(!c||!worldMapC)return;const dpr=Math.min(2,window.devicePixelRatio||1);const cw=c.clientWidth,ch=c.clientHeight;if(!cw||!ch)return;
  if(c.width!==Math.round(cw*dpr)||c.height!==Math.round(ch*dpr)){c.width=Math.round(cw*dpr);c.height=Math.round(ch*dpr);}
  const g=c.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);g.imageSmoothingEnabled=false;g.fillStyle="#16305a";g.fillRect(0,0,cw,ch);
  const s=mapScaleCss(),z=MAPM.z;const x0=MAPM.cx-cw/2/s,y0=MAPM.cy-ch/2/s;g.drawImage(worldMapC,x0,y0,cw/s,ch/s,0,0,cw,ch);
  const P2=(x,y)=>[(x-x0)*s,(y-y0)*s];const draw1=(t,x,y,col,sz)=>{g.font=`bold ${sz||12}px system-ui`;g.textAlign="center";g.lineWidth=3;g.strokeStyle="rgba(0,0,0,.85)";g.strokeText(t,x,y);g.fillStyle=col||"#fff";g.fillText(t,x,y);};
  // v23 declutter: labels are queued, icons always drawn, text labels placed by priority and skipped/nudged when they would collide
  const LQ=[],placed=[];let flushed=false;const isIcon=t=>[...t].length<=2;
  const rectOf=(t,x,y,sz)=>{g.font=`bold ${sz||12}px system-ui`;const w=g.measureText(t).width+4,h=(sz||12)+2;return{x:x-w/2,y:y-h+3,w,h};};
  const hit=r=>placed.some(q=>r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y)||r.x<2||r.y<2||r.x+r.w>cw-2||r.y+r.h>ch-2;
  const place1=(it)=>{if(it.icon){placed.push(rectOf(it.t,it.x,it.y,it.sz));draw1(it.t,it.x,it.y,it.col,it.sz);return;}
    for(const dy of [0,-14,14,30,44,-28]){const r=rectOf(it.t,it.x,it.y+dy,it.sz);if(!hit(r)){placed.push(r);draw1(it.t,it.x,it.y+dy,it.col,it.sz);window.__mapLabels.push({t:it.t,...r});return;}}};
  window.__mapLabels=[];
  const txt=(t,x,y,col,sz)=>{const icon=isIcon(t);const pri=icon?9:t==="You"?8:(sz||12)>=13?6:/\d+g$/.test(t)?1:3;const it={t,x,y,col,sz,icon,pri};if(flushed)place1(it);else LQ.push(it);};
  const flushL=(res)=>{if(res)placed.push(res);LQ.sort((a,b)=>b.pri-a.pri);for(const it of LQ)place1(it);flushed=true;};
  window.__mapTxt=txt;
  if(z>=3)for(const p of BORDER_POSTS){const [x,y]=P2(p.x,p.y);g.fillStyle="#fff";g.fillRect(x-2,y-2,4,4);}
  if(z>=2){for(const L of LAIRS){const [x,y]=P2(L.x,L.y);txt("🐉",x,y,"#f6f",12);}for(const l of LOOKOUTS){const [x,y]=P2(l.x,l.y);txt("▲",x,y+4,"#fff",11);}
    for(const q of POIS){const [x,y]=P2(q.x,q.y);txt("✦",x,y+4,"#ffe080",12);if(z>=3)txt(q.name,x,y+16,"#ffe8b0",10);}
    {const [x,y]=P2(RUINS.x,RUINS.y);txt("Ruins",x,y,"#ccc",11);}}drawHomesMap(g,P2,txt,z);
  for(const w of waystones){const [x,y]=P2(w.x,w.y);if(z<1&&!w.found)continue;g.fillStyle=w.found?"#5ff":"#567";g.beginPath();g.arc(x,y,w.found?Math.max(3,1.2*z+2):2,0,7);g.fill();}
  for(const st of SETS){const [x,y]=P2(st.x,st.y);const cap=KINGDOMS.some(k=>k.cap===st.id);const r=Math.max(2,Math.min(st.r*s*0.25,8));g.fillStyle=cap?"#ffec70":"#ffd84a";g.fillRect(x-r,y-r,r*2,r*2);g.strokeStyle="#000";g.lineWidth=1;g.strokeRect(x-r,y-r,r*2,r*2);
    if(z>=1||cap)txt((cap?"♛ ":"")+st.name,x,y-r-4,"#fff",z>=3?13:11);const ws=world.sets[st.id];if(ws&&(ws.raid||ws.dragon))txt("⚔",x+r+8,y+4,"#f33",12);}
  if(z<=1)for(const k of KINGDOMS){const S=SETS[k.cap];const [x,y0k]=P2(S.x,S.y);let y=y0k;{const hx2=(hero.x+6)/TILE,hy2=(hero.y+8)/TILE;const [mx,my]=P2(hx2,hy2);const ly=y-(z?34:22);if(Math.abs(mx-x)<70&&Math.abs(my-ly)<26)y+=(my<ly?30:-30);}txt((k.demon?"😈 ":"")+k.name.toUpperCase()+(atWar(k.id)?" ⚔":""),x,y-(z?34:22),k.col,z?16:13);}
  if(z>=2){try{for(const q of quests()){if(!q.pos)continue;const [x,y]=P2(q.pos.x,q.pos.y);g.fillStyle=q.ready?"#3ee05a":"#ff3a3a";g.strokeStyle="#fff";g.lineWidth=2;g.beginPath();g.arc(x,y,6,0,7);g.fill();g.stroke();txt("!",x,y+4,"#fff",10);}}catch(_){}}
  if(P.boat&&P.boat.owned){const [x,y]=P2(P.boat.x/TILE,P.boat.y/TILE);txt("⛵",x,y,"#fff",13);}
  // player marker: pulsing ring + facing arrow + label
  const hx=(hero.x+6)/TILE,hy=(hero.y+8)/TILE;const [px,py]=P2(hx,hy);MAPM.marker={x:px,y:py};const t=performance.now()/1000;const pr=12+Math.sin(t*5)*4;
  g.strokeStyle="rgba(255,60,60,.8)";g.lineWidth=3;g.beginPath();g.arc(px,py,pr+6,0,7);g.stroke();g.fillStyle="rgba(255,60,60,.25)";g.beginPath();g.arc(px,py,pr+6,0,7);g.fill();
  const ang=[Math.PI/2,Math.PI,0,-Math.PI/2][hero.dir||0];g.save();g.translate(px,py);g.rotate(ang);g.beginPath();g.moveTo(13,0);g.lineTo(-9,-9);g.lineTo(-4,0);g.lineTo(-9,9);g.closePath();g.lineWidth=4;g.strokeStyle="#fff";g.stroke();g.fillStyle="#ff2a2a";g.fill();g.restore();
  txt("You",px,z<=1?py+pr+24:py-pr-12,"#fff",14);flushL({x:px-22,y:py-22,w:44,h:44});
  const I=mapInfo();document.getElementById("mapinfo").innerHTML=`📍 <b>${I.inTown?I.town:I.region}</b> · ${I.kingdom}<br>${I.inTown?"In town":"Nearest town: "+I.town+" ("+I.dist+" tiles)"}`;
  document.getElementById("mapzl").textContent=`Zoom ${z+1}/${MAP_MULT.length}`;window.__map={z,scale:s,cx:MAPM.cx,cy:MAPM.cy,marker:{...MAPM.marker},w:cw,h:ch};};
let mapAnim=0;
toggleMap=function(){const ov=document.getElementById("mapov");if(!ov.classList.contains("hidden")){ov.classList.add("hidden");paused=false;cancelAnimationFrame(mapAnim);return;}
  paused=true;ov.classList.remove("hidden");MAPM.z=Math.max(2,MAPM.z===0?2:MAPM.z);requestAnimationFrame(()=>{mapCenterMe();const loop=()=>{if(ov.classList.contains("hidden"))return;drawFullMap();mapAnim=setTimeout(()=>requestAnimationFrame(loop),80);};loop();});};
// ---- minimap: arrow, zoom levels, tap to open ----
const MINI_R=[24,40,72];let miniZ=1;
drawMini=function(){mg.imageSmoothingEnabled=false;const R=MINI_R[miniZ];const tx=hero.x/TILE,ty=hero.y/TILE;
  mg.fillStyle="#123";mg.fillRect(0,0,mini.width,mini.height);mg.drawImage(worldMapC,tx-R,ty-R*0.75,R*2,R*1.5,0,0,mini.width,mini.height);
  const sx=mini.width/(R*2),sy=mini.height/(R*1.5),P2=(x,y)=>[(x-tx+R)*sx,(y-ty+R*0.75)*sy];
  for(const s of SETS){const [x,y]=P2(s.x,s.y);mg.fillStyle="#ffd84a";mg.fillRect(x-2,y-2,4,4);}
  for(const w of waystones)if(w.found){const [x,y]=P2(w.x,w.y);mg.fillStyle="#5ff";mg.fillRect(x-1,y-1,3,3);}drawHomesMini(mg,P2);
  try{for(const q of quests()){if(!q.pos)continue;const [x,y]=P2(q.pos.x,q.pos.y);mg.fillStyle=q.ready?"#3ee05a":"#ff3a3a";mg.fillRect(x-2,y-2,4,4);}}catch(_){}
  for(const m of mobs)if(!m.dead&&(m.def.beh==="agg"||m.sp==="dragon")){const [x,y]=P2(m.x/TILE,m.y/TILE);mg.fillStyle=m.sp==="dragon"?"#f0f":"#f44";mg.fillRect(x-1,y-1,2,2);}
  const ang=[Math.PI/2,Math.PI,0,-Math.PI/2][hero.dir||0];mg.save();mg.translate(mini.width/2,mini.height/2);mg.rotate(ang);mg.beginPath();mg.moveTo(7,0);mg.lineTo(-5,-5);mg.lineTo(-2,0);mg.lineTo(-5,5);mg.closePath();mg.lineWidth=2;mg.strokeStyle="#fff";mg.stroke();mg.fillStyle="#ff2a2a";mg.fill();mg.restore();
  mg.strokeStyle="#e8c060";mg.strokeRect(.5,.5,mini.width-1,mini.height-1);};
function miniCycle(d){miniZ=(miniZ+(d||1)+MINI_R.length)%MINI_R.length;drawMini();const b=document.getElementById("miniz");if(b)b.textContent=["+","±","−"][miniZ];}
(function miniUI(){const m=document.getElementById("mini");m.style.cursor="pointer";m.addEventListener("click",e=>{e.stopPropagation();if(state==="play")toggleMap();});
  const b=document.createElement("button");b.id="miniz";b.type="button";b.textContent="±";b.title="Minimap zoom";b.addEventListener("pointerdown",e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();miniCycle(1);};
  const place=()=>{const r=m.getBoundingClientRect();if(!r.width)return;b.style.position="fixed";b.style.left=(r.left-28)+"px";b.style.top=r.top+"px";b.style.display=m.offsetParent?"block":"none";};
  document.body.appendChild(b);setInterval(place,500);addEventListener("resize",place);})();
