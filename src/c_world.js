// ===== WORLD =====
const WW=1024, WH=800, PXW=WW*TILE, PXH=WH*TILE;
const DEEP=0,SHAL=1,SAND=2,GRASS=3,FOREST=4,TREE=5,ROCK=6,ROAD=7,RUIN=8,WALL=9,PIER=10,FLOWER=11,COBBLE=12,FARM=13,CAVE=14,BUSH=15,CLIFF=16,MTN=17,STAIRS=18;
const T=new Uint8Array(WW*WH), OCC=new Int16Array(WW*WH), ELEV=new Uint8Array(WW*WH);
const elevAt=(x,y)=>x<0||y<0||x>=WW||y>=WH?0:ELEV[y*WW+x];
const tAt=(x,y)=>x<0||y<0||x>=WW||y>=WH?DEEP:T[y*WW+x];
const SETS=[
 {id:0,name:"Aldmoor",kind:"town",x:138,y:146,r:22,roof:["#3d6fd6","#1d3a8a"],wall:"#f2e2c0",gem:"#7ff"},
 {id:1,name:"Saltmere",kind:"harbor town",x:244,y:150,r:22,roof:["#1fb5a8","#0b6460"],wall:"#fbf6ea",gem:"#9ff",harbor:true},
 {id:2,name:"Highcrest",kind:"town",x:110,y:58,r:22,roof:["#8a5cc8","#3f2470"],wall:"#cfc6bf",gem:"#f8f"},
 {id:3,name:"Fernhollow",kind:"village",x:52,y:124,r:18,roof:["#5fae3c","#2c5e1a"],wall:"#b98a55",gem:"#bf6"},
 {id:4,name:"Reedwick",kind:"village",x:124,y:224,r:18,roof:["#e8b23c","#9a6414"],wall:"#ead7a8",gem:"#fd6"},
 {id:5,name:"Coralcove",kind:"island village",x:330,y:66,r:16,roof:["#ff7a8a","#b0304a"],wall:"#f5dcb0",gem:"#f9c",island:true},
 {id:6,name:"Rimeholt",kind:"village",x:446,y:78,r:17,roof:["#9ab8d8","#4a6a90"],wall:"#e8eef4",gem:"#cff",region:"tundra",harbor:true},
 {id:7,name:"Lakemere",kind:"village",x:222,y:318,r:18,roof:["#4aa0c8","#1a5a80"],wall:"#f0e8d0",gem:"#8ef",region:"lakes"},
 {id:8,name:"Bogsend",kind:"village",x:70,y:338,r:17,roof:["#6a8a3a","#344a1a"],wall:"#a89060",gem:"#ae6",region:"swamp"},
 {id:9,name:"Dunerest",kind:"village",x:430,y:318,r:18,roof:["#e0904a","#9a4a1a"],wall:"#f0d8a8",gem:"#fc8",region:"desert"},
 {id:10,name:"Varnhold",kind:"capital town",x:760,y:182,r:22,roof:["#c83a3a","#6a1414"],wall:"#efe0c8",gem:"#f88"},
 {id:11,name:"Ironford",kind:"town",x:892,y:270,r:20,roof:["#a84a3a","#5a2010"],wall:"#d8ccc0",gem:"#fa8"},
 {id:12,name:"Pinegate",kind:"village",x:640,y:236,r:17,roof:["#7a6a5a","#3a2a1a"],wall:"#c8a878",gem:"#dc9"},
 {id:13,name:"Sylvaris",kind:"capital town",x:252,y:604,r:22,roof:["#3aa860","#14582a"],wall:"#f4ecd4",gem:"#8f8"},
 {id:14,name:"Willowmere",kind:"town",x:128,y:690,r:20,roof:["#5ac88a","#1a6a40"],wall:"#f0e4c4",gem:"#afc"},
 {id:15,name:"Thornby",kind:"village",x:372,y:704,r:17,roof:["#8aa83a","#40581a"],wall:"#c8b080",gem:"#cf8"},
 {id:16,name:"Pandemora",kind:"capital town",x:780,y:606,r:22,roof:["#5a1838","#2a0818"],wall:"#4a3a48",gem:"#f4a",demon:1},
 {id:17,name:"Cinderhold",kind:"town",x:904,y:704,r:20,roof:["#7a2030","#3a0810"],wall:"#585058",gem:"#f66",demon:1},
 {id:18,name:"Ashmire",kind:"village",x:656,y:700,r:17,roof:["#4a2a5a","#200a2a"],wall:"#605860",gem:"#c8f",demon:1},
];
const ISLES=[{x:332,y:68,r:30,name:"Coral Isle"},{x:338,y:228,r:21,name:"Isle of Bones"},{x:364,y:150,r:15,name:"Stormcrag"},{x:290,y:268,r:15,name:"Sunken Atoll"},{x:366,y:22,r:12,name:"Gull Rock"},{x:300,y:22,r:13,name:"Mistveil"},{x:500,y:205,r:14,name:"Ashreef"},{x:22,y:258,r:11,name:"Seal Skerry"}];
const RUINS={x:198,y:62}, ISLE_RUIN={x:338,y:228}, CAVE_POS={x:364,y:150}, DUNGEON={x:4,y:4,w:30,h:18};
const POIS=[{x:44,y:196,name:"Sunken Chapel",loot:{gold:60,gem:2}},{x:204,y:218,name:"Watchtower Ruins",loot:{gold:70,dscale:1}},{x:176,y:28,name:"Old Shrine",loot:{gold:50,gem:1,pearl:1}},{x:290,y:268,name:"Atoll Grotto",loot:{gold:90,pearl:3}},{x:366,y:22,name:"Gull Nest",loot:{gold:40,gem:2}},
 {x:40,y:372,name:"Sunken Ziggurat",loot:{gold:110,gem:2,dscale:1}},{x:478,y:362,name:"Glass Dune Tomb",loot:{gold:130,gem:3}},{x:478,y:40,name:"Frozen Watch",loot:{gold:100,pearl:2,gem:1}},
 {x:276,y:372,name:"Mirror Shrine",loot:{gold:90,pearl:2}},{x:500,y:205,name:"Ashreef Wreck",loot:{gold:120,pearl:3}},{x:160,y:296,name:"Fenwatch Ruins",loot:{gold:70,gem:1}}];
