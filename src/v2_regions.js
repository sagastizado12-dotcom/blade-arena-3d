// ===== NEW REGIONS: swamp, desert/badlands, frozen tundra, lake district — tiles & spawns =====
const _makeTilesR=makeTiles;makeTiles=function(season){const tiles=_makeTilesR(season);
  const mk=(f,n=4)=>{const a=[];for(let v=0;v<n;v++){const c=mkCanvas(32,32),g=c.getContext("2d");g.imageSmoothingEnabled=false;g.scale(2,2);f(g,v);a.push(c);}return a;};const H=(i,v,k)=>hash2(i,v,k);
  const base=(g,v,c0,c1,c2,n=6)=>{pxR(g,0,0,16,16,c0);for(let i=0;i<n;i++)pxR(g,(H(i,v,3)*15)|0,(H(i,v,4)*15)|0,2,1,i%2?c1:c2);};
  const mud=(g,v)=>{base(g,v,"#6a6a3a","#585a30","#7c7a48");pxR(g,(H(v,1,7)*10)|0,(H(v,2,7)*10)|0,4,2,"#4a5a3a");pxR(g,(H(v,3,7)*12)|0,(H(v,4,7)*12)|0,1,1,"#9ab060");};
  const dune=(g,v)=>{base(g,v,"#ecc880","#d8b068","#f8dca0",5);pxR(g,0,(4+v*3)%14,16,1,"#dcb470");pxR(g,3,(10+v*3)%15,10,1,"#f8e0a8");};
  const snow=(g,v)=>{base(g,v,"#eef4fa","#d8e4f0","#ffffff",5);pxR(g,(H(v,5,7)*12)|0,(H(v,6,7)*12)|0,2,1,"#c8d8ea");};
  tiles[MUD]=mk(mud);tiles[DUNE]=mk(dune);tiles[SNOW]=mk(snow);
  tiles[ICE]=mk((g,v)=>{pxR(g,0,0,16,16,"#b8dcf0");pxR(g,2+v,3,7,1,"#e8f8ff");pxR(g,8-v,10,6,1,"#e8f8ff");pxR(g,3,12,1,1,"#90c0dc");});
  tiles[REED]=mk((g,v)=>{(regionAtTileArt(v)?mud:(gg,vv)=>{pxR(gg,0,0,16,16,"#5cbc40");})(g,v);for(let i=0;i<4;i++){const x=2+i*3+(v%2);pxR(g,x,5+(i%2)*2,1,9,"#5a8a2a");pxR(g,x,4+(i%2)*2,1,2,"#8a6a3a");}});
  tiles[CACTUS]=mk((g,v)=>{dune(g,v);pxR(g,3,13,11,2,"rgba(0,0,0,.18)");pxR(g,6,3,4,12,POL);pxR(g,7,4,2,10,"#4aa04a");pxR(g,7,4,1,10,"#7ad06a");pxR(g,2,6,4,1,POL);pxR(g,2,6,1,4,POL);pxR(g,3,7,2,3,"#4aa04a");pxR(g,10,8,4,1,POL);pxR(g,13,5,1,4,POL);pxR(g,11,6,2,2,"#4aa04a");if(v===1)pxR(g,8,2,2,2,"#ff7aa0");});
  tiles[DEADTREE]=mk((g,v)=>{mud(g,v);pxR(g,3,13,11,2,"rgba(0,0,0,.2)");pxR(g,6,4,4,11,POL);pxR(g,7,5,2,10,"#6a5040");pxR(g,3,3,4,1,POL);pxR(g,9,2,5,1,POL);pxR(g,4,4,3,1,"#6a5040");pxR(g,10,3,3,1,"#6a5040");pxR(g,5,8,2,2,"#8aa060");});
  tiles[MESA]=mk((g,v)=>{dune(g,v);pxR(g,1,4,14,11,POL);pxR(g,2,5,12,9,"#c8703a");pxR(g,2,5,12,2,"#e89a5a");pxR(g,2,9,12,1,"#a8502a");pxR(g,2,12,12,1,"#a8502a");});
  return tiles;};
function regionAtTileArt(v){return true;}
// spawn tables for the new biomes
(function(){const add=(re,b)=>{for(const k in SPECIES){const d=SPECIES[k];if(!d.biome||!re.test(k))continue;if(!d.biome.includes(b))d.biome.push(b);}};
  add(/^(slime|meadowslime|viper|snapbloom|venusmaw|mudgolem|wisp|duskbat|treant)$/,"swamp");
  add(/^(cobra|mummy|skeleton|stonegolem|firespirit|emberslime|cyclops|manebeast|imp)$/,"desert");
  add(/^(steelslime|wolfman|gargoyle|knight|gazer|evileye|wisp|vampbat|dreadknight)$/,"tundra");
  add(/^(slime|meadowslime|viper|snapbloom|duskbat|wolfman)$/,"lakes");})();
