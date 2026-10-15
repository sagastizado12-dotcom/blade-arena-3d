// ---- Pixel helpers ----
function px(img,x,y,c){if(x<0||y<0||x>=img.w||y>=img.h)return; img.data[(y*img.w+x)*4]=c[0]; img.data[(y*img.w+x)*4+1]=c[1]; img.data[(y*img.w+x)*4+2]=c[2]; img.data[(y*img.w+x)*4+3]=c[3]??255}
function fillRect(img,x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(img,x+i,y+j,c)}
function makeImg(w,h,draw){
  const data=new Uint8ClampedArray(w*h*4);
  const img={w,h,data};
  draw(img); paintPass(img);
  const c=document.createElement("canvas");
  c.width=w;c.height=h;
  c.getContext("2d").putImageData(new ImageData(data,w,h),0,0);
  return c;
}

// Palette
const C={
  skin:[220,170,120], skinD:[180,130,90],
  tunic:[40,100,180], tunicD:[25,70,140],
  hair:[60,40,20],
  steel:[200,210,220], steelD:[120,130,150],
  wood:[140,90,40],
  grass:[50,110,50], grass2:[40,95,40], grass3:[60,125,55],
  dirt:[90,70,45], stone:[110,110,120], stoneD:[70,70,80], stoneL:[140,140,150],
  wall:[80,75,70], wallD:[50,48,45], wallT:[100,95,85],
  blood:[180,30,40], bloodD:[120,15,25],
  spark:[255,220,100], dust:[180,160,120],
  eye:[255,240,200], pupil:[20,20,30],
  green:[60,140,50], greenD:[40,100,35],
  purple:[120,60,160], purpleD:[80,40,110],
  orange:[200,100,40], orangeD:[150,70,25],
  red:[180,50,40], redD:[120,30,25],
  horn:[200,180,140], hornD:[160,140,100],
  boss:[90,50,120], bossD:[60,30,90],
  white:[240,240,245], black:[20,20,25],
  gold:[220,180,60]
};

// ---- Sprite factory ----
function heroFrame(dir,frame,swing){
  // dir: 0down 1left 2right 3up
  return makeImg(16,16,img=>{
    // legs
    const legOff=frame%2===0?0:1;
    fillRect(img,5,12,3,3,C.tunicD);
    fillRect(img,8,12,3,3,C.tunicD);
    if(dir!==3){
      fillRect(img,5+legOff,14,2,2,C.skinD);
      fillRect(img,9-legOff,14,2,2,C.skinD);
    }
    // body
    fillRect(img,5,6,6,7,C.tunic);
    fillRect(img,5,6,6,2,C.tunicD);
    // head
    fillRect(img,5,2,6,5,C.skin);
    fillRect(img,5,1,6,2,C.hair);
    fillRect(img,4,2,1,3,C.hair);
    fillRect(img,11,2,1,3,C.hair);
    // eyes
    if(dir===0){px(img,6,4,C.pupil);px(img,9,4,C.pupil)}
    else if(dir===1){px(img,5,4,C.pupil)}
    else if(dir===2){px(img,10,4,C.pupil)}
    // sword
    if(swing>=0){
      // swing arc positions relative to facing
      const arcs=[
        [[10,8],[12,6],[13,4],[12,2],[10,1]], // down-ish sweep
        [[4,8],[2,6],[1,4],[2,2],[4,1]],
        [[11,8],[13,7],[14,5],[13,3],[11,2]],
        [[5,5],[3,4],[2,2],[4,1],[7,0]]
      ];
      const a=arcs[dir]||arcs[0];
      const idx=Math.min(swing,a.length-1);
      const [sx,sy]=a[idx];
      fillRect(img,sx,sy,2,2,C.steel);
      fillRect(img,sx,sy+1,1,1,C.steelD);
    } else {
      // sheathed / held
      if(dir===2){fillRect(img,12,7,3,2,C.steel);px(img,11,7,C.wood)}
      else if(dir===1){fillRect(img,1,7,3,2,C.steel);px(img,4,7,C.wood)}
      else {fillRect(img,11,8,2,5,C.steel);px(img,11,7,C.wood)}
    }
  });
}

