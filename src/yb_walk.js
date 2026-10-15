// ===== NATURAL WALKING: 8-frame cycles tied to speed, bob/lean/sway, step dust & sounds, monster gaits =====
const STRIDE=40; // px travelled per full 8-frame cycle (two steps) so feet don't slide
function walkState(e,spd,isHero){e._ws=e._ws||{ph:0,sm:0,stopT:0,last:0};const w=e._ws;const prev=w.sm;w.sm+= (spd-w.sm)*0.35;
  if(spd>0.08){w.ph=(w.ph+spd/STRIDE)%1;w.stopT=0;}else if(prev>0.5&&spd<0.08)w.stopT=8;
  if(w.stopT>0)w.stopT--;
  const step=Math.floor(w.ph*2);if(spd>0.08&&step!==w.last){w.last=step;onStep(e,isHero,w.sm);}
  const moving=w.sm>0.12;const run=w.sm>1.45;
  const fr=moving?10+Math.floor(w.ph*8)%8:w.stopT>0?18:0;
  const amp=Math.min(1,w.sm/1.2);const q4=Math.floor(w.ph*4);const bob=moving&&q4%2===0?1:0; // 1px dip on step frames (1-2-3-2 ping-pong)
  const d=e.dir!=null&&isHero?e.dir:e.vdir;const lean=run?(d===1?-0.07:d===2?0.07:0):0;
  const sway=moving?Math.sin(w.ph*Math.PI*2)*amp:0;
  return{fr,bob,lean,sway,spd:w.sm,run};}
function onStep(e,isHero,sm){const fx=isHero?e.x+6:e.x+8,fy=isHero?e.y+13:e.y+15;
  if(!room&&fx>camX-40&&fx<camX+W+40&&fy>camY-40&&fy<camY+H+40){const t=T[Math.floor(fy/16)*WW+Math.floor(fx/16)];const col=t===SAND?[230,210,160]:t===ROAD||t===COBBLE?[200,190,170]:t===SNOWT?[240,248,255]:[170,200,130];
    if(particles.length<(typeof lowFX!=="undefined"&&lowFX?120:300))for(let i=0;i<(sm>1.4?3:2);i++)particles.push({x:fx+(Math.random()-.5)*4,y:fy,z:0,vx:(Math.random()-.5)*.5,vy:-Math.random()*.2,vz:.25,life:16,max:16,col,size:2,kind:"dust"});}
  if(isHero)SFX.step(Math.floor(e.x/16)+Math.floor(e.y/16)*WW);}
const SNOWT=-99;
// ---- adult women: unique varied looks ----
const FEM_NAMES=new Set(["Ada","Cora","Elsa","Greta","Iris","Kira","Mara","Opal","Rhea","Tova","Vera","Wren","Yara","Edda","Juna","Nell","Poppy","Brin","Lark","Cass"]);
const isWoman=n=>!!n&&n.age>=18&&n.age<56&&(FEM_NAMES.has(n.name)||(["Quinn","Gale","Sol","Pip"].includes(n.name)&&n.look%2===0));
const FEM_STYLES=["wavy","twin","braid","bob","updo","side","curly","long","pony","bun"];
const FEM_HAIR=[[40,28,24],[90,50,30],[160,90,40],[220,180,90],[240,220,170],[170,40,40],[200,90,40],[60,40,90],[30,30,40],[120,70,120],[200,200,210],[110,60,40]];
const FEM_SKIN=[[255,224,196],[247,210,175],[230,180,140],[200,145,105],[160,105,70],[120,75,50],[90,58,40],[240,200,170]];
const FEM_CLOTH=[[200,70,90],[90,120,200],[80,160,110],[230,170,60],[150,90,180],[60,150,160],[220,120,150],[120,80,60],[240,230,210],[70,80,120],[180,60,50],[110,170,70]];
const FEM_ACC=["flower","band","earring","ribbon","necklace","scarf","glasses",null];
const FEM_LIP=[[200,80,90],[170,60,70],[220,110,110],[150,70,90],[190,100,80]];
const FEM_EYE=[[60,120,200],[60,140,70],[110,70,40],[150,60,160],[60,60,60],[40,150,160]];
const femSigs=new Set();
const _npcLookCW=npcLookC;npcLookC=function(n){if(n._look)return n._look;const L=_npcLookCW(n);if(!isWoman(n))return L;
  for(let tries=0;tries<40;tries++){const h=k=>Math.floor(hash2(n.look+tries*7919,k,313)*99991);
    const o={style:FEM_STYLES[h(1)%FEM_STYLES.length],hair:FEM_HAIR[h(2)%FEM_HAIR.length],skin:FEM_SKIN[h(3)%FEM_SKIN.length],cloth:FEM_CLOTH[h(4)%FEM_CLOTH.length],acc:FEM_ACC[h(5)%FEM_ACC.length],accC:FEM_CLOTH[h(6)%FEM_CLOTH.length],lip:FEM_LIP[h(7)%FEM_LIP.length],eye:FEM_EYE[h(8)%FEM_EYE.length],build:h(9)%3,skirt:h(10)%3!==0,ht:0.92+(h(11)%9)/100,belt:FEM_CLOTH[h(12)%FEM_CLOTH.length]};
    const sig=JSON.stringify([o.style,o.hair,o.skin,o.cloth,o.acc]);if(femSigs.has(sig)&&tries<39)continue;femSigs.add(sig);Object.assign(L,o);break;}
  L.fem=1;L.beard=false;L.wd=L.build===2?1.04:1;return L;};
