// ===== GROUNDED MONSTER ART (v15) =====
// comparison sheet: every species next to a villager, drawn by the real in-game renderers
function monSheet(scale){scale=scale||3;const all=Object.keys(SPECIES).filter(k=>k!=="dragon");const sizeOf=k=>{const v=MONDEF[k]&&+MONDEF[k][3];return v>0?v:({warchief:56,orc:44,orcclub:44})[k]||32;};
  const small=all.filter(k=>sizeOf(k)<64),big=all.filter(k=>sizeOf(k)>=64);window.__sheet={small,big};const cols=8,cw=64,chh=70,bcw=128,bch=118;const rowsS=Math.ceil((small.length+1)/cols),rowsB=Math.ceil((big.length+1)/4);
  const W=cols*cw,H=rowsS*chh+rowsB*bch+10;const c=document.createElement("canvas");c.width=W*scale;c.height=H*scale;const g=c.getContext("2d");g.imageSmoothingEnabled=false;
  const o=document.createElement("canvas");o.width=W;o.height=H;const og=o.getContext("2d");og.imageSmoothingEnabled=false;og.fillStyle="#56703a";og.fillRect(0,0,W,H);
  for(let y=0;y<H;y+=4)for(let x=(y/4%2)*2;x<W;x+=4){og.fillStyle="rgba(0,0,0,.05)";og.fillRect(x,y,2,2);}
  const keep=ctx;ctx=og;const saved=mobs.slice();const fx=frameN;const hx=hero.x,hy=hero.y;hero.x=-9999;hero.y=-9999;
  const label=(t,x,y)=>{og.font="bold 7px system-ui";og.textAlign="center";og.fillStyle="#000";og.fillText(t,x+1,y+1);og.fillStyle="#fff";og.fillText(t,x,y);};
  const vil=npcs.find(n=>n.alive&&n.role!=="child"&&n.role!=="guard"&&n.role!=="leader"&&!n.adv&&!n.demon)||npcs[0];
  const villAt=(x,y)=>{const ox=vil.x,oy=vil.y,oi=vil.inside;vil.x=x-8;vil.y=y-22;vil.inside=false;try{drawNpc(vil);}catch(_){}vil.x=ox;vil.y=oy;vil.inside=oi;};
  const mon=(k,x,y)=>{mobs.length=0;const e=k==="dragon"?spawnDragon("fire",0,0,{}):spawnMob(k,0,0,{});mobs.length=0;e.x=x-e.w/2;e.y=y-e.h;e.px=e.x;e.py=e.y;e.state="idle";e.provoked=false;try{drawMob(e);}catch(err){label("ERR",x,y-20);}};
  try{small.concat(["__v"]).forEach((k,i)=>{const x=(i%cols)*cw+cw/2,y=Math.floor(i/cols)*chh+chh-12;if(k==="__v"){villAt(x,y);label("Villager",x,y+9);return;}villAt(x-18,y);mon(k,x+4,y);label(SPECIES[k].name||k,x,y+9);});
    const y0=rowsS*chh;big.concat(["dragon"]).forEach((k,i)=>{const x=(i%4)*bcw+bcw/2,y=y0+Math.floor(i/4)*bch+bch-12;villAt(x-(k==="dragon"?56:40),y);mon(k,x+8,y);label(k==="dragon"?"Fire Dragon":SPECIES[k].name||k,x,y+9);});
  }finally{ctx=keep;mobs.length=0;for(const m of saved)mobs.push(m);frameN=fx;hero.x=hx;hero.y=hy;}
  g.drawImage(o,0,0,W*scale,H*scale);return c;}
// ---------- palettes: 4 tones dark->light, muted and earthy ----------
const GP={
 slimeB:["#1d3a6b","#2f62a8","#5a95d6","#b9dcf5"],slimeG:["#1f4a2a","#357a3c","#62a85a","#bfe3a0"],ember:["#6b2410","#a8461a","#d97a2c","#f6c27a"],steel:["#3a4150","#68738a","#a2aabb","#e6ebf2"],
 slimeP:["#3a1f55","#5f3a8a","#8e64b8","#d2bde8"],furG:["#2b292b","#4e4a4c","#7b7573","#b0a89f"],furB:["#3a2516","#61412a","#8c6542","#c09a6c"],furGold:["#4a3110","#7f5a22","#b48a3e","#dcc07a"],
 mane:["#3a1e0e","#6a3a18","#9a5e28","#c88e4a"],gob:["#2f3a1c","#4f6230","#768c48","#a9b97a"],orc:["#26331f","#435a33","#66804c","#98ad7c"],leather:["#2e1d12","#4f3220","#734d30","#a07650"],
 clothR:["#3e1212","#6a1e1e","#963028","#c75e48"],clothB:["#161d33","#28345a","#3f5284","#7186b4"],clothP:["#24142e","#3e2450","#5c3a74","#8c6aa4"],bone:["#4d4636","#8a7f63","#bfb492","#ece4c8"],
 wrap:["#4a4232","#7d7253","#ada07a","#ddd2ad"],stone:["#2f2d2c","#55524f","#827d77","#b5afa6"],mud:["#2e2014","#523a24","#7a5a38","#a8875e"],lava:["#3a120a","#6e2410","#b04416","#f08a2a"],
 leaf:["#1d3318","#34552a","#55803f","#90b86a"],bark:["#2a1c12","#4a3220","#6e4c30","#977048"],iron:["#1a1a22","#34343f","#5a5a68","#9a9aaa"],rust:["#3a2418","#6a4028","#9a6a44","#c9a27a"],
 demonR:["#3a0c14","#6a1822","#9a2a2e","#cf5c4c"],demonN:["#18142a","#2e2650","#4a3f78","#8278ae"],night:["#1a1626","#332c48","#544a6e","#8c82a6"],crim:["#2e0a12","#5a1420","#8a2430","#c04a4a"],
 memb:["#2a1622","#4a2838","#6e3e50","#9a6070"],membR:["#3a0c10","#5e1a1c","#86302a","#b45a44"],eyeW:["#7a7060","#c8bea8","#ece4d0","#ffffff"],iris:["#5a0a0a","#a01818","#e03a2a","#ffb070"],
 eyeY:["#5a4206","#a87a10","#e0b830","#fff0a0"],cyc:["#1a3a3c","#2e5e5e","#4e8a84","#8ac0b0"],gold:["#4a3208","#86601a","#c49632","#f0d88a"],snakeG:["#1c3418","#2f5a26","#4f8a3c","#9cc070"],
 belly:["#4a4220","#8a7c3e","#c4b46a","#ece0a8"],sand:["#4a3410","#80602a","#b48c4a","#e0c486"],petal:["#5a1a34","#8e2e52","#c25478","#eaa0b4"],petalP:["#2e1846","#4e2c70","#74509c","#b292d0"],
 wispT:["#0e3a3e","#1e7a78","#4ec4b4","#d8fff4"],fire:["#6a1a08","#c0400c","#f08a1c","#ffe08a"],teal:["#123c3c","#1f6464","#3a9088","#86c8b8"],horn:["#3e3626","#7a6a4a","#b4a27a","#e6dcbc"],
 mouth:["#1a0608","#3a0c10","#6a1a1e","#a83a3a"],tooth:["#6a6252","#bfb79c","#e8e2cc","#ffffff"],wood:["#2e1e10","#5a3c20","#86603a","#b08a5a"],pinkF:["#5a2a3a","#8a4458","#b86a7e","#e0a4b0"],
 skinH:["#5a3a28","#98684c","#cc9a78","#f0caa8"],moss:["#22361a","#3c5a2a","#5e8040","#98b46a"],shadowP:["#100c1a","#221a34","#3a2e52","#665a86"]};
// texture per material: smooth | fur | scale | stone | metal | cloth | bone | bark | leaf | glow | flat
// ---------- auto-shading pixel painter ----------
const LDIR=[-0.62,-0.78];
function newPart(W,H){return{W,H,mat:new Int16Array(W*H),tone:new Int8Array(W*H).fill(-1),mats:[null]};}
const _scr={};function scratch(W,H){const k=W+"x"+H;if(!_scr[k]){const c=document.createElement("canvas");c.width=W;c.height=H;_scr[k]=[c,c.getContext("2d",{willReadFrequently:true})];}return _scr[k];}
function matId(P,pal,tex){const k=pal+"|"+tex;let i=P.mats.findIndex(m=>m&&m.k===k);if(i<0){P.mats.push({k,pal:GP[pal]||pal,tex});i=P.mats.length-1;}return i;}
function stamp(P,id,draw,tone){const [c,g]=scratch(P.W,P.H);g.clearRect(0,0,P.W,P.H);g.fillStyle="#fff";g.strokeStyle="#fff";g.lineCap="round";g.lineJoin="round";draw(g);
  const a=g.getImageData(0,0,P.W,P.H).data;for(let i=0;i<P.W*P.H;i++)if(a[i*4+3]>120){P.mat[i]=id;P.tone[i]=tone==null?-1:tone;}}
