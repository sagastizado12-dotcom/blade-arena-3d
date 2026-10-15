import * as THREE from './vendor/three.module.min.js';
import * as S from './sprites.js';
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
// ---------- renderer / scene ----------
const renderer=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color('#a8e4ff');scene.fog=new THREE.Fog('#c4ecff',30,75);
const cam=new THREE.PerspectiveCamera(40,1,0.1,200);
const CAMOFF=new THREE.Vector3(0,10,17);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h>1.6?42:52;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
scene.add(new THREE.HemisphereLight('#fff6e0','#5aa070',1.25));
const sun=new THREE.DirectionalLight('#fff2d0',1.6);sun.position.set(-14,24,10);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:80});sun.shadow.bias=-0.0008;sun.shadow.radius=4;
scene.add(sun,sun.target);
const M=c=>new THREE.MeshLambertMaterial({color:c});
const box=(w,h,d,c,x,y,z,cast=true)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='string'?M(c):c);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;scene.add(m);return m;};
// ---------- world ----------
const colliders=[];// {x,z,hw,hd} AABB or {x,z,r}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),M('#8fe0a0'));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
// grass tufts noise patches
for(let i=0;i<70;i++){const p=new THREE.Mesh(new THREE.CircleGeometry(rnd(1,3),10),M(Math.random()<.5?'#7fd492':'#a3e8a8'));p.rotation.x=-Math.PI/2;p.position.set(rnd(-40,40),0.01,rnd(-60,25));p.receiveShadow=true;scene.add(p);}
// dirt paths (slightly raised slabs with darker edges)
function path(x,z,w,d){box(w+0.4,0.06,d+0.4,'#c9a36a',x,0.03,z,false);box(w,0.1,d,'#e8c88e',x,0.05,z,false);}
path(0,0,4,30);path(0,-1,26,4);path(0,-22,4,16);path(-9,8,14,3);
// stone plaza
box(8,0.12,8,'#d8d2c0',0,0.06,-1,false);
// houses
function house(x,z,w,d,roof,wall){
  box(w+0.3,0.3,d+0.3,'#9a8a74',x,0.15,z);
  box(w,2.4,d,wall,x,1.5,z);
  for(let i=-1;i<=1;i+=2)box(0.25,2.6,0.25,'#6b4423',x+i*w/2,1.5,z+d/2);
  const sh=new THREE.Shape();sh.moveTo(-w/2-0.5,0);sh.lineTo(0,1.9);sh.lineTo(w/2+0.5,0);sh.lineTo(-w/2-0.5,0);
  const g=new THREE.ExtrudeGeometry(sh,{depth:d+0.9,bevelEnabled:false});const r=new THREE.Mesh(g,M(roof));r.position.set(x,2.7,z-d/2-0.45);r.castShadow=r.receiveShadow=true;scene.add(r);
  const ridge=box(0.3,0.3,d+1,'#ffffff',x,4.6,z);ridge.material=M('#e8f0d8');
  box(1.1,1.6,0.12,'#6b4423',x,1.1,z+d/2+0.04);box(0.9,0.7,0.1,'#bfe8ff',x-w/3,1.8,z+d/2+0.04);box(0.9,0.7,0.1,'#bfe8ff',x+w/3,1.8,z+d/2+0.04);
  box(0.4,1,0.4,'#b07050',x+w/4,4,z-0.4);// chimney
  colliders.push({x,z,hw:w/2+0.4,hd:d/2+0.4});
}
house(-8,-8,5,4,'#3fa860','#f2e6c8');house(8,-8,5,4,'#3f8fd0','#f6eedb');house(-10,10.5,4.5,3.5,'#d0603f','#efe2c2');
// fences
function fence(x1,z,len){for(let i=0;i<=len;i++)box(0.2,0.9,0.2,'#a87a4a',x1+i,0.45,z);box(len,0.12,0.1,'#c49260',x1+len/2,0.65,z);box(len,0.12,0.1,'#c49260',x1+len/2,0.35,z);}
fence(4,4,6);fence(-10,4,4);
// pond
const POND={x:9,z:7,r:4};
const rim=new THREE.Mesh(new THREE.CylinderGeometry(POND.r+0.5,POND.r+0.6,0.25,32),M('#cfc6ad'));rim.position.set(POND.x,0.12,POND.z);rim.receiveShadow=true;scene.add(rim);
const water=new THREE.Mesh(new THREE.CylinderGeometry(POND.r,POND.r,0.3,32),new THREE.MeshPhongMaterial({color:'#4fb6e8',shininess:90,specular:'#ffffff',transparent:true,opacity:.92}));water.position.set(POND.x,0.16,POND.z);scene.add(water);
colliders.push({x:POND.x,z:POND.z,r:POND.r+0.3});
for(let i=0;i<4;i++){const l=new THREE.Mesh(new THREE.CircleGeometry(0.45,10),M('#3fae5a'));l.rotation.x=-Math.PI/2;l.position.set(POND.x+rnd(-2.5,2.5),0.33,POND.z+rnd(-2.5,2.5));scene.add(l);}
const ripples=[];const ripMat=()=>new THREE.MeshBasicMaterial({color:'#e8f8ff',transparent:true,opacity:.8});
function ripple(x,z){const m=new THREE.Mesh(new THREE.RingGeometry(0.85,1,28),ripMat());m.rotation.x=-Math.PI/2;m.position.set(x,0.33,z);m.scale.setScalar(0.2);scene.add(m);ripples.push({m,t:0});}
// trees
const treeCols=['#3f9f4f','#4fb85a','#2f8a48'];
function tree(x,z,s=1,blossom=false){const t=new THREE.Mesh(new THREE.CylinderGeometry(0.25*s,0.35*s,1.6*s,7),M('#7a5232'));t.position.set(x,0.8*s,z);t.castShadow=true;scene.add(t);
  const col=blossom?'#ffb8d2':treeCols[(Math.random()*3)|0];
  for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry((1.3-k*0.25)*s,1),new THREE.MeshLambertMaterial({color:col,flatShading:true}));c.position.set(x+rnd(-.3,.3)*s,(2+k*0.8)*s,z+rnd(-.3,.3)*s);c.castShadow=true;c.receiveShadow=true;scene.add(c);}
  colliders.push({x,z,r:0.6*s});}