function makeEnemySprites(){
  const sprites={};
  // Grunt - melee with weapon arm
  sprites.grunt=makeImg(16,16,img=>{
    fillRect(img,5,11,3,4,C.greenD);
    fillRect(img,8,11,3,4,C.greenD);
    fillRect(img,4,5,8,7,C.green);
    fillRect(img,5,2,6,5,C.green);
    fillRect(img,5,1,6,2,C.greenD);
    px(img,6,3,C.eye);px(img,9,3,C.eye);px(img,6,3,C.pupil);px(img,9,3,C.pupil);
    // weapon arm
    fillRect(img,12,6,3,3,C.green);
    fillRect(img,14,4,2,5,C.steel);
    px(img,14,3,C.wood);
  });
  sprites.gruntNoArm=makeImg(16,16,img=>{
    fillRect(img,5,11,3,4,C.greenD);
    fillRect(img,8,11,3,4,C.greenD);
    fillRect(img,4,5,8,7,C.green);
    fillRect(img,5,2,6,5,C.green);
    fillRect(img,5,1,6,2,C.greenD);
    px(img,6,3,C.eye);px(img,9,3,C.eye);
    fillRect(img,11,7,2,2,C.blood); // stump
  });
  sprites.gruntCrawl=makeImg(16,12,img=>{
    fillRect(img,3,4,10,6,C.green);
    fillRect(img,4,1,8,5,C.green);
    px(img,6,3,C.eye);px(img,9,3,C.eye);
    fillRect(img,12,3,3,2,C.steel);
  });
  // Crawler - fast with tail
  sprites.crawler=makeImg(16,16,img=>{
    fillRect(img,4,6,8,6,C.purple);
    fillRect(img,5,3,6,5,C.purple);
    fillRect(img,6,2,4,2,C.purpleD);
    px(img,6,4,C.eye);px(img,9,4,C.eye);
    // legs
    fillRect(img,3,11,2,3,C.purpleD);
    fillRect(img,7,12,2,3,C.purpleD);
    fillRect(img,11,11,2,3,C.purpleD);
    // tail
    fillRect(img,1,8,4,3,C.purple);
    fillRect(img,0,7,2,2,C.purpleD);
    px(img,0,6,C.orange);
  });
  sprites.crawlerNoTail=makeImg(16,16,img=>{
    fillRect(img,4,6,8,6,C.purple);
    fillRect(img,5,3,6,5,C.purple);
    fillRect(img,6,2,4,2,C.purpleD);
    px(img,6,4,C.eye);px(img,9,4,C.eye);
    fillRect(img,3,11,2,3,C.purpleD);
    fillRect(img,7,12,2,3,C.purpleD);
    fillRect(img,11,11,2,3,C.purpleD);
    fillRect(img,3,8,2,2,C.blood);
  });
  // Spitter - ranged
  sprites.spitter=makeImg(16,16,img=>{
    fillRect(img,5,10,3,4,C.orangeD);
    fillRect(img,8,10,3,4,C.orangeD);
    fillRect(img,4,5,8,7,C.orange);
    fillRect(img,5,2,6,5,C.orange);
    fillRect(img,6,0,4,3,C.orangeD);
    px(img,6,4,C.eye);px(img,9,4,C.eye);
    // mouth
    fillRect(img,6,7,4,2,C.black);
    fillRect(img,7,8,2,1,[100,200,80]);
  });
  // Charger - horned
  sprites.charger=makeImg(16,16,img=>{
    fillRect(img,4,10,4,5,C.redD);
    fillRect(img,8,10,4,5,C.redD);
    fillRect(img,3,5,10,7,C.red);
    fillRect(img,4,2,8,5,C.red);
    // horns
    fillRect(img,3,0,2,4,C.horn);
    fillRect(img,11,0,2,4,C.horn);
    px(img,3,0,C.hornD);px(img,12,0,C.hornD);
    px(img,6,4,C.eye);px(img,9,4,C.eye);
    fillRect(img,6,7,4,2,C.black);
  });
  sprites.chargerNoHorn=makeImg(16,16,img=>{
    fillRect(img,4,10,4,5,C.redD);
    fillRect(img,8,10,4,5,C.redD);
    fillRect(img,3,5,10,7,C.red);
    fillRect(img,4,2,8,5,C.red);
    fillRect(img,4,1,2,2,C.blood);
    fillRect(img,10,1,2,2,C.blood);
    px(img,6,4,C.eye);px(img,9,4,C.eye);
  });
  // Boss
  sprites.boss=makeImg(24,24,img=>{
    fillRect(img,6,16,5,7,C.bossD);
    fillRect(img,13,16,5,7,C.bossD);
    fillRect(img,4,8,16,12,C.boss);
    fillRect(img,6,3,12,8,C.boss);
    // horns
    fillRect(img,4,0,3,6,C.horn);
    fillRect(img,17,0,3,6,C.horn);
    fillRect(img,3,0,2,3,C.hornD);
    fillRect(img,19,0,2,3,C.hornD);
    // arms
    fillRect(img,0,10,5,5,C.boss);
    fillRect(img,19,10,5,5,C.boss);
    fillRect(img,0,14,4,4,C.bossD);
    fillRect(img,20,14,4,4,C.bossD);
    // eyes
    fillRect(img,8,6,3,3,C.eye);
    fillRect(img,13,6,3,3,C.eye);
    px(img,9,7,C.pupil);px(img,14,7,C.pupil);
    // mouth
    fillRect(img,9,11,6,2,C.black);
  });
  sprites.bossNoArms=makeImg(24,24,img=>{
    fillRect(img,6,16,5,7,C.bossD);
    fillRect(img,13,16,5,7,C.bossD);
    fillRect(img,4,8,16,12,C.boss);
    fillRect(img,6,3,12,8,C.boss);
    fillRect(img,4,0,3,6,C.horn);
    fillRect(img,17,0,3,6,C.horn);
    fillRect(img,3,10,3,3,C.blood);
    fillRect(img,18,10,3,3,C.blood);
    fillRect(img,8,6,3,3,C.eye);
    fillRect(img,13,6,3,3,C.eye);
    px(img,9,7,C.pupil);px(img,14,7,C.pupil);
  });
  sprites.bossNoHorns=makeImg(24,24,img=>{
    fillRect(img,6,16,5,7,C.bossD);
    fillRect(img,13,16,5,7,C.bossD);
    fillRect(img,4,8,16,12,C.boss);
    fillRect(img,6,3,12,8,C.boss);
    fillRect(img,5,1,3,3,C.blood);
    fillRect(img,16,1,3,3,C.blood);
    fillRect(img,0,10,5,5,C.boss);
    fillRect(img,19,10,5,5,C.boss);
    fillRect(img,8,6,3,3,C.eye);
    fillRect(img,13,6,3,3,C.eye);
    px(img,9,7,C.pupil);px(img,14,7,C.pupil);
  });
  sprites.bossBare=makeImg(24,24,img=>{
    fillRect(img,6,16,5,7,C.bossD);
    fillRect(img,13,16,5,7,C.bossD);
    fillRect(img,4,8,16,12,C.boss);
    fillRect(img,6,3,12,8,C.boss);
    fillRect(img,5,1,3,3,C.blood);
    fillRect(img,16,1,3,3,C.blood);
    fillRect(img,3,10,3,3,C.blood);
    fillRect(img,18,10,3,3,C.blood);
    fillRect(img,8,6,3,3,C.eye);
    fillRect(img,13,6,3,3,C.eye);
    px(img,9,7,C.pupil);px(img,14,7,C.pupil);
  });
  // Parts
  sprites.partHead=makeImg(8,8,img=>{
    fillRect(img,1,1,6,6,C.green);
    fillRect(img,1,0,6,2,C.greenD);
    px(img,2,3,C.eye);px(img,5,3,C.eye);
  });
  sprites.partArm=makeImg(8,8,img=>{
    fillRect(img,2,1,4,6,C.green);
    fillRect(img,3,0,2,3,C.steel);
  });
  sprites.partLeg=makeImg(6,8,img=>{
    fillRect(img,1,0,4,8,C.greenD);
    fillRect(img,1,6,4,2,C.skinD);
  });
  sprites.partTail=makeImg(10,6,img=>{
    fillRect(img,0,1,8,4,C.purple);
    fillRect(img,7,0,3,3,C.purpleD);
    px(img,9,0,C.orange);
  });
  sprites.partHorn=makeImg(6,10,img=>{
    fillRect(img,1,0,3,10,C.horn);
    fillRect(img,2,0,2,4,C.hornD);
  });
  sprites.partBossArm=makeImg(10,10,img=>{
    fillRect(img,1,1,7,8,C.boss);
    fillRect(img,2,6,6,4,C.bossD);
  });
  sprites.partBossHead=makeImg(12,10,img=>{
    fillRect(img,1,1,10,8,C.boss);
    fillRect(img,3,3,2,2,C.eye);
    fillRect(img,7,3,2,2,C.eye);
  });
  return sprites;
}

