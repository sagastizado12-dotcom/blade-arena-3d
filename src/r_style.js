// ===== COZY CARTOON ART DIRECTION (original, code-drawn) =====
const OL="#2b1a12";
function olStroke(g,w){g.strokeStyle=OL;g.lineWidth=w||1;g.lineJoin="round";g.stroke();}
function blob(g,x,y,r,fill,hi){g.beginPath();g.arc(x,y,r,0,7);g.fillStyle=fill;g.fill();if(hi){g.beginPath();g.arc(x-r*.3,y-r*.35,r*.45,0,7);g.fillStyle=hi;g.fill();}}
const GRASS2=[["#7ccf3c","#9be04e","#5aa82c","#ffe45a"],["#6fc438","#92d94a","#4f9c28","#fff07a"],["#b8b03c","#d8c050","#8c8226","#f0803a"],["#c8d8dc","#eef6f8","#9fb2b8","#ffffff"]];
const LEAF2=[["#4fae3a","#7fd650","#2e7a26","#ffb0d8"],["#3fa034","#6cc848","#25701f","#f6ff9a"],["#e07a24","#f8b840","#a8441a","#ffe070"],["#7a9a92","#f2f8fa","#4e6a64","#ffffff"]];
function makeTiles(season){
  const tiles={};const G=GRASS2[season],L=LEAF2[season];
  const mk=(f,n=4)=>{const a=[];for(let v=0;v<n;v++){const c=mkCanvas(32,32),g=c.getContext("2d");g.scale(2,2);f(g,v);a.push(c);}return a;};
  const grass=(g,v)=>{g.fillStyle=G[0];g.fillRect(0,0,16,16);for(let i=0;i<5;i++){g.fillStyle=G[2];g.globalAlpha=.35;g.beginPath();g.ellipse(hash2(i,v,1)*16,hash2(i,v,2)*16,2.5,1.5,0,0,7);g.fill();}
    g.globalAlpha=1;g.strokeStyle=G[2];g.lineWidth=.8;for(let i=0;i<4;i++){const x=hash2(i,v,8)*15,y=3+hash2(i,v,9)*12;g.beginPath();g.moveTo(x,y);g.lineTo(x+1,y-2.5);g.moveTo(x+2,y);g.lineTo(x+2,y-2);g.stroke();}
    g.fillStyle=G[1];for(let i=0;i<3;i++){g.globalAlpha=.6;g.beginPath();g.ellipse(hash2(i,v,4)*16,hash2(i,v,5)*16,1.8,1,0,0,7);g.fill();}g.globalAlpha=1;};
  tiles[GRASS]=mk(grass);
  tiles[FLOWER]=mk((g,v)=>{grass(g,v);const fc=season===3?["#fff"]:["#ff6aa8","#ffd23a","#a46aff","#ff8a3a","#ffffff"];for(let i=0;i<4;i++){const x=3+hash2(i,v,40)*10,y=3+hash2(i,v,41)*10;
    g.fillStyle=fc[(i+v)%fc.length];for(let k=0;k<4;k++){g.beginPath();g.arc(x+Math.cos(k*1.57)*1.2,y+Math.sin(k*1.57)*1.2,1,0,7);g.fill();}g.fillStyle="#ffe860";g.beginPath();g.arc(x,y,.8,0,7);g.fill();}});
  tiles[FOREST]=mk((g,v)=>{grass(g,v);g.fillStyle="rgba(40,90,30,.25)";g.fillRect(0,0,16,16);for(let i=0;i<3;i++){g.fillStyle=season===2?"#c8642a":"#3a8a2a";g.beginPath();g.ellipse(hash2(i,v,6)*16,hash2(i,v,7)*16,2,1.2,0,0,7);g.fill();}});
  tiles[SAND]=mk((g,v)=>{g.fillStyle="#f4d890";g.fillRect(0,0,16,16);g.fillStyle="#e4c070";for(let i=0;i<4;i++){g.beginPath();g.arc(hash2(i,v,3)*16,hash2(i,v,4)*16,.8,0,7);g.fill();}g.fillStyle="#fff0c0";g.fillRect(hash2(v,1,3)*14,hash2(v,2,3)*14,2,1);});
  tiles[SHAL]=mk((g,v)=>{g.fillStyle="#4ed8d8";g.fillRect(0,0,16,16);g.fillStyle="#7ef0e8";g.beginPath();g.ellipse(4+v*2,6,4,1.2,0,0,7);g.fill();g.fillStyle="rgba(240,230,170,.35)";g.beginPath();g.ellipse(10,12,4,2,0,0,7);g.fill();});
  tiles[DEEP]=mk((g,v)=>{g.fillStyle="#22b0c8";g.fillRect(0,0,16,16);g.strokeStyle="rgba(200,255,255,.6)";g.lineWidth=1;g.beginPath();const y=4+v*3;g.moveTo(2,y);g.quadraticCurveTo(5,y-2,8,y);g.quadraticCurveTo(11,y+2,14,y);g.stroke();
    g.fillStyle="rgba(10,120,150,.35)";g.beginPath();g.ellipse(hash2(v,1,1)*16,hash2(v,2,1)*16,3,1.5,0,0,7);g.fill();});
  tiles[ROCK]=mk((g,v)=>{grass(g,v);g.beginPath();g.moveTo(2,14);g.lineTo(3,7);g.lineTo(7,3);g.lineTo(12,4);g.lineTo(14,9);g.lineTo(13,14);g.closePath();g.fillStyle="#a8a0b0";g.fill();olStroke(g,1);
    g.fillStyle="#d0c8d8";g.beginPath();g.moveTo(4,8);g.lineTo(7,4);g.lineTo(10,5);g.lineTo(7,8);g.fill();});
  const cob=(g,v,base)=>{g.fillStyle=base||"#b8a890";g.fillRect(0,0,16,16);for(let y=0;y<3;y++)for(let x=0;x<3;x++){const o=y%2?2.5:0;const cx=x*5.5+o+2.5,cy=y*5.5+2.5;g.beginPath();g.ellipse(cx,cy,2.4,2.1,0,0,7);
    g.fillStyle=["#e2d6c0","#cfc0a6","#efe4cc","#d6c4a4"][(x+y+v)%4];g.fill();g.strokeStyle="rgba(60,40,25,.55)";g.lineWidth=.6;g.stroke();g.fillStyle="rgba(255,255,255,.4)";g.fillRect(cx-1.4,cy-1.4,1.2,.6);}};
  tiles[COBBLE]=mk((g,v)=>cob(g,v));
  tiles[ROAD]=mk((g,v)=>{g.fillStyle="#d8b47a";g.fillRect(0,0,16,16);for(let i=0;i<5;i++){g.fillStyle=i%2?"#c49a5e":"#e8c890";g.beginPath();g.ellipse(hash2(i,v,91)*16,hash2(i,v,92)*16,1.6,1.1,0,0,7);g.fill();}});
  tiles[RUIN]=mk((g,v)=>{cob(g,v,"#9a948a");g.fillStyle="rgba(100,170,70,.5)";g.beginPath();g.ellipse(hash2(v,3,3)*16,hash2(v,4,3)*16,3,1.5,0,0,7);g.fill();});
  tiles[WALL]=mk((g,v)=>{g.fillStyle="#8a7e8e";g.fillRect(0,0,16,16);for(let y=0;y<3;y++)for(let x=0;x<2;x++){g.fillStyle=["#b4aab8","#a49aa8"][(x+y+v)%2];g.fillRect(x*8+(y%2?4:0)-4+.5,y*5.3+.5,7,4.5);g.strokeStyle=OL;g.lineWidth=.6;g.strokeRect(x*8+(y%2?4:0)-4+.5,y*5.3+.5,7,4.5);}},3);
  tiles[PIER]=mk((g,v)=>{g.drawImage(tiles[DEEP][v],0,0,16,16);g.fillStyle="#b07a40";g.fillRect(0,1,16,14);for(let i=0;i<4;i++){g.fillStyle=i%2?"#c88c4c":"#a46c36";g.fillRect(i*4,1,4,14);g.strokeStyle=OL;g.lineWidth=.5;g.strokeRect(i*4+.25,1.25,4,13.5);}});
  tiles[FARM]=mk((g,v)=>{g.fillStyle="#8a5a2e";g.fillRect(0,0,16,16);for(let y=1;y<16;y+=4){g.fillStyle="#6a4020";g.fillRect(0,y,16,2);g.fillStyle="#a06a38";g.fillRect(0,y-1,16,1);}});
  tiles[CAVE]=mk((g,v)=>{g.fillStyle="#7a7080";g.fillRect(0,0,16,16);g.fillStyle="#1a1020";g.beginPath();g.ellipse(8,11,6,7,0,Math.PI,0);g.fillRect(2,11,12,5);g.fill();g.strokeStyle=OL;g.stroke();g.fillStyle="#6ff";g.beginPath();g.arc(8,2,1.5,0,7);g.fill();},1);
  tiles[MTN]=mk((g,v)=>{g.fillStyle=season===3?"#d8e2e8":"#b0a68a";g.fillRect(0,0,16,16);for(let i=0;i<4;i++){g.fillStyle=season===3?"#f4f9fb":i%2?"#c8be9c":"#94a860";g.beginPath();g.ellipse(hash2(i,v,130)*16,hash2(i,v,131)*16,2.5,1.5,0,0,7);g.fill();}});
  tiles[CLIFF]=mk((g,v)=>{g.fillStyle="#8a7a6a";g.fillRect(0,0,16,16);g.fillStyle="#6e5e50";g.fillRect(0,9,16,7);for(let i=0;i<3;i++){g.fillStyle="#a8988a";g.beginPath();g.ellipse(3+i*5,6,2.5,3,0,0,7);g.fill();g.strokeStyle=OL;g.lineWidth=.7;g.stroke();}
    g.fillStyle=season===3?"#f4faff":"#7ccf3c";g.fillRect(0,0,16,2.5);g.strokeStyle=OL;g.lineWidth=1;g.beginPath();g.moveTo(0,2.5);g.lineTo(16,2.5);g.stroke();});
  tiles[STAIRS]=mk((g,v)=>{g.fillStyle="#8a7a6a";g.fillRect(0,0,16,16);for(let i=0;i<4;i++){g.fillStyle="#e2d6c0";g.fillRect(2,i*4,12,3);g.strokeStyle=OL;g.lineWidth=.6;g.strokeRect(2.3,i*4+.3,11.4,2.6);}});
  tiles[19]=mk((g,v)=>{grass(g,v);g.fillStyle="#8a5228";g.fillRect(5,7,7,5);g.strokeStyle=OL;g.lineWidth=.8;g.strokeRect(5,7,7,5);g.fillStyle="#e8c888";g.beginPath();g.ellipse(8.5,7,3.5,1.6,0,0,7);g.fill();g.stroke();});
  tiles[20]=mk((g,v)=>{grass(g,v);g.fillStyle="#6a4024";g.fillRect(7.5,6,1,7);blob(g,8,6,3.2,L[0],L[1]);g.beginPath();g.arc(8,6,3.2,0,7);olStroke(g,.6);});
  tiles[BUSH]=mk((g,v)=>{grass(g,v);g.fillStyle="rgba(0,0,0,.2)";g.beginPath();g.ellipse(8.5,13,6,2,0,0,7);g.fill();g.beginPath();g.ellipse(8,9,6,5,0,0,7);g.fillStyle=L[0];g.fill();olStroke(g,1);
    g.fillStyle=L[1];g.beginPath();g.ellipse(6.5,7.5,3,2,0,0,7);g.fill();if(season<3){g.fillStyle="#e8204a";for(let i=0;i<3;i++){g.beginPath();g.arc(5+hash2(i,v,5)*7,8+hash2(i,v,6)*3,1,0,7);g.fill();}}});
  tiles[TREE]=mk((g,v)=>{grass(g,v);g.fillStyle="rgba(20,10,0,.28)";g.beginPath();g.ellipse(9,14,6,2.2,0,0,7);g.fill();g.fillStyle="#8a5228";g.beginPath();g.moveTo(6.5,15);g.lineTo(7.5,7);g.lineTo(9.5,7);g.lineTo(10.5,15);g.closePath();g.fill();olStroke(g,.8);});
  tiles.canopy=[0,1,2,3].map(v=>{const c=mkCanvas(48,44),g=c.getContext("2d");g.scale(2,2);g.translate(4,4);
    const cs=[[8,9,7],[4.5,7,5],[11.5,6.5,5],[8,3.5,5]];g.fillStyle=L[2];for(const [x,y,r] of cs){g.beginPath();g.arc(x,y+1,r+.8,0,7);g.fill();}
    g.beginPath();for(const [x,y,r] of cs){g.moveTo(x+r,y);g.arc(x,y,r,0,7);}g.fillStyle=L[0];g.fill();
    g.strokeStyle=OL;g.lineWidth=1.1;for(const [x,y,r] of cs){g.beginPath();g.arc(x,y,r,Math.PI*0.9,Math.PI*2.2);g.stroke();}
    g.fillStyle=L[1];for(const [x,y,r] of cs){g.beginPath();g.arc(x-r*.3,y-r*.35,r*.45,0,7);g.fill();}
    if(season===0||(v===1&&season===1)){g.fillStyle=L[3];for(let i=0;i<4;i++){g.beginPath();g.arc(2+hash2(i,v,9)*12,1+hash2(i,v,8)*10,.9,0,7);g.fill();}}
    if(v===2&&season<2){g.fillStyle="#ff8a20";for(let i=0;i<3;i++){g.beginPath();g.arc(4+i*4,6+(i%2)*3,1.2,0,7);g.fill();}}return c;});
  return tiles;}