for(let x=-30;x<=30;x+=2.6){tree(x+rnd(-.6,.6),-46+rnd(-1,1),rnd(1,1.4));tree(x+rnd(-.6,.6),19+rnd(-1,1),rnd(1,1.3));}
for(let z=-44;z<=18;z+=2.6){tree(-28+rnd(-1,1),z,rnd(1,1.4));tree(28+rnd(-1,1),z,rnd(1,1.4));}
for(let i=0;i<14;i++){const x=rnd(-26,26),z=rnd(-44,17);if(Math.abs(x)<5||(Math.hypot(x,z+34)<12)||Math.hypot(x,z)<14)continue;tree(x,z,rnd(.9,1.3),Math.random()<.35);}
tree(-4,4,1,true);tree(4,-14,1,true);tree(-15,-2,1.1,true);
// flowers
const fl=new THREE.InstancedMesh(new THREE.SphereGeometry(0.12,6,4),new THREE.MeshLambertMaterial(),260);const dm=new THREE.Object3D();const fcols=['#fff','#ffd84a','#ff8fb8','#ff6a6a','#b7a0ff'];
for(let i=0;i<260;i++){dm.position.set(rnd(-26,26),0.12,rnd(-44,17));dm.updateMatrix();fl.setMatrixAt(i,dm.matrix);fl.setColorAt(i,new THREE.Color(fcols[i%5]));}scene.add(fl);
// tall grass patch
const TG={x:-12,z:-20,w:10,d:7};const tgN=420;
const tg=new THREE.InstancedMesh(new THREE.ConeGeometry(0.16,0.95,4),new THREE.MeshLambertMaterial({color:'#3fb85a',flatShading:true}),tgN);tg.castShadow=true;
const tgPos=[];for(let i=0;i<tgN;i++){tgPos.push([TG.x+rnd(-TG.w/2,TG.w/2),TG.z+rnd(-TG.d/2,TG.d/2),rnd(0,6),0]);tg.setColorAt(i,new THREE.Color().setHSL(.36,.55,rnd(.38,.5)));}scene.add(tg);
// boss arena: stone ring + ruined pillars
const ARENA={x:0,z:-34,r:9};
const ar=new THREE.Mesh(new THREE.CylinderGeometry(ARENA.r,ARENA.r+0.3,0.15,40),M('#cfc0a0'));ar.position.set(ARENA.x,0.07,ARENA.z);ar.receiveShadow=true;scene.add(ar);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;if(Math.abs(Math.sin(a)-1)<0.02||(a>1.3&&a<1.85))continue;const h=rnd(1.2,2.8);const x=ARENA.x+Math.cos(a)*(ARENA.r+0.6),z=ARENA.z+Math.sin(a)*(ARENA.r+0.6);box(0.9,h,0.9,'#a8a8b8',x,h/2,z);colliders.push({x,z,r:0.6});}
// petals
const PN=260;const pg=new THREE.BufferGeometry();const pp=new Float32Array(PN*3);for(let i=0;i<PN;i++){pp[i*3]=rnd(-30,30);pp[i*3+1]=rnd(0,10);pp[i*3+2]=rnd(-50,20);}pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
const petals=new THREE.Points(pg,new THREE.PointsMaterial({size:0.22,map:S.soft('#ffb0cc'),transparent:true,depthWrite:false,color:'#ffd0e0'}));scene.add(petals);
// ---------- entities ----------
const blobTex=S.blob();
function mkSprite(tex,w,h){const m=new THREE.SpriteMaterial({map:tex,transparent:true,alphaTest:.5});const s=new THREE.Sprite(m);s.center.set(.5,0);s.scale.set(w,h,1);scene.add(s);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.set(w*0.9,w*0.5,1);scene.add(sh);return{s,sh};}
const heroTex=[0,1,2].map(d=>[0,1].map(f=>S.hero(d,f)));
const DEF={
 slime:{hp:3,sp:2.2,dmg:1,w:1.1,h:1,tex:[S.slime(0),S.slime(1)],col:'#5fd0ff'},
 goblin:{hp:4,sp:3,dmg:1,w:1.2,h:1.65,tex:[S.goblin(0),S.goblin(1)],col:'#7cc04a'},
 bat:{hp:2,sp:3.8,dmg:1,w:1.3,h:.8,tex:[S.bat(0),S.bat(1)],col:'#7a4ab0',fly:1},
 wolf:{hp:5,sp:3.4,dmg:2,w:1.8,h:1.2,tex:[S.wolf(0),S.wolf(1)],col:'#8d96a8'},
 ogre:{hp:40,sp:2.2,dmg:2,w:3.4,h:3.8,tex:[S.ogre(0),S.ogre(1)],col:'#c8805a',boss:1}};
