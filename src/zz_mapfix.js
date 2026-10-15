// ===== iOS-proof world-map gestures: touch pan (tap vs drag), inertia, pinch around point =====
(function(){const st=document.createElement("style");st.textContent=`html,body{overscroll-behavior:none}#mapov,#mapwrap,#mapc{touch-action:none!important;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
body.mapopen #touch,body.mapopen .rb,body.mapopen #stickZone,body.mapopen #miniz{pointer-events:none!important}#maplegend{pointer-events:none}#mini{touch-action:manipulation}`;document.head.appendChild(st);
  const wrap=document.getElementById("mapwrap"),c=document.getElementById("mapc");if(!wrap||!c)return;
  const TAP=8;let T=null,vel={x:0,y:0},inert=0;
  const local=(x,y)=>{const r=c.getBoundingClientRect();return{x:x-r.left,y:y-r.top};};
  function zoomAt(d,px,py){const s0=mapScaleCss(),w=c.clientWidth/2,h=c.clientHeight/2;const wx=MAPM.cx+(px-w)/s0,wy=MAPM.cy+(py-h)/s0;const z0=MAPM.z;MAPM.z=clamp(MAPM.z+d,0,MAP_MULT.length-1);if(MAPM.z===z0)return;
    const s1=mapScaleCss();MAPM.cx=wx-(px-w)/s1;MAPM.cy=wy-(py-h)/s1;mapClamp();drawFullMap();}
  function panBy(dx,dy){const s=mapScaleCss();MAPM.cx-=dx/s;MAPM.cy-=dy/s;mapClamp();drawFullMap();}
  function stopInert(){if(inert)cancelAnimationFrame(inert);inert=0;}
  function glide(){vel.x*=0.92;vel.y*=0.92;if(Math.hypot(vel.x,vel.y)<0.3){inert=0;return;}panBy(vel.x,vel.y);inert=requestAnimationFrame(glide);}
  const pts=e=>[...e.touches].map(t=>({id:t.identifier,x:t.clientX,y:t.clientY}));
  // touch pointers are handled by the touch handlers below: keep the old pointer handlers for mouse/pen only
  for(const ty of ["pointerdown","pointermove","pointerup","pointercancel"])wrap.addEventListener(ty,e=>{if(e.pointerType==="touch"&&e.target===c)e.stopPropagation();},true);
  wrap.addEventListener("touchstart",e=>{if(e.target!==c&&!c.contains(e.target))return;e.preventDefault();stopInert();const P=pts(e);
    if(P.length>=2){const [a,b]=P;T={pinch:{d:Math.hypot(a.x-b.x,a.y-b.y)},moved:true};return;}
    const t=P[0];T={id:t.id,x0:t.x,y0:t.y,x:t.x,y:t.y,t:performance.now(),moved:false};vel={x:0,y:0};},{passive:false});
  wrap.addEventListener("touchmove",e=>{if(!T)return;e.preventDefault();const P=pts(e);
    if(P.length>=2){const [a,b]=P;const d=Math.hypot(a.x-b.x,a.y-b.y);if(!T.pinch){T.pinch={d};T.moved=true;return;}const m=local((a.x+b.x)/2,(a.y+b.y)/2);
      if(d/T.pinch.d>1.3){zoomAt(1,m.x,m.y);T.pinch.d=d;}else if(d/T.pinch.d<0.77){zoomAt(-1,m.x,m.y);T.pinch.d=d;}return;}
    if(T.pinch)return;const t=[...e.touches].find(q=>q.identifier===T.id);if(!t)return;
    if(!T.moved&&Math.hypot(t.clientX-T.x0,t.clientY-T.y0)<TAP)return;
    if(!T.moved){T.moved=true;T.x=T.x0;T.y=T.y0;}
    const dx=t.clientX-T.x,dy=t.clientY-T.y,now=performance.now(),dt=Math.max(1,now-T.t);vel={x:vel.x*.5+dx*16/dt*.5,y:vel.y*.5+dy*16/dt*.5};T.x=t.clientX;T.y=t.clientY;T.t=now;panBy(dx,dy);},{passive:false});
  const end=e=>{if(!T)return;e.preventDefault();if(e.touches.length>0){if(T.pinch&&e.touches.length===1){const t=e.touches[0];T={id:t.identifier,x0:t.clientX,y0:t.clientY,x:t.clientX,y:t.clientY,t:performance.now(),moved:true};}return;}
    const was=T;T=null;if(!was.moved&&e.type==="touchend"){const t=e.changedTouches[0];try{mapTap({clientX:t.clientX,clientY:t.clientY});}catch(_){}return;}
    if(!was.pinch&&performance.now()-was.t<80&&Math.hypot(vel.x,vel.y)>1)inert=requestAnimationFrame(glide);};
  wrap.addEventListener("touchend",end,{passive:false});wrap.addEventListener("touchcancel",end,{passive:false});
  // mouse momentum too
  let mv=null;c.addEventListener("pointermove",e=>{if(e.pointerType!=="touch"&&MAPM.drag){mv={x:e.movementX||0,y:e.movementY||0,t:performance.now()};}});
  c.addEventListener("pointerup",e=>{if(e.pointerType!=="touch"&&mv&&performance.now()-mv.t<60&&MAPM.moved&&Math.hypot(mv.x,mv.y)>2){vel={x:mv.x,y:mv.y};stopInert();inert=requestAnimationFrame(glide);}mv=null;});
  // body flag while map is open so HUD overlays never steal touches
  const ov=document.getElementById("mapov");new MutationObserver(()=>{document.body.classList.toggle("mapopen",!ov.classList.contains("hidden"));stopInert();}).observe(ov,{attributes:true,attributeFilter:["class"]});
  window.__mapZoomAt=zoomAt;window.__BA_ms=mapScaleCss;})();
