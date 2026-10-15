// ===== v21: PWA freshness (version check), save export/import, Continue, autosave, persistent storage, clean title =====
const BUILD_V="__BUILDV__";
// --- clean title screen: hide in-game HUD until playing ---
(function(){const st=document.createElement("style");st.textContent=`body.ontitle #tl,body.ontitle #bars,body.ontitle .rb,body.ontitle #touch,body.ontitle #miniz,body.ontitle #hudWrap,body.ontitle .sp4,body.ontitle #updToast2{display:none!important}
#saveio{position:fixed;inset:0;z-index:200;background:rgba(8,4,14,.94);display:flex;align-items:center;justify-content:center;padding:16px}#saveio .box{background:#2a1838;border:2px solid #e8c060;border-radius:12px;max-width:520px;width:100%;padding:14px;color:#ffe6c0;font:15px system-ui}
#saveio h3{margin:0 0 8px;color:#ffd870}#saveio textarea{width:100%;height:120px;box-sizing:border-box;font:11px monospace;background:#120a1a;color:#e8e0ff;border:1px solid #a08040;border-radius:6px}
#saveio .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}#saveio button,#saveio label.btn2{background:#4a2a5a;color:#ffe6a8;border:1px solid #e8c060;border-radius:8px;padding:9px 12px;font:700 14px system-ui;cursor:pointer}
.titleSave{margin-top:10px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.titleSave button{background:#3a2448;color:#ffe6a8;border:1px solid #c8a050;border-radius:8px;padding:8px 12px;font:700 13px system-ui}`;document.head.appendChild(st);
  const upd=()=>document.body.classList.toggle("ontitle",state!=="play");upd();setInterval(upd,250);
  // touch devices get touch hints instead of keyboard hints
  const sub=document.querySelector("#overlay .sub");if(sub&&(("ontouchstart" in window)||navigator.maxTouchPoints>0))sub.innerHTML=sub.innerHTML.replace(/Move WASD[^<]*/,"Joystick to move · 🗡 sword/talk · 🏃 sprint · hold a spell to charge · tap the minimap for the world map");})();
// --- save code helpers ---
const hasSave=()=>!!localStorage.getItem(SAVEKEY);
function saveCode(){saveGame&&state==="play"&&saveGame();const raw=localStorage.getItem(SAVEKEY);if(!raw)return"";return"BR1:"+btoa(unescape(encodeURIComponent(raw)));}
function parseSave(txt){txt=(txt||"").trim();let raw=txt;if(/^BR1:/.test(txt))raw=decodeURIComponent(escape(atob(txt.slice(4).replace(/\s+/g,""))));const d=JSON.parse(raw);if(!d||typeof d!=="object"||!(d.hero||d.P||d.world||d.p))throw new Error("Not a Blade Realm save");return raw;}
function closeSaveIO(){const d=document.getElementById("saveio");if(d)d.remove();}
function saveIO(mode){closeSaveIO();const d=document.createElement("div");d.id="saveio";const code=mode==="export"?saveCode():"";
  d.innerHTML=mode==="export"?`<div class="box"><h3>💾 Export Save</h3><div>${code?"Copy this code (or download the file) and import it on your other device / Home Screen app.":"No save yet."}</div><textarea id="sioText" readonly>${code}</textarea>
    <div class="row"><button id="sioCopy">📋 Copy code</button><button id="sioSel">🔤 Select all</button>${navigator.share?'<button id="sioShare">📤 Share</button>':""}<button id="sioFile">⬇ Download file</button><button id="sioClose">Close</button></div><div id="sioMsg" style="margin-top:6px;color:#9cf"></div></div>`
   :`<div class="box"><h3>📥 Import Save</h3><div>Paste a save code, or choose a save file. This replaces the save on this device.</div><textarea id="sioText" placeholder="BR1:..."></textarea>
    <div class="row"><button id="sioPaste">📋 Paste</button><label class="btn2">📂 Choose file<input id="sioFileIn" type="file" accept=".json,.txt,application/json,text/plain" style="display:none"></label><button id="sioGo">✔ Import</button><button id="sioClose">Cancel</button></div><div id="sioMsg" style="margin-top:6px;color:#9cf"></div></div>`;
  document.body.appendChild(d);const $=id=>document.getElementById(id),msg=t=>{$("sioMsg").textContent=t;};$("sioClose").onclick=closeSaveIO;
  if(mode==="export"){const ta=$("sioText");const selAll=()=>{try{ta.removeAttribute("readonly");ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);ta.setAttribute("readonly","");}catch(_){}};ta.addEventListener("focus",selAll);ta.addEventListener("click",selAll);$("sioSel").onclick=()=>{selAll();msg("Selected. Long-press the text and choose Copy.");};
    if($("sioShare"))$("sioShare").onclick=async()=>{try{await navigator.share({title:"Blade Realm save",text:code});msg("Shared.");}catch(_){msg("Share cancelled. Use Select all + Copy instead.");}};$("sioCopy").onclick=async()=>{const t=$("sioText");t.select();try{await navigator.clipboard.writeText(t.value);msg("Copied!");}catch(_){try{document.execCommand("copy");msg("Copied!");}catch(__){selAll();msg("Copy blocked here. The code is selected: long-press it and choose Copy.");}}};
    $("sioFile").onclick=()=>{const b=new Blob([code],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="blade-realm-save.txt";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);msg("If no file appeared (in-app browsers often block downloads), use Copy, Select all or Share instead.");};}
  else{$("sioPaste").onclick=async()=>{try{$("sioText").value=await navigator.clipboard.readText();}catch(_){msg("Long-press the box and choose Paste.");}};
    $("sioFileIn").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("sioText").value=String(r.result);msg("File loaded. Tap Import.");};r.readAsText(f);};
    $("sioGo").onclick=()=>{try{const raw=parseSave($("sioText").value);localStorage.setItem(SAVEKEY,raw);msg("Imported!");closeSaveIO();refreshContinue();if(loadGame()){if(state!=="play")beginPlay();toast("📥 Save imported.");}}catch(err){msg("That doesn't look like a valid save: "+err.message);}};}}