// stone borders where paths meet grass
function blendEdges(g,tx,ty,t,px0,py0){if(t===COBBLE){const nb=[[0,-1],[0,1],[-1,0],[1,0]];for(const [dx,dy] of nb){const n=tAt(tx+dx,ty+dy);if(n===GRASS||n===FLOWER||n===FOREST||n===TREE||n===BUSH){
    g.fillStyle="#a8987e";g.strokeStyle=OL;g.lineWidth=.6;for(let k=0;k<4;k++){const ox=dx?(dx>0?14.5:1.5):k*4+2,oy=dy?(dy>0?14.5:1.5):k*4+2;g.beginPath();g.ellipse(px0+ox,py0+oy,dx?1.5:2,dy?1.5:2,0,0,7);g.fill();g.stroke();}}}return;}
  if(t===GRASS||t===FLOWER||t===FOREST||t===TREE||t===BUSH){return;}
  return blendEdgesBase(g,tx,ty,t,px0,py0);}
// ---- buildings: 3/4 view, roof + front, thick outline ----
function buildingSprite(b){const key=b.id+":"+b.kind+":"+(b.owned?1:0)+":v3";let c=bldCache.get(key);if(c)return c;
  const s=SETS[b.s]||{roof:["#c8402a","#8a2a1a"],wall:"#f4e6c8",gem:"#ff6"};const w=b.w*16,h=b.h*16+30;c=mkCanvas(w*2,h*2);const g=c.getContext("2d");g.scale(2,2);c.lw=w;c.lh=h;g.lineJoin="round";
  const tile=(b.s===0||b.kind==="inn")&&b.kind!=="guild";const rc=b.kind==="guild"?["#4a7ad8","#2a4a98"]:b.kind==="shop"?["#a8642e","#6e3c18"]:tile?["#d8503a","#98301e"]:b.s===4?["#e8c050","#a88020"]:s.roof;
  const base=h-6,wallTop=h-30;
  // stone base
  g.fillStyle="#a8a0a0";g.fillRect(3,base,w-6,6);for(let x=3;x<w-3;x+=6){g.fillStyle=(x/6)%2?"#c0b8b4":"#9a9290";g.fillRect(x+.5,base+.5,5,5);g.strokeStyle=OL;g.lineWidth=.5;g.strokeRect(x+.5,base+.5,5,5);}
  // wall with timber frame
  g.fillStyle=s.wall||"#f4e6c8";g.fillRect(4,wallTop,w-8,base-wallTop);g.fillStyle="rgba(0,0,0,.08)";g.fillRect(w-14,wallTop,10,base-wallTop);
  g.fillStyle="#7a4a24";g.fillRect(4,wallTop,w-8,2);g.fillRect(4,wallTop,2.5,base-wallTop);g.fillRect(w-6.5,wallTop,2.5,base-wallTop);g.fillRect(w/2-10,wallTop,2,base-wallTop);g.fillRect(w/2+8,wallTop,2,base-wallTop);
  g.strokeStyle="#7a4a24";g.lineWidth=1.5;g.beginPath();g.moveTo(6,wallTop+2);g.lineTo(w/2-10,base);g.moveTo(w-6,wallTop+2);g.lineTo(w/2+10,base);g.stroke();
  // windows with shutters
  for(const wx of [9,w-19]){g.fillStyle="#5a3a1a";g.fillRect(wx-3,wallTop+6,3,10);g.fillRect(wx+10,wallTop+6,3,10);g.fillStyle="#7ac8f0";g.fillRect(wx,wallTop+6,10,10);g.fillStyle="#c8ecff";g.fillRect(wx+1,wallTop+7,4,3);
    g.strokeStyle=OL;g.lineWidth=1;g.strokeRect(wx,wallTop+6,10,10);g.beginPath();g.moveTo(wx+5,wallTop+6);g.lineTo(wx+5,wallTop+16);g.moveTo(wx,wallTop+11);g.lineTo(wx+10,wallTop+11);g.stroke();
    g.fillStyle="#d04a5a";g.fillRect(wx-1,wallTop+17,12,2.5);g.fillStyle="#ff8ac0";g.fillRect(wx+1,wallTop+16,2,1.5);g.fillRect(wx+6,wallTop+16,2,1.5);}
  // door
  const dx=w/2-6;g.beginPath();g.moveTo(dx,base);g.lineTo(dx,wallTop+12);g.arc(dx+6,wallTop+12,6,Math.PI,0);g.lineTo(dx+12,base);g.closePath();g.fillStyle="#8a4e22";g.fill();g.strokeStyle=OL;g.lineWidth=1.2;g.stroke();
  g.strokeStyle="#5a3010";g.lineWidth=.7;g.beginPath();g.moveTo(dx+4,wallTop+9);g.lineTo(dx+4,base);g.moveTo(dx+8,wallTop+9);g.lineTo(dx+8,base);g.stroke();g.fillStyle="#f0c850";g.beginPath();g.arc(dx+9.5,wallTop+19,1,0,7);g.fill();
  g.fillStyle="#c0b8b4";g.fillRect(dx-2,base,16,3);g.strokeStyle=OL;g.lineWidth=.6;g.strokeRect(dx-2,base,16,3);
  // roof: big front slope with shingles
  const ry=2,rb=wallTop+3;g.beginPath();g.moveTo(-1,rb);g.lineTo(8,ry);g.lineTo(w-8,ry);g.lineTo(w+1,rb);g.closePath();const gr=g.createLinearGradient(0,ry,0,rb);gr.addColorStop(0,rc[0]);gr.addColorStop(1,rc[1]);g.fillStyle=gr;g.fill();
  g.save();g.clip();for(let y=ry+4,row=0;y<rb+4;y+=5,row++){g.fillStyle="rgba(0,0,0,.22)";g.fillRect(0,y,w,1);for(let x=(row%2)*4-4;x<w+4;x+=8){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+4,y+3.5,x+8,y);g.strokeStyle="rgba(40,15,5,.45)";g.lineWidth=.6;g.stroke();
      g.fillStyle="rgba(255,255,255,.12)";g.fillRect(x+1.5,y-3.5,3,1);}}g.restore();
  g.beginPath();g.moveTo(-1,rb);g.lineTo(8,ry);g.lineTo(w-8,ry);g.lineTo(w+1,rb);g.closePath();olStroke(g,1.6);
  g.fillStyle=shadeHex(rc[0],1.25);g.fillRect(9,ry,w-18,2.5);g.strokeStyle=OL;g.lineWidth=1;g.strokeRect(9,ry,w-18,2.5);
  // chimney
  g.fillStyle="#b0a8a8";g.fillRect(w-20,ry-6,7,12);g.strokeStyle=OL;g.lineWidth=1;g.strokeRect(w-20,ry-6,7,12);g.fillStyle="#8a8080";g.fillRect(w-21,ry-8,9,3);g.strokeRect(w-21,ry-8,9,3);
  // kind extras
  if(b.kind==="shop"){for(let i=0;i<6;i++){g.fillStyle=i%2?"#fff6ea":"#e03a3a";g.beginPath();g.moveTo(8+i*(w-16)/6,wallTop-1);g.lineTo(8+(i+1)*(w-16)/6,wallTop-1);g.lineTo(8+(i+1)*(w-16)/6,wallTop+6);g.quadraticCurveTo(8+(i+.5)*(w-16)/6,wallTop+9,8+i*(w-16)/6,wallTop+6);g.fill();}
    g.strokeStyle=OL;g.lineWidth=1;g.strokeRect(8,wallTop-1,w-16,7);}
  if(b.kind==="guild"){g.fillStyle="#2a4a98";g.fillRect(w/2-4,wallTop-14,8,12);g.beginPath();g.moveTo(w/2-4,wallTop-2);g.lineTo(w/2,wallTop+1);g.lineTo(w/2+4,wallTop-2);g.fill();g.strokeStyle=OL;g.strokeRect(w/2-4,wallTop-14,8,12);g.fillStyle="#f0c850";g.fillRect(w/2-1.5,wallTop-11,3,5);}
  const sign={inn:"🍺",shop:"🛍",guild:"⚔",harbor:"⚓",forsale:b.owned?"🏠":"SALE"}[b.kind];
  if(sign){g.fillStyle="#7a4a24";g.fillRect(w-12,wallTop+2,1.5,8);g.fillStyle="#e8d0a0";g.fillRect(w-17,wallTop+9,12,8);g.strokeStyle=OL;g.lineWidth=.8;g.strokeRect(w-17,wallTop+9,12,8);g.font=(sign.length>2?"4px":"6px")+" system-ui";g.textAlign="center";g.fillStyle="#3a2010";g.fillText(sign,w-11,wallTop+15.5);}
  // whole silhouette outline
  g.strokeStyle=OL;g.lineWidth=1.6;g.strokeRect(4,wallTop,w-8,base-wallTop+6);
  bldCache.set(key,c);return c;}
