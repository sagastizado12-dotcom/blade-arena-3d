// ===== Blade Realm 3D renderer: draws the legacy simulation (window.__L3) as a 2.5D / HD-2D scene =====
import * as THREE from './vendor/three.module.min.js';
const L=window.__L3;window.__3D=true;
const legacyCv=document.getElementById('game');
const cv=document.getElementById('c3d');
const isMobile=/iPhone|iPad|Android/i.test(navigator.userAgent)||navigator.maxTouchPoints>1;
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:!isMobile,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,isMobile?1.5:2));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();const SKY=new THREE.Color('#a8e4ff');scene.background=SKY.clone();scene.fog=new THREE.Fog('#c4ecff',22,46);
const cam=new THREE.PerspectiveCamera(40,1,0.1,200);const CAMOFF=new THREE.Vector3(0,11,14);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h>1.6?40:54;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
const hemi=new THREE.HemisphereLight('#fff6e0','#5aa070',1.2);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff2d0',1.5);sun.castShadow=true;sun.shadow.mapSize.set(isMobile?1024:2048,isMobile?1024:2048);
Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:70});sun.shadow.bias=-0.001;scene.add(sun,sun.target);
const heroLight=new THREE.PointLight('#ffd890',0,9,1.4);scene.add(heroLight);
const TT=L.TT,TILE=L.TILE,CH=L.CH;
const lam=c=>new THREE.MeshLambertMaterial({color:c});
// ---------- terrain chunks: legacy painted chunk as ground texture + 3D volumes ----------
const chunks=new Map();const boxG=new THREE.BoxGeometry(1,1,1);boxG.translate(0,.5,0);
const canopyG=new THREE.IcosahedronGeometry(.62,1);const trunkG=new THREE.CylinderGeometry(.11,.16,.7,6);trunkG.translate(0,.35,0);
const coneG=new THREE.ConeGeometry(.55,1.5,7);coneG.translate(0,1.1,0);const rockG=new THREE.DodecahedronGeometry(.42,0);
const canopyM=new THREE.MeshLambertMaterial({flatShading:true});const whiteM=new THREE.MeshLambertMaterial({flatShading:true});
function leafCols(tx,ty){const rk=L.regionKind(tx,ty);if(rk==='tundra')return['#e8f2f6','#cfe0e8'];const s=L.season();if(s===2)return['#e89040','#d8b040'];if(s===3)return['#dde8ee','#9ab0a0'];return['#3fa850','#58c060','#2f9048'];}
function buildChunk(cx,cy,img){const g=new THREE.Group();g.userData.img=img;
  const tex=new THREE.CanvasTexture(img);tex.colorSpace=THREE.SRGBColorSpace;tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.anisotropy=4;
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(CH,CH),new THREE.MeshLambertMaterial({map:tex}));ground.rotation.x=-Math.PI/2;ground.position.set(cx*CH+CH/2,0,cy*CH+CH/2);ground.receiveShadow=true;g.add(ground);
  const trees=[],dead=[],cact=[],rocks=[],blocks=[],bushes=[];
  for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){const tx=cx*CH+x,ty=cy*CH+y,t=L.tAt(tx,ty);const h=((tx*73856093)^(ty*19349663))>>>0;const r=(h%1000)/1000;
    if(t===TT.TREE)trees.push([tx,ty,r]);else if(t===TT.DEADTREE)dead.push([tx,ty,r]);else if(t===TT.CACTUS)cact.push([tx,ty,r]);
    else if(t===TT.ROCK)rocks.push([tx,ty,r]);else if(t===TT.BUSH)bushes.push([tx,ty,r]);
    else if(t===TT.MTN){const e=L.elevAt(tx,ty)||1;blocks.push([tx,ty,.5+e*.55,'#9a8f84',r]);}
    else if(t===TT.CLIFF)blocks.push([tx,ty,.9,'#8a7a68',r]);else if(t===TT.MESA)blocks.push([tx,ty,1.2,'#c87850',r]);}
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),sc=new THREE.Vector3(),col=new THREE.Color();
  const inst=(geo,mat,arr,fn,shadow=true)=>{if(!arr.length)return;const im=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((a,i)=>{fn(a,v,sc,col);m4.compose(v,q.identity(),sc);im.setMatrixAt(i,m4);im.setColorAt(i,col);});im.castShadow=shadow;im.receiveShadow=true;g.add(im);};
  const all=trees.concat(dead);
  inst(trunkG,lam('#ffffff'),all,(a,v,s,c)=>{v.set(a[0]+.5,0,a[1]+.5);s.set(1,1+a[2]*.4,1);c.set('#7a5232');});
  const lc=leafCols(trees[0]?.[0]||cx*CH,trees[0]?.[1]||cy*CH);
  // 3 stacked blobs per tree for a rounded canopy
  const blobs=[];for(const a of trees){const k=1+a[2]*.35;blobs.push([a[0]+.5,.95*k,a[1]+.5,1.15*k,lc[(a[2]*7|0)%lc.length]],[a[0]+.38,1.45*k,a[1]+.55,.9*k,lc[(a[2]*13|0)%lc.length]],[a[0]+.6,1.75*k,a[1]+.42,.62*k,lc[0]]);}
  inst(canopyG,canopyM,blobs,(a,v,s,c)=>{v.set(a[0],a[1],a[2]);s.setScalar(a[3]);c.set(a[4]);});
  inst(coneG,whiteM,cact,(a,v,s,c)=>{v.set(a[0]+.5,-.4,a[1]+.5);s.set(.5,1,.5);c.set('#4a9a3a');});
  inst(rockG,whiteM,rocks,(a,v,s,c)=>{v.set(a[0]+.5,.2,a[1]+.5);s.set(1+a[2]*.4,.8,1);c.set('#a8a6b0');});
  inst(canopyG,canopyM,bushes,(a,v,s,c)=>{v.set(a[0]+.5,.3,a[1]+.5);s.set(.8,.6,.8);c.set('#3e9a48');});
  inst(boxG,whiteM,blocks,(a,v,s,c)=>{v.set(a[0]+.5,0,a[1]+.5);s.set(1,a[2],1);c.set(a[3]).offsetHSL(0,0,(a[4]-.5)*.06);});
  scene.add(g);return g;}