const LOBES=[{x:150,y:335,rx:142,ry:62,k:"south"},{x:420,y:320,rx:92,ry:72,k:"desert"},{x:312,y:346,rx:44,ry:26,k:"neck"},{x:450,y:80,rx:62,ry:66,k:"tundra"},
 {x:770,y:200,rx:200,ry:150,k:"ne"},{x:255,y:615,rx:205,ry:150,k:"sw"},{x:775,y:615,rx:195,ry:150,k:"se"},
 {x:555,y:110,rx:80,ry:26,k:"b1"},{x:205,y:455,rx:34,ry:72,k:"b2"},{x:560,y:430,rx:100,ry:30,k:"b3"},{x:515,y:650,rx:90,ry:28,k:"b4"},{x:790,y:405,rx:40,ry:90,k:"b5"},{x:560,y:430,rx:160,ry:150,k:"heart"},{x:520,y:120,rx:60,ry:40,k:"b6"},{x:150,y:268,rx:130,ry:34,k:"b7"},{x:200,y:405,rx:160,ry:55,k:"b8"},{x:345,y:300,rx:60,ry:45,k:"b9"},{x:500,y:150,rx:70,ry:50,k:"b10"}];
const LAKES2=[{x:176,y:352,rx:11,ry:7},{x:252,y:362,rx:13,ry:8},{x:282,y:322,rx:9,ry:7},{x:198,y:382,rx:9,ry:5},{x:150,y:322,rx:7,ry:5}];
const KOF=[0,0,0,0,0,0,1,2,2,0,1,1,1,2,2,2,3,3,3];
function kingdomAt(x,y){let b=0,bd=1e9;for(const s of SETS){if(s.island)continue;const d=Math.hypot(x-s.x,y-s.y)-(s.kind.includes("capital")||s.id===0?30:0);if(d<bd){bd=d;b=KOF[s.id];}}return b;}
function demonGround(){for(let y=440;y<WH;y++)for(let x=560;x<WW;x++){const i=y*WW+x,t=T[i];if(t===DEEP||t===SHAL||t===ROAD||t===SAND)continue;if(kingdomAt(x,y)!==3)continue;
  T[i]=t===TREE?DEADTREE:t===MTN||t===ROCK?ROCK:(hash2(x,y,505)<0.03?DEADTREE:MUD);}}
function borderForests(){const G=4,gw=WW/G|0,gh=WH/G|0,K=new Uint8Array(gw*gh);for(let y=0;y<gh;y++)for(let x=0;x<gw;x++)K[y*gw+x]=kingdomAt(x*G+2,y*G+2);
  for(let y=1;y<gh-1;y++)for(let x=1;x<gw-1;x++){const k=K[y*gw+x];if(K[y*gw+x+1]===k&&K[(y+1)*gw+x]===k)continue;
    for(let dy=-3;dy<G+3;dy++)for(let dx=-3;dx<G+3;dx++){const tx=x*G+dx,ty=y*G+dy;if(tx<1||ty<1||tx>=WW-1||ty>=WH-1)continue;const i=ty*WW+tx,t=T[i];if(t!==GRASS&&t!==FLOWER&&t!==BUSH)continue;
      if(SETS.some(q=>Math.hypot(tx-q.x,ty-q.y)<q.r+8))continue;T[i]=hash2(tx,ty,77)<0.22&&!(T[i-1]===TREE||T[i-WW]===TREE||T[i-WW-1]===TREE||T[i-WW+1]===TREE)?TREE:FOREST;}}}
function regionKind(x,y){const inL=L=>((x-L.x)/L.rx)**2+((y-L.y)/L.ry)**2<1.15;if(inL(LOBES[3]))return"tundra";if(inL(LOBES[1])||inL(LOBES[2])&&x>318)return"desert";
  if(y>282&&inL(LOBES[0])){if(x<128)return"swamp";if(x>140)return"lakes";}return null;}