function shadeHex(hx,f){const c=hexRGB(hx).map(v=>clamp(Math.round(v*f),0,255));return`rgb(${c[0]},${c[1]},${c[2]})`;}
// ---- settlement props ----
let PROPS=[];
function genProps(){PROPS=[];const doors=buildings.map(b=>({x:b.x+1.5,y:b.y+b.h}));const free=(x,y)=>!OCC[y*WW+x]&&!SOLID_T.has(T[y*WW+x])&&!doors.some(d=>Math.abs(d.x-x)<2&&Math.abs(d.y-y)<2)&&T[y*WW+x]!==DEEP;
  const put=(type,x,y,solid)=>{if(!free(x,y))return false;PROPS.push({type,x,y});if(solid)OCC[y*WW+x]=-1;return true;};
  for(const s of SETS){const town=s.kind.includes("town");
    put(town?"fountain":"well",s.x+2,s.y+1,true);
    for(const [dx,dy] of [[-4,-3],[4,-3],[-4,3],[4,3]])put("lamp",s.x+dx,s.y+dy,false);
    put("bench",s.x-2,s.y+2,false);put("bench",s.x+3,s.y-1,false);
    if(town){put("statue",s.x-5,s.y+1,true);put("stall",s.x+5,s.y+1,true);put("arch",s.x+s.r,s.y,false);}else{put("gazebo",s.x-4,s.y+3,true);}
    put("crates",s.x+6,s.y-2,false);put("logs",s.x-6,s.y-3,false);put("topiary",s.x-3,s.y-3,true);put("topiary",s.x+4,s.y+3,true);put("flowers",s.x+1,s.y+3,false);put("flowers",s.x-1,s.y-3,false);
    if(town){for(let k=0;k<5;k++)put("stall",s.x-5+k*3,s.y+3,true);put("crates",s.x-6,s.y+5,false);put("crates",s.x+7,s.y+5,false);put("logs",s.x+6,s.y+2,false);
      for(let gy=-3;gy<=3;gy++)for(let gx=-3;gx<=3;gx++){const lx=s.x+gx*7-1,ly=s.y+gy*6-1;if(Math.hypot(lx-s.x,ly-s.y)<s.r-2&&(gx||gy))put("lamp",lx,ly,false);}}
    else for(let gy=-2;gy<=2;gy++)for(let gx=-2;gx<=2;gx++){const lx=s.x+gx*7-1,ly=s.y+gy*6-1;if(Math.hypot(lx-s.x,ly-s.y)<s.r-3&&(gx||gy)&&hash2(gx,gy,s.id)<0.5)put(hash2(gx,gy,9)<0.5?"pumpkins":"logs",lx,ly,true);}
    if(s.farm){for(let x=s.farm.x-1;x<=s.farm.x+s.farm.w;x++){put("fence",x,s.farm.y-1,false);}put("pumpkins",s.farm.x+s.farm.w,s.farm.y+1,false);put("pumpkins",s.farm.x-1,s.farm.y+2,false);}}
  for(const c of CAMPS){for(let i=0;i<3;i++)PROPS.push({type:"tent",x:c.x-3+i*3,y:c.y-1});PROPS.push({type:"campfire",x:c.x,y:c.y+1});}}
