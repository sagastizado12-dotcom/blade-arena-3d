// ===== ORIGINAL 16-BIT JRPG-STYLE MONSTER ROSTER =====
// Procedurally drawn, layered rigs (body/head/wings/tail/arm/legs) with bold outlines and 3-4 tone shading.
const MPAL={ // [dark, mid, light, highlight]
 blue:["#1c4aa8","#3a7ae8","#7ab8ff","#d8f0ff"],orange:["#a8401c","#e8782a","#ffb060","#fff0c8"],steel:["#4a5266","#8a94aa","#c8d0e0","#ffffff"],green:["#2a6a1c","#4aa83a","#8ae060","#e0ffc0"],
 purple:["#4a1c6a","#7a3aa8","#b070e0","#f0d0ff"],red:["#7a1020","#c02a3a","#ff6a6a","#ffd0d0"],gold:["#7a5410","#c8901c","#f0c850","#fff4c0"],teal:["#105a5a","#20a0a0","#60e0d0","#d0fff8"],
 brown:["#4a2c14","#7a4e28","#b07a48","#e8c090"],stone:["#3e3a3a","#6e6866","#a8a29c","#e0dad2"],bone:["#6a5a44","#b0a080","#e8dcc0","#ffffff"],wrap:["#6a5a3a","#a89870","#d8ccaa","#fffbe8"],
 pink:["#8a2a5a","#d8508a","#ff98c0","#ffe0f0"],black:["#14101e","#2e2840","#504866","#9088b0"],fire:["#a8200c","#f05a14","#ffb020","#fff8a0"],ice:["#2a5a9a","#5aa0e0","#a8e0ff","#ffffff"],
 lava:["#5a1408","#a8300c","#f07020","#ffd060"],moss:["#2a4a1c","#4a7a2a","#7ab048","#d0f090"],night:["#1c1440","#3a2a7a","#6a58c0","#c8c0ff"],crimson:["#4a0818","#8a1430","#d03050","#ff9aaa"]};