function disposeGroup(g){scene.remove(g);g.traverse(o=>{if(o.geometry&&o.geometry!==boxG&&o.geometry!==canopyG&&o.geometry!==trunkG&&o.geometry!==coneG&&o.geometry!==rockG)o.geometry.dispose();if(o.material&&o.material!==canopyM&&o.material!==whiteM){if(o.material.map)o.material.map.dispose();o.material.dispose();}});}
let chunkBudget=0;
function updateChunks(hx,hz){chunkBudget=isMobile?2:3;const ccx=Math.floor(hx/CH),ccy=Math.floor(hz/CH);const want=new Set();
  for(let dy=-2;dy<=1;dy++)for(let dx=-2;dx<=2;dx++){const cx=ccx+dx,cy=ccy+dy;if(cx<0||cy<0||cx*CH>=L.WW||cy*CH>=L.WH)continue;const k=cx+','+cy;want.add(k);
    const img=L.getChunk(cx,cy);if(!img)continue;const have=chunks.get(k);if(have&&have.userData.img===img)continue;if(chunkBudget--<=0&&have)continue;if(chunkBudget<-3)continue;
    if(have)disposeGroup(have);chunks.set(k,buildChunk(cx,cy,img));}
  for(const [k,g] of chunks)if(!want.has(k)){disposeGroup(g);chunks.delete(k);}}
