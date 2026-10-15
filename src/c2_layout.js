// ===== BIG SETTLEMENT LAYOUT: street grid + districts =====
const BRIDGE=21;const RIVERM=new Uint8Array(WW*WH);
function layoutSettlement(s){const r=s.r,town=s.kind.includes("town");const land=i=>T[i]!==DEEP&&T[i]!==SHAL&&T[i]!==PIER;
  const SX=7,SY=6;const streetX=x=>{const d=x-s.x;return ((d%SX)+SX)%SX<2;},streetY=y=>{const d=y-s.y;return ((d%SY)+SY)%SY<2;};
  for(let y=s.y-r-2;y<=s.y+r+2;y++)for(let x=s.x-r-2;x<=s.x+r+2;x++){const i=y*WW+x;if(Math.hypot(x-s.x,y-s.y)>r+2.5||!land(i))continue;ELEV[i]=0;
    const plaza=Math.abs(x-s.x-0.5)<=5&&Math.abs(y-s.y-0.5)<=3.5;const main=(x===s.x||x===s.x+1||y===s.y||y===s.y+1);
    const market=town&&x>=s.x-6&&x<=s.x+7&&y>=s.y+2&&y<=s.y+5;
    T[i]=plaza||main||market?COBBLE:(streetX(x)||streetY(y))&&Math.hypot(x-s.x,y-s.y)<=r?(town?COBBLE:ROAD):(hash2(x,y,5)<0.05?FLOWER:GRASS);}
  s.bIdx=[];const slots=[];
  for(let bj=-5;bj<=4;bj++)for(let bk=-4;bk<=3;bk++){const bx=s.x+bk*SX+2,by=s.y+bj*SY+2;
    // footprint 4x3 + door row inside radius margin
    let ok=true;for(let y=by;y<=by+3&&ok;y++)for(let x=bx-1;x<bx+5;x++){const i=y*WW+x;if(Math.hypot(x-s.x,y-s.y)>r-1.5||!land(i)){ok=false;break;}}
    if(ok)slots.push({x:bx,y:by,d:Math.hypot(bx+2-s.x,by+1-s.y),bj,bk});}
  slots.sort((a,b)=>a.d-b.d);
  // districts: castle (north band of Aldmoor), market (near plaza), harbor (water side), residential elsewhere
  const castle=s.id===0||/capital/.test(s.kind);const waterDir=s.harbor?1:s.island?-1:0;
  const want=[];if(town){want.push("guild","inn","shop","shop");}else want.push("inn","shop");if(s.harbor)want.push("harbor");
  let forsale=town?3:1;
  for(const sl of slots){if(castle&&sl.bj<=-3&&Math.abs(sl.bk+0.5)<=1.5)continue;if(town&&sl.bj===0&&(sl.bk===0||sl.bk===-1))continue; // castle district kept clear
    let kind;if(want.length){kind=want.shift();if(kind==="harbor"){const hs=slots.filter(q=>q.bk*waterDir>0&&!q.used).sort((a,b)=>b.bk*waterDir-a.bk*waterDir)[0];if(hs&&hs!==sl){hs.used=true;hs.kind="harbor";kind=want.shift()||"house";}}}
    else kind=sl.kind||(forsale>0&&sl.d>r*0.55&&hash2(sl.x,sl.y,3)<0.35?(forsale--,"forsale"):"house");
    if(sl.used&&sl.kind!=="harbor")continue;sl.used=true;sl.kind=kind;}
  // town hall = guild (central slot north of plaza) for towns
  if(town){const hall=slots.filter(q=>q.used&&q.bj===-1&&(q.bk===0||q.bk===-1)).sort((a,b)=>a.d-b.d)[0];const g=slots.find(q=>q.kind==="guild");if(hall&&g&&hall!==g){const t=hall.kind;hall.kind="guild";g.kind=t;}}
  // farms for villages in outer residential blocks
  let farms=town?0:2;
  for(const sl of slots){if(!sl.used)continue;if(farms>0&&sl.kind==="house"&&sl.d>r*0.6){farms--;if(!s.farm)s.farm={x:sl.x,y:sl.y,w:4,h:3};for(let y=sl.y;y<sl.y+3;y++)for(let x=sl.x;x<sl.x+4;x++)T[y*WW+x]=FARM;continue;}
    const b={id:buildings.length,s:s.id,x:sl.x,y:sl.y,w:4,h:3,kind:sl.kind,dmg:0,burn:0,hall:town&&sl.kind==="guild",district:sl.kind==="harbor"?"harbor":sl.d<8?"market":castle&&sl.bj<=-2?"castle":"residential"};
    for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){T[y*WW+x]=COBBLE;OCC[y*WW+x]=b.id+1;}
    T[(b.y+b.h)*WW+b.x+1]=COBBLE;T[(b.y+b.h)*WW+b.x+2]=COBBLE;s.bIdx.push(b.id);buildings.push(b);}
  const ws={s:s.id,x:s.x-6,y:s.y-1,found:false};waystones.push(ws);OCC[ws.y*WW+ws.x]=-1;
  objects.push({type:"board",s:s.id,x:s.x+6,y:s.y-1});OCC[(s.y-1)*WW+s.x+6]=-1;}
// a winding river from the northern hills to the southern sea, bridged wherever a road crosses
function genRiver(){let prev=null;for(let y=2;y<WH-2;y++){const cx=Math.round(178+Math.sin(y*0.06)*9+Math.sin(y*0.021)*6+y*0.08);
    if(y>40&&T[y*WW+cx]===DEEP&&!RIVERM[y*WW+cx]&&T[(y+3)*WW+cx]===DEEP)break;
    for(let k=-2;k<=2;k++){const x=cx+k,i=y*WW+x;if(SETS.some(s=>Math.hypot(x-s.x,y-s.y)<s.r+5))continue;if(OCC[i]>0)continue;
      const was=T[i];const deep=Math.abs(k)<=1;RIVERM[i]=1;ELEV[i]=0;
      if(was===ROAD||was===COBBLE||was===PIER||was===BRIDGE)T[i]=BRIDGE;else T[i]=deep?DEEP:SHAL;}
    // fill diagonal steps so the river is continuous
    if(prev!=null&&Math.abs(prev-cx)>1)for(let x=Math.min(prev,cx);x<=Math.max(prev,cx);x++){const i=y*WW+x;if(!SETS.some(s=>Math.hypot(x-s.x,y-s.y)<s.r+5)&&OCC[i]<=0&&T[i]!==BRIDGE){RIVERM[i]=1;T[i]=T[i]===ROAD?BRIDGE:DEEP;}}
    prev=cx;}
  // bridge widening: make sure each bridge spans the full river width
  for(let y=1;y<WH-1;y++)for(let x=1;x<WW-1;x++){const i=y*WW+x;if(T[i]!==BRIDGE)continue;for(const d of [-1,1]){let j=i+d,n=0;while(RIVERM[j]&&T[j]!==BRIDGE&&n<4){T[j]=BRIDGE;j+=d;n++;}}}}
