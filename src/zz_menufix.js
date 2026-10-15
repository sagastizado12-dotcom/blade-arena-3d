// ===== Menus: never show a button twice; Pause menu organized into sections =====
const PAUSE_SECTIONS=[["Game",/^(Resume|Map|Quest Log|Bag|Spells|Sound)\b|Journal/],["People",/Friends|Family|Kingdoms|Odd jobs/],["Reputation",/amends|Restore Reputation/],["Settings",/^(Profanity|Blood)|Export Save|Import Save/]];
(function(){const st=document.createElement("style");st.textContent=`#menu.pausegrid .mbtns{display:block}#menu.pausegrid .psec{margin:4px 0 8px}#menu.pausegrid .psec h4{margin:2px 0 4px;font:700 12px system-ui;color:#e8c060;letter-spacing:.06em;text-transform:uppercase}
#menu.pausegrid .pgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}#menu.pausegrid .pgrid button{width:100%;margin:0}`;document.head.appendChild(st);})();
{const _sm=showMenu;showMenu=function(t,x,b){if(Array.isArray(b)&&/Paused|Guild|Satchel|Bag|Home|House|Cabin|Friends|Family|amends/i.test(t)){const seen=new Set();b=b.filter(o=>{const k=(o&&o.l||"").replace(/\s+/g," ").trim();if(seen.has(k))return false;seen.add(k);return true;});}
  const r=_sm.call(this,t,x,b);menuEl.classList.toggle("pausegrid",t==="Paused");
  if(t==="Paused"){const wrap=menuEl.querySelector(".mbtns");const btns=[...wrap.children];const groups=PAUSE_SECTIONS.map(([n])=>({n,l:[]})).concat([{n:"More",l:[]}]);
    for(const e of btns){const i=PAUSE_SECTIONS.findIndex(([,re])=>re.test(e.textContent.trim()));groups[i<0?groups.length-1:i].l.push(e);}
    wrap.innerHTML="";for(const g of groups){if(!g.l.length)continue;const s=document.createElement("div");s.className="psec";s.innerHTML=`<h4>${g.n}</h4>`;const gr=document.createElement("div");gr.className="pgrid";g.l.forEach(e=>gr.appendChild(e));s.appendChild(gr);wrap.appendChild(s);}}
  return r;};}