const MOL="#120a10";
const MONDEF={ // key: [name, shape, pal, size, opts]
 slime:["Blue Slime","slime","blue",30,{beh:"neu",hp:2,spd:.45,biome:["meadow","forest"],herd:1,parts:["core"],desc:"A wobbly, friendly-looking blob. Bites when bothered."}],
 meadowslime:["Meadow Slime","slime","green",28,{beh:"pea",hp:1,spd:.35,biome:["meadow"],herd:1,parts:["core"],desc:"Gentle grazing blobs that roam in herds."}],
 emberslime:["Ember Slime","slime","orange",32,{beh:"agg",hp:4,spd:.5,aggro:90,biome:["mountain","ruins"],tier:2,parts:["core","gem"],desc:"A hot-tempered slime swap with a fiery core."}],
 steelslime:["Steel Slime","slime","steel",30,{beh:"flee",hp:6,spd:1.1,biome:["mountain"],tier:3,gold:[20,40],parts:["gem","core"],desc:"Rare, armored and fast. Worth a fortune."}],
 kingslime:["Bubble King","slime","purple",72,{beh:"agg",hp:24,spd:.35,aggro:130,rare:1,biome:["meadow"],gold:[40,70],parts:["core","gem","gem"],desc:"A crowned giant of a slime. Rare."}],
 duskbat:["Dusk Bat","bat","night",34,{beh:"agg",hp:2,spd:.9,aggro:110,biome:["forest","ruins"],night:1,fly:1,parts:["wing","fang"],desc:"Flutters out at dusk in search of a bite."}],
 vampbat:["Crimson Bat","bat","crimson",38,{beh:"agg",hp:4,spd:1,aggro:130,biome:["ruins","mountain"],night:1,fly:1,tier:2,parts:["wing","fang","eye"],desc:"A blood-red swap of the dusk bat."}],
 imp:["Pip Imp","imp","red",34,{beh:"agg",hp:3,spd:.8,aggro:110,biome:["forest","ruins"],fly:1,parts:["horn","tail","wing"],desc:"A grinning little devil with a fork."}],
 heximp:["Hex Imp","imp","purple",36,{beh:"agg",hp:5,spd:.8,aggro:140,biome:["ruins","mountain"],fly:1,caster:[200,120,255],tier:2,parts:["horn","tail","core"],desc:"Casts crackling hexes from afar."}],
 viper:["Grass Viper","snake","green",34,{beh:"agg",hp:3,spd:.6,aggro:90,biome:["meadow","forest","shore"],parts:["fang","scale","tail"],desc:"Hides in tall grass. Quick to strike."}],
 cobra:["Sand Cobra","snake","gold",40,{beh:"agg",hp:5,spd:.6,aggro:110,biome:["shore","ruins"],tier:2,caster:[180,255,80],parts:["fang","scale","eye"],desc:"Hooded and venomous. Spits poison."}],
 snapbloom:["Snapbloom","plant","pink",36,{beh:"agg",hp:3,spd:.25,aggro:70,biome:["forest","meadow"],parts:["core","fang"],desc:"A pretty flower with very sharp teeth."}],
 venusmaw:["Gorge Maw","plant","purple",44,{beh:"agg",hp:6,spd:.25,aggro:90,biome:["forest"],tier:2,parts:["core","fang","eye"],desc:"Its bigger, hungrier cousin."}],
 treant:["Elder Treant","treant","moss",84,{beh:"neu",hp:22,spd:.35,rare:1,biome:["forest"],gold:[30,50],parts:["core","gem","wood"],desc:"An ancient walking tree. Rare and slow to anger."}],
 mudgolem:["Mud Golem","golem","brown",44,{beh:"agg",hp:7,spd:.35,aggro:90,biome:["meadow","shore"],parts:["core","hide"],desc:"Clumsy heaps of living mud."}],
 stonegolem:["Stone Golem","golem","stone",50,{beh:"agg",hp:10,spd:.35,aggro:100,biome:["mountain","ruins"],tier:2,parts:["core","gem"],desc:"Carved guardians that never tire."}],
 boss:["Ruin Colossus","golem","lava",88,{beh:"agg",hp:26,spd:.4,aggro:140,gold:[40,60],big:1,parts:["horn","core","gem"],desc:"A molten colossus that guards the old ruins."}],
 mummy:["Mummy","undead","wrap",38,{beh:"agg",hp:4,spd:.4,aggro:100,biome:["ruins"],parts:["hide","eye"],desc:"Shambling wrapped dead of the ruins."}],
 skeleton:["Bone Soldier","skeleton","bone",38,{beh:"agg",hp:4,spd:.6,aggro:110,biome:["ruins","mountain"],night:1,parts:["fang","crude"],desc:"Rattling soldiers that rise at night."}],
 wolfman:["Wolfman","beast","steel",42,{beh:"agg",hp:5,spd:.8,aggro:120,biome:["forest","meadow"],night:1,parts:["fang","claw","hide"],desc:"A howling beast-man of the woods."}],
 manebeast:["Mane Beast","lion","gold",48,{beh:"agg",hp:8,spd:.85,aggro:130,biome:["meadow","mountain"],tier:2,parts:["claw","fang","hide"],desc:"A lion-headed brute with a mighty roar."}],
 gazer:["Gazer","eye","pink",34,{beh:"agg",hp:3,spd:.5,aggro:120,biome:["ruins","forest"],fly:1,parts:["eye","core"],desc:"A floating eye that never blinks."}],
 evileye:["Evil Eye","eye","night",38,{beh:"agg",hp:5,spd:.5,aggro:150,biome:["ruins","mountain"],fly:1,caster:[255,80,200],tier:2,parts:["eye","eye","core"],desc:"Fires beams from its dreadful gaze."}],
 wisp:["Will-o'-Wisp","wisp","teal",30,{beh:"agg",hp:2,spd:.7,aggro:110,biome:["forest","shore"],night:1,fly:1,parts:["core"],desc:"A lantern-like spirit that lures travellers."}],
 firespirit:["Fire Spirit","wisp","fire",36,{beh:"agg",hp:4,spd:.7,aggro:130,biome:["mountain","ruins"],fly:1,caster:[255,140,40],tier:2,parts:["core","gem"],desc:"A living flame that hurls fireballs."}],
 knight:["Rust Knight","knight","steel",44,{beh:"agg",hp:8,spd:.5,aggro:110,biome:["ruins","meadow"],parts:["crude","core"],desc:"Empty armor that still swings its blade."}],
 dreadknight:["Dread Knight","knight","black",48,{beh:"agg",hp:12,spd:.55,aggro:130,biome:["mountain","ruins"],tier:3,parts:["crude","core","gem"],desc:"A black-armored swap. Deadly."}],
 cyclops:["Cyclops","cyclops","teal",80,{beh:"agg",hp:18,spd:.45,aggro:130,rare:1,biome:["mountain"],big:1,gold:[30,50],parts:["eye","horn","hide"],desc:"A one-eyed giant with a tree-trunk club."}],
 gargoyle:["Gargoyle","gargoyle","stone",48,{beh:"agg",hp:7,spd:.7,aggro:130,biome:["ruins","mountain"],fly:1,parts:["wing","horn","claw"],desc:"Stone statues that wake and swoop."}],
 seaserpent:["Tide Serpent","snake","teal",80,{beh:"agg",hp:20,spd:.6,aggro:150,rare:1,swims:1,big:1,gold:[30,50],parts:["scale","fang","pearl"],desc:"Rare sea terror of the coasts."}],
 demonlord:["Demon Lord Vorlag","demon","crimson",96,{beh:"agg",hp:34,spd:.4,aggro:160,big:1,boss:1,caster:[255,60,60],gold:[80,120],parts:["horn","core","gem","gem"],desc:"Lord of the deep dungeon. A true boss."}],
 archfiend:["Archfiend","demon","night",72,{beh:"agg",hp:20,spd:.45,aggro:150,biome:["mountain"],rare:1,big:1,caster:[160,120,255],tier:3,parts:["horn","wing","core"],desc:"A lesser demon lord that stalks the peaks."}]
};
// ---- tiny pixel painter helpers ----
function mcv(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.imageSmoothingEnabled=false;return [c,g];}
function shadeEll(g,x,y,rx,ry,p,rot){rot=rot||0;g.fillStyle=p[0];g.beginPath();g.ellipse(x,y,rx,ry,rot,0,7);g.fill();g.fillStyle=p[1];g.beginPath();g.ellipse(x-rx*.1,y-ry*.12,rx*.86,ry*.82,rot,0,7);g.fill();
  g.fillStyle=p[2];g.beginPath();g.ellipse(x-rx*.28,y-ry*.32,rx*.5,ry*.42,rot,0,7);g.fill();g.fillStyle=p[3];g.beginPath();g.ellipse(x-rx*.42,y-ry*.5,Math.max(1,rx*.16),Math.max(1,ry*.13),rot,0,7);g.fill();}
function shadeRect(g,x,y,w,h,p){g.fillStyle=p[0];g.fillRect(x,y,w,h);g.fillStyle=p[1];g.fillRect(x,y,w-Math.max(1,w*.18),h-Math.max(1,h*.12));g.fillStyle=p[2];g.fillRect(x+1,y+1,Math.max(1,w*.35),Math.max(1,h*.4));}
function poly(g,pts,col){g.fillStyle=col;g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fill();}
function eyes(g,x,y,sp,r,angry,col){for(const s of [-1,1]){const ex=x+s*sp;g.fillStyle="#fff";g.beginPath();g.ellipse(ex,y,r,r*1.2,0,0,7);g.fill();g.fillStyle=col||"#100810";g.beginPath();g.ellipse(ex+s*.3,y+r*.2,r*.55,r*.75,0,0,7);g.fill();g.fillStyle="#fff";g.fillRect(Math.round(ex-r*.3),Math.round(y-r*.5),1,1);
  if(angry){g.strokeStyle=MOL;g.lineWidth=1.2;g.beginPath();g.moveTo(ex-s*r*1.3,y-r*1.6);g.lineTo(ex+s*r*.9,y-r*.8);g.stroke();}}}
function mouth(g,x,y,w,fangs,open){g.fillStyle="#3a0810";g.beginPath();g.ellipse(x,y,w,open?w*.6:w*.3,0,0,Math.PI);g.fill();if(open){g.fillStyle="#e0405a";g.beginPath();g.ellipse(x,y+w*.35,w*.5,w*.2,0,0,7);g.fill();}
  if(fangs){g.fillStyle="#fff";poly(g,[x-w*.6,y,x-w*.35,y,x-w*.47,y+w*.45],"#fff");poly(g,[x+w*.35,y,x+w*.6,y,x+w*.47,y+w*.45],"#fff");}}