const SPR=makeEnemySprites();
const heroSprites=[];
for(let d=0;d<4;d++){
  heroSprites[d]=[];
  for(let f=0;f<2;f++)heroSprites[d][f]=heroFrame(d,f,-1);
  for(let s=0;s<5;s++)heroSprites[d]["s"+s]=heroFrame(d,0,s);
}

const heartFull=makeImg(9,8,img=>{
  fillRect(img,1,1,3,3,C.blood);
  fillRect(img,5,1,3,3,C.blood);
  fillRect(img,0,2,9,3,C.blood);
  fillRect(img,1,5,7,2,C.blood);
  fillRect(img,3,7,3,1,C.blood);
  fillRect(img,2,2,2,2,C.bloodD);
});
const heartEmpty=makeImg(9,8,img=>{
  fillRect(img,1,1,3,3,[60,40,40]);
  fillRect(img,5,1,3,3,[60,40,40]);
  fillRect(img,0,2,9,3,[60,40,40]);
  fillRect(img,1,5,7,2,[60,40,40]);
  fillRect(img,3,7,3,1,[60,40,40]);
});
// ---- Particles / blood / parts ----
function spray(x,y,n,ang,spread){
  for(let i=0;i<n;i++){
    const a=ang+(Math.random()-0.5)*spread;
    const sp=1+Math.random()*2.5;
    if(bloodOn){
      particles.push({
        x,y,z:2+Math.random()*4,
        vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, vz:1+Math.random()*2,
        life:30+Math.random()*30, max:60,
        col:Math.random()<0.5?C.blood:C.bloodD, size:1+Math.random()*1.5, kind:"blood"
      });
    } else {
      particles.push({
        x,y,z:2+Math.random()*3,
        vx:Math.cos(a)*sp*0.7, vy:Math.sin(a)*sp*0.7, vz:1+Math.random()*1.5,
        life:20+Math.random()*20, max:40,
        col:Math.random()<0.5?C.spark:C.dust, size:1+Math.random(), kind:"spark"
      });
    }
  }
}

