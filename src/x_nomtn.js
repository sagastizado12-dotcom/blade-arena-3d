// ===== NO MOUNTAINS: former highlands become open, walkable forest =====
function removeMountains(){for(let y=0;y<WH;y++)for(let x=0;x<WW;x++){const i=y*WW+x;const t=T[i];ELEV[i]=0;
    if(t===MTN||t===CLIFF||t===STAIRS){T[i]=hash2(x,y,77)<0.25?GRASS:FOREST;}}
  // scatter trees in the new forest: never adjacent (incl. diagonals), so trunks never form walls
  for(let y=1;y<WH-1;y++)for(let x=1;x<WW-1;x++){const i=y*WW+x;if(T[i]!==FOREST||OCC[i])continue;if(hash2(x,y,91)>0.22)continue;
    let ok=true;for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const n=T[(y+dy)*WW+x+dx];if(n===TREE||n===ROCK||n===BUSH||n===WALL){ok=false;break;}}
    if(ok)T[i]=TREE;}
  for(const k in SPECIES){const d=SPECIES[k];if(d.biome&&d.biome.includes("mountain"))d.biome=[...new Set(d.biome.map(b=>b==="mountain"?(d.fly?"ruins":"forest"):b))];}}
