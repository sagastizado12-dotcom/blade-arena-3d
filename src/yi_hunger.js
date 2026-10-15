// ===== HUNGER: HUD bar, sprint/swim drain, low-hunger penalties =====
function hungerBar(){const bars=document.getElementById("bars");if(!bars||document.getElementById("hgFill"))return;const d=document.createElement("div");d.className="hg";d.innerHTML=`<span class="hgi">🍖</span><div class="hgb"><i id="hgFill"></i></div><span class="num" id="hgNum"></span>`;bars.appendChild(d);}
{const st=document.createElement("style");st.textContent=`#bars .hg{display:flex;align-items:center;gap:4px;margin-top:3px;height:10px}#bars .hgi{font-size:9px;line-height:10px}
#bars .hgb{flex:1;height:7px;background:#2a1a10;border:1px solid #c8a060;border-radius:4px;overflow:hidden}#hgFill{display:block;height:100%;background:linear-gradient(#f0b050,#c07020);width:80%}
#bars .hg .num{position:static;font-size:8px;color:#fff;min-width:22px;text-align:right}#bars .hg.low .hgb{border-color:#ff5050;animation:hgBlink 1s infinite}@keyframes hgBlink{50%{background:#6a1010}}`;document.head.appendChild(st);}
const _buildHUDH=buildHUD;buildHUD=function(){_buildHUDH();hungerBar();layoutHUD();};
let hungerWarned=false;
const _updH=update;update=function(){if(!hero||!P||state!=="play")return _updH();const s0=hero.stam,m0=P.mag?P.mag.mp:0;_updH();
  if(hero.sprinting)P.hunger=Math.max(0,P.hunger-(hero.swim?0.003:0.002));else if(hero.swim)P.hunger=Math.max(0,P.hunger-0.001);
  if(P.hunger<25){if(hero.stam>s0&&!hero.sprinting)hero.stam=s0+(hero.stam-s0)*0.4;if(P.mag&&P.mag.mp>m0&&P.mag.mp-m0<2)P.mag.mp=m0+(P.mag.mp-m0)*0.4;
    if(!hungerWarned){hungerWarned=true;toast("You're getting hungry — eat something from your bag.");}}else hungerWarned=false;
  if(frameN%15===0){hungerBar();const f=document.getElementById("hgFill");if(f){f.style.width=Math.round(P.hunger)+"%";document.getElementById("hgNum").textContent=Math.round(P.hunger);f.parentNode.parentNode.classList.toggle("low",P.hunger<25);}}};
const _sleepH=sleep;sleep=function(b){P.hunger=Math.max(0,(P.hunger||0)-8);return _sleepH(b);};