function addSplat(x,y){
  if(!bloodOn)return;
  splats.push({x,y, life:180+Math.random()*120, max:300, size:2+Math.random()*3, col:Math.random()<0.5?C.blood:C.bloodD});
}

function detachPart(e, partName, ang){
  let spr, ox=0, oy=0;
  if(partName==="head"){spr=e.type==="boss"?SPR.partBossHead:SPR.partHead;oy=-4}
  else if(partName==="arm"||partName==="arms"){spr=e.type==="boss"?SPR.partBossArm:SPR.partArm;ox=6}
  else if(partName==="leg"||partName==="legs"){spr=SPR.partLeg;oy=6}
  else if(partName==="tail"){spr=SPR.partTail;ox=-6}
  else if(partName==="horn"||partName==="horns"){spr=SPR.partHorn;oy=-6}
  else spr=SPR.partArm;
  const sp=2+Math.random()*3;
  if(!bloodOn){
    // poof
    for(let i=0;i<8;i++){
      const a=Math.random()*Math.PI*2;
      particles.push({x:e.x+e.w/2,y:e.y+e.h/2,z:4,vx:Math.cos(a)*2,vy:Math.sin(a)*2,vz:2,life:25,max:25,col:C.dust,size:2,kind:"spark"});
    }
    return;
  }
  parts.push({
    spr, x:e.x+e.w/2+ox, y:e.y+e.h/2+oy, z:6+Math.random()*4,
    vx:Math.cos(ang)*sp+(Math.random()-0.5), vy:Math.sin(ang)*sp+(Math.random()-0.5),
    vz:2.5+Math.random()*2, rot:Math.random()*Math.PI*2, spin:(Math.random()-0.5)*0.4,
    life:200+Math.random()*100, max:300, grounded:false
  });
  spray(e.x+e.w/2, e.y+e.h/2, 6, ang, 1.2);
}

