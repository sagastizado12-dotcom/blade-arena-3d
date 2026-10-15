// ===== 3D BRIDGE: legacy sim keeps running; the outdoor view is rendered by src3d/world3d.js =====
function pregRoll(){return null;} // wholesome build: no pregnancy mechanic
let __capOn=false;
function __d3hook(){
  if(state!=="play"||room||!world||!hero)return false;
  if(tileSeason!==season()){tileSeason=season();TILESET=makeTiles(tileSeason);chunkCache.clear();}
  camX=hero.x+6-W/2;camY=hero.y+6-H/2;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx.imageSmoothingEnabled=false;
  try{drawSplats();}catch(e){}
  try{drawQuestMarkers();}catch(e){}
  try{drawParts();}catch(e){}try{drawProjectiles();}catch(e){}try{drawMagic();}catch(e){}
  for(const f of floats){ctx.globalAlpha=Math.min(1,f.life/20);ctx.font="bold 8px system-ui";ctx.textAlign="center";ctx.fillStyle="#000";ctx.fillText(f.t,f.x+7,f.y+1);ctx.fillStyle=f.c;ctx.fillText(f.t,f.x+6,f.y);}ctx.globalAlpha=1;
  ctx.restore();return true;}
// render a legacy draw closure into a small canvas; (ax,ay) world px lands at bottom-center (85% down)
function __cap(c,ax,ay,fn,noShadow){const oc=ctx,ox=camX,oy=camY,ods=drawShadow;const g=c.getContext("2d");
  camX=ax-c._w/2;camY=ay-c._h*0.85;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
  g.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx=g;if(noShadow)drawShadow=()=>{};
  try{fn();}catch(e){}finally{ctx=oc;camX=ox;camY=oy;drawShadow=ods;g.filter="none";g.globalAlpha=1;g.globalCompositeOperation="source-over";}}
function __capCanvas(w,h){const c=mkCanvas(w*RS,h*RS);c._w=w;c._h=h;return c;}
// static scene items (excluding buildings: those are real 3D)
function __statics(cx,cy,R){const list=[];const vis=(x,y,m)=>Math.abs(x-cx)<R+m&&Math.abs(y-cy)<R+m;
  for(const c of CASTLES)if(vis(c.x*16+48,c.y*16,140))list.push({o:c,ax:c.x*16+48,ay:(c.y+3)*16,w:130,h:130,f:()=>drawCapCastle(c)});
  for(const p of BORDER_POSTS)if(vis(p.x*16,p.y*16,40))list.push({o:p,ax:p.x*16+8,ay:p.y*16+14,w:48,h:64,f:()=>drawBorderPost(p)});
  if(castleObj&&vis(castleObj.x*16+48,castleObj.y*16,140))list.push({o:castleObj,ax:castleObj.x*16+48,ay:(castleObj.y+3)*16,w:120,h:110,f:()=>ctx.drawImage(SPR2.castle,castleObj.x*16,(castleObj.y+3)*16-88,96,88)});
  for(const w of waystones)if(vis(w.x*16,w.y*16,40))list.push({o:w,ax:w.x*16+8,ay:w.y*16+16,w:40,h:48,k:w.found,f:()=>ctx.drawImage(SPR2.way[w.found?1:0],w.x*16+2,w.y*16-8)});
  for(const o of objects)if(vis(o.x*16,o.y*16,40))list.push({o,ax:o.x*16+8,ay:o.y*16+16,w:48,h:64,k:world.opened[o.id],f:()=>{if(o.type==="lookout")return drawLookout(o);ctx.drawImage(o.type==="board"?SPR2.board:SPR2.chest[world.opened[o.id]?1:0],o.x*16,o.y*16);}});
  for(const p of PROPS)if(vis(p.x*16,p.y*16,70))list.push({o:p,ax:p.x*16+8,ay:p.y*16+14,w:64,h:80,f:()=>drawProp(p)});
  for(const w of world.wrecks)if(!w.looted&&vis(w.x,w.y,60))list.push({o:w,ax:w.x+24,ay:w.y+20,w:64,h:56,f:()=>ctx.drawImage(SPR2.wreck,w.x,w.y)});
  const wl=[];try{drawWoodList(wl,vis);}catch(e){}for(const it of wl)list.push({o:it,ax:null,ay:it.y,w:48,h:56,f:it.f,dyn:1});
  return list;}
function __dyn(cx,cy,R){const list=[];const vis=(x,y,m)=>Math.abs(x-cx)<R+m&&Math.abs(y-cy)<R+m;
  for(const n of npcs)if(n.alive&&!n.inside&&vis(n.x,n.y,0))list.push({o:n,ax:n.x+8,ay:n.y+16,w:40,h:52,f:()=>drawNpc(n)});
  for(const e of mobs)if(!(e.dead&&e.flash<=0)&&vis(e.x,e.y,60)){const big=e.sp==="dragon";const w=big?260:Math.max(56,(e.img?e.img.width:e.w)*1.6+16);const h=big?220:Math.max(56,(e.img?e.img.height:e.h)*1.4+24);
    list.push({o:e,ax:e.x+e.w/2,ay:e.y+e.h,w,h,f:()=>drawMob(e)});}
  for(const c of world.caravans){const A=SETS[c.from],B=SETS[c.to];const x=(A.x+(B.x-A.x)*c.t)*16,y=(A.y+(B.y-A.y)*c.t)*16;if(vis(x,y,40))list.push({o:c,ax:x+16,ay:y+16,w:56,h:48,f:()=>ctx.drawImage(SPR2.cart,x,y)});}
  if(P.boat.owned&&!hero.boat&&vis(P.boat.x,P.boat.y,40))list.push({o:P.boat,ax:P.boat.x+14,ay:P.boat.y+20,w:56,h:48,f:()=>ctx.drawImage(SPR2.boat,Math.floor(P.boat.x),Math.floor(P.boat.y))});
  list.push({o:hero,ax:hero.x+6,ay:hero.y+12,w:72,h:72,f:drawHeroFull,hero:1});
  return list;}
window.__L3={get state(){return state},get room(){return room},get world(){return world},get hero(){return hero},get P(){return P},get npcs(){return npcs},get mobs(){return mobs},
  get particles(){return particles},get frameN(){return frameN},get banner(){return banner},get bubbles(){return bubbles},get paused(){return paused},
  get buildings(){return buildings},SETS,KOF,get WALLS(){return WALLS},get GATES(){return GATES},get TOWERS(){return TOWERS},T,ELEV,OCC,WW,WH,TILE,RS,CH,
  TT:{DEEP,SHAL,SAND,GRASS,FOREST,TREE,ROCK,ROAD,RUIN,WALL,PIER,FLOWER,COBBLE,FARM,CAVE,BUSH,CLIFF,MTN,STAIRS,MUD,DUNE,SNOW,ICE,CACTUS,DEADTREE,MESA,REED},
  tAt,elevAt,getChunk:(x,y)=>TILESET?getChunk(x,y):null,chunkCache,hour,darkness,season,doorOf,interactHint,wallHp:i=>{try{return wallHp(i)}catch(e){return 1}},
  cap:__cap,capCanvas:__capCanvas,statics:__statics,dyn:__dyn,get W(){return W},get H(){return H},get camX(){return camX},get camY(){return camY},canvas,
  bld:id=>world&&world.bld&&world.bld[id],LEAFC:typeof LEAFC!=="undefined"?LEAFC:null,regionKind,kingdomAt,inDemonLand:()=>{try{return inDemonLand()}catch(e){return false}}};
