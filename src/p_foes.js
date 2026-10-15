// ===== GOBLINS & ORCS (hostile) =====
Object.assign(PARTDEF,{ear:["Goblin Ear","👂",7],tusk:["Orc Tusk","🦷",18],crude:["Crude Weapon","🗡️",10]});
for(const k of ["ear","tusk","crude"]){const [n,ic,p]=PARTDEF[k];ITEMS[k]={n,p,ic,part:1};ITEMS[k+"+"]={n:"Fine "+n,p:Math.round(p*2.2),ic,part:1,fine:1};}
Object.assign(SPECIES,{
 goblin:{base:"grunt",beh:"agg",hp:3,aggro:110,biome:["forest","meadow"],gold:[2,6],chibi:"gob",race:"goblin",spdM:1.5,thief:1},
 gslinger:{base:"spitter",beh:"agg",hp:2,aggro:140,biome:["forest","meadow"],gold:[2,6],chibi:"gsling",race:"goblin"},
 shaman:{base:"spitter",beh:"agg",hp:4,aggro:150,biome:["forest","mountain"],gold:[6,12],chibi:"shaman",race:"goblin",magic:1},
 orc:{base:"grunt",beh:"agg",hp:7,aggro:110,biome:["mountain","forest"],gold:[5,10],chibi:"orc",race:"orc",scale:1.35,dmg:2},
 orcclub:{base:"charger",beh:"agg",hp:8,aggro:110,biome:["mountain"],gold:[5,10],chibi:"orcclub",race:"orc",scale:1.35},
 warchief:{base:"boss",beh:"agg",hp:22,aggro:150,gold:[50,80],chibi:"chief",race:"orc",scale:1.7,dmg:2,elite:1},
});
Object.assign(PART_DROPS,{goblin:["ear","ear","crude"],gslinger:["ear","crude"],shaman:["ear","core"],orc:["tusk","crude","hide"],orcclub:["tusk","crude"],warchief:["tusk","crude","gem"]});
Object.assign(BEST_DESC,{goblin:"Small, fast pack raiders with daggers. They steal!",gslinger:"Goblins that pelt you with sling stones.",shaman:"Goblin spellcasters crackling with dark magic.",orc:"Big brutes with axes.",orcclub:"Orc bruisers that charge with clubs.",warchief:"Elite orc leaders of war camps."});
const CAMPS=[{x:70,y:90,name:"Goblin Camp",chief:false},{x:180,y:96,name:"Orc Fort",chief:true},{x:44,y:236,name:"Thornwood Camp",chief:true},{x:200,y:180,name:"Ridge Camp",chief:false},{x:100,y:310,name:"Bog Goblin Camp",chief:false},{x:380,y:296,name:"Dune Raider Fort",chief:true},{x:420,y:118,name:"Frost Orc Hold",chief:true},{x:262,y:296,name:"Reedside Camp",chief:false}];
function genCamps(){for(const c of CAMPS){for(let y=-4;y<=4;y++)for(let x=-5;x<=5;x++){const i=(c.y+y)*WW+c.x+x;if(Math.hypot(x,y*1.2)>5.2)continue;ELEV[i]=0;
    const edge=Math.hypot(x,y*1.2)>4.3;T[i]=edge&&!(y>=2&&Math.abs(x)<=1)&&!(y<=-2&&Math.abs(x)<=1)?WALL:ROAD;OCC[i]=0;}}}
function campTick(){for(const c of CAMPS){const k="camp_"+c.x;if((world[k]||0)>world.day)continue;if(mobs.some(m=>m.camp===c.x))continue;
  if(Math.hypot(hero.x-c.x*TILE,hero.y-c.y*TILE)>420)continue;const list=c.chief?["orc","orcclub","shaman","goblin","goblin"]:["goblin","goblin","gslinger","shaman","goblin"];
  list.forEach((sp,i)=>spawnMob(sp,(c.x-2+i)*TILE,(c.y-1+(i%2))*TILE,{persist:true,camp:c.x}));if(c.chief)spawnMob("warchief",c.x*TILE,(c.y-2)*TILE,{persist:true,camp:c.x,chiefOf:c.x});}}
function foeSetup(e,d){if(d.hp)e.hp=e.maxHp=d.hp;if(d.dmg)e.dmg=d.dmg;if(d.spdM)e.spd*=d.spdM;if(d.scale){e.w=Math.round(12*d.scale);e.h=Math.round(12*d.scale);}
  e.chibi={...chibiLook(e.x*7+e.y|0,d.chibi,d.race),skin:d.race==="orc"?[100,160,75]:[150,200,80],style:d.race==="orc"?"bald":"spiky",beard:false};e.cdir=0;}
function drawFoe(e){const d=e.def,sc=d.scale||1;const t=frameN+(e.x|0);const mv=Math.abs(e.x-(e.px||e.x))+Math.abs(e.y-(e.py||e.y))>0.05;e.cdir=dir4(e.x-(e.px||e.x),e.y-(e.py||e.y),e.cdir);e.px=e.x;e.py=e.y;
  const dying=e.dead?clamp(1-e.flash/(e.type==="boss"?12:8),0,1):0;drawShadow(e.x+e.w/2,e.y+e.h,6*sc,2.5*sc);
  const L=e.parts.arm===false||e.parts.arms===false?{...e.chibi,noArm:true}:e.chibi;
  let fr=mv?(Math.floor(t/8)%2?1:2):0;if(e.parts.legs===false)fr=3;if(e.state==="windup"||e.state==="slam"||e.atkCd>30)fr=4;
  ctx.save();ctx.translate(Math.floor(e.x+e.w/2),Math.floor(e.y+e.h+1));if(dying){ctx.rotate(dying*1.3);ctx.globalAlpha=1-dying*.6;}
  const bob=mv?-Math.abs(Math.sin(t*.3))*1.2:Math.sin(t*.07)*.5;if(e.flash>0&&!e.dead)ctx.filter="brightness(2.2)";
  const s=chibi(L,e.cdir,fr);ctx.drawImage(s,-CW*sc/2,-CHH*sc+bob,CW*sc,CHH*sc);ctx.filter="none";ctx.restore();ctx.globalAlpha=1;
  if(d.elite&&!e.dead){ctx.fillStyle="#200";ctx.fillRect(e.x-4,e.y-CHH*sc+e.h-6,e.w+8,4);ctx.fillStyle="#e33";ctx.fillRect(e.x-3,e.y-CHH*sc+e.h-5,(e.w+6)*e.hp/e.maxHp,2);}}
function goblinSteal(e){if(!e.def.thief||e.stolen)return;const ks=Object.keys(P.inv).filter(k=>P.inv[k]>0&&k!=="amulet");if(ks.length&&Math.random()<0.5){const k=pick(ks);P.inv[k]--;e.stolen=k;toast(`A goblin stole your ${ITEMS[k].n}! Get it back!`);}
  else if(P.gold>0){const g=Math.min(P.gold,5+Math.floor(Math.random()*10));P.gold-=g;e.stolenGold=g;e.stolen="gold";toast(`A goblin snatched ${g} gold!`);}e.state="flee";}
