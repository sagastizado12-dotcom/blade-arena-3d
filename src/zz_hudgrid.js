// ===== v23 portrait HUD grid: no overlaps. Top: [buttons | minimap] / HP|LV|MP / XP / hunger / [date+gold | MAP BAG ...]; toasts inside game window top; bottom: dpad | sprint | spell arc | sword =====
(function(){const st=document.createElement("style");st.textContent=`
body.portrait #bars .row{gap:6px}body.portrait #bars .lv{margin:0!important;flex:0 0 auto}
body.portrait #bars .xp{margin:5px 0 0!important;width:100%!important;left:0!important}
body.portrait #bars .hg{margin-top:5px!important;height:12px!important}body.portrait #bars .hg .num{min-width:24px}
body.portrait #hrowP{position:fixed;z-index:22;display:flex;gap:6px;pointer-events:auto}
body.portrait #hudL{width:auto!important;max-width:55vw}body.portrait #hudL #clock,body.portrait #hudL #gold{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.portrait #toasts{position:fixed!important;transform:none!important;z-index:23;pointer-events:none;align-items:center;gap:3px}
body.portrait #toasts div{max-width:100%;box-sizing:border-box;white-space:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:15px;max-height:38px;text-align:center}
body.portrait #toasts div:nth-last-child(n+3){display:none}
body.portrait #miniz{position:static!important;left:auto!important;top:auto!important;width:22px;height:22px;flex:0 0 22px}
`;document.head.appendChild(st);})();
{const _lh=layoutHUD;layoutHUD=function(K){const r=_lh.apply(this,arguments);try{if(isPortrait())hudGrid();else hudLand();}catch(e){console.warn(e);}return r;};}
let hrowHome=null;
function hrowEl(){const b=document.getElementById("btnMap");return b&&b.parentElement;}
function hudLand(){const mz=document.getElementById("miniz");if(mz&&mz.parentElement&&mz.parentElement.id==="hrowP")document.body.appendChild(mz);const hr=hrowEl();if(hr&&hr.id==="hrowP"&&hrowHome){hr.id="";hr.removeAttribute("style");hrowHome.appendChild(hr);}const t=document.getElementById("toasts");if(t){t.removeAttribute("style");let y=0;for(const id of ["tl","bars","hudL"]){const e=document.getElementById(id);if(!e)continue;const r=e.getBoundingClientRect();if(r.height&&r.top<innerHeight/2)y=Math.max(y,r.bottom);}
    const o=(t.offsetParent||document.body).getBoundingClientRect();t.style.top=(y+6-o.top)+"px";}
  const m=document.getElementById("mini"),z=document.getElementById("miniz");if(m&&z){const r=m.getBoundingClientRect();z.style.setProperty("left",(r.left-28)+"px","important");z.style.setProperty("top",r.top+"px","important");}}