const LAKE={x:84,y:180};
let buildings=[], objects=[], waystones=[], piers=[];
function genWorld(){
  for(let y=0;y<WH;y++)for(let x=0;x<WW;x++){
    const dx=(x-140)/124,dy=(y-144)/132;
    let lv=1-Math.hypot(dx,dy)+(fbm(x,y,7)-0.5)*0.7;
    for(const I of ISLES){lv=Math.max(lv,1-Math.hypot(x-I.x,y-I.y)/I.r+(fbm(x,y,9)-0.5)*0.5);}
    for(const L of LOBES){lv=Math.max(lv,1-Math.hypot((x-L.x)/L.rx,(y-L.y)/L.ry)+(fbm(x+77,y+33,8)-0.5)*0.45);}if(x<3||y<3||x>=WW-3||y>=WH-3)lv=Math.min(lv,-0.1);
    for(const s of SETS){const d=Math.hypot(x-s.x,y-s.y);if(d<s.r+7)lv=Math.max(lv,0.4);}for(const q of POIS){if(Math.hypot(x-q.x,y-q.y)<9)lv=Math.max(lv,0.3);}
    let t;
    if(lv<0)t=DEEP;else if(lv<0.07)t=SHAL;else if(lv<0.13)t=SAND;else{
      const e=fbm(x+300,y,3)+0;
      const m=fbm(x,y+500,5);
      if(e>0.62){t=MTN;ELEV[y*WW+x]=e>0.78?3:e>0.7?2:1;if(hash2(x,y,14)<0.03)t=ROCK;}
      else if(m>0.55){const clear=fbm(x+900,y+900,15)<0.36;const dense=m>0.64?0.26:0.17;t=!clear&&hash2(x,y,11)<dense?TREE:FOREST;if(t===FOREST&&hash2(x,y,12)<0.03)t=BUSH;}
      else{t=GRASS;const h=hash2(x,y,13);if(h<0.035)t=FLOWER;else if(h<0.042)t=BUSH;else if(h<0.052)t=TREE;}
      if((t===TREE||t===BUSH)&&y>0&&x>0){const a=T[y*WW+x-1],b=T[(y-1)*WW+x],c=T[(y-1)*WW+x-1],d=T[(y-1)*WW+x+1];if([a,b,c,d].some(q=>q===TREE||q===BUSH))t=m>0.55?FOREST:GRASS;}
    }
    if(t>=GRASS||t===SAND){const rk=regionKind(x,y);if(rk&&lv>=0.13){const h=hash2(x,y,401),m2=fbm(x+1200,y+700,6);
      if(rk==="tundra"){t=h<0.05?TREE:h<0.07?ROCK:m2>0.62?ICE:SNOW;}
      else if(rk==="desert"){t=m2>0.64?(h<0.35?MESA:ROCK):h<0.025?CACTUS:h<0.03?ROCK:DUNE;}
      else if(rk==="swamp"){t=m2>0.6?(h<0.5?SHAL:MUD):h<0.06?DEADTREE:h<0.16?REED:MUD;}
      else if(rk==="lakes"){t=h<0.03?TREE:h<0.06?FLOWER:h<0.08?REED:GRASS;}
      if(t===TREE||t===DEADTREE||t===CACTUS||t===ROCK||t===MESA){if(y>0&&x>0){const a=T[y*WW+x-1],b=T[(y-1)*WW+x],c=T[(y-1)*WW+x-1],d=T[(y-1)*WW+x+1];if([a,b,c,d].some(q=>SOLID_T.has(q)))t=rk==="tundra"?SNOW:rk==="desert"?DUNE:rk==="swamp"?MUD:GRASS;}}}}
    T[y*WW+x]=t;
  }
  borderForests();demonGround();
  for(const L of LAKES2)for(let y=L.y-L.ry-2;y<=L.y+L.ry+2;y++)for(let x=L.x-L.rx-2;x<=L.x+L.rx+2;x++){const d=Math.hypot((x-L.x)/L.rx,(y-L.y)/L.ry);if(d<1)T[y*WW+x]=d<0.7?DEEP:SHAL;else if(d<1.25&&T[y*WW+x]!==DEEP&&T[y*WW+x]!==SHAL)T[y*WW+x]=SAND;}
  // lake + river
  for(let y=0;y<WH;y++)for(let x=0;x<WW;x++){
    const d=Math.hypot((x-LAKE.x)/15,(y-LAKE.y)/10);
    if(d<1)T[y*WW+x]=d<0.75?DEEP:SHAL;else if(d<1.18&&T[y*WW+x]!==DEEP&&T[y*WW+x]!==SHAL)T[y*WW+x]=SAND;
  }
  for(let y=LAKE.y+5;y<WH;y++){const cx=Math.round(LAKE.x+Math.sin(y*0.18)*4);
    if(T[y*WW+cx]===DEEP&&y>LAKE.y+12)break;
    for(let k=-2;k<=2;k++){const i=y*WW+cx+k;T[i]=Math.abs(k)<2?DEEP:SHAL;}}
  // mountain ruins
  for(let y=RUINS.y-6;y<=RUINS.y+6;y++)for(let x=RUINS.x-8;x<=RUINS.x+8;x++){
    const edge=Math.abs(y-RUINS.y)===6||Math.abs(x-RUINS.x)===8;
    T[y*WW+x]=edge?(hash2(x,y,21)<0.65?WALL:RUIN):(hash2(x,y,22)<0.06?WALL:RUIN);}
  // island ruins
  for(let y=ISLE_RUIN.y-4;y<=ISLE_RUIN.y+4;y++)for(let x=ISLE_RUIN.x-5;x<=ISLE_RUIN.x+5;x++){
    const edge=Math.abs(y-ISLE_RUIN.y)===4||Math.abs(x-ISLE_RUIN.x)===5;
    T[y*WW+x]=edge&&hash2(x,y,23)<0.5?WALL:RUIN;}
  // cave isle
  for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)T[(CAVE_POS.y+y)*WW+CAVE_POS.x+x]=Math.abs(x)+Math.abs(y)>2?ROCK:RUIN;
  T[CAVE_POS.y*WW+CAVE_POS.x]=CAVE; T[(CAVE_POS.y+1)*WW+CAVE_POS.x]=RUIN;T[(CAVE_POS.y+2)*WW+CAVE_POS.x]=RUIN;
  // dungeon (sealed chamber in the far ocean corner)
  const D=DUNGEON;
  for(let y=D.y;y<D.y+D.h;y++)for(let x=D.x;x<D.x+D.w;x++){
    const edge=y===D.y||x===D.x||y===D.y+D.h-1||x===D.x+D.w-1;
    T[y*WW+x]=edge?WALL:(hash2(x,y,31)<0.07&&y>D.y+2?WALL:RUIN);}
  T[(D.y+D.h-2)*WW+D.x+2]=CAVE; T[(D.y+D.h-3)*WW+D.x+2]=RUIN;
  // roads between settlements
  const road=(a,b)=>{let x=a.x,y=a.y;const step=(nx,ny)=>{x=nx;y=ny;for(let k=0;k<2;k++){const i=y*WW+x+k;const t=T[i];
      if(t===DEEP||t===SHAL)T[i]=PIER;else if(t===CLIFF)T[i]=STAIRS;else if(t!==COBBLE&&t!==RUIN&&t!==WALL&&t!==CAVE)T[i]=ROAD;}};
    while(x!==b.x)step(x+Math.sign(b.x-x),y);while(y!==b.y)step(x,y+Math.sign(b.y-y));};
  road(SETS[0],SETS[1]);road(SETS[0],SETS[2]);road(SETS[0],SETS[3]);road(SETS[0],SETS[4]);road(SETS[2],{x:RUINS.x,y:RUINS.y+7});road({x:RUINS.x,y:SETS[2].y},{x:RUINS.x,y:RUINS.y});road(SETS[3],{x:POIS[0].x,y:POIS[0].y-6});road(SETS[0],{x:POIS[1].x,y:POIS[1].y-6});road(SETS[2],{x:POIS[2].x,y:POIS[2].y+6});road(SETS[4],SETS[7]);road(SETS[7],SETS[8]);road(SETS[7],SETS[9]);road(SETS[8],{x:POIS[5].x+6,y:POIS[5].y});road(SETS[9],{x:POIS[6].x,y:POIS[6].y-6});road(SETS[7],{x:POIS[8].x,y:POIS[8].y-6});road(SETS[4],{x:POIS[10].x,y:POIS[10].y+6});road(SETS[6],{x:POIS[7].x,y:POIS[7].y+6});
  for(const [a,b] of [[10,11],[10,12],[13,14],[13,15],[16,17],[16,18],[10,6],[9,12],[13,8],[13,7],[16,9],[16,15],[10,16],[18,15],[11,17]])road(SETS[a],SETS[b]);
  buildings=[];objects=[];waystones=[];piers=[];
  for(const s of SETS)if(s.id<10)layoutSettlement(s);
  genRiver();
  // piers
  const mkPier=(s,dir)=>{let x=s.x,y=s.y+1;while(T[y*WW+x]!==DEEP&&T[y*WW+x]!==SHAL||Math.abs(x-s.x)<s.r)x+=dir;
    for(let k=0;k<6;k++){T[y*WW+x]=PIER;T[(y+1)*WW+x]=PIER;x+=dir;}
    for(let k=0;k<3;k++)for(let j=-2;j<=3;j++){const i=(y+j)*WW+x+k*dir;if(T[i]!==PIER)T[i]=DEEP;}
    const p={s:s.id,x:x-dir,y:y,bx:(x+dir*0.5)*TILE,by:(y+2.2)*TILE,dir};piers.push(p);return p;};
  mkPier(SETS[1],1);mkPier(SETS[5],-1);mkPier(SETS[6],-1);
  // extra wild waystone at ruins & island
  waystones.push({s:-1,name:"Old Ruins",x:RUINS.x,y:RUINS.y+8,found:false});
  for(const w of waystones){T[w.y*WW+w.x]=COBBLE;OCC[w.y*WW+w.x]=-1;}
  objects.push({type:"chest",id:"isleruin",x:ISLE_RUIN.x,y:ISLE_RUIN.y,loot:{gold:80,amulet:1}});
  objects.push({type:"chest",id:"dungeon",x:DUNGEON.x+26,y:DUNGEON.y+3,loot:{gold:150,gem:3,dscale:1}});
  objects.push({type:"chest",id:"ruins",x:RUINS.x+5,y:RUINS.y-3,loot:{gold:40,gem:1}});
  objects.push({type:"chest",id:"coral",x:ISLES[0].x-4,y:ISLES[0].y+18,loot:{gold:30,pearl:2}});
  POIS.forEach((q,i)=>{for(let y=q.y-4;y<=q.y+4;y++)for(let x=q.x-6;x<=q.x+6;x++){const e=Math.abs(y-q.y)===4||Math.abs(x-q.x)===6;T[y*WW+x]=e&&hash2(x,y,61+i)<0.45&&!(x===q.x||y===q.y)?WALL:RUIN;}objects.push({type:"chest",id:"poi"+i,x:q.x+2,y:q.y-2,loot:q.loot});waystones.push({s:-1,name:q.name,x:q.x,y:q.y+5,found:false});});
  for(const o of objects){T[o.y*WW+o.x]=o.type==="chest"?(T[o.y*WW+o.x]===RUIN?RUIN:SAND):T[o.y*WW+o.x];if(o.type==="chest")OCC[o.y*WW+o.x]=-1;}
}
const MUD=22,DUNE=23,SNOW=24,ICE=25,CACTUS=26,DEADTREE=27,MESA=28,REED=29;
const SOLID_T=new Set([TREE,ROCK,WALL,BUSH,CACTUS,DEADTREE,MESA]);
let LOOKOUTS=[];
function finalizeTerrain(){
  // cliffs where elevation drops to the south; stairs every 7 columns (switchbacks) and along roads
  for(let y=0;y<WH-1;y++)for(let x=0;x<WW;x++){const i=y*WW+x,e=ELEV[i];if(!e)continue;const t=T[i];if(t!==MTN&&t!==ROCK)continue;
    if(ELEV[i+WW]<e&&T[i+WW]!==DEEP){T[i]=(x%7===0||(x+y)%23===0)?STAIRS:CLIFF;}}
  // keep trees away from roads, doors, piers, waystones, objects; no enclosures
  const clearAround=(cx,cy,r)=>{for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){const i=y*WW+x;if(T[i]===TREE||T[i]===BUSH||T[i]===ROCK&&ELEV[i])T[i]=GRASS;}};
  for(let y=1;y<WH-1;y++)for(let x=1;x<WW-1;x++){const t=T[y*WW+x];if(t===ROAD||t===PIER||t===STAIRS)clearAround(x,y,1);}
  for(const b of buildings)clearAround(b.x+1,b.y+b.h+1,2);
  for(const w of waystones)clearAround(w.x,w.y+1,2);for(const o of objects)clearAround(o.x,o.y+1,1);for(const p of piers)clearAround(p.x,p.y,2);
  for(const s of SETS){for(let y=s.y-s.r-3;y<=s.y+s.r+3;y++)for(let x=s.x-s.r-3;x<=s.x+s.r+3;x++){const i=y*WW+x;if(Math.hypot(x-s.x,y-s.y)<=s.r+3&&(T[i]===TREE||T[i]===BUSH))T[i]=GRASS;}}
  for(const w of waystones){T[w.y*WW+w.x]=COBBLE;}
  // peaks: lookouts (with treasure on some)
  LOOKOUTS=[];for(let y=4;y<WH-4;y+=2)for(let x=4;x<WW-4;x+=2){const i=y*WW+x;if(ELEV[i]===3&&T[i]===MTN&&ELEV[i-WW]===3&&ELEV[i+1]===3&&!LOOKOUTS.some(l=>Math.hypot(l.x-x,l.y-y)<26)&&!LAIRS.some(l=>Math.hypot(l.x-x,l.y-y)<10)){
    LOOKOUTS.push({x,y});objects.push({type:"lookout",x,y,id:"look"+x+"_"+y});OCC[i]=-1;if(LOOKOUTS.length%2){objects.push({type:"chest",id:"peak"+x+"_"+y,x:x+2,y,loot:{gold:60,gem:2}});OCC[i+2]=-1;T[i+2]=MTN;}}}
}
function solidTile(tx,ty){if(tx<0||ty<0||tx>=WW||ty>=WH)return true;const i=ty*WW+tx;return SOLID_T.has(T[i])||OCC[i]!==0;}
function blocked(x,y,w,h){const x0=Math.floor(x/TILE),y0=Math.floor(y/TILE),x1=Math.floor((x+w-0.01)/TILE),y1=Math.floor((y+h-0.01)/TILE);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++)if(solidTile(tx,ty))return true;return false;}
const isWater=t=>t===DEEP||t===SHAL;
function blockedE(e){
  if(room&&e===hero)return roomBlocked(e);
  const x0=Math.floor(e.x/TILE),y0=Math.floor(e.y/TILE),x1=Math.floor((e.x+e.w-0.01)/TILE),y1=Math.floor((e.y+e.h-0.01)/TILE);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
    const t=tAt(tx,ty);
    if(e===hero&&hero.boat){if(!isWater(t))return true;continue;}
    if(solidTile(tx,ty))return true;
    if(e!==hero&&t===DEEP&&!e.swims)return true;
    if(e!==hero&&t===CLIFF)return true;
    if(e!==hero&&!e.npc&&GATES.length){const g=gateAt(tx,ty);if(g&&gateClosed(g)&&!(g.hp<=0))return true;}
    if(e!==hero&&!e.npc&&walls.length&&walls.some(w=>aabb(e,w)))return true;
    if(e.npc&&(t!==COBBLE&&t!==GRASS&&t!==ROAD&&t!==FARM&&t!==PIER&&t!==SAND&&t!==FLOWER))return true;
  }
  return false;
}
// ===== PAINTED TILES =====
const SEASONS=["Spring","Summer","Autumn","Winter"];
const GRASSC=[["#4fb53a","#7fd24a","#2f8a2a","#ffe36a"],["#3fa534","#6cc63e","#23771f","#fff08a"],["#a8a43a","#d49a3a","#7a6a22","#e86a2a"],["#9fb8b0","#e8f2f4","#6f8c88","#ffffff"]];
const LEAFC=[["#2f9a3a","#5fd05a","#1a5e24","#ff9ad0"],["#22843a","#4fc04a","#124a20","#e8ff8a"],["#d2641e","#f2b23a","#8a2e14","#ffdf6a"],["#56786e","#eef6f8","#2e4a44","#ffffff"]];
function dabs(g,n,cols,s,r0,r1){for(let i=0;i<n;i++){g.globalAlpha=0.25+hash2(i,s,77)*0.45;g.fillStyle=cols[i%cols.length];
  g.beginPath();g.ellipse(hash2(i,s,1)*16,hash2(i,s,2)*16,r0+hash2(i,s,3)*(r1-r0),(r0+hash2(i,s,4)*(r1-r0))*0.7,hash2(i,s,5)*3,0,7);g.fill();}g.globalAlpha=1;}
