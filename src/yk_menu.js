// ===== MENU SHELL: visualViewport sizing, pinned header with X, backdrop/Escape close, safe bottom padding =====
{const st=document.createElement("style");st.textContent=`
#menu{top:calc(var(--vvt,0px) + var(--vvh,100dvh)/2)!important;max-height:calc(var(--vvh,100dvh) - 20px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;padding-top:0!important;padding-bottom:0!important}
#menu .mhead{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;margin:0 -14px 6px;padding:10px 10px 8px 14px;background:linear-gradient(#3a1a2e,#2e1426);border-bottom:1px solid #e8c06066}
#menu .mhead h2{flex:1;margin:0!important}
#menu .mclose{flex:none;width:44px;height:44px;border-radius:50%;border:2px solid #e8c060;background:#5a2030;color:#ffe8b0;font:bold 22px system-ui;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer}
#menu .mpad{height:calc(env(safe-area-inset-bottom) + 80px)}
#mback{position:fixed;inset:0;z-index:29;background:#0006;display:none}#mback.on{display:block}`;document.head.appendChild(st);}
function syncVV(){const v=window.visualViewport;const h=v?v.height:innerHeight,t=v?v.offsetTop:0;document.documentElement.style.setProperty("--vvh",h+"px");document.documentElement.style.setProperty("--vvt",t+"px");}
syncVV();addEventListener("resize",syncVV);if(window.visualViewport){visualViewport.addEventListener("resize",syncVV);visualViewport.addEventListener("scroll",syncVV);}
const mback=document.createElement("div");mback.id="mback";document.body.appendChild(mback);
mback.addEventListener("click",e=>{e.stopPropagation();closeMenu();});mback.addEventListener("touchend",e=>{e.preventDefault();e.stopPropagation();closeMenu();},{passive:false});
function menuChrome(){const m=menuEl;const h=m.querySelector(":scope > h2");if(h&&!m.querySelector(".mhead")){const hd=document.createElement("div");hd.className="mhead";m.insertBefore(hd,h);hd.appendChild(h);
    const x=document.createElement("button");x.className="mclose";x.type="button";x.setAttribute("aria-label","Close");x.textContent="✕";x.addEventListener("click",e=>{e.stopPropagation();closeMenu();});hd.appendChild(x);}
  if(!m.querySelector(".mpad")){const p=document.createElement("div");p.className="mpad";m.appendChild(p);}else if(m.lastElementChild!==m.querySelector(".mpad"))m.appendChild(m.querySelector(".mpad"));}
new MutationObserver(()=>{const open=!menuEl.classList.contains("hidden")&&menuEl.childElementCount>0;mback.classList.toggle("on",open);if(open)menuChrome();}).observe(menuEl,{childList:true,attributes:true,attributeFilter:["class"]});
