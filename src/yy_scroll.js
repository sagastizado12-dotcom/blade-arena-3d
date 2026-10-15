// ===== Touch-scrollable menus: finger drag with momentum, visible scrollbar, wheel, tap-safe =====
(function(){const st=document.createElement("style");st.textContent=`
#menu{max-height:min(86vh,calc(100vh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom)))!important;overflow-y:auto!important;overscroll-behavior:contain;touch-action:none!important;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#e8c060 #2a1020}
#menu .mbtns button.dis{opacity:.45}#menu .mbtns button.job.ok{border-color:#e8c070;box-shadow:inset 3px 0 0 #e8c070}.mbtns button.job{display:block;width:100%;text-align:left}#menu::-webkit-scrollbar{width:8px}#menu::-webkit-scrollbar-thumb{background:#e8c060;border-radius:4px}#menu::-webkit-scrollbar-track{background:#2a1020}
body.menuOpen #touch,body.menuOpen .rb,body.menuOpen #tl{pointer-events:none!important}
#menu .sbar{position:sticky;float:right;right:-10px;top:0;width:5px;margin-right:-10px;border-radius:3px;background:#ffd870cc;pointer-events:none;transition:opacity .4s}`;document.head.appendChild(st);})();
(function(){const m=document.getElementById("menu");let y0=0,s0=0,lastY=0,lastT=0,vel=0,moved=false,anim=0,tid=null;
  const bar=()=>{let b=m.querySelector(".sbar");if(!b){b=document.createElement("div");b.className="sbar";m.prepend(b);}const r=m.clientHeight/m.scrollHeight;b.style.display=r<0.99?"block":"none";b.style.height=Math.max(24,m.clientHeight*r)+"px";b.style.transform=`translateY(${m.scrollTop*(1-r)/r*r/(1-r||1)*0+m.scrollTop*(m.clientHeight-Math.max(24,m.clientHeight*r))/Math.max(1,m.scrollHeight-m.clientHeight)}px)`;};
  m.addEventListener("scroll",bar);new MutationObserver(()=>{m.scrollTop=0;bar();document.body.classList.toggle("menuOpen",!m.classList.contains("hidden"));}).observe(m,{childList:true,attributes:true,attributeFilter:["class"]});
  m.addEventListener("touchstart",e=>{e.stopPropagation();cancelAnimationFrame(anim);const t=e.changedTouches[0];tid=t.identifier;y0=lastY=t.clientY;s0=m.scrollTop;lastT=performance.now();vel=0;moved=false;},{passive:true});
  m.addEventListener("touchmove",e=>{e.stopPropagation();e.preventDefault();const t=[...e.changedTouches].find(t=>t.identifier===tid);if(!t)return;if(Math.abs(t.clientY-y0)>8)moved=true;
    const now=performance.now();vel=0.8*((lastY-t.clientY)/Math.max(1,now-lastT))+0.2*vel;lastY=t.clientY;lastT=now;m.scrollTop=s0+(y0-t.clientY);},{passive:false});
  m.addEventListener("touchend",e=>{e.stopPropagation();if(!moved)return;e.preventDefault();let v=vel*16;const step=()=>{if(Math.abs(v)<0.3)return;m.scrollTop+=v;v*=0.95;anim=requestAnimationFrame(step);};step();},{passive:false});
  // a drag must not fire the button under the finger; a clean tap still does
  m.addEventListener("click",e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false;}},true);
  m.addEventListener("wheel",e=>{e.stopPropagation();},{passive:true});
})();