function hudGrid(){const A=document.getElementById("btnA"),bars=document.getElementById("bars");if(!A||!bars)return;
  const vw=innerWidth,vh=innerHeight,I=safeInsets(),M=10,G=8,px=v=>Math.round(v)+"px";const u=Math.min(1.1,Math.max(0.86,vw/400));
  const put=(el,x,y,w,h)=>{if(!el)return;for(const [k,v] of [["left",x],["top",y],["width",w],["height",h]])el.style.setProperty(k,px(v),"important");el.style.setProperty("right","auto","important");el.style.setProperty("bottom","auto","important");};
  const zr=el=>{const o=(el.offsetParent||document.body).getBoundingClientRect();return{ox:-o.left,oy:-o.top};};
  // row 1: buttons left, minimap right
  const y1=I.t+8,tl=document.getElementById("tl"),tb=Math.round(34*u);const mini=document.getElementById("mini"),hr=document.getElementById("hudR");
  const mw=Math.round(Math.min(104*u,vw*0.27)),mh=Math.round(mw*0.7);mini.style.width=px(mw);mini.style.height=px(mh);
  hr.style.setProperty("top",px(y1),"important");hr.style.setProperty("right",px(I.r+M),"important");hr.style.setProperty("left","auto","important");
  const nb=tl.children.length,avail=vw-I.l-I.r-2*M-mw-G;const gap=Math.max(4,Math.min(7,(avail-nb*tb)/(nb-1)));const tb2=Math.min(tb,Math.floor((avail-(nb-1)*gap)/nb));
  tl.style.top=px(y1);tl.style.left=px(I.l+M);tl.style.gap=px(gap);for(const b of tl.children){b.style.width=b.style.height=px(tb2);b.style.fontSize=px(tb2*0.3);}
  // move MAP/BAG row out of hudR so it can sit in row 5
  let row=hrowEl();if(row&&row.id!=="hrowP"){hrowHome=row.parentElement;row.id="hrowP";document.body.appendChild(row);}
  const mz=document.getElementById("miniz");if(mz&&mz.parentElement!==row)row.appendChild(mz);
  const r1b=Math.max(y1+tb2,y1+mh);
  // rows 2-4: bars full width
  const bw=vw-I.l-I.r-2*M;put(bars,I.l+M,r1b+8,bw,bars.getBoundingClientRect().height);bars.style.setProperty("height","auto","important");
  const bb=bars.getBoundingClientRect().bottom;
  // row 5: date/gold left, buttons right
  const hl=document.getElementById("hudL");const rw=row.getBoundingClientRect().width;row.style.top=px(bb+8);row.style.left=px(vw-I.r-M-rw);
  if(hl){const {ox,oy}=zr(hl);hl.style.setProperty("top",px(bb+6+oy),"important");hl.style.setProperty("left",px(I.l+M+ox),"important");hl.style.setProperty("max-width",px(vw-I.l-I.r-2*M-rw-G),"important");}
  const bf=document.getElementById("buffs");let topH=Math.ceil(Math.max(row.getBoundingClientRect().bottom,hl?hl.getBoundingClientRect().bottom:0))+6;
  if(bf&&bf.textContent){bf.style.left=px(I.l+M);bf.style.top=px(topH-2);topH+=18;}
  // bottom cluster geometry
  const S=Math.round(64*u),s=Math.round(42*u),d=Math.round(40*u);const R=Math.ceil((s+4)/0.366);// adjacent spell boxes on the 30° arc never overlap
  const clusterH=R+s/2+S/2;const needBot=Math.ceil(clusterH+2*M+I.b+4);
  let ch=Math.max(140,Math.min(Math.round(vw*0.95),vh-topH-needBot));const cw=vw-I.l-I.r;
  portraitBox={x:I.l,y:topH,w:cw,h:ch};fit();
  for(const [id,x,y,w,h] of [["ptop",0,0,vw,topH],["pbot",0,topH+ch,vw,vh-topH-ch],["pframe",I.l-2,topH-2,cw+4,ch+4]]){const e=document.getElementById(id);if(e)put(e,x,y,w,h);}
  // toasts: inside the game window, top
  const t=document.getElementById("toasts");if(t){const {ox,oy}=zr(t);t.style.left=px(I.l+M+ox);t.style.top=px(topH+6+oy);t.style.width=px(cw-2*M);}
  // bottom: sword bottom-right, 4 spells on a quarter arc, sprint left of arc, dpad far left
  const cb=topH+ch+4,panelH=vh-I.b-cb;const cx=vw-I.r-M-S/2;const cy=Math.min(vh-I.b-M-S/2,cb+(panelH-clusterH)/2+R+s/2);
  put(A,cx-S/2,cy-S/2,S,S);A.style.fontSize=px(S*0.4);
  [180,150,120,90].forEach((ang,i)=>{const b=document.getElementById("sp_"+SPELL_ORDER[i]);if(!b)return;const a=ang*Math.PI/180;put(b,cx+Math.cos(a)*R-s/2,cy-Math.sin(a)*R-s/2,s,s);b.style.fontSize=px(s*0.42);});
  const B=document.getElementById("btnB");const sx=cx-R-s/2-G-d,sy=cy+S/2-d;put(B,sx,sy,d,d);B.style.fontSize=px(d*0.45);
  const base=document.getElementById("stickBase"),knob=document.getElementById("stickKnob");let dp=Math.min(Math.round(110*u),sx-G-(I.l+M),panelH-2*M);
  const {ox,oy}=zr(base);const bxx=I.l+M,byy=Math.min(cy+S/2-dp,vh-I.b-M-dp);put(base,bxx+ox,byy+oy,dp,dp);const kn=Math.round(dp*0.36);put(knob,bxx+ox+dp/2-kn/2,byy+oy+dp/2-kn/2,kn,kn);}
window.__hudGrid=()=>hudGrid();