function fine(g,v){for(let i=0;i<18;i++){g.globalAlpha=0.12+hash2(i,v,201)*0.12;g.fillStyle=i%2?"#fff":"#000";g.fillRect(hash2(i,v,202)*16,hash2(i,v,203)*16,0.5,0.5);}g.globalAlpha=1;}
function makeTiles(season){
  const tiles={};const G=GRASSC[season],L=LEAFC[season];
  const mk=(f,n=4)=>{const a=[];for(let v=0;v<n;v++){const c=mkCanvas(32,32),g=c.getContext("2d");g.scale(2,2);f(g,v);fine(g,v);a.push(c);}return a;};
  tiles[GRASS]=mk((g,v)=>{g.fillStyle=G[0];g.fillRect(0,0,16,16);dabs(g,14,[G[1],G[2],G[0]],v*13+season,1,3);
    g.strokeStyle=G[2];g.globalAlpha=.6;for(let i=0;i<5;i++){const x=hash2(i,v,8)*16,y=hash2(i,v,9)*16;g.beginPath();g.moveTo(x,y);g.lineTo(x+1,y-3);g.stroke();}g.globalAlpha=1;});
  tiles[FLOWER]=mk((g,v)=>{g.drawImage(tiles[GRASS][v],0,0,16,16);const fc=season===3?["#fff"]:["#ff5aa8","#ffd23a","#a46aff","#ff7a3a","#fff"];
    for(let i=0;i<5;i++){g.fillStyle=fc[(i+v)%fc.length];const x=2+hash2(i,v,40)*12,y=2+hash2(i,v,41)*12;g.beginPath();g.arc(x,y,1.4,0,7);g.fill();g.fillStyle="#fff6b0";g.fillRect(x-0.5,y-0.5,1,1);}});
  tiles[FOREST]=mk((g,v)=>{g.fillStyle=season===3?"#8aa8a2":season===2?"#6a6a24":"#2d7a2c";g.fillRect(0,0,16,16);dabs(g,16,[L[2],G[2],season===2?"#c8642a":"#3e9a34"],v*7+3,1,3.5);});
  tiles[SAND]=mk((g,v)=>{g.fillStyle="#f0d48a";g.fillRect(0,0,16,16);dabs(g,12,["#ffe8a8","#d8b060","#f8dc98"],v+50,1,2.5);g.fillStyle="#c89a50";g.fillRect(hash2(v,1,3)*14,hash2(v,2,3)*14,1,1);});
  tiles[SHAL]=mk((g,v)=>{const gr=g.createLinearGradient(0,0,16,16);gr.addColorStop(0,"#4fe0d8");gr.addColorStop(1,"#2ab0d0");g.fillStyle=gr;g.fillRect(0,0,16,16);dabs(g,8,["#8ff4ea","#22a0c8","#e8f8c0"],v+60,1,3);});
  tiles[DEEP]=mk((g,v)=>{const gr=g.createLinearGradient(0,0,0,16);gr.addColorStop(0,"#1a6ad8");gr.addColorStop(1,"#1450b0");g.fillStyle=gr;g.fillRect(0,0,16,16);dabs(g,8,["#2a8af0","#0e3a90","#3aa0ff"],v+70,1.5,4);
    g.strokeStyle="rgba(180,230,255,.45)";g.beginPath();const y=4+v*3;g.moveTo(2,y);g.quadraticCurveTo(6,y-2,10,y);g.stroke();});
  tiles[ROCK]=mk((g,v)=>{g.fillStyle="#7a6f8a";g.fillRect(0,0,16,16);dabs(g,10,["#a59ab8","#544a66","#8e84a2"],v+80,2,5);
    g.fillStyle=season===3?"#f4faff":"rgba(255,255,255,.25)";g.beginPath();g.moveTo(3,7);g.lineTo(8,1);g.lineTo(13,7);g.lineTo(10,6);g.lineTo(8,4);g.lineTo(6,6);g.fill();
    g.strokeStyle="#3a3048";g.beginPath();g.moveTo(4,14);g.lineTo(8,9);g.lineTo(12,15);g.stroke();});
  tiles[ROAD]=mk((g,v)=>{g.fillStyle="#c49a62";g.fillRect(0,0,16,16);dabs(g,12,["#dcb47a","#a87c48","#b88c58"],v+90,1,3);g.fillStyle="#8a6a44";for(let i=0;i<3;i++)g.fillRect(hash2(i,v,91)*15,hash2(i,v,92)*15,2,1);});
  tiles[COBBLE]=mk((g,v)=>{g.fillStyle="#8a7e78";g.fillRect(0,0,16,16);for(let y=0;y<4;y++)for(let x=0;x<4;x++){const o=y%2?2:0;
      g.fillStyle=["#c8b8a8","#b0a094","#d8c8b0","#a89488"][(x+y+v)%4];g.beginPath();g.ellipse(x*4+o+2,y*4+2,1.8,1.5,0,0,7);g.fill();}
    g.fillStyle="rgba(255,240,200,.25)";g.fillRect(0,0,16,1);});
  tiles[RUIN]=mk((g,v)=>{g.fillStyle="#9a9488";g.fillRect(0,0,16,16);g.strokeStyle="#5e584e";g.strokeRect(0.5,0.5,8,8);g.strokeRect(8.5,8.5,7,7);
    dabs(g,6,["#b8b2a4","#6aa04a","#7a7468"],v+100,1,3);});
  tiles[WALL]=mk((g,v)=>{g.fillStyle="#6a6278";g.fillRect(0,0,16,16);g.fillStyle="#8e86a0";g.fillRect(1,1,14,10);g.fillStyle="#4a4458";g.fillRect(0,12,16,4);
    g.strokeStyle="#e8c060";g.lineWidth=1;g.beginPath();g.moveTo(2,6);g.bezierCurveTo(5,2,7,10,8,6);g.bezierCurveTo(9,2,11,10,14,6);g.stroke();
    g.fillStyle=["#3ff","#f5f","#ff5"][v%3];g.beginPath();g.arc(8,6,1.3,0,7);g.fill();},3);
  tiles[PIER]=mk((g,v)=>{g.drawImage(tiles[DEEP][v],0,0,16,16);g.fillStyle="#9a6a3a";g.fillRect(0,1,16,14);g.fillStyle="#b88450";for(let i=0;i<4;i++)g.fillRect(i*4,1,3,14);
    g.fillStyle="#5a3a1a";g.fillRect(0,1,16,1);g.fillRect(0,14,16,1);});
  tiles[FARM]=mk((g,v)=>{g.fillStyle="#7a4e2a";g.fillRect(0,0,16,16);g.fillStyle="#5a361a";for(let y=1;y<16;y+=4)g.fillRect(0,y,16,2);dabs(g,4,["#9a6a3a"],v+110,1,2);});
  tiles[CAVE]=mk((g,v)=>{g.fillStyle="#6a6070";g.fillRect(0,0,16,16);g.fillStyle="#120a18";g.beginPath();g.ellipse(8,10,6,7,0,Math.PI,0);g.fillRect(2,10,12,6);g.fill();
    g.fillStyle="#e8c060";g.fillRect(1,2,2,14);g.fillRect(13,2,2,14);g.fillStyle="#6ff";g.beginPath();g.arc(8,2,1.5,0,7);g.fill();},1);
  tiles[MTN]=mk((g,v)=>{g.fillStyle=season===3?"#b8c4cc":"#8f8a78";g.fillRect(0,0,16,16);dabs(g,12,season===3?["#e8f2f8","#9aa8b4"]:["#a8a088","#6e6a5a","#7f9a58"],v+130,1,3);
    g.fillStyle="rgba(60,50,70,.5)";g.fillRect(hash2(v,3,4)*12,hash2(v,4,4)*12,3,2);});
  tiles[CLIFF]=mk((g,v)=>{const gr=g.createLinearGradient(0,0,0,16);gr.addColorStop(0,"#b0a6c0");gr.addColorStop(.25,"#7a6e8a");gr.addColorStop(1,"#3e3450");g.fillStyle=gr;g.fillRect(0,0,16,16);
    g.strokeStyle="rgba(30,20,40,.6)";for(let i=0;i<4;i++){const x=2+i*4+hash2(i,v,6)*2;g.beginPath();g.moveTo(x,3);g.lineTo(x+hash2(i,v,7)*2-1,16);g.stroke();}
    g.fillStyle=season===3?"#f4faff":"#9ad06a";g.fillRect(0,0,16,2);g.fillStyle="rgba(255,255,255,.35)";g.fillRect(0,2,16,1);});
  tiles[19]=mk((g,v)=>{g.drawImage(tiles[GRASS][v],0,0,16,16);g.fillStyle="rgba(0,0,0,.2)";g.beginPath();g.ellipse(9,12,5,2,0,0,7);g.fill();g.fillStyle="#7a4a24";g.fillRect(5,7,7,5);g.fillStyle="#d8b070";g.beginPath();g.ellipse(8.5,7,3.5,1.6,0,0,7);g.fill();g.strokeStyle="#a07040";g.beginPath();g.ellipse(8.5,7,1.6,.7,0,0,7);g.stroke();});
  tiles[20]=mk((g,v)=>{g.drawImage(tiles[GRASS][v],0,0,16,16);g.fillStyle="#6a4024";g.fillRect(7.5,6,1,7);g.fillStyle=L[0];g.beginPath();g.arc(8,6,3.2,0,7);g.fill();g.fillStyle=L[1];g.beginPath();g.arc(7,5,1.6,0,7);g.fill();});
  tiles[STAIRS]=mk((g,v)=>{g.fillStyle="#6a5e78";g.fillRect(0,0,16,16);for(let i=0;i<4;i++){g.fillStyle="#c8b898";g.fillRect(2,i*4,12,3);g.fillStyle="#8a7a62";g.fillRect(2,i*4+3,12,1);}
    g.fillStyle="#e8c060";g.fillRect(1,0,1,16);g.fillRect(14,0,1,16);});
  const tree=(g,v,base)=>{g.drawImage(base,0,0,16,16);g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.ellipse(9,14,6,2,0,0,7);g.fill();
    g.fillStyle="#6a4024";g.fillRect(7,9,3,6);
  };
  tiles.canopy=[0,1,2,3].map(v=>{const c=mkCanvas(48,44),g=c.getContext("2d");g.scale(2,2);g.translate(4,4);
    const cs=[[8,9,7.5,L[2]],[5,7,5,L[0]],[11,6,5,L[0]],[8,4,4.8,L[1]],[6,3.5,2.5,L[1]]];for(const [x,y,r,c2] of cs){const gr=g.createRadialGradient(x-1.5,y-2,0.5,x,y,r);gr.addColorStop(0,c2);gr.addColorStop(1,L[2]);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
    dabs(g,14,[L[1],L[3],L[0]],v+120,0.4,1.2);g.globalAlpha=1;return c;});
  tiles[TREE]=mk((g,v)=>tree(g,v,tiles[GRASS][v]));
  tiles[BUSH]=mk((g,v)=>{g.drawImage(tiles[GRASS][v],0,0,16,16);g.fillStyle=L[2];g.beginPath();g.ellipse(8,10,7,5,0,0,7);g.fill();g.fillStyle=L[0];g.beginPath();g.ellipse(7,8,5,4,0,0,7);g.fill();
    if(season<3){g.fillStyle="#e8204a";for(let i=0;i<4;i++){g.beginPath();g.arc(4+hash2(i,v,5)*8,7+hash2(i,v,6)*5,1.1,0,7);g.fill();}}});
  return tiles;
}
let TILESET=null, tileSeason=-1;
const GCLASS={19:1,20:1,[MTN]:5,[GRASS]:1,[FLOWER]:1,[TREE]:1,[BUSH]:2,[FOREST]:2,[SAND]:3,[ROAD]:4,[ROCK]:5,[COBBLE]:6,[RUIN]:7,[FARM]:8};
function blendEdgesBase(g,tx,ty,t,px0,py0){const my=GCLASS[t];if(!my)return;
  const nb=[[0,-1],[0,1],[-1,0],[1,0]];
  for(let k=0;k<4;k++){const [dx,dy]=nb[k];const n=tAt(tx+dx,ty+dy),nc=GCLASS[n];if(!nc||nc===my||nc>my&&!(my===1&&nc===2))continue;
    const src=TILESET[n===TREE?GRASS:n===BUSH?FOREST:n][0];
    for(let s=0;s<3;s++){g.globalAlpha=0.38-s*0.12;const w=2+s*2;
      if(dy<0)g.drawImage(src,0,0,32,w*2,px0,py0,16,w);if(dy>0)g.drawImage(src,0,32-w*2,32,w*2,px0,py0+16-w,16,w);
      if(dx<0)g.drawImage(src,0,0,w*2,32,px0,py0,w,16);if(dx>0)g.drawImage(src,32-w*2,0,w*2,32,px0+16-w,py0,w,16);}
    g.globalAlpha=1;}}
const chunkCache=new Map(); const CH=16;
function invalidateTile(x,y){chunkCache.delete((x>>4)+","+(y>>4));}
function getChunk(cx,cy){
  const k=cx+","+cy; let c=chunkCache.get(k); if(c)return c;
  c=mkCanvas(CH*TILE*RS,CH*TILE*RS); const g=c.getContext("2d"); g.scale(RS,RS);
  for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){const tx=cx*CH+x,ty=cy*CH+y;const t=tAt(tx,ty);
    let set=TILESET[t]; const v=Math.floor(hash2(tx,ty,5)*set.length);
    g.drawImage(set[v],x*TILE,y*TILE,16,16);
    blendEdges(g,tx,ty,t,x*TILE,y*TILE);
    const ev=elevAt(tx,ty);if(ev&&t!==CLIFF){g.fillStyle=`rgba(255,250,230,${ev*0.07})`;g.fillRect(x*TILE,y*TILE,16,16);}
    if(tAt(tx,ty-1)===CLIFF&&t!==CLIFF){const gr=g.createLinearGradient(0,y*TILE,0,y*TILE+8);gr.addColorStop(0,"rgba(20,10,40,.45)");gr.addColorStop(1,"rgba(20,10,40,0)");g.fillStyle=gr;g.fillRect(x*TILE,y*TILE,16,8);}
    if(isWater(t)){ // shoreline foam
      g.strokeStyle="rgba(255,255,255,.55)";g.lineWidth=1.5;g.beginPath();
      if(!isWater(tAt(tx,ty-1))&&tAt(tx,ty-1)!==PIER){g.moveTo(x*16,y*16+1);g.lineTo(x*16+16,y*16+1);}
      if(!isWater(tAt(tx,ty+1))&&tAt(tx,ty+1)!==PIER){g.moveTo(x*16,y*16+15);g.lineTo(x*16+16,y*16+15);}
      if(!isWater(tAt(tx-1,ty))&&tAt(tx-1,ty)!==PIER){g.moveTo(x*16+1,y*16);g.lineTo(x*16+1,y*16+16);}
      if(!isWater(tAt(tx+1,ty))&&tAt(tx+1,ty)!==PIER){g.moveTo(x*16+15,y*16);g.lineTo(x*16+15,y*16+16);}
      g.stroke();
    }
  }
  chunkCache.set(k,c);
  if(chunkCache.size>30){chunkCache.delete(chunkCache.keys().next().value);}
  return c;
}
// world overview map (1px per tile)
let worldMapC=null;
const MAPCOL={22:"#6a7040",23:"#e8c880",24:"#eef4fa",25:"#b8dcf0",26:"#4a9a4a",27:"#5a4a3a",28:"#b8683a",29:"#8aa860",21:"#a0703a",19:"#7a9a40",20:"#4aa040",16:"#5a5068",17:"#9a90a8",18:"#c8a878",0:"#1a5ac8",1:"#3ad0d8",2:"#f0d48a",3:"#5cbc40",4:"#2d7a2c",5:"#1e6a26",6:"#8a80a0",7:"#d8a868",8:"#b0a898",9:"#5a5268",10:"#a0703a",11:"#7ad050",12:"#e0d0b8",13:"#8a5a30",14:"#000",15:"#2f8a2a"};
function buildWorldMap(){worldMapC=mkCanvas(WW,WH);const g=worldMapC.getContext("2d");const id=g.createImageData(WW,WH);
  for(let i=0;i<WW*WH;i++){let t=T[i];const x=i%WW,y=(i/WW)|0;if(x<40&&y<26)t=DEEP;const c=MAPCOL[t];id.data[i*4]=parseInt(c.substr(1,2),16)||0;
    if(c.length===4){id.data[i*4]=parseInt(c[1]+c[1],16);id.data[i*4+1]=parseInt(c[2]+c[2],16);id.data[i*4+2]=parseInt(c[3]+c[3],16);}
    else{id.data[i*4+1]=parseInt(c.substr(3,2),16);id.data[i*4+2]=parseInt(c.substr(5,2),16);}
    if(OCC[i]>0){id.data[i*4]=200;id.data[i*4+1]=80;id.data[i*4+2]=60;}id.data[i*4+3]=255;}
  g.putImageData(id,0,0);}
function biomeAt(tx,ty){const t=tAt(tx,ty);if(t===MUD||t===REED||t===DEADTREE)return"swamp";if(t===DUNE||t===CACTUS||t===MESA)return"desert";if(t===SNOW||t===ICE)return"tundra";if(t===RUIN||t===WALL)return"ruins";if(t===ROCK||t===MTN||t===CLIFF||t===STAIRS)return"mountain";
  if(t===FOREST||t===TREE||t===BUSH)return"forest";if(isWater(t))return"water";if(t===SAND)return"shore";
  if(ty<70&&tx<125&&fbm(tx+300,ty,3)>0.6)return"mountain";return"meadow";}
function settlementAt(px,py){const tx=px/TILE,ty=py/TILE;for(const s of SETS)if(Math.hypot(tx-s.x,ty-s.y)<s.r+1)return s;return null;}