function hurtEnemy(e, dmg, ang, canDismember){
  if(e.iframes>0||e.dead)return;
  e.hp-=dmg; e.provoked=true;
  e.iframes=10;
  e.flash=6;
  e.knockT=8;
  e.knockVx=Math.cos(ang)*2.5;
  e.knockVy=Math.sin(ang)*2.5;
  spray(e.x+e.w/2, e.y+e.h/2, bloodOn?8:5, ang, 1.5);
  addSplat(e.x+e.w/2, e.y+e.h/2);
  shake=4; SFX.hit(); if(bloodOn)SFX.blood();

  // Dismemberment chances based on remaining hp / type
  if(canDismember && e.hp>0){
    {const before=Object.keys(e.parts).filter(k=>e.parts[k]);tryDismember(e, ang);for(const k of before)if(!e.parts[k])onSever(e,k);}
  }
  if(e.hp<=0){
    killEnemy(e, ang);
  }
}

function tryDismember(e, ang){
  const roll=Math.random();
  if(e.type==="grunt"){
    if(e.parts.arm && roll<0.45){e.parts.arm=false; detachPart(e,"arm",ang); e.state="flee"}
    else if(e.parts.legs && roll<0.25){e.parts.legs=false; detachPart(e,"legs",ang)}
  } else if(e.type==="crawler"){
    if(e.parts.tail && roll<0.5){e.parts.tail=false; detachPart(e,"tail",ang)}
    else if(e.parts.legs && roll<0.3){e.parts.legs=false; detachPart(e,"legs",ang)}
  } else if(e.type==="charger"){
    if(e.parts.horns && roll<0.4){e.parts.horns=false; detachPart(e,"horns",ang); if(e.state==="charge")e.state="chase"}
  } else if(e.type==="boss"){
    if(e.parts.horns && roll<0.35){e.parts.horns=false; detachPart(e,"horns",ang)}
    else if(e.parts.arms && roll<0.35){e.parts.arms=false; detachPart(e,"arms",ang)}
  } else if(e.type==="spitter"){
    if(e.parts.legs && roll<0.3){e.parts.legs=false; detachPart(e,"legs",ang)}
  }
}

function killEnemy(e, ang){
  e.dead=true;
  kills++;
  score+=10; onKill(e);
  // always lose head on death
  if(e.parts.head){e.parts.head=false; detachPart(e,"head",ang)}
  // fling remaining parts
  if(e.parts.arm){e.parts.arm=false; detachPart(e,"arm",ang+0.5)}
  if(e.parts.arms){e.parts.arms=false; detachPart(e,"arms",ang-0.5)}
  if(e.parts.tail){e.parts.tail=false; detachPart(e,"tail",ang+1)}
  if(e.parts.horns){e.parts.horns=false; detachPart(e,"horns",ang-1)}
  if(e.parts.legs){e.parts.legs=false; detachPart(e,"legs",ang+0.3)}
  spray(e.x+e.w/2, e.y+e.h/2, bloodOn?14:8, ang, 2.5);
  addSplat(e.x+e.w/2, e.y+e.h/2);
  addSplat(e.x+e.w/2+4, e.y+e.h/2-2);
}

// ---- Combat helpers ----
function swordHitbox(){
  if(hero.swinging<0)return null;
  const cx=hero.x+hero.w/2, cy=hero.y+hero.h/2;
  const reach=18;
  const dirs=[[0,1],[-1,0],[1,0],[0,-1]];
  const [dx,dy]=dirs[hero.dir];
  // arc widens mid-swing
  const t=hero.swinging/4;
  return {x:cx+dx*10-10, y:cy+dy*10-10, w:20, h:20, ang:Math.atan2(dy,dx)};
}

function aabb(a,b){
  return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
}