function painter(P){const M=(pal,tex)=>matId(P,pal,tex||"smooth");return{
  e:(pal,tex,x,y,rx,ry,rot,tone)=>stamp(P,M(pal,tex),g=>{g.beginPath();g.ellipse(x,y,Math.max(.5,rx),Math.max(.5,ry),rot||0,0,7);g.fill();},tone),
  p:(pal,tex,pts,tone)=>stamp(P,M(pal,tex),g=>{g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fill();},tone),
  l:(pal,tex,x1,y1,x2,y2,w,tone)=>stamp(P,M(pal,tex),g=>{g.lineWidth=w;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();},tone),
  q:(pal,tex,x1,y1,cx,cy,x2,y2,w,w2,tone)=>stamp(P,M(pal,tex),g=>{const n=14;for(let i=0;i<=n;i++){const t=i/n,x=(1-t)*(1-t)*x1+2*(1-t)*t*cx+t*t*x2,y=(1-t)*(1-t)*y1+2*(1-t)*t*cy+t*t*y2,r=(w+(w2==null?w:w2-w)*t)/2;g.beginPath();g.arc(x,y,Math.max(.5,r),0,7);g.fill();}},tone),
  r:(pal,tex,x,y,w,h,tone)=>stamp(P,M(pal,tex),g=>g.fillRect(x,y,w,h),tone),
  d:(pal,x,y,tone,w,h)=>{const id=M(pal,"flat");for(let yy=0;yy<(h||1);yy++)for(let xx=0;xx<(w||1);xx++){const X=Math.round(x)+xx,Y=Math.round(y)+yy;if(X<0||Y<0||X>=P.W||Y>=P.H)continue;const i=Y*P.W+X;P.mat[i]=id;P.tone[i]=tone;}},
  // small menacing eye: dark socket, glowing slit and one glint pixel
  eye:(x,y,pal,s,dir)=>{s=s||1;const X=Math.round(x),Y=Math.round(y);const id=M("mouth","flat");for(let yy=-1;yy<=Math.max(1,s);yy++)for(let xx=-1;xx<=s;xx++){const i=(Y+yy)*P.W+X+xx;if(i>=0&&i<P.mat.length&&P.mat[i]){P.mat[i]=id;P.tone[i]=0;}}
    const ie=M(pal||"eyeY","flat");for(let xx=0;xx<s;xx++){const i=Y*P.W+X+xx;if(i>=0&&i<P.mat.length){P.mat[i]=ie;P.tone[i]=xx===0?3:2;}}if(s>1){const i=(Y+1)*P.W+X;if(i<P.mat.length){P.mat[i]=ie;P.tone[i]=1;}}},
};}
function hsh(x,y,s){let h=(x*374761393+y*668265263+s*982451653)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296;}
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function shadePart(P,seed){const{W,H,mat,tone,mats}=P;const N=W*H;const D=new Float32Array(N);
  // distance to silhouette edge (chamfer), cap 7
  for(let i=0;i<N;i++)D[i]=mat[i]?99:0;for(let pass=0;pass<2;pass++){for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!D[i])continue;let v=D[i];if(x>0)v=Math.min(v,D[i-1]+1);if(y>0)v=Math.min(v,D[i-W]+1);if(x>0&&y>0)v=Math.min(v,D[i-W-1]+1.4);if(x<W-1&&y>0)v=Math.min(v,D[i-W+1]+1.4);D[i]=v;}
    for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;if(!D[i])continue;let v=D[i];if(x<W-1)v=Math.min(v,D[i+1]+1);if(y<H-1)v=Math.min(v,D[i+W]+1);if(x<W-1&&y<H-1)v=Math.min(v,D[i+W+1]+1.4);if(x>0&&y<H-1)v=Math.min(v,D[i+W-1]+1.4);D[i]=v;}}
  // per-material distance too (for internal forms)
  const DM=new Float32Array(N);for(let i=0;i<N;i++)DM[i]=mat[i]?99:0;for(let pass=0;pass<2;pass++){for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!DM[i])continue;let v=DM[i];if(x>0)v=Math.min(v,mat[i-1]===mat[i]?DM[i-1]+1:1);else v=1;if(y>0)v=Math.min(v,mat[i-W]===mat[i]?DM[i-W]+1:1);else v=1;DM[i]=v;}
    for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;if(!DM[i])continue;let v=DM[i];v=Math.min(v,x<W-1&&mat[i+1]===mat[i]?DM[i+1]+1:1);v=Math.min(v,y<H-1&&mat[i+W]===mat[i]?DM[i+W]+1:1);DM[i]=v;}}
  const out=new ImageData(W,H);const o=out.data;const cap=6;
  const hex=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];const PC=mats.map(m=>m&&m.pal.map(hex));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,m=mat[i];if(!m)continue;const T=mats[m].tex;let t;
    if(tone[i]>=0)t=tone[i];else{
      const dd=Math.min(DM[i],cap),dg=Math.min(D[i],cap);
      const g=(xx,yy)=>{if(xx<0||yy<0||xx>=W||yy>=H)return 0;const j=yy*W+xx;return mat[j]===m?Math.min(DM[j],cap):0;};
      let nx=g(x+1,y)-g(x-1,y),ny=g(x,y+1)-g(x,y-1);const nl=Math.hypot(nx,ny)||1;nx/=nl;ny/=nl;
      // nx,ny point inward; surface facing the light (top-left) has inward normal toward bottom-right
      let lit=(nx*-LDIR[0]+ny*-LDIR[1]);if(dd>=cap-.5)lit=0.25;
      let v=0.38+0.32*lit*(1-dd/(cap+2))+0.22*(Math.min(dd,4)/4)+0.10*(Math.min(dg,5)/5)-0.06*(y/H);
      if(T==="metal")v=0.25+0.9*(v-0.38)+0.35+((x+y)%7===0?0.15:0);
      if(T==="glow")v=0.3+0.7*Math.min(1,dg/4);
      const dz=(BAYER[(y&3)*4+(x&3)]/16-0.5)*(T==="glow"?0.08:0.035);v+=dz;
      // material texture
      const r=hsh(x,y,seed);
      if(T==="fur"){if(((x*2+y*3)%5===0&&r<.55)||r<.08)v-=0.16;else if(r>.94)v+=.1;}
      else if(T==="scale"){if((((x+((y>>1)&1)*2)%4)===0&&(y%2===0))||((y%3)===2&&r<.3))v-=0.15;}
      else if(T==="stone"){if(r<.07)v-=0.22;else if(r>.95)v+=.12;if(((x*7+y*13)%23)===0)v-=.25;}
      else if(T==="bark"){if(x%3===0&&r<.7)v-=0.17;if(r>.96)v+=.1;}
      else if(T==="leaf"){if(r<.18)v-=0.15;else if(r>.86)v+=.14;}
      else if(T==="cloth"){if(x%4===1&&r<.6)v-=0.08;}
      else if(T==="bone"){if(r<.06)v-=0.2;}
      t=v<0.33?0:v<0.5?1:v<0.7?2:3;}
    const c=PC[m][Math.max(0,Math.min(3,t))];o[i*4]=c[0];o[i*4+1]=c[1];o[i*4+2]=c[2];o[i*4+3]=255;}
  // internal contour: where material changes, the lower/right pixel gets its darkest tone (selective outline)
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,m=mat[i];if(!m||tone[i]>=0||mats[m].tex==="glow")continue;const up=y>0?mat[i-W]:0,lf=x>0?mat[i-1]:0;
    if((up&&up!==m&&tone[i-W]<0)||(lf&&lf!==m&&tone[i-1]<0)){const c=PC[m][0];o[i*4]=c[0]*.8;o[i*4+1]=c[1]*.8;o[i*4+2]=c[2]*.8;}}
  // outer outline: very dark, tinted by the neighbour colour
  const o2=new Uint8ClampedArray(o);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(mat[i])continue;let nb=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<W&&Y<H&&mat[Y*W+X]){nb=mat[Y*W+X];break;}}
    if(nb){const c=PC[nb][0];const glow=mats[nb].tex==="glow";o2[i*4]=glow?c[0]*.7:c[0]*.32+6;o2[i*4+1]=glow?c[1]*.7:c[1]*.3+3;o2[i*4+2]=glow?c[2]*.7:c[2]*.34+8;o2[i*4+3]=glow?150:255;}}
  const c=document.createElement("canvas");c.width=W;c.height=H;c.getContext("2d").putImageData(new ImageData(o2,W,H),0,0);return c;}
// ---------- rig builder ----------
function rig2(key,S,name,shape,fn){const W=S,H=S,L={};const lay=(n,px,py,draw)=>{const P=newPart(W,H);draw(painter(P),false);L[n]={c:shadePart(P,n.length*7+S),px,py};
    if(n==="head"){const B=newPart(W,H);draw(painter(B),true);L.headB={c:shadePart(B,n.length*7+S),px,py};}};
  fn(lay,W,H);return{W,H,L,name,shape,v2:1};}