// ---------- buildings: real 3D houses ----------
const bmeshes=new Map();
function roofGeo(w,d){const sh=new THREE.Shape();sh.moveTo(-w/2-.3,0);sh.lineTo(0,1.0);sh.lineTo(w/2+.3,0);sh.lineTo(-w/2-.3,0);const g=new THREE.ExtrudeGeometry(sh,{depth:d+.5,bevelEnabled:false});g.translate(0,0,-(d+.5)/2);return g;}
const winM=new THREE.MeshLambertMaterial({color:'#bfe8ff',emissive:'#ffb050',emissiveIntensity:0});
function makeBuilding(b){const S=L.SETS[b.s]||{roof:['#c8a040','#6a4a20'],wall:'#e8e0d0'};const g=new THREE.Group();
  const w=b.w,d=b.h-.2,hgt=b.kind==='house'||b.kind==='forsale'?1.3:1.7;const cx=b.x+b.w/2,cz=b.y+b.h/2;
  const wallM=lam(S.wall);const add=(geo,mat,x,y,z,shadow=true)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;g.add(m);return m;};
  add(new THREE.BoxGeometry(w+.1,.2,d+.1),lam('#9a8a74'),0,.1,0);
  add(new THREE.BoxGeometry(w-.2,hgt,d-.2),wallM,0,hgt/2+.15,0);
  for(const sx of[-1,1])for(const sz of[-1,1])add(new THREE.BoxGeometry(.18,hgt+.1,.18),lam('#6b4423'),sx*(w/2-.15),hgt/2+.15,sz*(d/2-.15));
  const roof=add(roofGeo(w,d),lam(S.roof[0]),0,hgt+.15,0);g.userData.roof=roof;
  add(new THREE.BoxGeometry(.2,.2,d+.55),lam(S.roof[1]),0,hgt+1.15,0);
  const fz=d/2-.08;add(new THREE.BoxGeometry(.8,1.1,.06),lam('#6b4423'),(b.x+1.5+.5)-cx-0,.7,fz);// door at legacy door tile
  add(new THREE.BoxGeometry(.6,.5,.06),winM,-w/2+.7,1.15,fz,false);add(new THREE.BoxGeometry(.6,.5,.06),winM,w/2-.7,1.15,fz,false);
  if(b.kind!=='house'&&b.kind!=='forsale'){const sign={inn:'#d04a3a',shop:'#3a8ad0',guild:'#d0a030',smith:'#555',harbor:'#2aa0a0'}[b.kind]||'#a07040';add(new THREE.BoxGeometry(.7,.45,.08),lam(sign),w/2-.3,hgt*.85,fz+.12,false);}
  if(b.kind==='house'||b.kind==='forsale')add(new THREE.BoxGeometry(.35,.8,.35),lam('#b07050'),w/4,hgt+1,-.2);
  g.position.set(cx,0,cz);g.userData.mats=[wallM,roof.material];g.userData.all=[];g.traverse(o=>{if(o.material&&o.material!==winM&&!g.userData.all.includes(o.material))g.userData.all.push(o.material)});scene.add(g);return g;}
function updateBuildings(hx,hz){const R=30;const keep=new Set();
  for(const b of L.buildings){if(Math.abs(b.x+2-hx)>R||Math.abs(b.y+1.5-hz)>R)continue;keep.add(b);let g=bmeshes.get(b);if(!g){g=makeBuilding(b);bmeshes.set(b,g);}
    const st=L.bld(b.id)||{};const dmg=Math.min(1,st.dmg||0);
    for(const m of g.userData.mats){m.emissive=m.emissive||new THREE.Color();m.emissive.set(st.burn>0?'#ff5010':'#000');m.emissiveIntensity=st.burn>0?.4+.3*Math.random():0;m.color.offsetHSL?0:0;}
    g.scale.y=dmg>.95?.45:1;
    const occl=(b.y+b.h/2)>hz+.3&&(b.y+b.h/2)-hz<7&&Math.abs(b.x+b.w/2-hx)<b.w/2+1.2;const op=occl?.3:1;
    if(g.userData.op!==op){g.userData.op=op;for(const m of g.userData.all){m.transparent=op<1;m.opacity=op;m.depthWrite=op===1;m.needsUpdate=true;}g.traverse(o=>{if(o.isMesh)o.castShadow=true;});}}
  for(const [b,g] of bmeshes)if(!keep.has(b)){disposeGroup(g);bmeshes.delete(b);}}
