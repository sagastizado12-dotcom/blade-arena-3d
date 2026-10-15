// Procedural original pixel-art sprites -> THREE textures (nearest filtered)
import * as THREE from './vendor/three.module.min.js';
function tex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const r=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x,y,a,b)};fn(r,g);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;return t;}
const O='#2a1c22';
// hero: dir 0=down 1=up 2=side(right); f=0/1 walk
export function hero(dir,f){return tex(16,24,r=>{
  const lx=f?1:0, rx=f?0:1;
  r(4,20+lx,3,3,O);r(9,20+rx,3,3,O);r(5,20+lx,2,2,'#6b3f22');r(10,20+rx,2,2,'#6b3f22');
  r(3,11,10,10,O);r(4,12,8,8,'#3a7bd5');r(4,17,8,2,'#7a4a22');r(7,17,2,2,'#f2c94c');// tunic+belt
  r(2,12,2,6,O);r(12,12,2,6,O);r(2,13,1,4,'#ffd2a8');r(13,13,1,4,'#ffd2a8');
  r(3,2,10,10,O);r(4,3,8,8,'#ffd2a8');
  if(dir===1){r(4,2,8,7,'#c0502a');r(3,3,10,4,'#c0502a');}
  else{r(4,2,8,3,'#c0502a');r(3,3,2,5,'#c0502a');r(11,3,2,5,'#c0502a');
    if(dir===0){r(5,6,2,2,O);r(9,6,2,2,O);r(5,6,1,1,'#fff');r(9,6,1,1,'#fff');r(7,9,2,1,'#c66')}
    else{r(3,3,4,6,'#c0502a');r(10,6,2,2,O);r(10,6,1,1,'#fff');}}
  r(4,1,8,1,'#2e9e5a');r(2,2,12,1,'#2e9e5a');// green cap band
});}
export function slime(f){return tex(16,14,r=>{const s=f?1:0;r(2,3+s,12,11-s,O);r(3,4+s,10,9-s,'#5fd0ff');r(4,5+s,4,2,'#c8f2ff');r(5,8,2,2,O);r(9,8,2,2,O);r(1,12,14,2,O)});}
export function goblin(f){return tex(16,22,r=>{const s=f?1:0;r(4,18+s,3,4-s,O);r(9,18+(1-s),3,4-(1-s),O);
  r(3,10,10,9,O);r(4,11,8,7,'#8a5a2a');r(1,3,14,8,O);r(2,4,12,6,'#7cc04a');r(0,5,2,2,'#7cc04a');r(14,5,2,2,'#7cc04a');
  r(4,6,2,2,'#ff3');r(10,6,2,2,'#ff3');r(6,9,4,1,O);r(12,8,2,10,'#bbb');});}
export function bat(f){return tex(20,12,r=>{r(7,3,6,6,O);r(8,4,4,4,'#7a4ab0');r(8,5,1,1,'#f44');r(11,5,1,1,'#f44');
  if(f){r(0,2,7,3,O);r(13,2,7,3,O);r(1,3,6,1,'#9a6ad0');r(13,3,6,1,'#9a6ad0');}else{r(1,6,6,4,O);r(13,6,6,4,O);r(2,7,5,2,'#9a6ad0');r(13,7,5,2,'#9a6ad0');}});}
export function wolf(f){return tex(24,16,r=>{const s=f?1:0;r(3,12+s,3,4-s,O);r(16,12+(1-s),3,4,O);r(2,5,18,8,O);r(3,6,16,6,'#8d96a8');
  r(17,2,7,8,O);r(18,3,5,6,'#8d96a8');r(21,4,1,1,'#ff0');r(18,1,2,2,O);r(0,4,4,2,O);r(4,10,14,2,'#c8cfdc');});}
export function ogre(f){return tex(32,36,r=>{const s=f?1:0;r(7,29+s,7,7-s,O);r(18,29+(1-s),7,7,O);
  r(4,13,24,18,O);r(5,14,22,16,'#b06a4a');r(5,24,22,3,'#5a3a1a');r(8,2,16,13,O);r(9,3,14,11,'#c8805a');
  r(11,7,3,2,'#ff2');r(18,7,3,2,'#ff2');r(12,11,8,2,O);r(12,11,1,3,'#fff');r(19,11,1,3,'#fff');
  r(6,9,3,5,'#5aa040');r(23,9,3,5,'#5aa040');r(27,10,5,18,O);r(28,11,3,16,'#7a5030');r(26,6,7,7,'#6a6a6a');});}
// gibs: part textures (head chunk / limb / bone) per color
export function part(kind,col){return tex(8,8,r=>{if(kind===0){r(1,1,6,6,O);r(2,2,4,4,col);r(3,3,1,1,'#000')}else if(kind===1){r(1,3,6,3,O);r(2,4,4,1,col)}else{r(1,3,6,2,'#eee');r(0,2,2,4,'#eee');r(6,2,2,4,'#eee')}});}
export function blob(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(20,40,30,.55)');gr.addColorStop(1,'rgba(20,40,30,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
export function soft(col){const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');g.fillStyle=col;g.beginPath();g.arc(8,8,7,0,7);g.fill();const t=new THREE.CanvasTexture(c);return t;}