// generic biped: o={h, bulk, skin, cloth, arms, legsPal, head(m,back,g), weapon(m,g), hunch, extra(lay,g)}
function biped(lay,W,H,o){const gy=H-1,h=o.h,cx=W*.5,bw=h*(o.bulk||.34),hip=gy-h*.44,sh=gy-h*.8+(o.hunch||0),hr=h*(o.headR||.13);
  const G={cx,gy,h,bw,hip,sh,hr,hy:sh-hr*.75-(o.neck||0)+(o.hunch||0)*.6,hx:cx-(o.hunch||0)*.5};
  if(o.extra)o.extra(lay,G);
  lay("legs",cx,gy,(m)=>{const lp=o.legsPal||o.skin,lt=o.legsTex||"fur";for(const s of [-1,1]){const x=cx+s*bw*.28;
      if(o.digi){m.q(lp,lt,x,hip,x+s*1+h*.1,hip+h*.22,x-h*.02,gy-1,bw*.42,bw*.24);}else m.l(lp,lt,x,hip,x+s*.5,gy-2,bw*.36);
      m.e(o.footPal||lp,o.footTex||lt,x-h*.03,gy-1.2,bw*.26,Math.max(1.2,h*.035));
      if(o.boots)m.l(o.boots,"smooth",x,gy-h*.16,x,gy-2,bw*.4);}});
  lay("body",cx,gy,(m)=>{// far arm behind torso
      const ap=o.armPal||o.skin;m.l(ap,o.armTex||"fur",cx-bw*.55,sh+2,cx-bw*.75,hip+h*.06,bw*.3);m.e(ap,o.armTex||"fur",cx-bw*.76,hip+h*.08,bw*.17,bw*.17);
      m.p(o.skin,o.skinTex||"fur",[cx-bw*.6,sh,cx+bw*.6,sh,cx+bw*.42,hip+2,cx-bw*.42,hip+2]);m.e(o.skin,o.skinTex||"fur",cx,sh+h*.06,bw*.62,h*.1);
      if(o.torso)o.torso(m,G);});
  lay("arm",cx+bw*.52,sh+2,(m)=>{const ap=o.armPal||o.skin;if(o.weapon)o.weapon(m,G,"back");m.l(ap,o.armTex||"fur",cx+bw*.52,sh+2,cx+bw*.74,hip+h*.04,bw*.32);
      m.e(o.handPal||ap,o.armTex||"fur",cx+bw*.76,hip+h*.06,bw*.19,bw*.19);if(o.weapon)o.weapon(m,G,"front");});
  lay("head",G.hx,sh+2,(m,back)=>o.head(m,back,G));
  return G;}