const partTex={};const getPart=(k,c)=>partTex[k+c]||(partTex[k+c]=S.part(k,c));
let hero,foes,parts,fx,decals,state='title',boss,shake=0;
let blood=localStorage.getItem('br3d_blood')!=='off';
function setBloodBtn(){$('bloodBtn').textContent='Blood: '+(blood?'On':'Off');}setBloodBtn();
$('bloodBtn').onclick=e=>{blood=!blood;localStorage.setItem('br3d_blood',blood?'on':'off');setBloodBtn();e.target.blur();};
// sword visual
const swordG=new THREE.Group();const blade=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,1.4),new THREE.MeshBasicMaterial({color:'#eef6ff'}));blade.position.z=1.05;swordG.add(blade);
const hilt=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.1,0.12),M('#d4a530'));hilt.position.z=0.35;swordG.add(hilt);
const arc=new THREE.Mesh(new THREE.RingGeometry(0.9,1.9,20,1,-Math.PI/3,Math.PI*2/3),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}));arc.rotation.x=-Math.PI/2;
swordG.visible=arc.visible=false;scene.add(swordG,arc);
const tele=new THREE.Mesh(new THREE.RingGeometry(0,1,32),new THREE.MeshBasicMaterial({color:'#ff3030',transparent:true,opacity:.35,depthWrite:false}));tele.rotation.x=-Math.PI/2;tele.visible=false;scene.add(tele);
function spawn(type,x,z){const d=DEF[type];const v=mkSprite(d.tex[0],d.w,d.h);const f={type,d,x,z,vx:0,vz:0,hp:d.hp,hit:0,t:rnd(0,3),cd:rnd(1,2),st:'idle',...v,y:0};foes.push(f);return f;}
function reset(){
  [...(foes||[]),...(parts||[]),...(fx||[]),...(decals||[])].forEach(o=>{if(o.s){scene.remove(o.s);scene.remove(o.sh)}if(o.m)scene.remove(o.m)});
  if(hero){scene.remove(hero.s,hero.sh)}
  hero={x:0,z:6,fx:0,fz:1,dir:0,hp:10,max:10,ifr:0,atk:0,dodge:0,dcd:0,kx:0,kz:0,anim:0,...mkSprite(heroTex[0][0],1.1,1.65)};
  foes=[];parts=[];fx=[];decals=[];
  [[-6,2],[6,3],[-3,-12],[12,-2]].forEach(p=>spawn('slime',...p));
  [[-12,-19],[-9,-21],[-14,-22]].forEach(p=>spawn('goblin',...p));
  [[14,-14],[-18,6],[16,10]].forEach(p=>spawn('bat',...p));
  [[18,-22],[-20,-12]].forEach(p=>spawn('wolf',...p));
  boss=spawn('ogre',ARENA.x,ARENA.z-2);boss.st='sleep';$('bossbar').style.display='none';
}
// ---------- input ----------
const keys={};let jx=0,jz=0,pressA=false,pressB=false;
addEventListener('keydown',e=>{keys[e.code]=1;if(['Space','KeyJ','KeyZ'].includes(e.code))pressA=true;if(['KeyK','KeyX','ShiftLeft','ShiftRight'].includes(e.code))pressB=true;if(e.code==='Enter'&&state!=='play')start();if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();});
addEventListener('keyup',e=>keys[e.code]=0);
const isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;if(isTouch)document.body.classList.add('touch');
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
const joy=$('joy'),knob=$('knob');let jid=null;
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);mvJoy(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)mvJoy(e)});
const endJoy=e=>{if(e.pointerId===jid){jid=null;jx=jz=0;knob.style.transform=''}};joy.addEventListener('pointerup',endJoy);joy.addEventListener('pointercancel',endJoy);
function mvJoy(e){const r=joy.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const l=Math.hypot(dx,dy),mx=45;if(l>mx){dx*=mx/l;dy*=mx/l}knob.style.transform=`translate(${dx}px,${dy}px)`;jx=dx/mx;jz=dy/mx;}
$('bA').addEventListener('pointerdown',()=>pressA=true);$('bB').addEventListener('pointerdown',()=>pressB=true);
// ---------- audio (tiny synth) ----------
let ac;function beep(f,d=.08,type='square',v=.05){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
// ---------- helpers ----------
function collide(o,rad){for(const c of colliders){if(c.r){const dx=o.x-c.x,dz=o.z-c.z,l=Math.hypot(dx,dz),m=c.r+rad;if(l<m&&l>0){o.x=c.x+dx/l*m;o.z=c.z+dz/l*m}}
  else{const dx=o.x-c.x,dz=o.z-c.z,ox=c.hw+rad-Math.abs(dx),oz=c.hd+rad-Math.abs(dz);if(ox>0&&oz>0){if(ox<oz)o.x+=Math.sign(dx)*ox;else o.z+=Math.sign(dz)*oz}}}
  o.x=Math.max(-27,Math.min(27,o.x));o.z=Math.max(-45,Math.min(18,o.z));}
function toast(t,ms=1800){const el=$('toast');el.textContent=t;el.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>el.style.opacity=0,ms);}
function particle(x,y,z,col,n,sp=4,life=.6,size=.14){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(size,size,size),new THREE.MeshBasicMaterial({color:col}));m.position.set(x,y,z);scene.add(m);fx.push({m,vx:rnd(-sp,sp),vy:rnd(1,sp*1.4),vz:rnd(-sp,sp),t:life*rnd(.6,1.2)})}}
function decal(x,z,r){const m=new THREE.Mesh(new THREE.CircleGeometry(r,10),new THREE.MeshBasicMaterial({color:'#9a1020',transparent:true,opacity:.75,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,0.14,z);scene.add(m);decals.push({m,t:12});}
function hurtFoe(f,dmg,kx,kz){if(f.hit>0||f.hp<=0)return;f.hp-=dmg;f.hit=.25;const kb=f.d.boss?3:10;f.vx=kx*kb;f.vz=kz*kb;shake=Math.max(shake,f.d.boss?.25:.12);beep(f.d.boss?110:220,.1,'sawtooth');
  if(blood)particle(f.x,f.y+f.d.h*.5,f.z,'#c0182a',f.d.boss?10:6,3);else particle(f.x,f.y+f.d.h*.5,f.z,'#fff6a0',5,3);
  if(f.st==='sleep')wake();
  if(f.hp<=0)kill(f,kx,kz);}
function kill(f,kx,kz){scene.remove(f.s,f.sh);beep(90,.25,'square',.06);
  if(blood){const n=f.d.boss?10:4;for(let i=0;i<n;i++){const k=i===0?0:(i%3===0?2:1);const v=mkSprite(getPart(k,f.d.col),f.d.boss?.9:.55,f.d.boss?.9:.55);
      parts.push({...v,x:f.x,z:f.z,y:f.d.h*.5,vx:kx*4+rnd(-4,4),vz:kz*4+rnd(-4,4),vy:rnd(4,8),t:8,trail:1});}
    particle(f.x,f.d.h*.4,f.z,'#c0182a',f.d.boss?40:16,5,.8);decal(f.x,f.z,f.d.boss?1.8:rnd(.5,.9));}
  else{particle(f.x,f.d.h*.4,f.z,'#ffffff',14,4,.6,.2);particle(f.x,f.d.h*.4,f.z,'#ffe066',8,4,.6,.12);}
  if(f.d.boss){$('bossbar').style.display='none';setTimeout(()=>end(true),1600);toast('The Ogre falls!');}
}
function wake(){if(boss.st!=='sleep')return;boss.st='chase';boss.cd=1.5;$('bossbar').style.display='block';toast('THORNBACK OGRE awakens!');beep(70,.6,'sawtooth',.08);}
function hurtHero(dmg,fromx,fromz){if(hero.ifr>0||hero.dodge>0||state!=='play')return;hero.hp-=dmg;hero.ifr=1.1;const dx=hero.x-fromx,dz=hero.z-fromz,l=Math.hypot(dx,dz)||1;hero.kx=dx/l*12;hero.kz=dz/l*12;shake=.3;beep(140,.15,'triangle',.08);
  if(blood)particle(hero.x,.9,hero.z,'#c0182a',6,3);if(hero.hp<=0){hero.hp=0;setTimeout(()=>end(false),700);state='dying';}}
function drawHUD(){let h='';for(let i=0;i<hero.max/2;i++){const v=hero.hp-i*2;h+=`<span style="color:${v>=2?'#ff3b5c':v===1?'#ff9aae':'#ffffff88'}">♥</span>`}$('hearts').innerHTML=h;
  const left=foes.filter(f=>f.hp>0&&!f.d.boss).length;$('info').textContent=boss.st==='sleep'?(left?`Foes in the meadow: ${left}`:'Head north to the stone grove ↑'):'';
  $('bossfill').style.width=Math.max(0,boss.hp/boss.d.hp*100)+'%';}
// ---------- update ----------
const clock=new THREE.Clock();let time=0;
function update(dt){time+=dt;
  // hero
  if(state==='play'){
    let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+jx,mz=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+jz;
    const l=Math.hypot(mx,mz);if(l>1){mx/=l;mz/=l}
    if(l>.15&&hero.atk<=0){hero.fx=mx/Math.max(l,1e-3);hero.fz=mz/Math.max(l,1e-3);const n=Math.hypot(hero.fx,hero.fz);hero.fx/=n;hero.fz/=n;}
    if(pressB&&hero.dcd<=0&&hero.dodge<=0){hero.dodge=.32;hero.dcd=.6;beep(500,.06,'sine');}
    if(pressA&&hero.atk<=0&&hero.dodge<=0){hero.atk=.3;hero.hitDone=false;beep(700,.05,'square',.03);}
    pressA=pressB=false;
    let sp=hero.atk>0?1.5:5.2;if(hero.dodge>0){hero.x+=hero.fx*15*dt;hero.z+=hero.fz*15*dt;}else{hero.x+=mx*sp*dt;hero.z+=mz*sp*dt;}
    hero.x+=hero.kx*dt;hero.z+=hero.kz*dt;hero.kx*=.86;hero.kz*=.86;collide(hero,.4);
    if(l>.15)hero.anim+=dt*8;
    hero.dir=Math.abs(hero.fx)>Math.abs(hero.fz)?2:(hero.fz<0?1:0);
    // attack hit
    if(hero.atk>0&&!hero.hitDone&&hero.atk<.22){hero.hitDone=true;for(const f of foes){if(f.hp<=0)continue;const dx=f.x-hero.x,dz=f.z-hero.z,d=Math.hypot(dx,dz);const reach=2.3+f.d.w*.35;
        if(d<reach&&(dx*hero.fx+dz*hero.fz)/(d||1)>-.2){hurtFoe(f,f.d.boss?2:2,dx/(d||1),dz/(d||1));}}
      // cut tall grass rustle
      for(const g of tgPos){if(Math.hypot(g[0]-hero.x-hero.fx,g[1]-hero.z-hero.fz)<1.4)g[3]=1.2;}}
    hero.atk-=dt;hero.dodge-=dt;hero.dcd-=dt;hero.ifr-=dt;
    if(Math.hypot(hero.x-ARENA.x,hero.z-ARENA.z)<ARENA.r-1)wake();
  }
  const ht=heroTex[hero.dir][(hero.anim|0)%2];if(hero.s.material.map!==ht){hero.s.material.map=ht;hero.s.material.needsUpdate=true}
  hero.s.scale.x=(hero.dir===2&&hero.fx<0?-1:1)*1.1;
  const bob=hero.dodge>0?Math.sin((.32-hero.dodge)/.32*Math.PI)*.5:0;
  hero.s.position.set(hero.x,bob,hero.z);hero.sh.position.set(hero.x,0.13,hero.z);
  hero.s.material.opacity=hero.ifr>0&&((time*20)|0)%2?.3:1;hero.s.material.rotation=0;
  // sword visual
  if(hero.atk>0){const a0=Math.atan2(hero.fx,hero.fz),p=1-hero.atk/.3,a=a0+1.2-2.4*p;swordG.visible=true;swordG.position.set(hero.x,.8,hero.z);swordG.rotation.set(0,a,0);
    arc.visible=p>.2;arc.position.set(hero.x,.5,hero.z);arc.rotation.set(-Math.PI/2,0,a0-Math.PI/2);arc.material.opacity=.7*(1-p);}else swordG.visible=arc.visible=false;
  // grass sway / rustle
  for(let i=0;i<tgN;i++){const g=tgPos[i];if(Math.hypot(g[0]-hero.x,g[1]-hero.z)<0.8)g[3]=Math.max(g[3],.6);g[3]*=.95;
    dm.position.set(g[0],0.45,g[1]);dm.rotation.set(Math.sin(time*2+g[2])*.12+g[3]*Math.sin(time*20+i),0,Math.cos(time*1.7+g[2])*.1);dm.scale.set(1,1-g[3]*.3,1);dm.updateMatrix();tg.setMatrixAt(i,dm.matrix);}
  tg.instanceMatrix.needsUpdate=true;
  // foes
  for(const f of foes){if(f.hp<=0)continue;f.t+=dt;f.hit-=dt;f.cd-=dt;
    const dx=hero.x-f.x,dz=hero.z-f.z,d=Math.hypot(dx,dz)||1,nx=dx/d,nz=dz/d;let mvx=0,mvz=0;
    const aggro=f.d.boss?f.st!=='sleep':d<11;
    if(f.hit<=0&&aggro&&state==='play'){
      if(f.type==='slime'){if(f.cd<=0&&d<9){f.vx=nx*7;f.vz=nz*7;f.cd=1.3;f.jump=.5}}
      else if(f.type==='wolf'){if(f.st==='charge'){f.ct-=dt;if(f.ct<=0)f.st='idle'}else if(f.cd<=0&&d<8){f.st='charge';f.ct=.5;f.cdx=nx;f.cdz=nz;f.cd=2.2}else{mvx=nx*.6;mvz=nz*.6}
        if(f.st==='charge'){mvx=f.cdx*4;mvz=f.cdz*4}}
      else if(f.type==='bat'){mvx=nx+Math.cos(f.t*3)*.8;mvz=nz+Math.sin(f.t*3)*.8;}
      else if(f.type==='goblin'){if(d>1.4){mvx=nx;mvz=nz}}
      else if(f.d.boss){
        if(f.st==='chase'){mvx=nx;mvz=nz;if(f.cd<=0){f.st=d<5?'wind':'leap';f.wt=f.st==='wind'?.9:.7;f.tx=hero.x;f.tz=hero.z;}}
        else if(f.st==='wind'){f.wt-=dt;tele.visible=true;tele.position.set(f.x,.16,f.z);tele.scale.setScalar(3.8*(1-f.wt/.9)+.2);
          if(f.wt<=0){tele.visible=false;shake=.5;beep(55,.4,'sawtooth',.1);particle(f.x,.2,f.z,'#b89a6a',20,6,.6,.2);if(d<4)hurtHero(2,f.x,f.z);f.st='chase';f.cd=rnd(1.4,2.2);}}
        else if(f.st==='leap'){f.wt-=dt;tele.visible=true;tele.position.set(f.tx,.16,f.tz);tele.scale.setScalar(2.6);f.x+=(f.tx-f.x)*dt*3;f.z+=(f.tz-f.z)*dt*3;f.y=Math.sin((.7-f.wt)/.7*Math.PI)*3;
          if(f.wt<=0){f.y=0;tele.visible=false;shake=.5;beep(55,.4,'sawtooth',.1);particle(f.x,.2,f.z,'#b89a6a',20,6,.6,.2);if(Math.hypot(hero.x-f.x,hero.z-f.z)<2.8)hurtHero(2,f.x,f.z);f.st='chase';f.cd=rnd(1.5,2.5);}}
        if(f.hp<f.d.hp/2&&!f.enraged){f.enraged=1;toast('The Ogre is enraged!');}
      }}
    const sp=f.d.sp*(f.enraged?1.4:1);f.x+=(mvx*sp+f.vx)*dt;f.z+=(mvz*sp+f.vz)*dt;f.vx*=.88;f.vz*=.88;
    if(f.jump>0){f.jump-=dt;f.y=Math.sin(f.jump/.5*Math.PI)*.8}else if(!f.d.boss)f.y=f.d.fly?1.1+Math.sin(f.t*5)*.3:0;
    collide(f,f.d.w*.3);
    if(f.d.boss&&f.st!=='sleep'){const ax=f.x-ARENA.x,az=f.z-ARENA.z,al=Math.hypot(ax,az);if(al>ARENA.r-1.5){f.x=ARENA.x+ax/al*(ARENA.r-1.5);f.z=ARENA.z+az/al*(ARENA.r-1.5)}}
    if(d<f.d.w*.45+.4&&Math.abs(f.y-0)<1.5&&f.st!=='sleep')hurtHero(f.d.dmg,f.x,f.z);
    const tx=f.d.tex[((f.t*(f.d.fly?8:4))|0)%2];if(f.s.material.map!==tx){f.s.material.map=tx;f.s.material.needsUpdate=true}
    f.s.scale.x=f.d.w*(dx<0?-1:1);
    f.s.material.color.set(f.hit>0?'#ff6060':(f.st==='sleep'?'#b0b0c0':'#ffffff'));
    f.s.position.set(f.x,f.y,f.z);f.sh.position.set(f.x,0.13,f.z);f.sh.material.opacity=f.d.fly?.5:1;
  }
  // parts physics
  for(const p of parts){p.t-=dt;if(p.y>0||p.vy>0){p.vy-=22*dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;if(p.y<=0.05){p.y=0.05;p.vy=Math.abs(p.vy)>3?-p.vy*.35:0;p.vx*=.5;p.vz*=.5;if(blood&&p.trail){decal(p.x,p.z,.25);p.trail=0}}}
    p.s.position.set(p.x,p.y,p.z);p.sh.position.set(p.x,.13,p.z);p.s.material.rotation+=p.vy?dt*8:0;p.s.material.opacity=Math.min(1,p.t);if(p.t<=0){scene.remove(p.s,p.sh)}}
  parts=parts.filter(p=>p.t>0);
  for(const e of fx){e.t-=dt;e.vy-=18*dt;e.m.position.x+=e.vx*dt;e.m.position.y=Math.max(.05,e.m.position.y+e.vy*dt);e.m.position.z+=e.vz*dt;if(e.t<=0)scene.remove(e.m)}fx=fx.filter(e=>e.t>0);
  for(const e of decals){e.t-=dt;e.m.material.opacity=Math.min(.75,e.t/3);if(e.t<=0)scene.remove(e.m)}decals=decals.filter(e=>e.t>0);
  // pond ripples
  if(Math.random()<dt*1.6){const a=rnd(0,7),r=rnd(0,POND.r-1);ripple(POND.x+Math.cos(a)*r,POND.z+Math.sin(a)*r);}
  if(Math.hypot(hero.x-POND.x,hero.z-POND.z)<POND.r+1.2&&Math.random()<dt*3)ripple(POND.x+(hero.x-POND.x)*.7,POND.z+(hero.z-POND.z)*.7);
  for(const r of ripples){r.t+=dt;r.m.scale.setScalar(.2+r.t*1.1);r.m.material.opacity=.8*(1-r.t/1.5);if(r.t>1.5)scene.remove(r.m)}
  for(let i=ripples.length-1;i>=0;i--)if(ripples[i].t>1.5)ripples.splice(i,1);
  // petals
  for(let i=0;i<PN;i++){pp[i*3+1]-=dt*.6;pp[i*3]+=Math.sin(time+i)*dt*.6+dt*.4;if(pp[i*3+1]<0){pp[i*3+1]=10;pp[i*3]=hero.x+rnd(-25,25);pp[i*3+2]=hero.z+rnd(-35,8)}}pg.attributes.position.needsUpdate=true;
  // camera
  const tgt=new THREE.Vector3(hero.x,0,hero.z-4);const want=tgt.clone().add(CAMOFF);cam.position.lerp(want,1-Math.pow(.001,dt));
  if(shake>0){cam.position.x+=rnd(-shake,shake);cam.position.y+=rnd(-shake,shake);shake=Math.max(0,shake-dt*1.5)}
  cam.lookAt(cam.position.x-CAMOFF.x,0,cam.position.z-CAMOFF.z);
  sun.position.set(hero.x-14,24,hero.z+10);sun.target.position.set(hero.x,0,hero.z);
  drawHUD();
}
function loop(){const dt=Math.min(clock.getDelta(),.05);update(dt);renderer.render(scene,cam);requestAnimationFrame(loop);}
function start(){reset();state='play';$('title').classList.add('hide');$('over').classList.add('hide');toast('Clear the meadow!');}
function end(win){state='over';$('overT').textContent=win?'VICTORY!':'YOU FELL';$('overP').textContent=win?'The stone grove is safe again. Play again?':'Rest up and try again.';$('over').classList.remove('hide');}
$('startBtn').onclick=start;$('againBtn').onclick=start;
reset();loop();
window.__game={get hero(){return hero},get foes(){return foes},start,wake,hurtFoe,kill};