// ---------- town walls / towers (instanced, rebuilt when near set changes) ----------
let wallGroup=null,wallKey='';
function updateWalls(hx,hz){const R=30;const ws=L.WALLS.filter(w=>Math.abs(w.x-hx)<R&&Math.abs(w.y-hz)<R);const key=ws.length+':'+(ws[0]?ws[0].i:0)+':'+ws.map(w=>L.wallHp(w.i)>0?1:0).join('').length+':'+ws.reduce((a,w)=>a+(L.wallHp(w.i)>0?1:0),0);
  if(key===wallKey)return;wallKey=key;if(wallGroup)disposeGroup(wallGroup);wallGroup=new THREE.Group();
  const up=ws.filter(w=>L.wallHp(w.i)>0),down=ws.filter(w=>L.wallHp(w.i)<=0);const m4=new THREE.Matrix4();
  if(up.length){const im=new THREE.InstancedMesh(boxG,lam('#b8b0a4'),up.length);up.forEach((w,i)=>{m4.makeScale(1,1.3,1).setPosition(w.x+.5,0,w.y+.5);im.setMatrixAt(i,m4);});im.castShadow=im.receiveShadow=true;wallGroup.add(im);}
  if(down.length){const im=new THREE.InstancedMesh(boxG,lam('#8a8078'),down.length);down.forEach((w,i)=>{m4.makeScale(1,.25,1).setPosition(w.x+.5,0,w.y+.5);im.setMatrixAt(i,m4);});wallGroup.add(im);}
  const tw=L.TOWERS.filter(t=>Math.abs(t.x-hx)<R&&Math.abs(t.y-hz)<R);for(const t of tw){const m=new THREE.Mesh(new THREE.CylinderGeometry(.8,.9,2.6,10),lam('#c8c0b4'));m.position.set(t.x+.5,1.3,t.y+.5);m.castShadow=true;wallGroup.add(m);const r=new THREE.Mesh(new THREE.ConeGeometry(1.05,1.1,10),lam('#5a6aa0'));r.position.set(t.x+.5,3.15,t.y+.5);r.castShadow=true;wallGroup.add(r);}
  scene.add(wallGroup);}
// ---------- billboard sprites captured from legacy draw code ----------
const pool=new Map();const blobTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(20,30,40,.5)');gr.addColorStop(1,'rgba(20,30,40,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const shadowGeo=new THREE.PlaneGeometry(1,1);shadowGeo.rotateX(-Math.PI/2);const shadowMat=new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false});
function spriteFor(o,w,h){let s=pool.get(o);if(s&&(s.w!==w||s.h!==h)){scene.remove(s.spr,s.sh);s.tex.dispose();s.spr.material.dispose();pool.delete(o);s=null;}
  if(!s){const c=L.capCanvas(w,h);const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;tex.generateMipmaps=false;
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,alphaTest:.35,transparent:true,fog:true}));spr.center.set(.5,.15);spr.scale.set(w/TILE,h/TILE,1);
    const sh=new THREE.Mesh(shadowGeo,shadowMat);sh.renderOrder=1;scene.add(spr,sh);s={c,tex,spr,sh,w,h,t:-1e9};pool.set(o,s);}
  s.seen=frame;return s;}