// ---- monster gaits ----
function gaitOf(e){const r=e.mon;if(!r)return"walk";if(r.shape==="slime")return"hop";if(e.flyer||(e.def&&e.def.fly))return"fly";if(e.def&&e.def.big)return"stomp";
  return ["beast","wolf","boar","fluffin","lion"].includes(r.shape)||r.L&&r.L.legs&&r.W<40?"trot":"walk";}
const _drawMonW=drawMon;drawMon=function(e){const g=gaitOf(e);const mv=Math.abs(e.x-(e.gpx==null?e.x:e.gpx))+Math.abs(e.y-(e.gpy==null?e.y:e.gpy));e.gpx=e.x;e.gpy=e.y;
  e.gph=((e.gph||0)+mv/(g==="stomp"?40:g==="trot"?14:g==="hop"?22:20))%1;const p=e.gph*Math.PI*2;const moving=mv>0.05&&!e.dead;
  if(!moving||e.dead)return _drawMonW(e);
  const cx=e.x+e.w/2,by=e.y+e.h;ctx.save();
  if(g==="hop"){const h=Math.abs(Math.sin(p/2));const sq=h<0.15?1-(0.15-h)*1.6:1+h*0.08;ctx.translate(cx,by);ctx.scale(1/sq,sq);ctx.translate(-cx,-by);}
  else if(g==="fly"){ctx.translate(0,Math.sin(p)*2);}
  else if(g==="trot"){ctx.translate(0,-Math.abs(Math.sin(p*2))*1.5);ctx.translate(cx,by);ctx.rotate(Math.sin(p*2)*0.04);ctx.translate(-cx,-by);}
  else if(g==="stomp"){const s=Math.sin(p*2);ctx.translate(cx,by);ctx.rotate(s*0.05);ctx.translate(-cx,-by+(s>0.9?0:-Math.abs(s)*1.5));
    const step=Math.floor(e.gph*2);if(step!==e.gstep){e.gstep=step;const d=Math.hypot(cx-hero.x,by-hero.y);if(d<220){shake=Math.max(shake,1.5*(1-d/220)+0.5);if(typeof SFX.thud==="function")SFX.thud();}
      for(let i=0;i<4;i++)particles.push({x:cx+(Math.random()-.5)*e.w*.6,y:by,z:0,vx:(Math.random()-.5)*1,vy:-.2,vz:.3,life:20,max:20,col:[170,150,120],size:2,kind:"dust"});}}
  else{ctx.translate(0,-Math.abs(Math.sin(p))*1);}
  _drawMonW(e);ctx.restore();};