function drawProp(p){const x=p.x*16,y=p.y*16;ctx.lineJoin="round";const ol=()=>{ctx.strokeStyle=OL;ctx.lineWidth=1;ctx.stroke();};
  switch(p.type){
  case "fountain":drawShadow(x+8,y+14,11,4);ctx.beginPath();ctx.ellipse(x+8,y+11,11,5,0,0,7);ctx.fillStyle="#c8c0c8";ctx.fill();ol();ctx.beginPath();ctx.ellipse(x+8,y+10,9,3.6,0,0,7);ctx.fillStyle="#4ed0e0";ctx.fill();
    ctx.fillStyle="#b0a8b0";ctx.fillRect(x+6,y-2,4,12);ctx.strokeStyle=OL;ctx.strokeRect(x+6,y-2,4,12);ctx.beginPath();ctx.ellipse(x+8,y-2,5,2,0,0,7);ctx.fillStyle="#c8c0c8";ctx.fill();ol();
    ctx.fillStyle="rgba(220,255,255,.85)";for(let i=0;i<5;i++){const a=i/5*7+frameN*.05;ctx.fillRect(x+8+Math.cos(a)*(3+(frameN+i*7)%10*.4),y-3+((frameN+i*7)%10)*1.2,1.2,1.2);}break;
  case "well":drawShadow(x+8,y+14,8,3);ctx.fillStyle="#b0a8a8";ctx.fillRect(x+1,y+6,14,8);ctx.strokeStyle=OL;ctx.strokeRect(x+1,y+6,14,8);ctx.fillStyle="#2a5a8a";ctx.fillRect(x+3,y+6,10,2);ctx.fillStyle="#7a4a24";ctx.fillRect(x+2,y-4,2,10);ctx.fillRect(x+12,y-4,2,10);
    ctx.beginPath();ctx.moveTo(x-1,y-3);ctx.lineTo(x+8,y-9);ctx.lineTo(x+17,y-3);ctx.closePath();ctx.fillStyle="#a8642e";ctx.fill();ol();break;
  case "lamp":{drawShadow(x+8,y+15,4,1.5);ctx.fillStyle="#3a3040";ctx.fillRect(x+7,y-8,2,23);ctx.fillRect(x+5,y+13,6,2);ctx.fillStyle="#3a3040";ctx.fillRect(x+4,y-14,8,7);const lit=darkness()>.05;ctx.fillStyle=lit?"#fff2a0":"#f0e0a0";ctx.fillRect(x+5,y-13,6,5);
    ctx.strokeStyle=OL;ctx.strokeRect(x+4,y-14,8,7);ctx.beginPath();ctx.moveTo(x+3,y-14);ctx.lineTo(x+8,y-18);ctx.lineTo(x+13,y-14);ctx.closePath();ctx.fillStyle="#3a3040";ctx.fill();
    if(lit){ctx.globalCompositeOperation="lighter";const d=darkness();const g=ctx.createRadialGradient(x+8,y-10,2,x+8,y-10,52);g.addColorStop(0,`rgba(255,200,110,${d*.8})`);g.addColorStop(1,"rgba(255,160,60,0)");ctx.fillStyle=g;ctx.fillRect(x-44,y-62,104,104);ctx.globalCompositeOperation="source-over";}break;}
  case "bench":drawShadow(x+8,y+13,8,2);ctx.fillStyle="#a8642e";ctx.fillRect(x,y+4,16,3);ctx.fillRect(x,y+8,16,3);ctx.fillStyle="#6e3c18";ctx.fillRect(x+1,y+11,2,4);ctx.fillRect(x+13,y+11,2,4);ctx.strokeStyle=OL;ctx.strokeRect(x,y+4,16,7);break;
  case "statue":drawShadow(x+8,y+14,8,3);ctx.fillStyle="#d8d4dc";ctx.fillRect(x+2,y+6,12,8);ctx.strokeStyle=OL;ctx.strokeRect(x+2,y+6,12,8);ctx.fillStyle="#e8e4ec";ctx.fillRect(x+5,y-8,6,14);ctx.strokeRect(x+5,y-8,6,14);ctx.beginPath();ctx.arc(x+8,y-11,3.5,0,7);ctx.fill();ol();
    ctx.fillStyle="#c8c4cc";ctx.fillRect(x+11,y-14,1.5,18);break;
  case "stall":drawShadow(x+8,y+14,10,3);ctx.fillStyle="#8a5228";ctx.fillRect(x-2,y+4,20,9);ctx.strokeStyle=OL;ctx.strokeRect(x-2,y+4,20,9);ctx.fillStyle="#ff9a3a";ctx.fillRect(x,y+3,4,3);ctx.fillStyle="#7ad040";ctx.fillRect(x+6,y+3,4,3);ctx.fillStyle="#e83a3a";ctx.fillRect(x+12,y+3,4,3);
    ctx.fillStyle="#7a4a24";ctx.fillRect(x-2,y-10,2,14);ctx.fillRect(x+16,y-10,2,14);for(let i=0;i<5;i++){ctx.fillStyle=i%2?"#fff":"#3a7ae0";ctx.fillRect(x-3+i*4.4,y-12,4.4,6);}ctx.strokeRect(x-3,y-12,22,6);break;
  case "arch":ctx.fillStyle="#d8d0c8";ctx.fillRect(x-2,y-16,5,30);ctx.fillRect(x+15,y-16,5,30);ctx.strokeStyle=OL;ctx.strokeRect(x-2,y-16,5,30);ctx.strokeRect(x+15,y-16,5,30);ctx.beginPath();ctx.moveTo(x-3,y-14);ctx.quadraticCurveTo(x+9,y-28,x+21,y-14);ctx.lineTo(x+21,y-10);ctx.quadraticCurveTo(x+9,y-23,x-3,y-10);ctx.closePath();ctx.fillStyle="#e8e0d8";ctx.fill();ol();
    ctx.fillStyle="#f0c850";ctx.beginPath();ctx.arc(x+9,y-20,2,0,7);ctx.fill();break;
  case "gazebo":drawShadow(x+8,y+14,14,4);ctx.fillStyle="#7a4a24";for(const dx of [-6,20])ctx.fillRect(x+dx,y-6,2,20);ctx.beginPath();ctx.ellipse(x+8,y+12,14,4,0,0,7);ctx.fillStyle="#c8b8a0";ctx.fill();ol();
    ctx.beginPath();ctx.moveTo(x-10,y-4);ctx.lineTo(x+8,y-18);ctx.lineTo(x+26,y-4);ctx.closePath();ctx.fillStyle="#9a5a2a";ctx.fill();ol();break;
  case "crates":drawShadow(x+8,y+14,7,2);ctx.fillStyle="#c08a4a";ctx.fillRect(x+1,y+4,9,9);ctx.fillRect(x+8,y+7,7,7);ctx.strokeStyle=OL;ctx.strokeRect(x+1,y+4,9,9);ctx.strokeRect(x+8,y+7,7,7);ctx.beginPath();ctx.moveTo(x+1,y+4);ctx.lineTo(x+10,y+13);ctx.stroke();break;
  case "logs":drawShadow(x+8,y+14,8,2);for(const [lx,ly] of [[2,9],[8,9],[5,5]]){ctx.fillStyle="#8a5228";ctx.fillRect(x+lx,y+ly,6,4);ctx.strokeStyle=OL;ctx.strokeRect(x+lx,y+ly,6,4);ctx.fillStyle="#e8c888";ctx.beginPath();ctx.ellipse(x+lx+6,y+ly+2,1.4,2,0,0,7);ctx.fill();ctx.stroke();}break;
  case "topiary":{const L=LEAF2[season()];drawShadow(x+8,y+14,5,2);ctx.fillStyle="#8a5a3a";ctx.fillRect(x+5,y+10,6,4);ctx.strokeStyle=OL;ctx.strokeRect(x+5,y+10,6,4);ctx.beginPath();ctx.ellipse(x+8,y+2,5,9,0,0,7);ctx.fillStyle=L[0];ctx.fill();ol();ctx.fillStyle=L[1];ctx.beginPath();ctx.ellipse(x+6.5,y-1,2,4,0,0,7);ctx.fill();break;}
  case "flowers":for(let i=0;i<5;i++){ctx.fillStyle=["#ff6aa8","#ffd23a","#a46aff","#ff8a3a","#fff"][i];ctx.beginPath();ctx.arc(x+3+i*2.5,y+8+(i%2)*3,1.6,0,7);ctx.fill();}break;
  case "fence":ctx.fillStyle="#a8743e";ctx.fillRect(x,y+6,16,2);ctx.fillRect(x,y+10,16,2);ctx.fillRect(x+2,y+3,2,11);ctx.fillRect(x+12,y+3,2,11);ctx.strokeStyle=OL;ctx.lineWidth=.6;ctx.strokeRect(x+2,y+3,2,11);ctx.strokeRect(x+12,y+3,2,11);break;
  case "pumpkins":for(const [px2,py2,r] of [[5,10,3.5],[11,11,3],[8,6,2.6]]){drawShadow(x+px2,y+py2+3,r,1);ctx.beginPath();ctx.ellipse(x+px2,y+py2,r*1.2,r,0,0,7);ctx.fillStyle="#ff8a20";ctx.fill();ol();ctx.fillStyle="#3a7a20";ctx.fillRect(x+px2-.5,y+py2-r-1.5,1.5,2);}break;
  case "tent":drawShadow(x+8,y+14,9,3);ctx.beginPath();ctx.moveTo(x-2,y+14);ctx.lineTo(x+8,y-4);ctx.lineTo(x+18,y+14);ctx.closePath();ctx.fillStyle="#8a6a3a";ctx.fill();ol();ctx.beginPath();ctx.moveTo(x+6,y+14);ctx.lineTo(x+8,y+6);ctx.lineTo(x+10,y+14);ctx.fillStyle="#3a2010";ctx.fill();
    ctx.fillStyle="#a02020";ctx.fillRect(x+8,y-10,1,7);ctx.fillRect(x+9,y-10,5,3);break;
  case "campfire":ctx.fillStyle="#6a4020";ctx.fillRect(x+2,y+9,12,3);ctx.globalCompositeOperation="lighter";ctx.fillStyle="#ff8a30";ctx.beginPath();ctx.ellipse(x+8,y+6-Math.random(),3,5,0,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";break;
  }}
function drawTorches(){/* replaced by lamp-post props */}