let frame=0;
function updateSprites(){const hero=L.hero;const cx=hero.x,cy=hero.y;
  const dyn=L.dyn(cx,cy,26*TILE);for(const it of dyn){const s=spriteFor(it.o,it.w,it.h);L.cap(s.c,it.ax,it.ay,it.f,true);s.tex.needsUpdate=true;place(s,it.ax,it.ay,it);}
  const st=L.statics(cx,cy,28*TILE);for(const it of st){const s=spriteFor(it.o,it.w,it.h);const ax=it.ax??(it.o&&it.o.y!=null?null:null);
    const stale=it.dyn||frame-s.t>45||s.k!==it.k;if(it.ax==null){// wood pickups: derive anchor from closure-less y
      it.ax=(it.o.f&&it.o.x)||cx;}
    if(stale){L.cap(s.c,it.ax,it.ay,it.f,true);s.tex.needsUpdate=true;s.t=frame;s.k=it.k;}place(s,it.ax,it.ay,it);}
  for(const [o,s] of pool)if(s.seen!==frame){scene.remove(s.spr,s.sh);s.tex.dispose();s.spr.material.dispose();pool.delete(o);}}
function place(s,ax,ay,it){const x=ax/TILE,z=ay/TILE;s.spr.position.set(x,0,z);const sw=it.hero?.9:it.w>120?3.5:Math.min(2.2,it.w/TILE*.5);s.sh.scale.set(sw,1,sw*.55);s.sh.position.set(x,.04,z);
  if(it.o===L.hero&&L.hero.boat){s.spr.position.y=.05;}}
// ---------- particles (spells, blood, sparks, leaves) as real 3D points ----------
const PMAX=2500;const pgeo=new THREE.BufferGeometry();const ppos=new Float32Array(PMAX*3),pcol=new Float32Array(PMAX*3);
pgeo.setAttribute('position',new THREE.BufferAttribute(ppos,3));pgeo.setAttribute('color',new THREE.BufferAttribute(pcol,3));
const dot=(()=>{const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(3,3,10,10);return new THREE.CanvasTexture(c);})();
const pts=new THREE.Points(pgeo,new THREE.PointsMaterial({size:.16,vertexColors:true,map:dot,alphaTest:.5,transparent:true,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
function updateParticles(){const ps=L.particles;let n=0;for(const p of ps){if(n>=PMAX)break;ppos[n*3]=p.x/TILE;ppos[n*3+1]=Math.max(.05,(p.z||0)/TILE*1.2+.05);ppos[n*3+2]=p.y/TILE;
  pcol[n*3]=p.col[0]/255;pcol[n*3+1]=p.col[1]/255;pcol[n*3+2]=p.col[2]/255;n++;}pgeo.setDrawRange(0,n);pgeo.attributes.position.needsUpdate=true;pgeo.attributes.color.needsUpdate=true;}
// ---------- legacy ground overlay (splats, spell FX, quest marks, damage numbers, fish, critters...) ----------
const ovTex=new THREE.CanvasTexture(legacyCv);ovTex.colorSpace=THREE.SRGBColorSpace;ovTex.magFilter=THREE.NearestFilter;ovTex.minFilter=THREE.LinearFilter;ovTex.generateMipmaps=false;
const overlay=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ovTex,transparent:true,depthWrite:false,fog:false}));overlay.rotation.x=-Math.PI/2;overlay.renderOrder=2;scene.add(overlay);
// ---------- DOM labels: interaction hint, speech bubbles, town banner ----------
const labels=document.getElementById('labels3d');const bannerEl=document.getElementById('banner3d');const lblPool=[];
function proj(x,y,z){const v=new THREE.Vector3(x,y,z).project(cam);return[(v.x+1)/2*innerWidth,(1-v.y)/2*innerHeight,v.z<1];}
function updateLabels(){const items=[];const h=L.hero;const hint=L.interactHint();if(hint)items.push({t:hint,x:(h.x+6)/TILE,y:2.3,z:(h.y+12)/TILE,c:'hint'});
  for(const b of L.bubbles)if(!b.n.inside&&b.n.alive!==false)items.push({t:b.t,x:(b.n.x+8)/TILE,y:2,z:(b.n.y+16)/TILE,c:'bub',a:Math.min(1,b.life/20)});
  while(lblPool.length<items.length){const d=document.createElement('div');labels.appendChild(d);lblPool.push(d);}
  lblPool.forEach((d,i)=>{const it=items[i];if(!it){d.style.display='none';return;}const [sx,sy,ok]=proj(it.x,it.y,it.z);d.style.display=ok?'block':'none';d.className='lbl '+it.c;d.textContent=it.t;d.style.transform=`translate(-50%,-100%) translate(${sx}px,${sy}px)`;d.style.opacity=it.a??1;});
  const bn=L.banner;if(bn&&bn.life>0){bannerEl.style.display='block';bannerEl.innerHTML=`<b>${bn.t}</b><i>${bn.sub||''}</i>`;bannerEl.style.opacity=Math.min(1,bn.life/30);}else bannerEl.style.display='none';}
