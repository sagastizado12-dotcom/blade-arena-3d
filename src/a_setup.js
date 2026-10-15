"use strict";
const TILE=16, RS=2;
let H=240, W=400;
const canvas=document.getElementById("game");
let ctx=canvas.getContext("2d");
function fit(){
  const de=document.documentElement;const vw=de.clientWidth||window.innerWidth, vh=de.clientHeight||window.innerHeight;
  // logical view: ~240px on the short side (zoomed so the world fills the whole screen, no letterboxing)
  const k=Math.max(1,Math.min(vw,vh)/(vw<vh?220:240));W=Math.round(vw/k);H=Math.round(vh/k);
  if(canvas.width!==W*RS||canvas.height!==H*RS){canvas.width=W*RS;canvas.height=H*RS;}
  canvas.style.width=vw+"px";canvas.style.height=vh+"px";
  ctx.imageSmoothingEnabled=false;
}
fit();
window.addEventListener("resize",()=>fit());if(window.visualViewport)visualViewport.addEventListener("resize",()=>fit());
window.addEventListener("orientationchange",()=>setTimeout(()=>fit(),150));

let bloodOn=localStorage.getItem("bladeArenaBlood")!=="0";
const bloodBtn=document.getElementById("bloodToggle");
function updateBloodBtn(){bloodBtn.textContent=bloodOn?"BLOOD: ON":"BLOOD: OFF";bloodBtn.className="hbtn"+(bloodOn?" on":"");}
updateBloodBtn();
bloodBtn.addEventListener("click",e=>{e.stopPropagation();bloodOn=!bloodOn;localStorage.setItem("bladeArenaBlood",bloodOn?"1":"0");updateBloodBtn();});

const keys={},latch={};
window.addEventListener("keydown",e=>{
  keys[e.code]=true;if(!e.repeat)latch[e.code]=true;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();
  if(e.code==="KeyM"&&state==="play")toggleMap();
  if(e.code==="KeyE"&&state==="play")eatFood();
  if(e.code==="Escape")closeMenu();
});
window.addEventListener("keyup",e=>{keys[e.code]=false});
const touch={active:false,sx:0,sy:0,dx:0,dy:0,id:null,a:false,b:false,aId:null,bId:null};
const isTouch=("ontouchstart" in window)||navigator.maxTouchPoints>0;
if(isTouch)document.getElementById("touch").classList.add("show");
const stickKnob=document.getElementById("stickKnob"),stickBase=document.getElementById("stickBase"),stickZone=document.getElementById("stickZone");
const btnA=document.getElementById("btnA"),btnB=document.getElementById("btnB");
const RMAX=36;
function setKnob(dx,dy){const len=Math.hypot(dx,dy)||1;const c=Math.min(len,RMAX)/len;stickKnob.style.transform=`translate(${dx*c}px,${dy*c}px)`;}
stickZone.addEventListener("touchstart",e=>{e.preventDefault();const t=e.changedTouches[0];touch.active=true;touch.id=t.identifier;const r=stickBase.getBoundingClientRect();touch.sx=r.left+r.width/2;touch.sy=r.top+r.height/2;touch.dx=t.clientX-touch.sx;touch.dy=t.clientY-touch.sy;setKnob(touch.dx,touch.dy);},{passive:false});
stickZone.addEventListener("touchmove",e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===touch.id){touch.dx=t.clientX-touch.sx;touch.dy=t.clientY-touch.sy;setKnob(touch.dx,touch.dy);}},{passive:false});
function endStick(e){for(const t of e.changedTouches)if(t.identifier===touch.id){touch.active=false;touch.id=null;touch.dx=0;touch.dy=0;setKnob(0,0);}}
stickZone.addEventListener("touchend",endStick);stickZone.addEventListener("touchcancel",endStick);
btnA.addEventListener("touchstart",e=>{e.preventDefault();touch.a=true;btnA.classList.add("active");touch.aId=e.changedTouches[0].identifier},{passive:false});
btnB.addEventListener("touchstart",e=>{e.preventDefault();touch.b=true;btnB.classList.add("active");touch.bId=e.changedTouches[0].identifier},{passive:false});
function endBtn(e){for(const t of e.changedTouches){if(t.identifier===touch.aId){touch.a=false;btnA.classList.remove("active");touch.aId=null}if(t.identifier===touch.bId){touch.b=false;btnB.classList.remove("active");touch.bId=null}}}
window.addEventListener("touchend",endBtn);window.addEventListener("touchcancel",endBtn);
document.body.addEventListener("gesturestart",e=>e.preventDefault());

// painterly post-process for pixel sprites: soft top light + dark outline
function paintPass(img){
  const {w,h,data}=img, src=new Uint8ClampedArray(data);
  const A=(x,y)=>x<0||y<0||x>=w||y>=h?0:src[(y*w+x)*4+3];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;
    if(src[i+3]){
      const f=1.18-0.36*(y/h)+(A(x,y-1)?0:0.12)-(A(x+1,y)?0:0.08);
      data[i]=Math.min(255,src[i]*f*1.05);data[i+1]=Math.min(255,src[i+1]*f);data[i+2]=Math.min(255,src[i+2]*f*1.08);
    } else if(A(x-1,y)||A(x+1,y)||A(x,y-1)||A(x,y+1)){
      data[i]=34;data[i+1]=18;data[i+2]=30;data[i+3]=200;
    }
  }
}
function mkCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c;}
let rs=1;
function rnd(){rs|=0;rs=rs+0x6D2B79F5|0;let t=Math.imul(rs^rs>>>15,1|rs);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
function hash2(x,y,s){let h=(x*374761393+y*668265263+s*1442695041)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296;}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash2(xi,yi,s),b=hash2(xi+1,yi,s),c=hash2(xi,yi+1,s),d=hash2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y,s){return vnoise(x/32,y/32,s)*0.5+vnoise(x/16,y/16,s+1)*0.3+vnoise(x/6,y/6,s+2)*0.2;}
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
let state="title", particles=[], parts=[], projectiles=[], splats=[], shake=0, kills=0, score=0, hero;