// binarize alpha, 4-tone posterize already by palette, then add a bold dark outline
function inkLayer(c){const g=c.getContext("2d");const W=c.width,H=c.height;const d=g.getImageData(0,0,W,H);const a=d.data;
  for(let i=3;i<a.length;i+=4)a[i]=a[i]>110?255:0;const o=new Uint8ClampedArray(a);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(a[i+3])continue;let n=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&a[(yy*W+xx)*4+3])n++;}
    if(n){o[i]=18;o[i+1]=10;o[i+2]=16;o[i+3]=255;}}
  d.data.set(o);g.putImageData(d,0,0);return c;}
// ---- shape builders: each returns layer list drawn into same-size canvases ----
function buildMon(key){const [name,shape,pk,S,o]=MONDEF[key];const p=MPAL[pk];const W=S,H=S;const L={};
  const lay=(n,px,py,f)=>{const [c,g]=mcv(W,H);f(g);L[n]={c:inkLayer(c),px,py};};
  const u=S/40; // unit scale
  switch(shape){
  case "slime":lay("body",W/2,H,g=>{poly(g,[W*.5,H*.22,W*.62,H*.36,W*.9,H*.7,W*.88,H*.92,W*.12,H*.92,W*.1,H*.7,W*.38,H*.36],p[0]);shadeEll(g,W*.5,H*.7,W*.38,H*.24,p);poly(g,[W*.5,H*.24,W*.6,H*.48,W*.4,H*.48],p[1]);g.fillStyle=p[2];g.fillRect(W*.47,H*.3,2*u,4*u);
     eyes(g,W*.5,H*.66,W*.12,2.6*u,false);mouth(g,W*.5,H*.78,W*.12,false,true);if(key==="kingslime"){poly(g,[W*.32,H*.32,W*.36,H*.18,W*.43,H*.27,W*.5,H*.13,W*.57,H*.27,W*.64,H*.18,W*.68,H*.32],"#f0c850");g.fillStyle="#d02040";g.fillRect(W*.48,H*.22,3,3);}});break;
  case "bat":lay("wingL",W*.42,H*.5,g=>{poly(g,[W*.42,H*.45,W*.05,H*.25,W*.1,H*.5,W*.02,H*.62,W*.2,H*.6,W*.26,H*.72,W*.42,H*.58],p[0]);poly(g,[W*.4,H*.47,W*.12,H*.32,W*.16,H*.5,W*.4,H*.55],p[1]);});
     lay("wingR",W*.58,H*.5,g=>{poly(g,[W*.58,H*.45,W*.95,H*.25,W*.9,H*.5,W*.98,H*.62,W*.8,H*.6,W*.74,H*.72,W*.58,H*.58],p[0]);poly(g,[W*.6,H*.47,W*.88,H*.32,W*.84,H*.5,W*.6,H*.55],p[1]);});
     lay("body",W/2,H*.7,g=>{poly(g,[W*.36,H*.36,W*.38,H*.22,W*.45,H*.34],p[1]);poly(g,[W*.64,H*.36,W*.62,H*.22,W*.55,H*.34],p[1]);shadeEll(g,W*.5,H*.5,W*.17,H*.17,p);eyes(g,W*.5,H*.47,W*.07,2*u,true,"#e02020");mouth(g,W*.5,H*.56,W*.07,true,false);g.fillStyle=p[0];g.fillRect(W*.44,H*.66,2,4);g.fillRect(W*.54,H*.66,2,4);});break;
  case "imp":lay("wingL",W*.42,H*.45,g=>{poly(g,[W*.42,H*.42,W*.1,H*.2,W*.14,H*.5,W*.38,H*.56],"#4a1c3a");});lay("wingR",W*.58,H*.45,g=>{poly(g,[W*.58,H*.42,W*.9,H*.2,W*.86,H*.5,W*.62,H*.56],"#4a1c3a");});
     lay("tail",W*.55,H*.75,g=>{g.strokeStyle=p[0];g.lineWidth=2*u;g.beginPath();g.moveTo(W*.55,H*.75);g.quadraticCurveTo(W*.85,H*.85,W*.8,H*.6);g.stroke();poly(g,[W*.76,H*.6,W*.84,H*.6,W*.8,H*.5],p[1]);});
     lay("body",W/2,H*.92,g=>{shadeEll(g,W*.5,H*.7,W*.14,H*.16,p);g.fillStyle=p[0];g.fillRect(W*.42,H*.82,3*u,5*u);g.fillRect(W*.53,H*.82,3*u,5*u);});
     lay("head",W/2,H*.55,g=>{poly(g,[W*.34,H*.32,W*.3,H*.12,W*.42,H*.26],"#f0e0c0");poly(g,[W*.66,H*.32,W*.7,H*.12,W*.58,H*.26],"#f0e0c0");shadeEll(g,W*.5,H*.4,W*.19,H*.17,p);eyes(g,W*.5,H*.38,W*.08,2.2*u,true,"#f0d020");mouth(g,W*.5,H*.48,W*.09,true,false);});
     lay("arm",W*.66,H*.62,g=>{g.fillStyle="#8a6a3a";g.fillRect(W*.7,H*.25,1.5*u,H*.5);poly(g,[W*.66,H*.25,W*.78,H*.25,W*.76,H*.15,W*.73,H*.22,W*.72,H*.12,W*.7,H*.22,W*.67,H*.15],"#c8c8d8");shadeEll(g,W*.68,H*.64,W*.06,H*.05,p);});break;
  case "snake":lay("tail",W*.5,H*.85,g=>{shadeEll(g,W*.5,H*.82,W*.36,H*.12,p);g.fillStyle=p[2];for(let i=0;i<5;i++)g.fillRect(W*(.26+i*.11),H*.8,2*u,1.5*u);});
     lay("body",W*.5,H*.85,g=>{g.fillStyle=p[0];g.fillRect(W*.4,H*.38,W*.2,H*.42);g.fillStyle=p[1];g.fillRect(W*.42,H*.38,W*.13,H*.42);g.fillStyle="#f0e0a0";for(let i=0;i<5;i++)g.fillRect(W*.45,H*(.42+i*.08),W*.08,H*.04);});
     lay("head",W*.5,H*.42,g=>{if(key!=="viper")shadeEll(g,W*.5,H*.33,W*.26,H*.2,[p[0],p[1],p[2],p[3]]);shadeEll(g,W*.5,H*.28,W*.15,H*.13,p);eyes(g,W*.5,H*.25,W*.07,2*u,true,"#e02020");g.fillStyle="#e02040";g.fillRect(W*.495,H*.38,1,4*u);});break;
  case "plant":lay("arm",W*.5,H*.8,g=>{poly(g,[W*.5,H*.75,W*.12,H*.62,W*.22,H*.8],"#2a8a2a");poly(g,[W*.5,H*.75,W*.88,H*.62,W*.78,H*.8],"#2a8a2a");});
     lay("body",W*.5,H,g=>{g.fillStyle="#1c5a1c";g.fillRect(W*.46,H*.45,W*.08,H*.5);g.fillStyle="#3aa83a";g.fillRect(W*.47,H*.45,W*.04,H*.5);shadeEll(g,W*.5,H*.95,W*.22,H*.06,["#3a2a1a","#5a4028","#7a5a38","#a07a50"]);});
     lay("head",W*.5,H*.45,g=>{for(let i=0;i<6;i++){const a=i/6*Math.PI*2;shadeEll(g,W*.5+Math.cos(a)*W*.2,H*.32+Math.sin(a)*H*.17,W*.12,H*.1,p,a);}shadeEll(g,W*.5,H*.33,W*.17,H*.15,["#5a1020","#a02040","#e05070","#ffc0d0"]);mouth(g,W*.5,H*.33,W*.13,true,true);g.fillStyle="#ffe040";g.fillRect(W*.47,H*.2,2,2);});break;
  case "treant":lay("arm",W*.5,H*.5,g=>{g.strokeStyle=p[0];g.lineWidth=5*u;g.beginPath();g.moveTo(W*.3,H*.5);g.lineTo(W*.08,H*.35);g.lineTo(W*.04,H*.2);g.moveTo(W*.7,H*.5);g.lineTo(W*.92,H*.38);g.lineTo(W*.97,H*.22);g.stroke();});
     lay("body",W*.5,H,g=>{shadeRect(g,W*.3,H*.4,W*.4,H*.5,["#3a2410","#6a4422","#9a6a3a","#c89a60"]);poly(g,[W*.3,H*.9,W*.18,H*.98,W*.4,H*.92],"#4a2c14");poly(g,[W*.7,H*.9,W*.82,H*.98,W*.6,H*.92],"#4a2c14");
       eyes(g,W*.5,H*.55,W*.08,3*u,true,"#f0e020");mouth(g,W*.5,H*.7,W*.1,false,true);});
     lay("head",W*.5,H*.42,g=>{shadeEll(g,W*.5,H*.26,W*.4,H*.22,p);shadeEll(g,W*.3,H*.32,W*.18,H*.13,p);shadeEll(g,W*.7,H*.32,W*.18,H*.13,p);g.fillStyle="#ff6a8a";g.fillRect(W*.6,H*.18,2*u,2*u);g.fillRect(W*.34,H*.22,2*u,2*u);});break;
  case "golem":lay("legs",W*.5,H,g=>{shadeRect(g,W*.28,H*.74,W*.16,H*.22,p);shadeRect(g,W*.56,H*.74,W*.16,H*.22,p);});
     lay("body",W*.5,H*.8,g=>{shadeRect(g,W*.22,H*.38,W*.56,H*.4,p);g.fillStyle=p[0];g.fillRect(W*.3,H*.55,W*.12,1);g.fillRect(W*.55,H*.46,1,W*.1);if(pk==="lava"){g.fillStyle="#ffd060";g.fillRect(W*.45,H*.5,W*.1,H*.12);}});
     lay("head",W*.5,H*.4,g=>{shadeRect(g,W*.36,H*.18,W*.28,H*.22,p);g.fillStyle=pk==="lava"?"#fff060":"#60f0ff";g.fillRect(W*.41,H*.26,3*u,2*u);g.fillRect(W*.54,H*.26,3*u,2*u);if(key==="boss"){poly(g,[W*.36,H*.2,W*.3,H*.06,W*.42,H*.18],"#e8dcc0");poly(g,[W*.64,H*.2,W*.7,H*.06,W*.58,H*.18],"#e8dcc0");}});
     lay("arm",W*.76,H*.42,g=>{shadeRect(g,W*.74,H*.4,W*.16,H*.36,p);shadeRect(g,W*.1,H*.4,W*.16,H*.36,p);});break;
  case "undead":case "skeleton":{const sk=shape==="skeleton";
     lay("legs",W*.5,H,g=>{g.fillStyle=p[0];g.fillRect(W*.4,H*.7,3*u,H*.28);g.fillRect(W*.54,H*.7,3*u,H*.28);g.fillStyle=p[2];g.fillRect(W*.41,H*.7,1.5*u,H*.26);g.fillRect(W*.55,H*.7,1.5*u,H*.26);});
     lay("body",W*.5,H*.75,g=>{if(sk){g.fillStyle=p[2];for(let i=0;i<4;i++)g.fillRect(W*.38,H*(.42+i*.07),W*.24,2*u);g.fillStyle=p[1];g.fillRect(W*.48,H*.4,2*u,H*.32);}else{shadeRect(g,W*.36,H*.4,W*.28,H*.34,p);g.fillStyle=p[0];for(let i=0;i<5;i++)g.fillRect(W*.36,H*(.44+i*.06),W*.28,1);}});
     lay("head",W*.5,H*.42,g=>{shadeEll(g,W*.5,H*.3,W*.14,H*.13,p);if(sk){g.fillStyle=MOL;g.fillRect(W*.42,H*.27,3*u,3*u);g.fillRect(W*.53,H*.27,3*u,3*u);g.fillStyle="#f02020";g.fillRect(W*.43,H*.28,1,1);g.fillRect(W*.54,H*.28,1,1);g.fillStyle=MOL;for(let i=0;i<4;i++)g.fillRect(W*(.43+i*.04),H*.38,1,2);}
       else{g.fillStyle=p[0];g.fillRect(W*.36,H*.26,W*.28,1);g.fillRect(W*.36,H*.33,W*.28,1);g.fillStyle="#f0e040";g.fillRect(W*.44,H*.29,2*u,2*u);g.fillRect(W*.53,H*.29,2*u,2*u);}});
     lay("arm",W*.66,H*.45,g=>{g.fillStyle=p[1];g.fillRect(W*.64,H*.44,3*u,H*.24);if(sk){g.fillStyle="#c0c0d0";g.fillRect(W*.7,H*.2,2*u,H*.42);g.fillStyle="#7a5a2a";g.fillRect(W*.66,H*.58,W*.12,2*u);}else{g.fillRect(W*.64,H*.44,W*.2,3*u);}});break;}
  case "beast":case "lion":{const li=shape==="lion";
     lay("tail",W*.4,H*.75,g=>{g.strokeStyle=p[0];g.lineWidth=2.5*u;g.beginPath();g.moveTo(W*.4,H*.75);g.quadraticCurveTo(W*.1,H*.8,W*.12,H*.55);g.stroke();if(li)shadeEll(g,W*.12,H*.55,W*.05,H*.05,MPAL.brown);});
     lay("legs",W*.5,H,g=>{shadeRect(g,W*.36,H*.72,W*.11,H*.25,p);shadeRect(g,W*.54,H*.72,W*.11,H*.25,p);});
     lay("body",W*.5,H*.78,g=>{shadeEll(g,W*.5,H*.58,W*.2,H*.18,p);g.fillStyle=p[3];g.beginPath();g.ellipse(W*.5,H*.6,W*.09,H*.1,0,0,7);g.fill();});
     lay("head",W*.5,H*.42,g=>{if(li)shadeEll(g,W*.5,H*.3,W*.24,H*.2,MPAL.brown);else{poly(g,[W*.36,H*.22,W*.38,H*.08,W*.46,H*.2],p[0]);poly(g,[W*.64,H*.22,W*.62,H*.08,W*.54,H*.2],p[0]);}
       shadeEll(g,W*.5,H*.3,W*.15,H*.13,p);shadeEll(g,W*.5,H*.37,W*.08,H*.05,[p[1],p[2],p[3],"#fff"]);eyes(g,W*.5,H*.27,W*.07,2*u,true,"#f0c020");g.fillStyle=MOL;g.fillRect(W*.49,H*.35,2,1);mouth(g,W*.5,H*.4,W*.06,true,false);});
     lay("arm",W*.68,H*.5,g=>{shadeRect(g,W*.66,H*.48,W*.1,H*.22,p);g.fillStyle="#fff";g.fillRect(W*.66,H*.7,1,2);g.fillRect(W*.7,H*.7,1,2);g.fillRect(W*.74,H*.7,1,2);});break;}
  case "eye":lay("tail",W*.5,H*.6,g=>{g.strokeStyle=p[0];g.lineWidth=2*u;for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(W*.5+i*W*.06,H*.6);g.quadraticCurveTo(W*.5+i*W*.12,H*.8,W*.5+i*W*.08,H*.95);g.stroke();}});
     lay("body",W*.5,H*.6,g=>{shadeEll(g,W*.5,H*.42,W*.3,H*.28,p);g.fillStyle="#fff";g.beginPath();g.ellipse(W*.5,H*.44,W*.2,H*.18,0,0,7);g.fill();g.fillStyle="#d02040";g.beginPath();g.ellipse(W*.52,H*.46,W*.1,H*.11,0,0,7);g.fill();g.fillStyle=MOL;g.beginPath();g.ellipse(W*.53,H*.47,W*.05,H*.07,0,0,7);g.fill();g.fillStyle="#fff";g.fillRect(W*.47,H*.38,2*u,2*u);
       g.strokeStyle="#e04060";g.lineWidth=1;g.beginPath();g.moveTo(W*.32,H*.4);g.lineTo(W*.38,H*.44);g.moveTo(W*.68,H*.5);g.lineTo(W*.62,H*.48);g.stroke();});break;
  case "wisp":lay("body",W*.5,H*.8,g=>{poly(g,[W*.5,H*.05,W*.66,H*.32,W*.78,H*.62,W*.5,H*.85,W*.22,H*.62,W*.34,H*.32],p[0]);poly(g,[W*.5,H*.15,W*.62,H*.38,W*.7,H*.62,W*.5,H*.78,W*.3,H*.62,W*.38,H*.38],p[1]);shadeEll(g,W*.5,H*.6,W*.18,H*.16,[p[1],p[2],p[3],"#fff"]);
       eyes(g,W*.5,H*.56,W*.07,2*u,false);mouth(g,W*.5,H*.66,W*.06,false,true);});break;
  case "knight":lay("legs",W*.5,H,g=>{shadeRect(g,W*.38,H*.72,W*.1,H*.26,p);shadeRect(g,W*.52,H*.72,W*.1,H*.26,p);});
     lay("body",W*.5,H*.76,g=>{shadeRect(g,W*.32,H*.38,W*.36,H*.36,p);g.fillStyle=pk==="black"?"#a01830":"#2a5ab0";g.fillRect(W*.45,H*.4,W*.1,H*.32);shadeEll(g,W*.24,H*.56,W*.1,H*.14,MPAL[pk==="black"?"crimson":"blue"]);});
     lay("head",W*.5,H*.4,g=>{shadeRect(g,W*.38,H*.14,W*.24,H*.24,p);g.fillStyle=MOL;g.fillRect(W*.4,H*.24,W*.2,2*u);g.fillStyle="#ff3030";g.fillRect(W*.44,H*.245,1.5*u,1);g.fillRect(W*.54,H*.245,1.5*u,1);poly(g,[W*.5,H*.14,W*.56,H*.02,W*.52,H*.14],"#d02040");});
     lay("arm",W*.7,H*.45,g=>{shadeRect(g,W*.66,H*.42,W*.08,H*.2,p);g.fillStyle="#e0e8f0";g.fillRect(W*.72,H*.06,2*u,H*.44);g.fillStyle="#c8901c";g.fillRect(W*.67,H*.48,W*.12,2*u);});break;
  case "cyclops":lay("legs",W*.5,H,g=>{shadeRect(g,W*.32,H*.74,W*.13,H*.24,p);shadeRect(g,W*.55,H*.74,W*.13,H*.24,p);});
     lay("body",W*.5,H*.78,g=>{shadeEll(g,W*.5,H*.56,W*.24,H*.22,p);g.fillStyle="#7a4e28";g.fillRect(W*.28,H*.66,W*.44,H*.1);});
     lay("head",W*.5,H*.4,g=>{shadeEll(g,W*.5,H*.26,W*.16,H*.15,p);poly(g,[W*.5,H*.12,W*.53,H*.02,W*.47,H*.12],"#e8dcc0");g.fillStyle="#fff";g.beginPath();g.ellipse(W*.5,H*.25,W*.07,H*.06,0,0,7);g.fill();g.fillStyle="#d02020";g.fillRect(W*.49,H*.24,3*u,3*u);mouth(g,W*.5,H*.33,W*.08,true,false);});
     lay("arm",W*.74,H*.46,g=>{shadeRect(g,W*.7,H*.44,W*.1,H*.2,p);poly(g,[W*.72,H*.6,W*.82,H*.6,W*.92,H*.06,W*.78,H*.04],"#7a4e28");g.fillStyle="#b07a48";g.fillRect(W*.8,H*.1,2*u,H*.4);});break;
  case "gargoyle":lay("wingL",W*.4,H*.45,g=>{poly(g,[W*.4,H*.4,W*.04,H*.16,W*.1,H*.42,W*.04,H*.56,W*.38,H*.6],p[0]);poly(g,[W*.38,H*.43,W*.12,H*.26,W*.16,H*.48,W*.36,H*.55],p[1]);});
     lay("wingR",W*.6,H*.45,g=>{poly(g,[W*.6,H*.4,W*.96,H*.16,W*.9,H*.42,W*.96,H*.56,W*.62,H*.6],p[0]);poly(g,[W*.62,H*.43,W*.88,H*.26,W*.84,H*.48,W*.64,H*.55],p[1]);});
     lay("tail",W*.5,H*.8,g=>{g.strokeStyle=p[0];g.lineWidth=2*u;g.beginPath();g.moveTo(W*.5,H*.8);g.quadraticCurveTo(W*.8,H*.95,W*.84,H*.75);g.stroke();});
     lay("body",W*.5,H*.95,g=>{shadeEll(g,W*.5,H*.66,W*.15,H*.2,p);shadeRect(g,W*.4,H*.82,W*.08,H*.14,p);shadeRect(g,W*.52,H*.82,W*.08,H*.14,p);});
     lay("head",W*.5,H*.45,g=>{poly(g,[W*.38,H*.3,W*.34,H*.14,W*.44,H*.26],p[2]);poly(g,[W*.62,H*.3,W*.66,H*.14,W*.56,H*.26],p[2]);shadeEll(g,W*.5,H*.36,W*.14,H*.12,p);eyes(g,W*.5,H*.34,W*.06,1.8*u,true,"#f03030");mouth(g,W*.5,H*.42,W*.07,true,false);});break;
  case "demon":lay("wingL",W*.4,H*.4,g=>{poly(g,[W*.4,H*.36,W*.02,H*.08,W*.08,H*.36,W*.0,H*.5,W*.36,H*.56],"#3a0a1a");poly(g,[W*.38,H*.4,W*.1,H*.18,W*.14,H*.4,W*.36,H*.5],p[0]);});
     lay("wingR",W*.6,H*.4,g=>{poly(g,[W*.6,H*.36,W*.98,H*.08,W*.92,H*.36,W*1,H*.5,W*.64,H*.56],"#3a0a1a");poly(g,[W*.62,H*.4,W*.9,H*.18,W*.86,H*.4,W*.64,H*.5],p[0]);});
     lay("legs",W*.5,H,g=>{shadeRect(g,W*.38,H*.78,W*.1,H*.2,p);shadeRect(g,W*.52,H*.78,W*.1,H*.2,p);});
     lay("body",W*.5,H*.82,g=>{poly(g,[W*.32,H*.4,W*.68,H*.4,W*.76,H*.86,W*.24,H*.86],"#2a1a3a");poly(g,[W*.36,H*.42,W*.64,H*.42,W*.68,H*.84,W*.32,H*.84],"#4a2a6a");shadeEll(g,W*.5,H*.5,W*.14,H*.12,p);g.fillStyle="#f0c850";g.fillRect(W*.47,H*.56,W*.06,W*.06);});
     lay("head",W*.5,H*.4,g=>{poly(g,[W*.4,H*.26,W*.28,H*.06,W*.44,H*.2],"#e8dcc0");poly(g,[W*.6,H*.26,W*.72,H*.06,W*.56,H*.2],"#e8dcc0");shadeEll(g,W*.5,H*.3,W*.11,H*.11,p);eyes(g,W*.5,H*.28,W*.05,1.6*u,true,"#ffe020");mouth(g,W*.5,H*.35,W*.06,true,false);});
     lay("arm",W*.66,H*.46,g=>{shadeRect(g,W*.64,H*.44,W*.07,H*.2,p);g.fillStyle="#6a4a2a";g.fillRect(W*.7,H*.1,1.5*u,H*.56);shadeEll(g,W*.705,H*.1,W*.04,H*.04,MPAL.purple);});break;
  }
  return {W,H,L,name,shape};}