// ---------- day / night & weather ----------
const DAYC=new THREE.Color('#a8e4ff'),DUSK=new THREE.Color('#ffb48a'),NIGHT=new THREE.Color('#1c2450');
function updateSky(){const w=L.world;const h=w.min/60,dk=L.darkness();const sky=new THREE.Color();
  if(h>=17&&h<20)sky.copy(DAYC).lerp(DUSK,Math.min(1,(h-17)/1.5)).lerp(NIGHT,Math.max(0,(h-19)/1));else if(h>=5&&h<7)sky.copy(NIGHT).lerp(DUSK,(h-5)/1).lerp(DAYC,Math.max(0,h-6));else sky.copy(dk>.3?NIGHT:DAYC);
  const wth=w.weather;if(wth==='rain'||wth==='storm')sky.lerp(new THREE.Color('#7a8494'),.5);
  scene.background.copy(sky);scene.fog.color.copy(sky).lerp(new THREE.Color('#ffffff'),dk>.3?0:.25);
  scene.fog.near=wth==='fog'?6:22;scene.fog.far=wth==='fog'?24:46;
  const day=1-dk/0.6;hemi.intensity=.35+.9*day;hemi.color.set(dk>.3?'#8090d0':'#fff6e0');sun.intensity=.15+1.4*day*(wth==='rain'||wth==='storm'?.5:1);sun.color.set(h>=17||h<7?'#ffc890':'#fff2d0');
  heroLight.intensity=dk>.15?dk*6:0;winM.emissiveIntensity=dk>.15?dk*2.2:0;
  if(wth==='storm'&&L.frameN%400<4){hemi.intensity=3;}}
// ---------- main loop ----------
let active=false;
function setActive(on){if(on===active)return;active=on;cv.style.display=on?'block':'none';legacyCv.style.opacity=on?'0':'1';document.body.classList.toggle('in3d',on);}
const camPos=new THREE.Vector3();let camInit=false;
function tick(){requestAnimationFrame(tick);frame++;
  const on=L.state==='play'&&!L.room&&!!L.world&&!!L.hero;setActive(on);if(!on){camInit=false;return;}
  const h=L.hero;const hx=(h.x+6)/TILE,hz=(h.y+12)/TILE;
  try{updateChunks(hx,hz);updateBuildings(hx,hz);updateWalls(hx,hz);updateSprites();updateParticles();updateSky();updateLabels();}catch(e){console.warn('3d',e);}
  // overlay plane follows the legacy camera rect
  overlay.position.set((L.camX+L.W/2)/TILE,.03,(L.camY+L.H/2)/TILE);overlay.scale.set(L.W/TILE,L.H/TILE,1);ovTex.needsUpdate=true;
  const want=new THREE.Vector3(hx,0,hz-3).add(CAMOFF);if(!camInit||camPos.distanceTo(want)>20){camPos.copy(want);camInit=true;}else camPos.lerp(want,.15);
  cam.position.copy(camPos);if(window.__shake3d)cam.position.x+=(Math.random()-.5)*.2;cam.lookAt(camPos.x-CAMOFF.x,0,camPos.z-CAMOFF.z);
  sun.position.set(hx-12,22,hz+8);sun.target.position.set(hx,0,hz-4);heroLight.position.set(hx,1.6,hz);
  renderer.render(scene,cam);}
tick();
window.__R3={scene,cam,renderer,chunks,pool,info:()=>renderer.info};