function moveEntity(ent, dx, dy){
  if(dx!==0){
    ent.x+=dx;
    if(blockedE(ent)){
      ent.x-=dx;
      // slide
      const step=Math.sign(dx)*0.5;
      for(let i=0;i<Math.abs(dx)*2;i++){
        ent.x+=step;
        if(blockedE(ent)){ent.x-=step;break}
      }
    }
  }
  if(dy!==0){
    ent.y+=dy;
    if(blockedE(ent)){
      ent.y-=dy;
      const step=Math.sign(dy)*0.5;
      for(let i=0;i<Math.abs(dy)*2;i++){
        ent.y+=step;
        if(blockedE(ent)){ent.y-=step;break}
      }
    }
  }
}
function combatAI(e){
  if(e.dead)return;
  if(e.iframes>0)e.iframes--;
  if(e.flash>0)e.flash--;
  if(e.atkCd>0)e.atkCd--;
  if(e.knockT>0){
    moveEntity(e, e.knockVx, e.knockVy);
    e.knockVx*=0.75; e.knockVy*=0.75;
    e.knockT--;
    return;
  }
  e.timer++;
  e.anim++;
  if(e.anim%8===0)e.frame^=1;

  const cx=e.x+e.w/2, cy=e.y+e.h/2;
  const hx=hero.x+hero.w/2, hy=hero.y+hero.h/2;
  const dx=hx-cx, dy=hy-cy;
  const dist=Math.hypot(dx,dy)||1;
  const ang=Math.atan2(dy,dx);

  // speed mods from missing parts
  let spd=e.spd;
  if(!e.parts.legs)spd*=0.35;
  if(e.type==="crawler" && !e.parts.tail)spd*=0.85;

  // Behavior
  if(e.type==="grunt"){
    if(!e.parts.arm){
      // flee or ram
      if(dist<50){moveEntity(e, -Math.cos(ang)*spd*1.2, -Math.sin(ang)*spd*1.2)}
      else { // occasional ram
        if(e.state!=="ram" && Math.random()<0.01){e.state="ram"; e.timer=0}
        if(e.state==="ram"){
          moveEntity(e, Math.cos(ang)*spd*1.8, Math.sin(ang)*spd*1.8);
          if(e.timer>40)e.state="flee";
          if(dist<14 && !hero.dead)hurtHero(e.dmg, ang);
        }
      }
    } else {
      moveEntity(e, Math.cos(ang)*spd, Math.sin(ang)*spd);
      if(dist<16 && e.atkCd<=0){
        e.atkCd=40;
        if(!hero.dead){hurtHero(e.dmg, ang);goblinSteal(e);}
      }
    }
  } else if(e.type==="crawler"){
    // erratic if no tail, otherwise weave
    let ox=Math.cos(ang)*spd, oy=Math.sin(ang)*spd;
    if(!e.parts.tail){
      ox+=Math.sin(e.timer*0.3)*1.2;
      oy+=Math.cos(e.timer*0.25)*1.2;
    } else {
      ox+=Math.sin(e.timer*0.15)*0.4;
      // tail whip at close range
      if(dist<18 && e.atkCd<=0){
        e.atkCd=35;
        if(!hero.dead)hurtHero(e.dmg, ang);
        spray(cx,cy,3,ang,1);
      }
    }
    moveEntity(e, ox, oy);
    if(dist<12 && e.atkCd<=0 && !e.parts.tail){
      e.atkCd=30;
      if(!hero.dead)hurtHero(e.dmg, ang);
    }
  } else if(e.type==="spitter"){
    if(dist<70){
      // kite
      moveEntity(e, -Math.cos(ang)*spd, -Math.sin(ang)*spd);
    } else if(dist>100){
      moveEntity(e, Math.cos(ang)*spd, Math.sin(ang)*spd);
    }
    // strafe
    moveEntity(e, -Math.sin(ang)*spd*0.5, Math.cos(ang)*spd*0.5);
    if(e.atkCd<=0 && dist<130){
      e.atkCd=70;
      projectiles.push({
        x:cx, y:cy, vx:Math.cos(ang)*2.2, vy:Math.sin(ang)*2.2,
        life:90, r:3, dmg:1, col:[100,200,80]
      });
    }
  } else if(e.type==="charger"){
    if(!e.parts.horns){
      // no charge — slow chase / bite
      moveEntity(e, Math.cos(ang)*spd*0.8, Math.sin(ang)*spd*0.8);
      if(dist<16 && e.atkCd<=0){e.atkCd=45; if(!hero.dead)hurtHero(e.dmg,ang)}
    } else {
      if(e.state==="windup"){
        e.timer++;
        if(e.timer>25){e.state="charge"; e.timer=0; e.chargeAng=ang}
      } else if(e.state==="charge"){
        moveEntity(e, Math.cos(e.chargeAng)*spd*3.2, Math.sin(e.chargeAng)*spd*3.2);
        e.timer++;
        if(dist<16){if(!hero.dead)hurtHero(e.dmg+1,e.chargeAng); e.state="chase"; e.atkCd=50}
        if(e.timer>35)e.state="chase";
      } else {
        moveEntity(e, Math.cos(ang)*spd, Math.sin(ang)*spd);
        if(dist<90 && dist>30 && e.atkCd<=0 && Math.random()<0.02){
          e.state="windup"; e.timer=0; e.atkCd=80;
        }
        if(dist<14 && e.atkCd<=0){e.atkCd=40; if(!hero.dead)hurtHero(e.dmg,ang)}
      }
    }
  } else if(e.type==="boss"){
    // phases based on parts
    if(e.state==="slam"){
      e.timer++;
      if(e.timer===15){
        // slam shockwave
        shake=8;
        if(dist<40 && !hero.dead)hurtHero(e.dmg, ang);
        for(let i=0;i<12;i++){
          const a=i/12*Math.PI*2;
          particles.push({x:cx,y:cy,z:0,vx:Math.cos(a)*3,vy:Math.sin(a)*3,vz:1,life:20,max:20,col:C.dust,size:3,kind:"spark"});
        }
      }
      if(e.timer>30)e.state="chase";
    } else if(e.state==="charge"){
      moveEntity(e, Math.cos(e.chargeAng)*spd*2.8, Math.sin(e.chargeAng)*spd*2.8);
      e.timer++;
      if(dist<20){if(!hero.dead)hurtHero(e.dmg+1,e.chargeAng); e.state="chase"; e.atkCd=40}
      if(e.timer>40)e.state="chase";
    } else {
      moveEntity(e, Math.cos(ang)*spd, Math.sin(ang)*spd);
      if(e.atkCd<=0){
        if(e.parts.arms && dist<50 && Math.random()<0.03){
          e.state="slam"; e.timer=0; e.atkCd=90;
        } else if(e.parts.horns && dist<100 && dist>40 && Math.random()<0.02){
          e.state="charge"; e.timer=0; e.chargeAng=ang; e.atkCd=100;
        } else if(dist<22){
          e.atkCd=50;
          if(!hero.dead)hurtHero(e.dmg, ang);
        }
      }
    }
  }

  // face
  if(Math.abs(dx)>Math.abs(dy))e.dir=dx<0?1:2;
  else e.dir=dy<0?3:0;
}