const HUM=new Set(["goblin","gslinger","shaman","orc","orcclub","warchief"]);
function buildMon2(key){const def=MONDEF[key]||{};const S=MONDEF[key]?MONDEF[key][3]:({goblin:36,gslinger:36,shaman:38,orc:46,orcclub:46,warchief:58})[key];
  const name=MONDEF[key]?MONDEF[key][0]:(SPECIES[key]&&SPECIES[key].name)||key;const shape=MONDEF[key]?MONDEF[key][1]:(key.startsWith("orc")||key==="warchief"?"orc":"goblin");
  const PAL={slime:"slimeB",meadowslime:"slimeG",emberslime:"ember",steelslime:"steel",kingslime:"slimeP",duskbat:"night",vampbat:"crim",imp:"demonR",heximp:"demonN",viper:"snakeG",cobra:"sand",seaserpent:"teal",
    snapbloom:"petal",venusmaw:"petalP",mudgolem:"mud",stonegolem:"stone",boss:"lava",gazer:"pinkF",evileye:"night",wisp:"wispT",firespirit:"fire",dreadknight:"iron",knight:"rust",cyclops:"cyc",gargoyle:"stone",demonlord:"crim",archfiend:"demonN"}[key];
  return rig2(key,S,name,shape,(lay,W,H)=>{const X=a=>a*W,Y=b=>b*H;switch(shape){
  case "slime":{const big=key==="kingslime";const top=big?.42:.56;const pal=PAL,tex=key==="steelslime"?"metal":"smooth";
    lay("body",X(.5),H,(m)=>{m.p(pal,tex,[X(.5),Y(top),X(.6),Y(top+.12),X(.86),Y(.8),X(.84),Y(.97),X(.16),Y(.97),X(.14),Y(.8),X(.4),Y(top+.12)]);m.e(pal,tex,X(.5),Y(.84),X(.37),Y(.15));
      m.q(pal,tex,X(.5),Y(top+.02),X(.58),Y(top-.05),X(.62),Y(top-.02),2.2*W/30,1.2);
      // gloss and inner core
      m.e(pal,"flat",X(.36),Y(.74),X(.05),Y(.035),-.5,3);m.d(pal,X(.3),Y(.8),3,1,1);if(key!=="steelslime")m.e(pal,"flat",X(.56),Y(.88),X(.08),Y(.04),0,1);
      m.eye(X(.38),Y(.79),key==="emberslime"?"fire":"eyeW",big?2:1);m.eye(X(.56),Y(.79),key==="emberslime"?"fire":"eyeW",big?2:1);
      m.l("mouth","flat",X(.42),Y(.88),X(.54),Y(.875),big?2:1,0);m.d("tooth",X(.45),Y(.885),2);m.d("tooth",X(.51),Y(.882),2);
      if(big){m.p("gold","metal",[X(.32),Y(.47),X(.36),Y(.34),X(.42),Y(.42),X(.5),Y(.3),X(.58),Y(.42),X(.64),Y(.34),X(.68),Y(.47)]);m.r("gold","metal",X(.32),Y(.45),X(.36),Y(.05));m.d("iris",X(.49),Y(.43),2,2,2);}});break;}
  case "bat":{const pal=PAL,mb=key==="vampbat"?"membR":"memb";
    for(const [n,s] of [["wingL",-1],["wingR",1]])lay(n,X(.5+s*.08),Y(.5),(m)=>{const bx=X(.5+s*.08),by=Y(.5);m.p(mb,"smooth",[bx,by-2,X(.5+s*.46),Y(.28),X(.5+s*.48),Y(.42),X(.5+s*.38),Y(.5),X(.5+s*.3),Y(.62),X(.5+s*.2),Y(.56),bx,by+4]);
      m.l(pal,"fur",bx,by-1,X(.5+s*.46),Y(.28),1.3);m.l(pal,"fur",X(.5+s*.3),Y(.36),X(.5+s*.38),Y(.5),1);m.l(pal,"fur",X(.5+s*.24),Y(.38),X(.5+s*.3),Y(.62),1);m.d("horn",X(.5+s*.46),Y(.27),3);});
    lay("body",X(.5),Y(.72),(m)=>{m.e(pal,"fur",X(.5),Y(.53),X(.12),Y(.13));m.l(pal,"fur",X(.46),Y(.64),X(.45),Y(.72),1.5);m.l(pal,"fur",X(.54),Y(.64),X(.55),Y(.72),1.5);});
    lay("head",X(.5),Y(.46),(m,b)=>{m.p(pal,"fur",[X(.38),Y(.42),X(.36),Y(.22),X(.46),Y(.36)]);m.p(pal,"fur",[X(.62),Y(.42),X(.64),Y(.22),X(.54),Y(.36)]);m.e(pal,"fur",X(.5),Y(.42),X(.12),Y(.1));
      if(!b){m.e(pal,"smooth",X(.5),Y(.47),X(.05),Y(.035));m.eye(X(.43),Y(.4),"iris",1);m.eye(X(.55),Y(.4),"iris",1);m.d("tooth",X(.47),Y(.5),3,1,2);m.d("tooth",X(.52),Y(.5),3,1,2);}});break;}
  case "imp":{const pal=PAL;
    lay("wingL",X(.44),Y(.5),(m)=>{m.p("memb","smooth",[X(.44),Y(.46),X(.12),Y(.22),X(.16),Y(.4),X(.1),Y(.52),X(.3),Y(.56),X(.42),Y(.6)]);m.l(pal,"smooth",X(.44),Y(.46),X(.12),Y(.22),1.2);});
    lay("wingR",X(.56),Y(.5),(m)=>{m.p("memb","smooth",[X(.56),Y(.46),X(.88),Y(.22),X(.84),Y(.4),X(.9),Y(.52),X(.7),Y(.56),X(.58),Y(.6)]);m.l(pal,"smooth",X(.56),Y(.46),X(.88),Y(.22),1.2);});
    lay("tail",X(.56),Y(.8),(m)=>{m.q(pal,"smooth",X(.56),Y(.8),X(.86),Y(.92),X(.84),Y(.64),2,1);m.p(pal,"smooth",[X(.8),Y(.64),X(.88),Y(.62),X(.84),Y(.54)]);});
    biped(lay,W,H,{h:H*.58,bulk:.36,skin:pal,skinTex:"smooth",legsTex:"smooth",armTex:"smooth",digi:1,headR:.17,hunch:1,
      torso:(m,G)=>{m.r("leather","cloth",G.cx-G.bw*.42,G.hip-2,G.bw*.84,3);},
      weapon:(m,G,ph)=>{if(ph!=="back")return;m.l("wood","bark",G.cx+G.bw*.8,G.gy-2,G.cx+G.bw*.8,G.sh-G.h*.35,1.4);m.p("iron","metal",[G.cx+G.bw*.55,G.sh-G.h*.3,G.cx+G.bw*1.05,G.sh-G.h*.3,G.cx+G.bw*1.05,G.sh-G.h*.48,G.cx+G.bw*.97,G.sh-G.h*.36,G.cx+G.bw*.8,G.sh-G.h*.52,G.cx+G.bw*.63,G.sh-G.h*.36,G.cx+G.bw*.55,G.sh-G.h*.48]);},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.p("horn","bone",[hx-hr*.7,hy-hr*.5,hx-hr*1.1,hy-hr*1.6,hx-hr*.2,hy-hr*.8]);m.p("horn","bone",[hx+hr*.7,hy-hr*.5,hx+hr*1.1,hy-hr*1.6,hx+hr*.2,hy-hr*.8]);
        m.e(pal,"smooth",hx,hy,hr,hr*.9);m.p(pal,"smooth",[hx-hr*.9,hy,hx-hr*1.5,hy-hr*.5,hx-hr*.7,hy-hr*.35]);m.p(pal,"smooth",[hx+hr*.9,hy,hx+hr*1.5,hy-hr*.5,hx+hr*.7,hy-hr*.35]);
        if(!b){m.eye(hx-hr*.55,hy-hr*.15,key==="heximp"?"wispT":"eyeY",1);m.eye(hx+hr*.2,hy-hr*.15,key==="heximp"?"wispT":"eyeY",1);m.l("mouth","flat",hx-hr*.45,hy+hr*.45,hx+hr*.35,hy+hr*.5,1,0);m.d("tooth",hx-hr*.3,hy+hr*.5,3);m.d("tooth",hx+hr*.15,hy+hr*.5,3);}}});break;}
  case "snake":{const pal=PAL,big=key==="seaserpent";const hood=key==="cobra";
    lay("tail",X(.5),Y(.9),(m)=>{m.q(pal,"scale",X(.18),Y(.9),X(.3),Y(.99),X(.6),Y(.93),X(.07),X(.13));m.q(pal,"scale",X(.6),Y(.93),X(.86),Y(.88),X(.72),Y(.8),X(.13),X(.06));if(big)for(let i=0;i<3;i++)m.p("teal","smooth",[X(.3+i*.14),Y(.86),X(.36+i*.14),Y(.76),X(.4+i*.14),Y(.87)]);});
    lay("body",X(.5),Y(.9),(m)=>{m.q(pal,"scale",X(.62),Y(.86),X(.42),Y(.78),X(.46),Y(.5),X(.14),X(.1));m.q("belly","scale",X(.58),Y(.84),X(.44),Y(.76),X(.48),Y(.52),X(.06),X(.04));if(big)m.p("teal","smooth",[X(.46),Y(.5),X(.62),Y(.56),X(.5),Y(.66)]);});
    lay("head",X(.47),Y(.48),(m,b)=>{const hx=X(.44),hy=Y(.38),r=X(big?.1:.09);if(hood)m.e(pal,"scale",hx+r*.2,hy+r*1.1,r*1.6,r*1.5);if(big){m.p("teal","smooth",[hx+r*.4,hy-r*.6,hx+r*1.6,hy-r*1.6,hx+r*1.2,hy+r*.2]);}
      m.e(pal,"scale",hx,hy,r*1.1,r*.8,-.15);m.e(pal,"scale",hx-r*.9,hy+r*.2,r*.7,r*.5);if(!b){m.eye(hx-r*.6,hy-r*.25,big?"eyeY":"iris",big?2:1);m.l("mouth","flat",hx-r*1.5,hy+r*.5,hx-r*.2,hy+r*.55,1,0);m.d("iris",hx-r*1.8,hy+r*.6,1,1,2);m.d("iris",hx-r*2.1,hy+r*.75,1,1,1);}
      if(hood&&!b){m.d("mouth",hx+r*.1,hy+r*1.3,1,2,1);m.d("mouth",hx+r*.9,hy+r*1.3,1,2,1);}});break;}
  case "plant":{const pal=PAL;
    lay("arm",X(.5),Y(.78),(m)=>{for(const s of [-1,1]){m.q("leaf","leaf",X(.5),Y(.8),X(.5+s*.22),Y(.66),X(.5+s*.38),Y(.74),X(.05),X(.02));m.e("leaf","leaf",X(.5+s*.28),Y(.73),X(.1),Y(.045),s*.4);}});
    lay("body",X(.5),H,(m)=>{m.q("leaf","leaf",X(.5),Y(.96),X(.44),Y(.7),X(.5),Y(.46),X(.06),X(.05));m.e("mud","stone",X(.5),Y(.96),X(.2),Y(.05));for(let i=0;i<5;i++)m.l("bark","bark",X(.5),Y(.95),X(.32+i*.09),Y(.99),1.2);});
    lay("head",X(.5),Y(.46),(m,b)=>{const big=key==="venusmaw";const r=X(big?.24:.2),cx=X(.5),cy=Y(.36);for(let i=0;i<7;i++){const a=i/7*Math.PI*2-.3;m.e(pal,"smooth",cx+Math.cos(a)*r*.85,cy+Math.sin(a)*r*.7,r*.5,r*.32,a);}
      m.e("leaf","leaf",cx,cy+r*.1,r*.62,r*.5);if(!b){m.e("mouth","flat",cx,cy+r*.12,r*.5,r*.32,0,0);m.e("mouth","flat",cx,cy+r*.12,r*.38,r*.18,0,1);for(let i=0;i<5;i++){m.d("tooth",cx-r*.42+i*r*.21,cy-r*.12,2,1,2);m.d("tooth",cx-r*.32+i*r*.18,cy+r*.36,2,1,2);}}});break;}
  case "treant":{lay("legs",X(.5),H,(m)=>{for(const s of [-1,-.4,.4,1])m.q("bark","bark",X(.5+s*.1),Y(.82),X(.5+s*.22),Y(.9),X(.5+s*.3),Y(.99),X(.07),X(.03));});
    lay("body",X(.5),H,(m)=>{m.p("bark","bark",[X(.38),Y(.36),X(.62),Y(.36),X(.66),Y(.9),X(.34),Y(.9)]);m.e("moss","leaf",X(.42),Y(.62),X(.05),Y(.08));
      m.e("bark","flat",X(.5),Y(.58),X(.07),Y(.05),0,0);m.eye(X(.42),Y(.48),"eyeY",2);m.eye(X(.54),Y(.48),"eyeY",2);m.l("mouth","flat",X(.44),Y(.6),X(.56),Y(.61),2,0);});
    lay("arm",X(.6),Y(.42),(m)=>{m.q("bark","bark",X(.6),Y(.42),X(.82),Y(.42),X(.86),Y(.66),X(.06),X(.03));for(const a of [0,1,2])m.l("bark","bark",X(.86),Y(.66),X(.8+a*.06),Y(.74),1.5);m.e("leaf","leaf",X(.82),Y(.42),X(.08),Y(.06));});
    lay("head",X(.5),Y(.36),(m,b)=>{for(let i=0;i<9;i++){const a=i/9*Math.PI*2;m.e("leaf","leaf",X(.5)+Math.cos(a)*X(.22),Y(.2)+Math.sin(a)*Y(.12),X(.16),Y(.11));}m.e("leaf","leaf",X(.5),Y(.2),X(.3),Y(.16));m.q("bark","bark",X(.38),Y(.36),X(.3),Y(.3),X(.24),Y(.28),X(.04),X(.02));});break;}
  case "golem":{const pal=PAL,tex=key==="mudgolem"?"stone":"stone",lava=key==="boss";const h=key==="boss"?.86:key==="stonegolem"?.78:.74;
    biped(lay,W,H,{h:H*h,bulk:.5,skin:pal,skinTex:tex,legsTex:tex,armTex:tex,headR:.11,neck:-H*.02,
      torso:(m,G)=>{m.p(pal,tex,[G.cx-G.bw*.75,G.sh-2,G.cx+G.bw*.75,G.sh-2,G.cx+G.bw*.5,G.sh+G.h*.18,G.cx-G.bw*.5,G.sh+G.h*.18]);
        if(lava){m.l("fire","glow",G.cx-G.bw*.3,G.sh+G.h*.05,G.cx+G.bw*.1,G.sh+G.h*.22,1.4);m.l("fire","glow",G.cx+G.bw*.1,G.sh+G.h*.22,G.cx-G.bw*.1,G.hip,1.2);m.e("fire","glow",G.cx,G.sh+G.h*.12,G.bw*.18,G.bw*.18);}
        if(key==="mudgolem"){m.e("moss","leaf",G.cx-G.bw*.4,G.sh,G.bw*.25,G.bw*.12);}},
      weapon:(m,G,ph)=>{if(ph==="front"){m.e(pal,tex,G.cx+G.bw*.78,G.hip+G.h*.08,G.bw*.32,G.bw*.3);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.r(pal,tex,hx-hr*1.1,hy-hr*.9,hr*2.2,hr*1.9);if(!b){m.r("mouth","flat",hx-hr*.9,hy-hr*.15,hr*1.8,Math.max(1,hr*.5),0);m.d(lava?"fire":"wispT",hx-hr*.7,hy-hr*.1,3,2,1);m.d(lava?"fire":"wispT",hx+hr*.2,hy-hr*.1,3,2,1);}}});break;}
  case "undead":{biped(lay,W,H,{h:H*.68,bulk:.3,skin:"wrap",skinTex:"cloth",legsTex:"cloth",armTex:"cloth",headR:.15,hunch:1.5,
      torso:(m,G)=>{for(let i=0;i<4;i++)m.l("wrap","flat",G.cx-G.bw*.5,G.sh+i*G.h*.09+2,G.cx+G.bw*.5,G.sh+i*G.h*.09+4,1,0);m.l("wrap","cloth",G.cx+G.bw*.3,G.hip,G.cx+G.bw*.45,G.hip+G.h*.18,1.5);},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.e("wrap","cloth",hx,hy,hr,hr*1.05);for(let i=0;i<3;i++)m.l("wrap","flat",hx-hr,hy-hr*.5+i*hr*.5,hx+hr,hy-hr*.3+i*hr*.5,1,0);if(!b){m.e("mouth","flat",hx-hr*.35,hy,hr*.25,hr*.18,0,0);m.d("iris",hx-hr*.45,hy,2,1,3);}}});break;}
  case "skeleton":{biped(lay,W,H,{h:H*.68,bulk:.28,skin:"bone",skinTex:"bone",legsTex:"bone",armTex:"bone",headR:.15,
      torso:(m,G)=>{m.r("leather","cloth",G.cx-G.bw*.5,G.hip-2,G.bw,3);for(let i=0;i<3;i++)m.l("mouth","flat",G.cx-G.bw*.4,G.sh+3+i*2.5,G.cx+G.bw*.4,G.sh+3+i*2.5,1,1);m.e("rust","metal",G.cx-G.bw*.85,G.sh+G.h*.2,G.bw*.45,G.bw*.55);},
      weapon:(m,G,ph)=>{if(ph==="back"){m.l("iron","metal",G.cx+G.bw*.8,G.hip+G.h*.04,G.cx+G.bw*.9,G.sh-G.h*.3,2);m.l("rust","metal",G.cx+G.bw*.55,G.hip,G.cx+G.bw*1.05,G.hip,1.5);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.e("bone","bone",hx,hy,hr,hr);m.r("bone","bone",hx-hr*.55,hy+hr*.5,hr*1.1,hr*.6);m.e("rust","metal",hx,hy-hr*.4,hr*1.05,hr*.65);
        if(!b){m.e("mouth","flat",hx-hr*.45,hy+hr*.05,hr*.3,hr*.3,0,0);m.e("mouth","flat",hx+hr*.25,hy+hr*.05,hr*.25,hr*.3,0,0);m.d("iris",hx-hr*.5,hy+hr*.05,1,1,3);m.d("iris",hx+hr*.2,hy+hr*.05,1,1,3);for(let i=0;i<3;i++)m.d("mouth",hx-hr*.4+i*hr*.4,hy+hr*.75,0,1,1);}}});break;}
  case "beast":{lay("tail",X(.42),Y(.66),(m)=>{m.q("furG","fur",X(.42),Y(.66),X(.22),Y(.72),X(.2),Y(.86),X(.07),X(.04));});
    biped(lay,W,H,{h:H*.74,bulk:.38,skin:"furG",digi:1,headR:.14,hunch:3,neck:-2,
      torso:(m,G)=>{m.e("furG","fur",G.cx-G.bw*.1,G.sh+G.h*.04,G.bw*.7,G.h*.12);m.l("leather","cloth",G.cx-G.bw*.45,G.hip,G.cx+G.bw*.45,G.hip,2);m.p("clothB","cloth",[G.cx-G.bw*.4,G.hip,G.cx+G.bw*.4,G.hip,G.cx+G.bw*.3,G.hip+G.h*.15,G.cx-G.bw*.3,G.hip+G.h*.15]);},
      weapon:(m,G,ph)=>{if(ph==="front")for(let i=0;i<3;i++)m.l("bone","bone",G.cx+G.bw*.7+i*1.2,G.hip+G.h*.1,G.cx+G.bw*.6+i*1.5,G.hip+G.h*.17,1);},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.p("furG","fur",[hx+hr*.1,hy-hr*.6,hx+hr*.5,hy-hr*1.6,hx+hr*.9,hy-hr*.4]);m.p("furG","fur",[hx-hr*.5,hy-hr*.6,hx-hr*.3,hy-hr*1.5,hx+hr*.2,hy-hr*.6]);
        m.e("furG","fur",hx+hr*.1,hy,hr,hr*.9);m.e("furG","fur",hx-hr*.9,hy+hr*.35,hr*.75,hr*.42);if(!b){m.d("mouth",hx-hr*1.6,hy+hr*.15,1,2,0);m.l("mouth","flat",hx-hr*1.5,hy+hr*.65,hx-hr*.3,hy+hr*.6,1,0);m.d("tooth",hx-hr*1.2,hy+hr*.7,2);m.d("tooth",hx-hr*.7,hy+hr*.7,2);m.eye(hx-hr*.4,hy-hr*.25,"eyeY",1);}}});break;}
  case "lion":{const hp=Y(.6);
    lay("tail",X(.78),Y(.6),(m)=>{m.q("furGold","fur",X(.78),Y(.6),X(.95),Y(.56),X(.92),Y(.4),2.2,1.4);m.e("mane","fur",X(.92),Y(.4),X(.035),X(.05));});
    lay("legs",X(.5),H,(m)=>{for(const [x,s] of [[.3,1],[.4,-1],[.66,1],[.76,-1]]){m.l("furGold","fur",X(x),hp,X(x)+s*.5,Y(.97),X(.075));m.e("furGold","fur",X(x)-1,Y(.97),X(.05),2);}});
    lay("body",X(.5),H,(m)=>{m.e("furGold","fur",X(.54),Y(.6),X(.27),Y(.15));m.e("belly","fur",X(.52),Y(.68),X(.18),Y(.06));});
    lay("head",X(.3),Y(.52),(m,b)=>{m.e("mane","fur",X(.3),Y(.48),X(.17),Y(.19));m.e("furGold","fur",X(.24),Y(.5),X(.1),Y(.1));m.e("furGold","fur",X(.17),Y(.55),X(.07),Y(.05));
      if(!b){m.d("mouth",X(.12),Y(.53),1,2,0);m.l("mouth","flat",X(.12),Y(.59),X(.22),Y(.59),1,0);m.d("tooth",X(.15),Y(.6),2);m.eye(X(.21),Y(.46),"eyeY",1);}});break;}
  case "eye":{const pal=PAL;lay("legs",X(.5),Y(.7),(m)=>{for(let i=0;i<5;i++){const x=X(.36+i*.07);m.q(pal,"smooth",x,Y(.62),x+(i-2)*1.5,Y(.78),x+(i%2?2:-2),Y(.92),2,1);}});
    lay("body",X(.5),Y(.7),(m)=>{m.e(pal,"smooth",X(.5),Y(.46),X(.22),Y(.2));if(key==="evileye")for(const s of [-1,1])m.p("memb","smooth",[X(.5+s*.18),Y(.4),X(.5+s*.45),Y(.24),X(.5+s*.4),Y(.5)]);});
    lay("head",X(.5),Y(.46),(m,b)=>{if(b)return;m.e("eyeW","smooth",X(.48),Y(.46),X(.13),Y(.11));m.e("iris","smooth",X(.45),Y(.47),X(.07),Y(.075));m.e("mouth","flat",X(.44),Y(.47),X(.03),Y(.05),0,0);m.d("eyeW",X(.42),Y(.43),3,1,1);
      m.l(pal,"smooth",X(.32),Y(.4),X(.64),Y(.36),2);});break;}
  case "wisp":{const pal=PAL;lay("body",X(.5),Y(.7),(m)=>{m.p(pal,"glow",[X(.5),Y(.12),X(.64),Y(.38),X(.7),Y(.6),X(.5),Y(.78),X(.3),Y(.6),X(.36),Y(.38)]);m.e(pal,"glow",X(.5),Y(.58),X(.18),Y(.18));m.e(pal,"glow",X(.5),Y(.58),X(.09),Y(.1),0,3);});
    lay("head",X(.5),Y(.55),(m,b)=>{if(b)return;m.d("mouth",X(.42),Y(.54),1,2,1);m.d("mouth",X(.54),Y(.54),1,2,1);m.d("mouth",X(.46),Y(.64),1,4,1);});break;}
  case "knight":{const pal=PAL||"iron";biped(lay,W,H,{h:H*.72,bulk:.36,skin:pal,skinTex:"metal",legsTex:"metal",armTex:"metal",headR:.13,
      extra:(lay,G)=>lay("tail",G.cx,G.sh,(m)=>m.p("clothR","cloth",[G.cx-G.bw*.5,G.sh,G.cx+G.bw*.5,G.sh,G.cx+G.bw*.8,G.gy-2,G.cx-G.bw*.9,G.gy-3])),
      torso:(m,G)=>{m.e("shadowP","metal",G.cx-G.bw*.9,G.sh+G.h*.22,G.bw*.45,G.bw*.65);m.d("crim",G.cx-G.bw*.9,G.sh+G.h*.18,2,3,2);m.l("leather","cloth",G.cx-G.bw*.45,G.hip-1,G.cx+G.bw*.45,G.hip-1,2);},
      weapon:(m,G,ph)=>{if(ph==="back"){m.l("steel","metal",G.cx+G.bw*.78,G.hip+G.h*.05,G.cx+G.bw*.8,G.sh-G.h*.42,2.2);m.l("gold","metal",G.cx+G.bw*.5,G.hip+G.h*.02,G.cx+G.bw*1.1,G.hip+G.h*.02,1.5);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.e(pal,"metal",hx,hy,hr,hr*1.1);m.p(pal,"metal",[hx-hr,hy,hx+hr,hy,hx+hr*.8,hy+hr*1.1,hx-hr*.8,hy+hr*1.1]);m.p("clothR","cloth",[hx,hy-hr,hx+hr*.3,hy-hr*2,hx+hr*.9,hy-hr*1.4]);
        if(!b){m.l("mouth","flat",hx-hr*.8,hy+hr*.1,hx+hr*.5,hy+hr*.1,1.4,0);m.d("iris",hx-hr*.5,hy+hr*.1,1,1,3);m.d("iris",hx+hr*.1,hy+hr*.1,1,1,3);}}});break;}
  case "cyclops":{const pal=PAL;biped(lay,W,H,{h:H*.86,bulk:.42,skin:pal,skinTex:"smooth",legsTex:"smooth",armTex:"smooth",headR:.12,
      torso:(m,G)=>{m.p("furB","fur",[G.cx-G.bw*.48,G.hip-2,G.cx+G.bw*.48,G.hip-2,G.cx+G.bw*.4,G.hip+G.h*.16,G.cx-G.bw*.42,G.hip+G.h*.14]);m.l("leather","cloth",G.cx-G.bw*.5,G.hip-1,G.cx+G.bw*.5,G.hip-1,2);},
      weapon:(m,G,ph)=>{if(ph==="back"){m.q("wood","bark",G.cx+G.bw*.78,G.hip+G.h*.08,G.cx+G.bw*.95,G.sh-G.h*.1,G.cx+G.bw*1.05,G.sh-G.h*.36,2.5,6);for(let i=0;i<3;i++)m.d("iron",G.cx+G.bw*(1+i*.05),G.sh-G.h*(.25+i*.04),2,1,1);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.e(pal,"smooth",hx,hy,hr,hr*1.05);m.p("horn","bone",[hx-hr*.2,hy-hr*.8,hx,hy-hr*1.7,hx+hr*.3,hy-hr*.8]);
        if(!b){m.e("eyeW","smooth",hx-hr*.2,hy-hr*.2,hr*.42,hr*.32);m.e("iris","flat",hx-hr*.3,hy-hr*.2,hr*.18,hr*.22,0,2);m.d("mouth",hx-hr*.32,hy-hr*.22,1,1,0);m.l("mouth","flat",hx-hr*.7,hy+hr*.55,hx+hr*.4,hy+hr*.6,1.5,0);m.d("tooth",hx-hr*.5,hy+hr*.6,2);m.d("tooth",hx+hr*.1,hy+hr*.6,2);}}});break;}
  case "gargoyle":{const pal=PAL;
    lay("wingL",X(.42),Y(.45),(m)=>{m.p(pal,"stone",[X(.42),Y(.42),X(.06),Y(.18),X(.12),Y(.4),X(.04),Y(.52),X(.36),Y(.6)]);m.l(pal,"stone",X(.42),Y(.42),X(.06),Y(.18),1.5);});
    lay("wingR",X(.58),Y(.45),(m)=>{m.p(pal,"stone",[X(.58),Y(.42),X(.94),Y(.18),X(.88),Y(.4),X(.96),Y(.52),X(.64),Y(.6)]);m.l(pal,"stone",X(.58),Y(.42),X(.94),Y(.18),1.5);});
    lay("tail",X(.5),Y(.82),(m)=>{m.q(pal,"stone",X(.5),Y(.82),X(.8),Y(.95),X(.86),Y(.76),2.5,1.2);m.p(pal,"stone",[X(.82),Y(.76),X(.9),Y(.74),X(.86),Y(.66)]);});
    biped(lay,W,H,{h:H*.66,bulk:.4,skin:pal,skinTex:"stone",legsTex:"stone",armTex:"stone",digi:1,headR:.14,hunch:3,
      weapon:(m,G,ph)=>{if(ph==="front")for(let i=0;i<3;i++)m.l("horn","bone",G.cx+G.bw*.7+i*1.3,G.hip+G.h*.1,G.cx+G.bw*.62+i*1.6,G.hip+G.h*.18,1);},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.p("horn","bone",[hx-hr*.4,hy-hr*.6,hx-hr*.1,hy-hr*1.8,hx+hr*.3,hy-hr*.6]);m.e(pal,"stone",hx,hy,hr,hr*.9);m.e(pal,"stone",hx-hr*.8,hy+hr*.3,hr*.6,hr*.4);
        if(!b){m.eye(hx-hr*.5,hy-hr*.2,"iris",1);m.eye(hx+hr*.2,hy-hr*.2,"iris",1);m.l("mouth","flat",hx-hr*1.3,hy+hr*.6,hx-hr*.2,hy+hr*.55,1,0);m.d("tooth",hx-hr*1,hy+hr*.65,2);}}});break;}
  case "demon":{const pal=PAL,lord=key==="demonlord";
    lay("wingL",X(.42),Y(.38),(m)=>{m.p("membR","smooth",[X(.42),Y(.34),X(.02),Y(.06),X(.1),Y(.3),X(.0),Y(.44),X(.14),Y(.46),X(.36),Y(.58)]);m.l(pal,"smooth",X(.42),Y(.34),X(.02),Y(.06),2);m.l(pal,"smooth",X(.2),Y(.18),X(.1),Y(.3),1);});
    lay("wingR",X(.58),Y(.38),(m)=>{m.p("membR","smooth",[X(.58),Y(.34),X(.98),Y(.06),X(.9),Y(.3),X(1),Y(.44),X(.86),Y(.46),X(.64),Y(.58)]);m.l(pal,"smooth",X(.58),Y(.34),X(.98),Y(.06),2);m.l(pal,"smooth",X(.8),Y(.18),X(.9),Y(.3),1);});
    lay("tail",X(.5),Y(.8),(m)=>{m.q(pal,"smooth",X(.5),Y(.8),X(.82),Y(.98),X(.9),Y(.8),2.4,1.2);m.p(pal,"smooth",[X(.86),Y(.8),X(.94),Y(.78),X(.9),Y(.7)]);});
    biped(lay,W,H,{h:H*.8,bulk:.36,skin:pal,skinTex:"smooth",legsTex:"smooth",armTex:"smooth",digi:1,headR:.1,
      torso:(m,G)=>{m.p(lord?"shadowP":"clothP","cloth",[G.cx-G.bw*.62,G.sh,G.cx+G.bw*.62,G.sh,G.cx+G.bw*.85,G.gy-G.h*.12,G.cx-G.bw*.85,G.gy-G.h*.12]);m.p("gold","metal",[G.cx-G.bw*.65,G.sh-1,G.cx+G.bw*.65,G.sh-1,G.cx+G.bw*.4,G.sh+G.h*.08,G.cx-G.bw*.4,G.sh+G.h*.08]);m.e("iris","flat",G.cx,G.sh+G.h*.05,G.bw*.12,G.bw*.12,0,2);},
      weapon:(m,G,ph)=>{if(ph==="back"){m.l("wood","bark",G.cx+G.bw*.8,G.gy-2,G.cx+G.bw*.8,G.sh-G.h*.3,1.6);m.e("iris","glow",G.cx+G.bw*.8,G.sh-G.h*.33,G.bw*.14,G.bw*.14);m.p("horn","bone",[G.cx+G.bw*.6,G.sh-G.h*.25,G.cx+G.bw*.8,G.sh-G.h*.2,G.cx+G.bw*1,G.sh-G.h*.25,G.cx+G.bw*.8,G.sh-G.h*.42]);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.q("horn","bone",hx-hr*.6,hy-hr*.6,hx-hr*1.8,hy-hr*1.2,hx-hr*1.4,hy-hr*2.6,hr*.7,hr*.2);m.q("horn","bone",hx+hr*.6,hy-hr*.6,hx+hr*1.8,hy-hr*1.2,hx+hr*1.4,hy-hr*2.6,hr*.7,hr*.2);
        m.e(pal,"smooth",hx,hy,hr,hr*1.15);m.p(pal,"smooth",[hx-hr*.7,hy+hr*.7,hx+hr*.7,hy+hr*.7,hx,hy+hr*1.6]);if(!b){m.eye(hx-hr*.6,hy-hr*.1,"eyeY",1);m.eye(hx+hr*.2,hy-hr*.1,"eyeY",1);m.l("mouth","flat",hx-hr*.5,hy+hr*.65,hx+hr*.4,hy+hr*.65,1,0);m.d("tooth",hx-hr*.3,hy+hr*.75,2);m.d("tooth",hx+hr*.2,hy+hr*.75,2);}}});break;}
  case "goblin":{const sh=key==="shaman",sl=key==="gslinger";biped(lay,W,H,{h:H*.62,bulk:.34,skin:"gob",skinTex:"smooth",armTex:"smooth",legsPal:"leather",legsTex:"cloth",footPal:"leather",headR:.17,hunch:1.5,
      torso:(m,G)=>{m.p(sh?"clothP":"leather","cloth",[G.cx-G.bw*.55,G.sh+1,G.cx+G.bw*.55,G.sh+1,G.cx+G.bw*.6,G.hip+G.h*(sh?.32:.1),G.cx-G.bw*.6,G.hip+G.h*(sh?.32:.1)]);m.l("rust","cloth",G.cx-G.bw*.5,G.sh+1,G.cx+G.bw*.4,G.hip,1.2);if(sh)for(let i=0;i<3;i++)m.d("bone",G.cx-G.bw*.3+i*2,G.sh+3,2,1,2);},
      weapon:(m,G,ph)=>{if(ph!=="back")return;const hx=G.cx+G.bw*.78,hy=G.hip+G.h*.06;if(sh){m.l("wood","bark",hx,G.gy-1,hx+1,G.sh-G.h*.3,1.4);m.e("bone","bone",hx+1,G.sh-G.h*.32,2.2,2.2);m.d("wispT",hx,G.sh-G.h*.34,2,1,3);}
        else if(sl){m.l("leather","cloth",hx,hy,hx+3,hy+5,1);m.e("stone","stone",hx+3,hy+6,1.5,1.5);}else{m.l("steel","metal",hx,hy,hx+G.h*.08,hy-G.h*.22,1.4);m.l("leather","cloth",hx-1,hy+1,hx+1,hy-1,1.5);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.p("gob","smooth",[hx-hr*.7,hy-hr*.2,hx-hr*2,hy-hr*.9,hx-hr*.6,hy+hr*.3]);m.p("gob","smooth",[hx+hr*.7,hy-hr*.2,hx+hr*1.9,hy-hr*1,hx+hr*.6,hy+hr*.3]);m.e("gob","smooth",hx,hy,hr*.95,hr*.9);
        m.e("gob","smooth",hx-hr*.75,hy+hr*.15,hr*.35,hr*.3);if(sh)m.p("clothP","cloth",[hx-hr,hy-hr*.3,hx+hr,hy-hr*.3,hx+hr*.2,hy-hr*1.9]);
        if(!b){m.eye(hx-hr*.55,hy-hr*.15,"eyeY",1);m.eye(hx+hr*.15,hy-hr*.15,"eyeY",1);m.l("mouth","flat",hx-hr*.6,hy+hr*.5,hx+hr*.3,hy+hr*.45,1,0);m.d("tooth",hx-hr*.35,hy+hr*.5,2);}}});break;}
  case "orc":{const chief=key==="warchief",club=key==="orcclub";biped(lay,W,H,{h:H*(chief?.8:.74),bulk:.46,skin:"orc",skinTex:"smooth",armTex:"smooth",legsPal:"leather",legsTex:"cloth",footPal:"iron",footTex:"metal",headR:.13,hunch:2,
      extra:chief?(lay,G)=>lay("tail",G.cx,G.sh,(m)=>m.p("clothR","cloth",[G.cx-G.bw*.55,G.sh,G.cx+G.bw*.55,G.sh,G.cx+G.bw*.9,G.gy-1,G.cx-G.bw*.95,G.gy-2])):null,
      torso:(m,G)=>{m.p("leather","cloth",[G.cx-G.bw*.5,G.sh+G.h*.12,G.cx+G.bw*.5,G.sh+G.h*.12,G.cx+G.bw*.45,G.hip+G.h*.12,G.cx-G.bw*.45,G.hip+G.h*.12]);m.l("iron","metal",G.cx-G.bw*.5,G.hip,G.cx+G.bw*.5,G.hip,2);m.d("gold",G.cx-1,G.hip-1,2,2,2);
        m.e(chief?"gold":"iron","metal",G.cx+G.bw*.55,G.sh+1,G.bw*.3,G.bw*.22);if(chief){m.e("gold","metal",G.cx-G.bw*.55,G.sh+1,G.bw*.3,G.bw*.22);m.p("iron","metal",[G.cx-G.bw*.5,G.sh+2,G.cx+G.bw*.5,G.sh+2,G.cx+G.bw*.4,G.sh+G.h*.18,G.cx-G.bw*.4,G.sh+G.h*.18]);}},
      weapon:(m,G,ph)=>{if(ph!=="back")return;const hx=G.cx+G.bw*.78,hy=G.hip+G.h*.06;if(club){m.q("wood","bark",hx,hy+2,hx+2,hy-G.h*.2,hx+3,hy-G.h*.42,2,5);for(let i=0;i<3;i++)m.d("iron",hx+2+i%2,hy-G.h*(.3+i*.04),1,1,2);}
        else{m.l("wood","bark",hx,hy+3,hx+1,hy-G.h*(chief?.5:.4),1.6);const ty=hy-G.h*(chief?.48:.38);m.p("steel","metal",[hx+1,ty,hx+G.bw*(chief?.9:.65),ty-G.h*.08,hx+G.bw*(chief?.95:.7),ty+G.h*.14,hx+1,ty+G.h*.08]);if(chief)m.p("steel","metal",[hx+1,ty,hx-G.bw*.6,ty-G.h*.08,hx-G.bw*.65,ty+G.h*.14,hx+1,ty+G.h*.08]);}},
      head:(m,b,G)=>{const{hx,hy,hr}=G;m.e("orc","smooth",hx,hy,hr,hr*.95);m.e("orc","smooth",hx-hr*.5,hy+hr*.4,hr*.7,hr*.5);m.p("orc","smooth",[hx+hr*.8,hy-hr*.1,hx+hr*1.5,hy-hr*.4,hx+hr*.8,hy+hr*.2]);
        if(chief){m.e("iron","metal",hx,hy-hr*.45,hr*1.05,hr*.65);m.q("horn","bone",hx-hr*.8,hy-hr*.5,hx-hr*1.8,hy-hr*.8,hx-hr*1.6,hy-hr*2,hr*.5,hr*.15);m.q("horn","bone",hx+hr*.8,hy-hr*.5,hx+hr*1.8,hy-hr*.8,hx+hr*1.6,hy-hr*2,hr*.5,hr*.15);}
        else m.p("mouth","smooth",[hx-hr,hy-hr*.4,hx+hr,hy-hr*.6,hx+hr*.6,hy-hr*1.1,hx-hr*.5,hy-hr*1]);
        if(!b){m.eye(hx-hr*.65,hy-hr*.15,"iris",1);m.eye(hx+hr*.05,hy-hr*.15,"iris",1);m.l("mouth","flat",hx-hr*.9,hy+hr*.55,hx+hr*.1,hy+hr*.55,1,0);m.p("tooth","bone",[hx-hr*.8,hy+hr*.55,hx-hr*.6,hy+hr*.55,hx-hr*.75,hy-hr*.05]);m.p("tooth","bone",[hx-hr*.1,hy+hr*.55,hx+hr*.1,hy+hr*.55,hx,hy-hr*.05]);}}});break;}
  }});}
// ---------- install: new rigs for every species ----------
const _buildMon1=buildMon;buildMon=function(key){try{return buildMon2(key);}catch(err){console.warn("monart",key,err);return _buildMon1(key);}};
for(const k in MONCACHE)delete MONCACHE[k];
const HUMRIG={};const humRig=k=>HUMRIG[k]||(HUMRIG[k]=buildMon2(k));
// improved animation: face movement direction, back view when walking away, collapse on death
drawMon=function(e){const r=e.mon,d=e.def,S=r.W;const t=frameN+(e.uid0||0);const vx=e.x-(e.px==null?e.x:e.px),vy=e.y-(e.py==null?e.y:e.py);const mv=Math.abs(vx)+Math.abs(vy)>0.05;e.px=e.x;e.py=e.y;
  if(mv){e._mvx=vx;e._mvy=vy;e._mvT=t;}const recent=e._mvT!=null&&t-e._mvT<20;const away=recent&&e._mvy<0&&Math.abs(e._mvy)>Math.abs(e._mvx)*1.2&&!e.dead;
  const dying=e.dead?clamp(1-e.flash/34,0,1):0;const flyH=e.flyer?8+Math.sin(t*.09)*3:0;const hop=r.shape==="slime"&&mv?Math.abs(Math.sin(t*.16))*5:0;
  drawShadow(e.x+e.w/2,e.y+e.h-1,S*.28*(1-flyH/30),Math.max(2,S*.06));
  let face=hero.x+6<e.x+e.w/2?1:-1;if(recent&&Math.abs(e._mvx)>0.08&&!(e.wind>0||e.lunge>0||e.castT>0))face=e._mvx<0?1:-1;
  const wind=e.wind>0?e.wind/16:0,lunge=e.lunge>0?e.lunge/10:0,cast=e.castT>0?Math.sin((26-e.castT)/26*Math.PI):0;const rec=e.iframes>0&&!e.dead?e.iframes/10:0;
  ctx.save();ctx.translate(Math.floor(e.x+e.w/2+(rec?Math.cos(t*2)*1.5:0)),Math.floor(e.y+e.h-flyH-hop+dying*flyH));if(face<0)ctx.scale(-1,1);
  if(dying){const side=(e.deathAng>Math.PI/2||e.deathAng<-Math.PI/2?-1:1);if(r.shape==="slime"||r.shape==="wisp"){ctx.scale(1+dying*.5,1-dying*.85);}else{ctx.rotate(Math.min(1,dying*1.6)*1.45*side);}ctx.globalAlpha=1-Math.max(0,dying-.55)*2.2;}
  ctx.translate(-lunge*S*.12+wind*S*.06,0);
  const white=(e.flash>0&&!e.dead)||rec>.6;
  const br=Math.sin(t*.07)*.03;const sq=r.shape==="slime"?(mv?Math.sin(t*.16)*.12:br*2.2):br;const ox=-S/2,oy=-S;
  const D=(n,rot,dx,dy,sx,sy)=>{const l=r.L[n];if(!l||e.cut[n])return;ctx.save();ctx.translate(ox+l.px+(dx||0),oy+l.py+(dy||0));ctx.rotate(rot||0);ctx.scale(sx||1,sy||1);ctx.drawImage(l.c,-l.px,-l.py);ctx.restore();};
  if(white)ctx.filter="brightness(3) saturate(0)";
  const flap=Math.sin(t*(e.flyer?.45:.08))*(e.flyer?.55:.1);const step=mv?Math.sin(t*.28):0;const armRot=cast?-1.6*cast:wind?-1.2*wind:lunge?1.1*lunge:Math.sin(t*(mv?.28:.06))*(mv?.3:.06);
  const headN=away&&r.L.headB?"headB":"head";
  if(away){D("arm",armRot,0,0);}
  D("tail",Math.sin(t*.1)*.18);D("wingL",-flap-wind*.3);D("wingR",flap+wind*.3);
  if(r.L.legs){ctx.save();ctx.beginPath();ctx.rect(ox,oy,S/2,S);ctx.clip();D("legs",0,0,step>0?-step*2:0);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(0,oy,S/2,S);ctx.clip();D("legs",0,0,step<0?step*2:0);ctx.restore();}
  D("body",0,0,mv&&!e.flyer?-Math.abs(step):0,1-sq*.6,1+sq);
  if(!away)D("arm",armRot,0,mv?-Math.abs(step)*.8:0);
  D(headN,(wind?-.12*wind:0)+(lunge?.14*lunge:0),Math.sin(t*.06+1)*.5,-sq*S*.3+(mv?-Math.abs(step)*1.1:0)+br*4);
  ctx.filter="none";
  if(cast>0&&d.caster){ctx.globalCompositeOperation="lighter";const c=d.caster;ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${.5*cast})`;ctx.beginPath();ctx.arc(S*.25,oy+S*.25,3+cast*5,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";}
  ctx.restore();ctx.globalAlpha=1;
  if(dying>.3&&dying<.7&&!e._dust){e._dust=1;try{burst(e.x+e.w/2,e.y+e.h-2,[120,110,100],8,.8,1.5);}catch(_){}}
  if(!e.dead&&(d.rare||d.big||(e.provoked&&e.hp<e.maxHp))){const y=e.y+e.h-S*.9-4-flyH;ctx.fillStyle="#300";ctx.fillRect(e.x+e.w/2-12,y,24,3);ctx.fillStyle="#e44";ctx.fillRect(e.x+e.w/2-12,y,24*e.hp/e.maxHp,3);
    if(d.big||d.rare){ctx.font="bold 6px system-ui";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText(d.name,e.x+e.w/2,y-2);}}};
// goblins and orcs keep their own AI and limb system, but are drawn with the new rigs
{const _dm=drawMob;drawMob=function(e){const d=e&&e.def;if(!d||e.mon||!HUM.has(e.sp||e.type||"")){return _dm(e);}if(e.dead&&e.flash<=0)return;
  const r=humRig(e.sp||e.type);const p=e.parts||{};e.mon=r;e.cut={arm:p.arm===false,legs:p.legs===false,head:p.head===false,tail:false};if(e.uid0==null)e.uid0=(Math.random()*999)|0;
  const w0=e.wind,l0=e.lunge;if(e.state==="windup"||e.state==="charge")e.wind=Math.max(e.wind||0,10);if(e.state==="slam"||e.state==="ram")e.lunge=Math.max(e.lunge||0,8);
  try{drawMon(e);}finally{e.mon=null;delete e.mon;e.wind=w0;e.lunge=l0;}};}
// ---------- dragons: same shader, same 224x126 layout (head upper-left, wings upper-right, tail lower-left) ----------
const DRAGON_PAL={fire:["crim","gold","membR"],frost:["#",0,0],storm:["night","slimeP","memb"],forest:["moss","belly","leaf"]};
GP.frostD=["#1e2e4a","#3a5a86","#6a92be","#c2dcf0"];GP.frostB=["#4a5a6a","#8a9aaa","#c4d0da","#f4f8fc"];GP.frostM=["#1a2a44","#2e4a72","#4a72a0","#86aed2"];
DRAGON_PAL.frost=["frostD","frostB","frostM"];
function paintDragon2(kind){const [sk,bl,mb]=DRAGON_PAL[kind]||DRAGON_PAL.fire;const W=112,H=63;const P=newPart(W,H);const m=painter(P);
  // tail (lower-left region)
  m.q(sk,"scale",60,50,34,62,8,54,9,2.5);m.p(sk,"scale",[8,48,1,54,9,58]);for(let i=0;i<5;i++)m.p(sk,"scale",[44-i*7,53-i*0.5,47-i*7,48-i*.4,50-i*7,53-i*.5]);
  // far wing + near wing (upper-right)
  m.p(mb,"smooth",[66,30,84,4,108,8,102,16,110,24,98,24,100,33,88,30,80,36]);m.l(sk,"scale",66,30,84,4,2.5);m.l(sk,"scale",84,4,108,8,1.8);m.l(sk,"scale",84,6,102,16,1.2);m.l(sk,"scale",84,7,98,24,1.2);m.l(sk,"scale",82,9,88,30,1.2);
  // body, belly plates, legs with claws
  m.e(sk,"scale",64,44,21,12.5);m.e(bl,"scale",60,51,15,5);for(let i=0;i<5;i++)m.l(bl,"flat",50+i*5,48,50+i*5,55,1,1);
  for(const [x,s] of [[48,1],[74,1]]){m.l(sk,"scale",x,46,x-1,58,6);m.e(sk,"scale",x-2,59,4,2.2);for(let k=0;k<3;k++)m.d("horn",x-5+k*2,61,3);}
  m.l(sk,"scale",80,44,86,57,5);m.e(sk,"scale",86,59,3.5,2);
  for(let i=0;i<6;i++)m.p("horn","bone",[52+i*5,33+Math.abs(i-2)*.6,54+i*5,27+Math.abs(i-2)*.6,57+i*5,33+Math.abs(i-2)*.6]);
  // neck + head (upper-left)
  m.q(sk,"scale",50,40,40,30,30,22,10,7);for(let i=0;i<4;i++)m.d(bl,44-i*4,36-i*3.5,2,2,2);
  m.e(sk,"scale",24,18,11,8);m.e(sk,"scale",12,22,9,5,-.1);m.e(sk,"scale",8,26,7,3,-.05);
  m.q("horn","bone",28,12,34,6,38,2,3,1);m.q("horn","bone",22,11,24,4,28,0,2.5,1);m.p("horn","bone",[30,20,37,18,31,24]);
  m.eye(19,15,"eyeY",2);m.l("mouth","flat",3,25,18,25,1.2,0);for(let i=0;i<4;i++)m.d("tooth",5+i*3,26,3,1,2);m.d("mouth",4,21,0,2,1);
  const c=shadePart(P,kind.length*13);const [c2,g2]=mcv(W*2,H*2);g2.drawImage(c,0,0,W*2,H*2);return c2;}
paintDragon=paintDragon2;
for(const k of ["fire","frost","storm","forest"])if(typeof IMG!=="undefined"&&IMG["dragon_"+k])IMG["dragon_"+k]=paintDragon2(k);
