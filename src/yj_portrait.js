// ===== PORTRAIT "handheld" layout: top panel (status), centered game window, bottom panel (controls) =====
const isPortrait=()=>innerHeight>innerWidth;
let portraitBox=null;
const _fitP=fit;fit=function(){if(!isPortrait()||!portraitBox){canvas.style.top="0px";return _fitP();}
  const b=portraitBox;H=240;W=Math.max(300,Math.round(H*b.w/b.h));if(canvas.width!==W*RS||canvas.height!==H*RS){canvas.width=W*RS;canvas.height=H*RS;}
  canvas.style.left=b.x+"px";canvas.style.top=b.y+"px";canvas.style.width=b.w+"px";canvas.style.height=b.h+"px";ctx.imageSmoothingEnabled=false;};
function ensureFrames(){for(const id of ["ptop","pbot","pframe"])if(!document.getElementById(id)){const d=document.createElement("div");d.id=id;document.body.appendChild(d);}
  if(!document.getElementById("pstyle")){const st=document.createElement("style");st.id="pstyle";st.textContent=`#ptop,#pbot,#pframe{position:fixed;display:none;pointer-events:none}
body.portrait #ptop,body.portrait #pbot,body.portrait #pframe{display:block}
#ptop,#pbot{z-index:1;background:radial-gradient(ellipse at 50% 0%,#2a1c2a,#120a12 70%),#120a12;}
#ptop{background:linear-gradient(#1e1420,#140c14)}#pbot{background:linear-gradient(#140c14,#1e1420)}
#pframe{z-index:2;border:2px solid #c8a050;border-radius:3px;box-shadow:0 0 0 1px #3a2008,0 0 14px #000c,inset 0 0 0 1px #ffe08a55}
body.portrait #game{z-index:1;position:fixed!important;transform:none!important}`;document.head.appendChild(st);}}
const _layoutP=layoutHUD;layoutHUD=function(K){ensureFrames();const P_=isPortrait();document.body.classList.toggle("portrait",P_);
  if(!P_){if(portraitBox){portraitBox=null;canvas.style.left="0px";canvas.style.top="0px";fit();}return _layoutP(K);}
  K=K||1;const A=document.getElementById("btnA");if(!A||!document.getElementById("bars"))return;const vw=innerWidth,vh=innerHeight,I=safeInsets(),G=10,M=10;
  const u=clamp(vw/400,0.86,1.1)*K;const px=v=>Math.round(v)+"px";const put=(el,x,y,w,h)=>{el.style.left=px(x);el.style.top=px(y);el.style.right="auto";el.style.bottom="auto";el.style.width=px(w);el.style.height=px(h);};
  // --- top panel
  const tb=Math.round(36*u);const tl=document.getElementById("tl");tl.style.top=px(I.t+M);tl.style.left=px(I.l+M);tl.style.gap=px(7);for(const b of tl.children){b.style.width=b.style.height=px(tb);b.style.fontSize=px(tb*0.3);}
  const hr=document.getElementById("hudR");hr.style.top=px(I.t+M);hr.style.right=px(I.r+M);const mini=document.getElementById("mini");const mw=Math.round(Math.min(108*u,vw*0.3));mini.style.width=px(mw);mini.style.height=px(mw*0.75);
  const hrR=hr.getBoundingClientRect();const tlR=tl.getBoundingClientRect();
  const bars=document.getElementById("bars");const bx0=I.l+M,bw=Math.max(150,hrR.left-G-bx0);bars.style.left=px(bx0);bars.style.width=px(bw);bars.style.top=px(tlR.bottom+8);bars.style.bottom="auto";bars.style.right="auto";bars.style.transform="none";
  const hl=document.getElementById("hudL");const bb=bars.getBoundingClientRect().bottom;if(hl){hl.style.setProperty("top",px(bb+5),"important");hl.style.setProperty("left",px(I.l+M),"important");}
  const hlb=hl?hl.getBoundingClientRect().bottom:bb;const bf=document.getElementById("buffs");
  const topH=Math.ceil(Math.max(hlb,hrR.bottom,bb)+(bf&&bf.textContent?20:8));
  // --- game window (16:10, shrinks if the control panel needs room)
  const S=Math.round(70*u),s=Math.round(44*u),d=Math.round(42*u);const sep=0.366;const Rr=Math.max(S/2+G+s/2,(s+G)/sep);
  const needBot=Math.ceil(Rr+s/2+S/2+2*M+I.b+6);let ch=Math.round(vw*(vh/vw>2?3/4:10/16));ch=Math.max(150,Math.min(ch,vh-topH-needBot));
  const cw=vw-I.l-I.r;portraitBox={x:I.l,y:topH,w:cw,h:ch};fit();
  for(const [id,x,y,w,h] of [["ptop",0,0,vw,topH],["pbot",0,topH+ch,vw,vh-topH-ch],["pframe",I.l-2,topH-2,cw+4,ch+4]]){const e=document.getElementById(id);put(e,x,y,w,h);}
  // --- bottom panel: sword bottom-right, even arc of 4 spells, sprint left of the arc, joystick bottom-left
  const cb=topH+ch+2,panelH=vh-I.b-cb;const cyMax=vh-I.b-M-S/2;const clusterH=Rr+s/2+S/2;let cy=Math.min(cyMax,cb+(panelH-clusterH)/2+Rr+s/2);const cx=vw-I.r-M-S/2;
  put(A,cx-S/2,cy-S/2,S,S);A.style.fontSize=px(S*0.4);let leftX=cx-S/2;
  [180,150,120,90].forEach((ang,i)=>{const b=document.getElementById("sp_"+SPELL_ORDER[i]);if(!b)return;const a=ang*Math.PI/180;const x=cx+Math.cos(a)*Rr,y=cy-Math.sin(a)*Rr;put(b,x-s/2,y-s/2,s,s);b.style.fontSize=px(s*0.42);leftX=Math.min(leftX,x-s/2);});
  if(cy-Rr-s/2<cb+4&&K>0.6)return layoutHUD(K*0.92);
  const B=document.getElementById("btnB");const sx=leftX-G-d,sy=cy+S/2-d;put(B,sx,sy,d,d);B.style.fontSize=px(d*0.45);
  let dp=Math.round(108*u);dp=Math.min(dp,sx-G-(I.l+M));if(dp<70&&K>0.6)return layoutHUD(K*0.92);
  const base=document.getElementById("stickBase"),knob=document.getElementById("stickKnob");const zr=(base.offsetParent||document.body).getBoundingClientRect();const ox=-zr.left,oy=-zr.top;
  const bxx=I.l+M,byy=Math.min(cy+S/2-dp,vh-I.b-M-dp);
  for(const [k,v] of [["left",bxx+ox],["top",byy+oy],["width",dp],["height",dp]])base.style.setProperty(k,px(v),"important");base.style.setProperty("bottom","auto","important");
  const kn=Math.round(dp*0.36);for(const [k,v] of [["left",bxx+ox+dp/2-kn/2],["top",byy+oy+dp/2-kn/2],["width",kn],["height",kn]])knob.style.setProperty(k,px(v),"important");knob.style.setProperty("bottom","auto","important");
  if(bf&&hl){bf.style.left=px(I.l+M);bf.style.top=px(hlb+2);}};