function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx; p.y+=p.vy; p.z+=p.vz;
    p.vz-=0.25;
    if(p.z<=0){
      p.z=0; p.vz*=-0.3; p.vx*=0.6; p.vy*=0.6;
      if(p.kind==="blood" && Math.random()<0.3)addSplat(p.x,p.y);
      if(Math.abs(p.vz)<0.3){p.vx*=0.5;p.vy*=0.5}
    }
    p.life--;
    if(p.life<=0)particles.splice(i,1);
  }
  for(let i=splats.length-1;i>=0;i--){
    splats[i].life--;
    if(splats[i].life<=0)splats.splice(i,1);
  }
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i];
    if(!p.grounded){
      p.x+=p.vx; p.y+=p.vy; p.z+=p.vz;
      p.vz-=0.3; p.rot+=p.spin;
      if(p.z<=0){
        p.z=0; p.vz*=-0.4; p.vx*=0.5; p.vy*=0.5; p.spin*=0.6;
        if(Math.abs(p.vz)<0.5){p.grounded=true; p.vx=0; p.vy=0}
      }
    }
    p.life--;
    if(p.life<=0)parts.splice(i,1);
  }
  for(let i=projectiles.length-1;i>=0;i--){
    const p=projectiles[i];
    p.x+=p.vx; p.y+=p.vy; p.life--;
    if(blocked(p.x-2,p.y-2,4,4)){projectiles.splice(i,1);continue}
    if(!p.friendly&&aabb({x:p.x-p.r,y:p.y-p.r,w:p.r*2,h:p.r*2}, hero) && !hero.dead){
      hurtHero(p.dmg, Math.atan2(p.vy,p.vx));
      projectiles.splice(i,1);
      continue;
    }
    if(p.life<=0)projectiles.splice(i,1);
  }
}
function drawSplats(){
  for(const s of splats){
    const a=Math.min(1,s.life/60);
    ctx.globalAlpha=a*0.7;
    ctx.fillStyle=`rgb(${s.col[0]},${s.col[1]},${s.col[2]})`;
    ctx.beginPath();
    ctx.ellipse(s.x,s.y,s.size,s.size*0.6,0,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=1;
}
function drawHero(){
  if(hero.dead)return;
  if(hero.iframes>0 && Math.floor(hero.iframes/3)%2===0)return;
  let spr;
  if(hero.swinging>=0)spr=heroSprites[hero.dir]["s"+Math.min(hero.swinging,4)];
  else spr=heroSprites[hero.dir][hero.frame];
  // shadow
  ctx.globalAlpha=0.25;
  ctx.fillStyle="#000";
  ctx.beginPath();ctx.ellipse(hero.x+8,hero.y+14,6,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  ctx.drawImage(spr, Math.floor(hero.x-2), Math.floor(hero.y-4));
  // sword arc trail
  if(hero.swinging>=0 && hero.swinging<4){
    const cx=hero.x+6, cy=hero.y+6;
    const dirs=[[0,1],[-1,0],[1,0],[0,-1]];
    const [dx,dy]=dirs[hero.dir];
    ctx.strokeStyle="rgba(200,220,255,0.45)";
    ctx.lineWidth=2;
    ctx.beginPath();
    const base=Math.atan2(dy,dx);
    ctx.arc(cx,cy,14, base-0.9+hero.swinging*0.35, base-0.3+hero.swinging*0.35);
    ctx.stroke();
  }
}

function enemySprite(e){
  if(e.img)return e.img;
  if(e.type==="grunt"){
    if(!e.parts.legs)return SPR.gruntCrawl;
    if(!e.parts.arm)return SPR.gruntNoArm;
    return SPR.grunt;
  }
  if(e.type==="crawler")return e.parts.tail?SPR.crawler:SPR.crawlerNoTail;
  if(e.type==="spitter")return SPR.spitter;
  if(e.type==="charger")return e.parts.horns?SPR.charger:SPR.chargerNoHorn;
  if(e.type==="boss"){
    if(!e.parts.arms && !e.parts.horns)return SPR.bossBare;
    if(!e.parts.arms)return SPR.bossNoArms;
    if(!e.parts.horns)return SPR.bossNoHorns;
    return SPR.boss;
  }
  return SPR.grunt;
}
function drawParts(){
  for(const p of parts){
    const a=Math.min(1, p.life/40);
    ctx.globalAlpha=a;
    // shadow
    ctx.fillStyle="rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y+2, 4, 1.5, 0,0,Math.PI*2);
    ctx.fill();
    ctx.save();
    ctx.translate(p.x, p.y - p.z);
    ctx.rotate(p.rot);
    ctx.drawImage(p.spr, -p.spr.width/2, -p.spr.height/2);
    ctx.restore();
  }
  ctx.globalAlpha=1;
}

function drawParticles(){
  for(const p of particles){
    const a=Math.min(1,p.life/15);
    ctx.globalAlpha=a;
    ctx.fillStyle=`rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;
    ctx.fillRect(p.x - p.size/2, p.y - p.z - p.size/2, p.size, p.size);
  }
  ctx.globalAlpha=1;
}

function drawProjectiles(){
  for(const p of projectiles){
    ctx.fillStyle=`rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="rgba(200,255,150,0.5)";
    ctx.beginPath();
    ctx.arc(p.x-p.vx,p.y-p.vy,p.r*0.6,0,Math.PI*2);
    ctx.fill();
  }
}
