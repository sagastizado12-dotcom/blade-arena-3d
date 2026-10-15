// ===== PIXEL TOWN ART DIRECTION (clean 16px top-down, 1px soft outlines, cheerful palette) =====
const POL="#2a2238";
function pxR(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function pxDisc(g,cx,cy,r,c,ol){for(let y=-r-1;y<=r+1;y++)for(let x=-r-1;x<=r+1;x++){const d=Math.hypot(x+.5,y+.5);if(d<=r){g.fillStyle=c;g.fillRect(cx+x,cy+y,1,1);}else if(ol&&d<=r+1){g.fillStyle=ol;g.fillRect(cx+x,cy+y,1,1);}}}
const PGR=[["#5cc84a","#4cb03e","#82e060"],["#54c040","#44a834","#7ad858"],["#9cc048","#86a83a","#c0d860"],["#e8f0f4","#cdd8e0","#ffffff"]];
const PLEAF=[["#3eae3a","#2a8a2e","#6ad85a"],["#36a032","#25802a","#5ccc4c"],["#d8862a","#b0601e","#f0b040"],["#a8c0c8","#8aa0aa","#e8f4f8"]];
makeTiles=function(season){const tiles={};const G=PGR[season],L=PLEAF[season];
  const mk=(f,n=4)=>{const a=[];for(let v=0;v<n;v++){const c=mkCanvas(32,32),g=c.getContext("2d");g.imageSmoothingEnabled=false;g.scale(2,2);f(g,v);a.push(c);}return a;};
  const H=(i,v,k)=>hash2(i,v,k);
  const grass=(g,v,base)=>{pxR(g,0,0,16,16,base||G[0]);for(let i=0;i<6;i++){const x=(H(i,v,1)*15)|0,y=(H(i,v,2)*14)|0;pxR(g,x,y,1,2,G[1]);pxR(g,x+1,y+1,1,1,G[1]);}for(let i=0;i<3;i++)pxR(g,(H(i,v,3)*15)|0,(H(i,v,4)*15)|0,1,1,G[2]);};
  tiles[GRASS]=mk(grass);
  tiles[FLOWER]=mk((g,v)=>{grass(g,v);const fc=season===3?["#fff"]:["#ff5a6a","#ffffff","#ffd23a","#ff8ad0"];for(let i=0;i<3;i++){const x=2+((H(i,v,5)*11)|0),y=2+((H(i,v,6)*11)|0),c=fc[(i+v)%fc.length];pxR(g,x,y-1,1,1,c);pxR(g,x-1,y,3,1,c);pxR(g,x,y+1,1,1,c);pxR(g,x,y,1,1,"#ffe040");}
    if(v===3&&season<3){pxR(g,10,10,3,2,"#e8402a");pxR(g,11,10,1,1,"#fff");pxR(g,11,12,1,2,"#f4ecd8");}});
  tiles[FOREST]=mk((g,v)=>{grass(g,v,G[1]);for(let i=0;i<4;i++)pxR(g,(H(i,v,7)*15)|0,(H(i,v,8)*15)|0,2,1,"#3a9030");});
  tiles[SAND]=mk((g,v)=>{pxR(g,0,0,16,16,"#f4e2a8");for(let i=0;i<5;i++)pxR(g,(H(i,v,3)*15)|0,(H(i,v,4)*15)|0,1,1,"#dcc488");});
  const water=(g,v,base,hi)=>{pxR(g,0,0,16,16,base);const y=(3+v*3)%14;pxR(g,2+v,y,4,1,hi);pxR(g,9-v,(y+6)%15,5,1,hi);};
  tiles[DEEP]=mk((g,v)=>water(g,v,"#3a8ef0","#7ec0ff"));
  tiles[SHAL]=mk((g,v)=>{water(g,v,"#5cb4ff","#a8dcff");pxR(g,(H(v,1,1)*12)|0,(H(v,2,1)*12)|0,2,2,"#78c4ff");});
  tiles[ROAD]=mk((g,v)=>{pxR(g,0,0,16,16,"#eedcae");for(let i=0;i<5;i++)pxR(g,(H(i,v,3)*15)|0,(H(i,v,4)*15)|0,2,1,"#dcc690");pxR(g,(H(v,9,9)*14)|0,(H(v,8,9)*14)|0,1,1,"#c8b07a");});
  const cob=(g,v,base,line)=>{pxR(g,0,0,16,16,line||"#c4b496");for(let y=0;y<4;y++)for(let x=0;x<2;x++){const ox=y%2?4:0;const sx=(x*8+ox)%16;pxR(g,sx+1,y*4+1,7,3,base||["#ece2c8","#e2d6b8"][(x+y+v)%2]);if(sx+8>16)pxR(g,0,y*4+1,sx+8-16-1,3,base||"#e6dabe");pxR(g,sx+1,y*4+1,7,1,"#f6eedc");}};
  tiles[COBBLE]=mk((g,v)=>cob(g,v));
  tiles[RUIN]=mk((g,v)=>{cob(g,v,"#b0aab0","#7e7884");pxR(g,(H(v,3,3)*12)|0,(H(v,4,3)*12)|0,3,2,"#5cb84a");});
  tiles[WALL]=mk((g,v)=>{cob(g,v,"#b8b4c0","#6e6a78");});
  tiles[PIER]=mk((g,v)=>{water(g,v,"#3a8ef0","#7ec0ff");pxR(g,1,0,14,16,"#c88a50");for(let i=0;i<4;i++){pxR(g,1+i*3.5|0,0,1,16,"#8a5a30");}pxR(g,0,0,1,16,POL);pxR(g,15,0,1,16,POL);pxR(g,2,(v*4)%16,12,1,"#e0a868");});
  tiles[BRIDGE]=mk((g,v)=>{water(g,v,"#3a8ef0","#7ec0ff");pxR(g,0,1,16,14,"#c88a50");for(let i=0;i<4;i++)pxR(g,i*4,1,1,14,"#8a5a30");pxR(g,0,1,16,2,"#7a4a24");pxR(g,0,13,16,2,"#7a4a24");pxR(g,0,0,16,1,POL);pxR(g,0,15,16,1,POL);pxR(g,2+v,6,3,1,"#e0a868");});
  tiles[FARM]=mk((g,v)=>{pxR(g,0,0,16,16,"#a06a3a");for(let y=1;y<16;y+=4){pxR(g,0,y,16,2,"#7e4e28");pxR(g,0,y+2,16,1,"#b88050");if(season<3){pxR(g,2+v,y-1,1,1,"#6ad04a");pxR(g,9-v,y-1,1,1,"#6ad04a");}}});
  tiles[CAVE]=mk((g,v)=>{pxR(g,0,0,16,16,"#8a8494");pxDisc(g,8,11,6,"#1a1424",POL);pxR(g,2,11,12,5,"#1a1424");});
  tiles[MTN]=mk((g,v)=>{pxR(g,0,0,16,16,season===3?"#e4eaf0":"#bcae8a");for(let i=0;i<4;i++)pxR(g,(H(i,v,1)*14)|0,(H(i,v,2)*14)|0,2,1,season===3?"#fff":"#a89870");});
  tiles[CLIFF]=mk((g,v)=>{pxR(g,0,0,16,16,"#9a8a7a");pxR(g,0,9,16,7,"#7a6a5c");for(let i=0;i<3;i++)pxR(g,1+i*5,4+(i%2)*5,4,1,"#b8a898");pxR(g,0,0,16,2,season===3?"#fff":G[0]);pxR(g,0,2,16,1,POL);});
  tiles[STAIRS]=mk((g,v)=>{pxR(g,0,0,16,16,"#8a7a6a");for(let i=0;i<4;i++){pxR(g,2,i*4,12,3,"#e8dcc4");pxR(g,2,i*4+3,12,1,"#9a8a74");}});
  tiles[19]=mk((g,v)=>{grass(g,v);pxR(g,5,8,6,5,"#9a5e30");pxR(g,5,7,6,2,"#e8c890");pxR(g,7,7,2,1,"#c8a070");pxR(g,4,8,1,5,POL);pxR(g,11,8,1,5,POL);pxR(g,5,13,6,1,POL);});
  tiles[20]=mk((g,v)=>{grass(g,v);pxR(g,7,7,1,6,"#7a4a24");pxDisc(g,7,6,3,L[0],POL);pxR(g,6,4,2,1,L[2]);});
  tiles[BUSH]=mk((g,v)=>{grass(g,v);pxR(g,3,13,11,2,"rgba(0,0,0,.18)");pxDisc(g,8,9,5,L[0],POL);pxR(g,5,6,3,2,L[2]);pxR(g,8,11,4,2,L[1]);if(season<3){pxR(g,6,9,1,1,"#ff4a5a");pxR(g,10,8,1,1,"#ff4a5a");}});
  tiles[ROCK]=mk((g,v)=>{grass(g,v);pxR(g,3,13,11,2,"rgba(0,0,0,.18)");pxDisc(g,8,9,5,"#a8a4b4",POL);pxR(g,4,11,9,2,"#8a8698");pxR(g,5,6,4,2,"#d8d4e0");});
  tiles[TREE]=mk((g,v)=>{grass(g,v);pxR(g,3,13,11,2,"rgba(0,0,0,.2)");pxR(g,6,7,4,7,"#9a5e30");pxR(g,6,7,1,7,"#c07a40");pxR(g,5,7,1,7,POL);pxR(g,10,7,1,7,POL);pxR(g,5,13,6,1,"#7a4a24");});
  tiles.canopy=[0,1,2,3].map(v=>{const c=mkCanvas(48,44),g=c.getContext("2d");g.imageSmoothingEnabled=false;g.scale(2,2);
    if(v===3){ // pine
      const P=[[12,2,2],[12,6,4],[12,10,6],[12,14,8]];for(const [x,y,w] of P){for(let k=0;k<5;k++){pxR(g,x-w+Math.floor(k/2),y+k,w*2-Math.floor(k/2)*2,1,k<2?L[2]:k<4?L[0]:L[1]);}pxR(g,x-w-1,y+4,1,1,POL);pxR(g,x+w,y+4,1,1,POL);}
      pxR(g,11,1,2,1,POL);return c;}
    pxDisc(g,12,10,9,L[0],POL);pxDisc(g,9,7,4,L[2]);pxR(g,6,6,2,2,"#ffffff55");for(let i=0;i<3;i++){pxR(g,14+i*1,14-i,4,1,L[1]);}pxR(g,4,15,16,2,L[1]);pxDisc(g,12,10,9,"rgba(0,0,0,0)",POL);
    if(v===1&&season<2){for(let i=0;i<4;i++)pxR(g,6+((H(i,v,9)*12)|0),5+((H(i,v,8)*10)|0),2,2,"#ff5a5a");}
    if(v===2&&season===0){for(let i=0;i<5;i++)pxR(g,6+((H(i,v,9)*12)|0),4+((H(i,v,8)*10)|0),2,2,"#ffffff");}
    return c;});
  return tiles;};
// soft path edging instead of stone borders
blendEdges=function(g,tx,ty,t,px0,py0){if(t===ROAD||t===COBBLE){const nb=[[0,-1],[0,1],[-1,0],[1,0]];for(const [dx,dy] of nb){const n=tAt(tx+dx,ty+dy);if(n===GRASS||n===FLOWER||n===FOREST){g.fillStyle="rgba(70,140,50,.35)";
      if(dx)g.fillRect(px0+(dx>0?15:0),py0,1,16);else g.fillRect(px0,py0+(dy>0?15:0),16,1);}}return;}
  if(t===GRASS||t===FLOWER||t===FOREST||t===TREE||t===BUSH)return;return blendEdgesBase(g,tx,ty,t,px0,py0);};
// ---- buildings: 3/4 pixel view, steep roof + timber-frame front ----
const ROOFS={red:["#d8483a","#a83028","#f07a5a"],brown:["#9a6038","#6e4024","#c08050"],slate:["#5a6478","#3e4658","#8a96aa"],navy:["#34508e","#22386a","#5a7ac0"],green:["#3e9a5a","#2a6e40","#6ac87a"]};
function pxRoof(g,x,y,w,h,R,steep){ // roof with shingle rows and ridge
  for(let r=0;r<h;r++){const inset=steep?Math.floor((h-r)*0.0):0;pxR(g,x+inset,y+r,w-inset*2,1,r%3===0?R[1]:R[0]);if(r%3===1)for(let k=(r%6===1?0:3);k<w;k+=6)pxR(g,x+k,y+r,1,2,R[1]);}
  pxR(g,x,y,w,1,R[2]);pxR(g,x-1,y,1,h,POL);pxR(g,x+w,y,1,h,POL);pxR(g,x-1,y+h,w+2,1,POL);pxR(g,x,y-1,w,1,POL);}
function pxWall(g,x,y,w,h,wall){pxR(g,x,y,w,h,wall);pxR(g,x,y,w,1,"#7a4a28");pxR(g,x,y+h-1,w,1,"#7a4a28");for(let k=0;k<=w;k+=8)pxR(g,Math.min(x+k,x+w-1),y,1,h,"#7a4a28");pxR(g,x,y+Math.floor(h/2),w,1,"#7a4a28");
  for(let k=4;k<w-2;k+=8){pxR(g,x+k-2,y+1,1,Math.floor(h/2)-1,"#9a6a40");}pxR(g,x-1,y,1,h,POL);pxR(g,x+w,y,1,h,POL);}
function pxWin(g,x,y,lit){pxR(g,x-1,y-1,6,6,POL);pxR(g,x,y,4,4,lit?"#ffe080":"#8ad0f0");pxR(g,x+2,y,1,4,"#f4ecd8");pxR(g,x,y+2,4,1,"#f4ecd8");pxR(g,x-1,y+5,6,2,"#9a5e30");pxR(g,x,y+5,1,1,"#ff5a6a");pxR(g,x+2,y+5,1,1,"#ffd23a");pxR(g,x+4,y+5,1,1,"#ff5a6a");}
function pxDoor(g,x,y){pxR(g,x-1,y-1,8,12,POL);pxR(g,x,y,6,11,"#8a4e28");pxR(g,x+1,y+1,4,9,"#a8643a");pxR(g,x+4,y+5,1,1,"#ffd23a");pxR(g,x-2,y+11,10,1,"#b8b0a8");}
buildingSprite=function(b){const key=b.id+":"+b.kind+":"+(b.owned?1:0)+":px"+(b.hall?1:0);let c=bldCache.get(key);if(c)return c;
  const w=b.w*16,extra=b.hall?44:30,h=b.h*16+extra;c=mkCanvas(w*2,h*2);const g=c.getContext("2d");g.imageSmoothingEnabled=false;g.scale(2,2);c.lw=w;c.lh=h;
  const s=SETS[b.s]||{};const lit=world&&(hour()>=19||hour()<6);
  const rk=b.hall?"red":b.kind==="guild"?"navy":b.kind==="shop"?"brown":b.kind==="inn"?"red":b.kind==="harbor"?"slate":["red","brown","slate","navy","green"][(b.id*7+(b.s||0))%5];const R=ROOFS[rk];
  const wall=b.kind==="harbor"?"#e8e0d0":["#f4e6c4","#f0dcb8","#ece4d4"][b.id%3];
  const baseY=h-2,wallH=b.hall?24:18,wallY=baseY-wallH,roofH=h-wallH-6;
  // shadow & stone foundation
  pxR(g,2,baseY-1,w-2,3,"rgba(0,0,0,.18)");pxR(g,1,baseY-3,w-2,3,"#a8a2a8");pxR(g,1,baseY-3,w-2,1,"#c8c2c8");pxR(g,0,baseY-3,1,3,POL);pxR(g,w-1,baseY-3,1,3,POL);pxR(g,1,baseY,w-2,1,POL);
  pxWall(g,2,wallY,w-4,wallH-3,wall);
  pxRoof(g,1,4,w-2,roofH,R,true);
  // chimney
  if(!b.hall&&b.kind!=="forsale"){const cx=w-14;pxR(g,cx-1,0,7,10,POL);pxR(g,cx,1,5,9,"#b06a50");pxR(g,cx,1,5,2,"#c88a70");}
  // dormer window in roof
  pxWin(g,(w/2|0)-2,6+Math.floor(roofH/3),lit);
  // windows + door
  const doorX=Math.floor(w/2)-3;pxDoor(g,doorX,baseY-14);
  for(const wx of [6,w-11])if(Math.abs(wx-doorX)>8)pxWin(g,wx,wallY+3,lit);
  if(b.hall){ // clock tower centerpiece
    const tx=Math.floor(w/2)-8;pxR(g,tx-1,0,18,roofH+6,POL);pxR(g,tx,1,16,roofH+4,"#f0e2c0");for(let k=0;k<roofH;k+=6)pxR(g,tx,1+k,16,1,"#c8b08a");pxDisc(g,tx+8,9,5,"#fffbe8",POL);pxR(g,tx+8,6,1,4,POL);pxR(g,tx+8,9,3,1,POL);
    pxRoof(g,tx-2,-2,20,4,ROOFS.red,true);pxR(g,tx+4,wallY+3,8,7,POL);pxR(g,tx+5,wallY+4,6,5,lit?"#ffe080":"#8ad0f0");
    // banner
    pxR(g,2,wallY+2,4,8,s.gem||"#ffd23a");pxR(g,w-6,wallY+2,4,8,s.gem||"#ffd23a");}
  if(b.kind==="shop"||b.kind==="inn"){const aw=b.kind==="shop"?["#e84a4a","#fff4e8"]:["#4a8ae8","#fff4e8"];for(let k=0;k<w-8;k++)pxR(g,4+k,wallY+1,1,4,aw[Math.floor(k/3)%2]);pxR(g,4,wallY+5,w-8,1,POL);for(let k=0;k<w-8;k+=3)pxR(g,4+k,wallY+5,2,1,aw[0]);}
  // sign
  const sign={inn:"INN",shop:"SHOP",harbor:"DOCK",forsale:b.owned?"HOME":"SALE",guild:"GUILD"}[b.kind]||(b.hall?"HALL":null);
  if(sign){const sw=sign.length*4+4;const sx=doorX+8;pxR(g,sx-1,baseY-21,sw+2,8,POL);pxR(g,sx,baseY-20,sw,6,"#c88a50");g.fillStyle="#fff8e0";g.font="bold 5px monospace";g.textBaseline="top";g.fillText(sign,sx+2,baseY-20);}
  if(b.kind==="harbor"){pxR(g,w-10,baseY-10,8,8,"#c88a50");pxR(g,w-10,baseY-10,8,1,POL);}
  bldCache.set(key,c);return c;};
// mark the town hall (building nearest each town's center)
function markHalls(){for(const s of SETS){if(!s.kind.includes("town"))continue;let best=null,bd=1e9;for(const b of buildings){if(b.s!==s.id||!(b.kind==="house"||b.kind==="forsale"))continue;if(b.kind==="forsale")continue;const d=Math.hypot(b.x+b.w/2-s.x,b.y+b.h/2-s.y);if(d<bd){bd=d;best=b;}}if(best)best.hall=true;}}
// ---- props in pixel style ----
const _drawProp0=drawProp;
drawProp=function(p){const x=p.x*16,y=p.y*16;const g=ctx;const S=(a,b2,w,h,c)=>{g.fillStyle=c;g.fillRect(x+a,y+b2,w,h);};
  switch(p.type){
  case "lamp":S(5,15,6,1,"rgba(0,0,0,.2)");S(7,3,2,12,POL);S(6,13,4,2,POL);S(5,0,6,5,POL);S(6,1,4,3,world&&(hour()>=18||hour()<6)?"#ffe070":"#fff4c0");return;
  case "bench":S(1,13,14,2,"rgba(0,0,0,.18)");S(1,7,14,1,POL);S(1,8,14,2,"#c88a50");S(1,10,14,1,POL);S(1,4,14,3,"#a86a38");S(1,3,14,1,POL);S(2,11,1,3,POL);S(13,11,1,3,POL);return;
  case "crates":S(1,14,14,2,"rgba(0,0,0,.18)");for(const [a,b2] of [[1,6],[8,8]]){S(a-1,b2-1,8,8,POL);S(a,b2,6,6,"#d09a58");S(a,b2,6,1,"#e8b878");S(a+2,b2,1,6,"#a86a38");S(a,b2+3,6,1,"#a86a38");}return;
  case "logs":S(0,14,16,2,"rgba(0,0,0,.18)");for(const [a,b2] of [[1,9],[7,9],[4,4]]){S(a-1,b2-1,8,7,POL);S(a,b2,6,5,"#9a5e30");S(a+1,b2+1,3,3,"#e8c890");S(a+2,b2+2,1,1,"#a87a48");}return;
  case "pumpkins":S(1,14,14,2,"rgba(0,0,0,.18)");S(2,4,12,11,POL);S(3,5,10,9,"#f0c84a");S(3,5,10,2,"#ffe078");for(let k=0;k<4;k++)S(4+k*2,8+k%2,1,4,"#c89a2a");return; // haystack
  case "fence":S(0,7,16,1,POL);S(0,8,16,2,"#c88a50");S(0,10,16,1,POL);for(const a of [1,7,13]){S(a-1,3,4,11,POL);S(a,4,2,9,"#e0a868");}return;
  case "stall":{S(0,14,16,2,"rgba(0,0,0,.18)");S(0,0,16,7,POL);for(let k=0;k<14;k++)S(1+k,1,1,5,["#e84a4a","#fff4e8"][Math.floor(k/2)%2]);S(1,7,1,7,POL);S(14,7,1,7,POL);S(0,10,16,4,POL);S(1,10,14,3,"#c88a50");S(3,9,2,2,"#ff5a5a");S(7,9,2,2,"#ffd23a");S(11,9,2,2,"#6ad04a");return;}
  case "arch":S(7,4,2,11,POL);S(1,3,14,5,POL);S(2,4,12,3,"#e0a868");S(3,5,8,1,"#8a5a30");return; // signpost
  case "flowers":for(let i=0;i<5;i++){const c=["#ff5a6a","#ffd23a","#ffffff","#ff8ad0"][i%4];const a=2+i*3,b2=6+(i%2)*5;S(a,b2+1,1,2,"#3a9030");S(a-1,b2,3,1,c);S(a,b2-1,1,3,c);S(a,b2,1,1,"#ffe040");}return;
  case "statue":case "topiary":S(2,13,12,2,"rgba(0,0,0,.18)");S(3,1,10,14,POL);if(p.type==="topiary"){S(4,2,8,7,"#3eae3a");S(5,2,3,2,"#6ad85a");S(7,9,2,3,"#9a5e30");S(4,12,8,2,"#c86a50");}else{S(4,10,8,4,"#c0bcc8");S(5,2,6,8,"#d8d4e0");S(6,3,2,3,"#f4f0f8");}return;
  case "crate":break;}
  return _drawProp0(p);};
// ---- stone town walls & gates: low grey stone walls, pixel palisades for villages ----
drawWallsList=function(list,vis){const town=new Set(SETS.filter(s=>s.kind.includes("town")).map(s=>s.id));
  for(const w of WALLS){if(!vis(w.x*16,w.y*16,40))continue;list.push({y:w.y*16+15,f:()=>{const x=w.x*16,y=w.y*16,hp=wallHp(w.i);const S=(a,b2,ww,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a,y+b2,ww,hh);};
    if(hp<=0){for(let k=0;k<3;k++){S(2+k*5,10+(k%2)*2,4,3,POL);S(3+k*5,11+(k%2)*2,2,1,"#b8b4c0");}return;}
    if(town.has(w.s)){S(0,14,16,3,"rgba(0,0,0,.18)");S(0,-3,16,17,POL);S(0,-2,16,15,"#a8a4b4");for(let r=0;r<3;r++)for(let k=0;k<2;k++){const ox=r%2?4:0;S((k*8+ox)%16,-2+r*5,1,4,"#7e7a8c");}S(0,2,16,1,"#7e7a8c");S(0,7,16,1,"#7e7a8c");S(0,-2,16,2,"#d0ccd8");S(0,12,16,1,"#7e7a8c");
      if(hp<10){S(5,1,1,4,POL);S(6,4,2,1,POL);}}
    else{S(0,13,16,3,"rgba(0,0,0,.18)");for(let k=0;k<4;k++){S(k*4,-5,4,18,POL);S(k*4+1,-4,2,16,k%2?"#c88a50":"#b07a40");S(k*4+1,-4,2,1,"#e0a868");}S(0,3,16,1,"#7a4a24");if(hp<10)S(6,0,3,1,POL);}}});}
  for(const g of GATES){const x=g.x*16,y=g.y*16;if(!vis(x,y,50))continue;const horiz=g.d==="N"||g.d==="S";const tw=town.has(g.s);const n=g.tiles.length;
    const xs=g.tiles.map(t=>t[0]),ys=g.tiles.map(t=>t[1]);const x0=Math.min(...xs)*16,y0=Math.min(...ys)*16,x1=(Math.max(...xs)+1)*16,y1=(Math.max(...ys)+1)*16;
    list.push({y:y1-1,f:()=>{const amt=gateOpenAmt(g),closed=amt>0.04;const S=(a,b2,ww,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(a,b2,ww,hh);};
      const pil=(px,py)=>{S(px-1,py-12,10,24,POL);S(px,py-11,8,22,tw?"#c0bccc":"#b07a40");S(px,py-11,8,2,tw?"#e0dce8":"#e0a868");S(px-2,py-14,12,4,POL);S(px-1,py-13,10,2,tw?"#d8d4e0":"#c88a50");};
      if(horiz){pil(x0-10,y0+6);pil(x1+2,y0+6);if(closed){const lw=Math.max(1,Math.round((x1-x0)/2*amt));for(const lx of [x0,x1-lw]){S(lx-1,y0-6,lw+2,20,POL);S(lx,y0-5,lw,18,"#a8643a");for(let k=lx+3;k<lx+lw;k+=4)S(k,y0-5,1,18,"#7a4424");S(lx,y0,lw,1,"#5a5260");S(lx,y0+8,lw,1,"#5a5260");}}}
      else{pil(x0+4,y0-4);pil(x0+4,y1+8);if(closed){const lh=Math.max(1,Math.round((y1-y0+2)/2*amt));for(const ly of [y0-1,y1+1-lh]){S(x0+5,ly-1,6,lh+2,POL);S(x0+6,ly,4,lh,"#a8643a");}}}
      const gl=chibiLook(g.s*13+(g.d.charCodeAt(0)),"guard","human");if(horiz){drawChibi(gl,x0-14,y0+22,0,0);drawChibi(gl,x1+14,y0+22,0,0);}else{drawChibi(gl,x0+8+g.o[0]*16,y0-4,0,0);drawChibi(gl,x0+8+g.o[0]*16,y1+12,0,0);}}});}
  for(const t of TOWERS){const x=t.x*16,y=t.y*16;if(!vis(x,y,60))continue;list.push({y:y+16,f:()=>{const S=(a,b2,ww,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a,y+b2,ww,hh);};
    S(-3,14,22,3,"rgba(0,0,0,.2)");S(-3,-18,22,33,POL);S(-2,-17,20,31,"#b4b0c0");for(let r=0;r<5;r++)S(-2,-14+r*6,20,1,"#8a8698");S(-2,-17,20,2,"#d8d4e0");S(5,-8,6,8,POL);S(6,-7,4,6,"#3a3448");
    for(let k=0;k<4;k++){S(-4+k*6,-24,5,7,POL);S(-3+k*6,-23,3,5,"#c8c4d4");}drawChibi(chibiLook(t.x*7+t.y,"archer","human"),x+8,y-20,0,0,0.8);}});}};