const MONCACHE={};function monRig(key){return MONCACHE[key]||(MONCACHE[key]=buildMon(key));}
// ---- register species ----
for(const k of ["crawler","spitter","charger","scorchrat","umbrawl","gloomote","thornback","voltusk","puffalo","fluffin","mossnail","sprigling","lilyleap","pondhop","grovegiant","tidemaw"]){delete SPECIES[k];delete PART_DROPS[k];delete BEST_DESC[k];}
for(const k in MONDEF){const [name,shape,pk,S,o]=MONDEF[k];const big=S>=64;
  SPECIES[k]={mon:1,name,shape,beh:o.beh,hp:o.hp,spd:o.spd,aggro:o.aggro,biome:o.biome,night:o.night,herd:o.herd,rare:o.rare,swims:o.swims,fly:o.fly,caster:o.caster,tier:o.tier||1,
    gold:o.gold||(o.beh==="pea"?null:[1+(o.tier||1)*2,3+(o.tier||1)*4]),w:Math.round(S*(big?.42:.4)),h:Math.round(S*(big?.22:.26)),S,dmg:big||o.tier>=3?2:1};
  PART_DROPS[k]=o.parts.filter(p=>typeof ITEMS==="undefined"||ITEMS[p]||PARTDEF[p]);BEST_DESC[k]=o.desc;}
