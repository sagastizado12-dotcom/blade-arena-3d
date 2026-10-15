// ===== WOODCUTTING & CRAFTING =====
const STUMP=19,SAPLING=20;
const treeHits=new Map(),chopShake=new Map();let fallers=[],pickups=[];
function townTree(tx,ty){for(const s of SETS)if(Math.hypot(tx-s.x,ty-s.y)<s.r+4)return true;if(castleObj&&Math.abs(tx-castleObj.x-3)<7&&Math.abs(ty-castleObj.y-2)<6)return true;return false;}
function chopCheck(){const f=facingPoint(12);const tx=Math.floor(f.x/TILE),ty=Math.floor(f.y/TILE);if(tAt(tx,ty)!==TREE)return false;
  const i=ty*WW+tx;const cx=tx*16+8,cy=ty*16+6;
  if(townTree(tx,ty)){if(!chopCheck.warned||frameN-chopCheck.warned>180){toast("Town trees are protected.");chopCheck.warned=frameN;}return false;}
  const need=P.gear&&P.gear.axe===2?1:P.inv.axe>0?2:4;const h=(treeHits.get(i)||0)+1;treeHits.set(i,h);chopShake.set(i,12);SFX.hit();
  const L=LEAFC[season()];for(let k=0;k<8;k++){const a=Math.random()*7;particles.push({x:cx,y:cy,z:10+Math.random()*8,vx:Math.cos(a)*1.2,vy:Math.sin(a)*.6,vz:.5,life:40,max:40,col:hexRGB(L[k%2]),size:2,kind:"leaf"});}
  for(let k=0;k<5;k++){const a=Math.random()*7;particles.push({x:cx,y:cy+4,z:4,vx:Math.cos(a)*1.6,vy:Math.sin(a)*1.6,vz:1.5,life:25,max:25,col:[200,150,90],size:1.5,kind:"spark"});}
  if(h>=need){treeHits.delete(i);chopShake.delete(i);T[i]=STUMP;invalidateTile(tx,ty);world.trees[i]={st:0,d:world.day};
    fallers.push({x:tx*16-4,y:ty*16-12,v:Math.floor(hash2(tx,ty,5)*4),dir:hero.x<cx?1:-1,t:0});noiz(0.5,{f:300,v:0.2,a:0.05});
    const n=2+Math.floor(Math.random()*2);for(let k=0;k<n;k++)pickups.push({x:cx-6+k*7,y:cy+10+Math.random()*4,item:"wood",t:0});
    toast("Timber! The tree falls.");}
  return true;}
function regrowTrees(){for(const k in world.trees){const r=world.trees[k],i=+k;const age=world.day-r.d;
  if(r.st===0&&age>=2){r.st=1;T[i]=SAPLING;invalidateTile(i%WW,(i/WW)|0);}else if(r.st===1&&age>=5){T[i]=TREE;delete world.trees[k];invalidateTile(i%WW,(i/WW)|0);}}}
function applyTrees(){for(const k in world.trees){const i=+k;T[i]=world.trees[k].st?SAPLING:STUMP;}}
function updateWood(){for(const [k,v] of chopShake){if(v<=1)chopShake.delete(k);else chopShake.set(k,v-1);}
  for(const f of fallers)f.t++;fallers=fallers.filter(f=>f.t<50);
  for(const p of pickups){p.t++;if(p.t>20&&Math.hypot(hero.x+6-p.x,hero.y+8-p.y)<14){p.got=true;P.inv[p.item]=(P.inv[p.item]||0)+1;floatText(p.x,p.y,"+"+(ITEMS[p.item].ic||"")+ITEMS[p.item].n,ITEMS[p.item].fine?"#ffd84a":"#e8c890");if(p.sp){const b=bestiary(p.sp);b.parts[p.item]=(b.parts[p.item]||0)+1;}SFX.coin();}}
  pickups=pickups.filter(p=>!p.got);
  for(const c of world.placed)if(c.type==="campfire"&&Math.random()<.3&&Math.hypot(c.x-hero.x,c.y-hero.y)<400)particles.push({x:c.x+(Math.random()-.5)*4,y:c.y,z:2,vx:(Math.random()-.5)*.2,vy:0,vz:.5+Math.random()*.4,life:25,max:25,col:pick([[255,140,40],[255,210,90]]),size:2,kind:"spark"});}