function refreshContinue(){const c=document.getElementById("contBtn");if(c)c.style.display=hasSave()?"inline-block":"none";const ex=document.getElementById("tsExport");if(ex)ex.style.display=hasSave()?"":"none";}
(function(){const ov=document.getElementById("overlay");if(!ov)return;const w=document.createElement("div");w.className="titleSave";w.innerHTML=`<button id="tsExport" type="button">💾 Export Save</button><button id="tsImport" type="button">📥 Import Save</button>`;ov.appendChild(w);
  document.getElementById("tsExport").onclick=e=>{e.stopPropagation();saveIO("export");};document.getElementById("tsImport").onclick=e=>{e.stopPropagation();saveIO("import");};refreshContinue();setInterval(refreshContinue,1500);})();
{const _sm=showMenu;showMenu=function(t,x,b){if(t==="Paused"&&Array.isArray(b)){b=b.slice();b.push({l:"💾 Export Save",f:()=>saveIO("export")},{l:"📥 Import Save",f:()=>saveIO("import")});}return _sm.call(this,t,x,b);};}
// --- autosave + persistent storage ---
setInterval(()=>{try{if(state==="play"&&hero&&!hero.dead)saveGame();}catch(_){}},45000);
addEventListener("pagehide",()=>{try{if(state==="play")saveGame();}catch(_){}});document.addEventListener("visibilitychange",()=>{try{if(document.hidden&&state==="play")saveGame();}catch(_){}});
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist().catch(()=>{});}catch(_){}
// --- version check: fetch version.json fresh; if newer, purge caches, update SW and reload once ---
async function versionCheck(){if(location.protocol==="file:"||!/^\d+$/.test(BUILD_V))return;try{const r=await fetch("version.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)return;const j=await r.json();
  if(j&&j.v&&+j.v>+BUILD_V){const k="brReloadFor"+j.v;if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1");try{if(state==="play")saveGame();}catch(_){}
    const to=(p,ms)=>Promise.race([p,new Promise(r=>setTimeout(r,ms))]);try{await to(caches.keys().then(ks=>Promise.all(ks.filter(x=>/^blade-realm/.test(x)).map(x=>caches.delete(x)))),1200);}catch(_){}try{const regs=await to(navigator.serviceWorker.getRegistrations(),1200)||[];await to(Promise.all(regs.map(g=>g.update().catch(()=>{}))),1500);}catch(_){}location.reload();}}catch(_){}}
// unregister stray service workers registered from another script path
if("serviceWorker" in navigator&&location.protocol!=="file:")navigator.serviceWorker.getRegistrations().then(rs=>{for(const r of rs){const u=(r.active||r.waiting||r.installing||{}).scriptURL||"";if(u&&!/\/sw\.js(\?|$)/.test(u))r.unregister();}}).catch(()=>{});
versionCheck();document.addEventListener("visibilitychange",()=>{if(!document.hidden)versionCheck();});
// --- legacy save migration (never deletes anything) + backups + new-game confirm ---
(function migrateLegacy(){try{if(localStorage.getItem(SAVEKEY))return;const c=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k===SAVEKEY||/_bak$/.test(k))continue;
  if(!/save/i.test(k)||!/realm|blade|arena|tenwinds/i.test(k))continue;try{const d=JSON.parse(localStorage.getItem(k));if(d&&d.world&&d.P)c.push({k,n:+(k.match(/(\d+)$/)||[0,0])[1],len:localStorage.getItem(k).length});}catch(_){}}
  if(!c.length){const b=localStorage.getItem(SAVEKEY+"_bak");if(b)localStorage.setItem(SAVEKEY,b);return;}c.sort((a,b)=>b.n-a.n||b.len-a.len);localStorage.setItem(SAVEKEY,localStorage.getItem(c[0].k));window.__migratedFrom=c[0].k;}catch(_){}})();
{const _sg=saveGame;saveGame=function(){try{const cur=localStorage.getItem(SAVEKEY);if(cur&&!saveGame._newLife)localStorage.setItem(SAVEKEY+"_bak",cur);}catch(_){}return _sg.apply(this,arguments);};}
(function(){const sb=document.getElementById("startBtn");if(!sb)return;sb.addEventListener("click",()=>{try{const cur=localStorage.getItem(SAVEKEY);if(cur)localStorage.setItem(SAVEKEY+"_prevlife",cur);}catch(_){}},true);})();