SPECIES.boss.biome=null;SPECIES.demonlord.biome=null;
// ---- spawn hook: give new species their rig ----
const _spawnMob0=spawnMob;
spawnMob=function(sp,x,y,extra){const e=_spawnMob0(sp,x,y,extra);const d=SPECIES[sp];if(d&&d.mon){e.mon=monRig(sp);e.img=null;e.cut={};e.dmg=Math.max(e.dmg||1,d.dmg);e.uid0=(Math.random()*999)|0;if(d.fly)e.flyer=true;}return e;};
// ---- AI extras: casters fire bolts with a cast pose; flyers hover ----
function monAI(e,dist,ang){const d=e.def;if(e.castT>0){e.castT--;if(e.castT===8){const col=d.caster;const a=ang+(Math.random()-.5)*.15;
    projectiles.push({x:e.x+e.w/2,y:e.y+e.h/2-6,vx:Math.cos(a)*2.6,vy:Math.sin(a)*2.6,life:90,r:3.5,dmg:1,col});SFX.spell&&SFX.spell("fireball");}return true;}
  if(d.caster&&d.beh==="agg"&&dist<160&&dist>44&&(e.provoked||dist<(d.aggro||100))&&!heroSafeAt()){e.castCd=(e.castCd||60+Math.random()*60)-1;if(e.castCd<=0){e.castCd=110+Math.random()*60;e.castT=26;return true;}}
  return false;}