function drawWoodList(list,vis){
  for(const p of pickups)if(vis(p.x,p.y,20))list.push({y:p.y,f:()=>{const b=p.t<20?-Math.sin(p.t/20*Math.PI)*6:0;
    if(p.item!=="wood"){drawShadow(p.x,p.y+2,4,1.5);ctx.font="9px system-ui";ctx.textAlign="center";ctx.fillText(ITEMS[p.item].ic||"✦",p.x,p.y+b+1+Math.sin(frameN*.1)*1);if(ITEMS[p.item].fine){ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(255,220,90,.35)";ctx.beginPath();ctx.arc(p.x,p.y-2+b,6,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";}return;}ctx.fillStyle="#8a5a2a";ctx.fillRect(p.x-5,p.y-3+b,10,4);ctx.fillStyle="#d8b070";ctx.beginPath();ctx.arc(p.x+5,p.y-1+b,2,0,7);ctx.fill();}});
  for(const c of world.placed)if(vis(c.x,c.y,40))list.push({y:c.y+4,f:()=>{if(c.type==="campfire"){drawShadow(c.x,c.y+3,6,2);ctx.fillStyle="#6a4020";ctx.fillRect(c.x-6,c.y,12,3);ctx.fillRect(c.x-2,c.y-2,4,6);
      ctx.globalCompositeOperation="lighter";const f=Math.random()*.4;const g=ctx.createRadialGradient(c.x,c.y-2,1,c.x,c.y-2,30+darkness()*30);g.addColorStop(0,`rgba(255,170,70,${.35+darkness()*.5+f*.1})`);g.addColorStop(1,"rgba(255,120,40,0)");ctx.fillStyle=g;ctx.fillRect(c.x-60,c.y-62,120,120);ctx.globalCompositeOperation="source-over";}
    else{ctx.fillStyle="#9a6a3a";ctx.fillRect(c.x-8,c.y-8,2,10);ctx.fillRect(c.x+6,c.y-8,2,10);ctx.fillRect(c.x-8,c.y-6,16,2);ctx.fillRect(c.x-8,c.y-2,16,2);}}});}
function drawFallers(){for(const f of fallers){const a=Math.min(1,f.t/30)*Math.PI/2*f.dir;ctx.save();ctx.globalAlpha=f.t>35?(50-f.t)/15:1;ctx.translate(f.x+12,f.y+20);ctx.rotate(a);ctx.drawImage(TILESET.canopy[f.v],-12,-20,24,22);ctx.restore();}ctx.globalAlpha=1;}
function craftMenu(){const w=P.inv.wood||0;const ok=n=>w>=n;
  showMenu("Crafting",`Wood: ${w}${P.inv.axe?" · Axe equipped (fast chopping)":" · Tip: buy an axe in shops to chop faster"}`,[
   {l:"Campfire (3 wood)",dis:!ok(3),f:()=>{P.inv.wood-=3;world.placed.push({type:"campfire",x:hero.x+6,y:hero.y+20});toast("Campfire built. Rest beside it with A.");}},
   {l:"Fence (2 wood)",dis:!ok(2),f:()=>{P.inv.wood-=2;const fp=facingPoint(16);world.placed.push({type:"fence",x:fp.x,y:fp.y+6});}},
   {l:"Raft (8 wood)",dis:!ok(8)||P.boat.owned,f:()=>{const {tx,ty}=heroTile();let spot=null;for(let r=1;r<=3&&!spot;r++)for(let dy=-r;dy<=r&&!spot;dy++)for(let dx=-r;dx<=r;dx++)if(isWater(tAt(tx+dx,ty+dy))){spot=[tx+dx,ty+dy];break;}
     if(!spot)return toast("Build a raft at the water's edge.");P.inv.wood-=8;P.boat.owned=true;P.boat.raft=true;P.boat.x=spot[0]*16-6;P.boat.y=spot[1]*16-12;toast("You lash together a raft! Board it with A.");}},
   {l:"Furniture (4 wood)",dis:!ok(4)||P.house<0,f:()=>{P.inv.wood-=4;if(!P.decor)P.decor=[];const d=["plant","bookshelf","painting","rug2"][P.decor.length%4];P.decor.push(d);toast("Crafted a "+d.replace("2","")+" for your home!");}},
   {l:"Upgrade house (10 wood)",dis:!ok(10)||P.house<0,f:()=>{P.inv.wood-=10;P.houseLv=(P.houseLv||0)+1;hero.maxHp=Math.min(14,hero.maxHp+1);hero.hp=hero.maxHp;updateHearts();toast("House upgraded to level "+(P.houseLv+1)+"! (+1 max heart)");}},
   {l:"Close"}]);}
function campfireNear(){return world.placed.find(c=>c.type==="campfire"&&near(c.x,c.y,22));}