function heroSafeAt(){return !!(room||(typeof curSet!=="undefined"&&curSet&&!curSet.raid&&Math.hypot(hero.x/16-SETS[curSet.id].x,hero.y/16-SETS[curSet.id].y)<wallR(SETS[curSet.id])-1));}
// ---- severing: wings, tails, arms and heads come off the same rig ----
const SEVERABLE={wingL:"wing",wingR:"wing",tail:"tail",arm:"claw",head:"fang"};
function monSever(e,n,ang){const r=e.mon;if(!r.L[n]||e.cut[n])return false;e.cut[n]=true;const S=r.W;
  parts.push({spr:r.L[n].c,x:e.x+e.w/2,y:e.y+e.h-S*.5,z:8,vx:Math.cos(ang)*2+(Math.random()-.5),vy:Math.sin(ang)*2,vz:2.2,rot:0,spin:(Math.random()-.5)*.4,life:260,max:260,grounded:false});
  if(bloodOn)spray(e.x+e.w/2,e.y,10,ang,2);try{onSever(e,n==="wingL"||n==="wingR"?"wings":n==="arm"?"arm":n);}catch(_){}
  if(n==="wingL"||n==="wingR"){e.flyer=false;}if(n==="arm")e.dmg=Math.max(1,e.dmg-1);return true;}
const _hurtEnemy0=hurtEnemy;
hurtEnemy=function(e,dmg,ang,can){if(!e.mon)return _hurtEnemy0(e,dmg,ang,can);if(e.iframes>0||e.dead)return;const hp0=e.hp;_hurtEnemy0(e,dmg,ang,false);
  if(e.hp<hp0&&can&&e.hp>0&&Math.random()<0.28){const opts=Object.keys(SEVERABLE).filter(n=>n!=="head"&&e.mon.L[n]&&!e.cut[n]);if(opts.length)monSever(e,opts[(Math.random()*opts.length)|0],ang);}};
const _rigDeath0=rigDeath;
rigDeath=function(e,ang){if(!e.mon)return _rigDeath0(e,ang);e.flash=34;e.deathAng=ang;if(bloodOn&&e.mon.L.head)monSever(e,"head",ang);else burst(e.x+e.w/2,e.y,[255,255,255],14,1.2,2);};
// ---- animated drawing ----
function drawMon(e){const r=e.mon,d=e.def,S=r.W;const t=frameN+e.uid0;const mv=Math.abs(e.x-(e.px||e.x))+Math.abs(e.y-(e.py||e.y))>0.05;e.px=e.x;e.py=e.y;
  const dying=e.dead?clamp(1-e.flash/34,0,1):0;const flyH=e.flyer?8+Math.sin(t*.09)*3:0;const hop=r.shape==="slime"&&mv?Math.abs(Math.sin(t*.16))*6:0;
  drawShadow(e.x+e.w/2,e.y+e.h-1,S*.3*(1-flyH/30),Math.max(2,S*.07));
  const face=hero.x+6<e.x+e.w/2?1:-1;const wind=e.wind>0?e.wind/16:0,lunge=e.lunge>0?e.lunge/10:0,cast=e.castT>0?Math.sin((26-e.castT)/26*Math.PI):0;
  const rec=e.iframes>0&&!e.dead?e.iframes/10:0;
  ctx.save();ctx.translate(Math.floor(e.x+e.w/2+(rec?Math.cos(t*2)*1.5:0)),Math.floor(e.y+e.h-flyH-hop));if(face<0)ctx.scale(-1,1);
  if(dying){ctx.rotate(dying*(r.shape==="slime"?0:0.9)*(e.deathAng>Math.PI/2||e.deathAng<-Math.PI/2?-1:1));ctx.scale(1+dying*.3*(r.shape==="slime"?1:0),1-dying*.7);ctx.globalAlpha=1-dying*.8;}
  ctx.translate(-lunge*S*.12+wind*S*.05,0);
  if((e.flash>0&&!e.dead)||rec>.6)ctx.filter="brightness(2.6)";
  const br=Math.sin(t*.07)*.035;const sq=r.shape==="slime"?(mv?Math.sin(t*.16)*.12:br*2):br;
  const ox=-S/2,oy=-S;
  const D=(n,rot,dx,dy,sx,sy)=>{const l=r.L[n];if(!l||e.cut[n])return;ctx.save();ctx.translate(ox+l.px+(dx||0),oy+l.py+(dy||0));ctx.rotate(rot||0);ctx.scale(sx||1,sy||1);ctx.drawImage(l.c,-l.px,-l.py);ctx.restore();};
  const flap=Math.sin(t*(e.flyer?.45:.08))*(e.flyer?.55:.12);
  D("tail",Math.sin(t*.1)*.2);D("wingL",-flap-wind*.3,0,0);D("wingR",flap+wind*.3,0,0);
  const step=mv?Math.sin(t*.3):0;
  if(r.L.legs){ctx.save();ctx.beginPath();ctx.rect(ox,oy,S/2,S);ctx.clip();D("legs",0,0,step>0?-step*2:0);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(0,oy,S/2,S);ctx.clip();D("legs",0,0,step<0?step*2:0);ctx.restore();}
  D("body",0,0,mv&&!e.flyer?-Math.abs(step)*1:0,1-sq*.6,1+sq);
  const armRot=cast?-1.6*cast:wind?-1.1*wind:lunge?1*lunge:Math.sin(t*(mv?.3:.06))*(mv?.25:.06);
  D("arm",armRot,0,0);
  D("head",(wind?-.12*wind:0)+(lunge?.12*lunge:0),Math.sin(t*.06+1)*.6,-sq*S*.3+(mv?-Math.abs(step)*1.2:0));
  ctx.filter="none";
  if(cast>0){ctx.globalCompositeOperation="lighter";const c=d.caster;ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${.5*cast})`;ctx.beginPath();ctx.arc(S*.2,oy+S*.25,3+cast*5,0,7);ctx.fill();ctx.globalCompositeOperation="source-over";}
  ctx.restore();ctx.globalAlpha=1;
  if(!e.dead&&(d.rare||d.big||(e.provoked&&e.hp<e.maxHp))){const y=e.y+e.h-S-4-flyH;ctx.fillStyle="#300";ctx.fillRect(e.x+e.w/2-12,y,24,3);ctx.fillStyle="#e44";ctx.fillRect(e.x+e.w/2-12,y,24*e.hp/e.maxHp,3);
    if(d.big||d.rare){ctx.font="bold 6px system-ui";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText(d.name,e.x+e.w/2,y-2);}}}
const _drawMob0=drawMob;drawMob=function(e){if(e.mon){if(e.dead&&e.flash<=0)return;return drawMon(e);}return _drawMob0(e);};
// ---- dragons redrawn in the same style (224x126 sheet; rig crops head/wings/tail) ----
function paintDragon(kind){const P2={fire:MPAL.red,frost:MPAL.ice,storm:MPAL.night,forest:MPAL.green}[kind];const belly={fire:MPAL.gold,frost:MPAL.steel,storm:MPAL.purple,forest:MPAL.moss}[kind];
  const W=112,H=63;const [c,g]=mcv(W,H);
  // tail (lower-left)
  g.strokeStyle=P2[0];g.lineWidth=8;g.lineCap="round";g.beginPath();g.moveTo(52,52);g.quadraticCurveTo(26,62,10,50);g.stroke();g.strokeStyle=P2[1];g.lineWidth=5;g.stroke();poly(g,[10,44,2,50,12,57],P2[2]);
  // wings (upper-right)
  poly(g,[62,30,80,2,110,6,104,18,110,28,96,26,98,36,84,32],P2[0]);poly(g,[64,30,80,8,104,10,98,20,90,22,88,30],P2[1]);g.strokeStyle=P2[0];g.lineWidth=1;for(const [a,b] of [[96,10],[92,20],[84,28]]){g.beginPath();g.moveTo(66,30);g.lineTo(a,b);g.stroke();}
  // body & legs
  shadeEll(g,62,44,22,14,P2);shadeEll(g,60,50,14,6,belly);shadeRect(g,46,50,8,10,P2);shadeRect(g,70,50,8,10,P2);g.fillStyle="#fff";for(const x of [46,49,70,73])g.fillRect(x,59,2,2);
  for(let i=0;i<5;i++)poly(g,[52+i*6,31,55+i*6,25,58+i*6,31],P2[2]);
  // neck + head (upper-left)
  g.strokeStyle=P2[0];g.lineWidth=10;g.beginPath();g.moveTo(48,40);g.quadraticCurveTo(36,30,28,22);g.stroke();g.strokeStyle=P2[1];g.lineWidth=7;g.stroke();
  shadeEll(g,22,18,13,10,P2);shadeEll(g,12,22,8,5,P2);poly(g,[26,10,36,2,30,12],"#f0e8d0");poly(g,[20,9,24,0,24,10],"#f0e8d0");
  eyes(g,20,15,0.01,2.2,true,"#f0c020");g.fillStyle="#3a0810";g.fillRect(5,24,12,2);g.fillStyle="#fff";g.fillRect(7,24,1,2);g.fillRect(11,24,1,2);g.fillStyle=MOL;g.fillRect(6,20,2,1);
  inkLayer(c);const [c2,g2]=mcv(W*2,H*2);g2.drawImage(c,0,0,W*2,H*2);return c2;}
// replace art once images have loaded
const _loadImages0=loadImages;loadImages=function(){return _loadImages0().then(()=>{for(const k of ["fire","frost","storm","forest"])IMG["dragon_"+k]=paintDragon(k);});};
// species name helper for bestiary
function monName(k){return (SPECIES[k]&&SPECIES[k].name)||k[0].toUpperCase()+k.slice(1);}
// lineup preview (for screenshot/testing)
function monLineup(){const ks=Object.keys(MONDEF);const cols=8;const cw=104,chh=104;const [c,g]=mcv(cols*cw,Math.ceil(ks.length/cols)*chh+20);g.fillStyle="#3a3e4a";g.fillRect(0,0,c.width,c.height);
  ks.forEach((k,i)=>{const r=monRig(k);const x=(i%cols)*cw,y=Math.floor(i/cols)*chh;const sc=Math.min(2,88/r.W);const ox=x+cw/2-r.W*sc/2,oy=y+90-r.H*sc;
    for(const n of ["tail","wingL","wingR","legs","body","arm","head"])if(r.L[n])g.drawImage(r.L[n].c,ox,oy,r.W*sc,r.H*sc);g.fillStyle="#fff";g.font="10px system-ui";g.textAlign="center";g.fillText(r.name,x+cw/2,y+101);});return c;}
