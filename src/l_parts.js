// ===== MONSTER PARTS, GEAR CRAFTING, BESTIARY =====
const PARTDEF={fang:["Fang","🦷",9],claw:["Claw","🐾",9],horn:["Horn","📯",12],hide:["Hide","🟫",8],scale:["Scale","🐚",14],wing:["Wing","🪶",16],tail:["Tail","〰️",11],
  eye:["Eye","👁️",13],core:["Core","🔮",22],dscale:["Dragon Scale","🐉",140],dhorn:["Dragon Horn","🔱",220],dheart:["Dragon Heart","❤️‍🔥",400]};
for(const k in PARTDEF){const [n,ic,p]=PARTDEF[k];if(!ITEMS[k])ITEMS[k]={n,p};ITEMS[k].ic=ic;ITEMS[k].part=1;ITEMS[k+"+"]={n:"Fine "+n,p:Math.round(p*2.2),ic,part:1,fine:1};}
ITEMS.horn.n="Horn";const ICONS={bread:"🍞",meat:"🍖",fish:"🐟",berry:"🫐",herb:"🌿",pelt:"🟫",trinket:"🪙",gem:"💎",pearl:"⚪",scale:"🐉",potion:"🧪",flowers:"💐",ring:"💍",amulet:"📿",pie:"🥧",wood:"🪵",axe:"🪓"};
for(const k in ICONS)if(ITEMS[k]&&!ITEMS[k].ic)ITEMS[k].ic=ICONS[k];
const PART_DROPS={goblin:["fang","fang","eye"],crawler:["claw","tail"],spitter:["eye","core"],charger:["horn","hide"],scorchrat:["fang","hide"],umbrawl:["claw","eye"],gloomote:["core","eye"],
 thornback:["hide","claw"],voltusk:["horn","hide"],puffalo:["hide"],fluffin:["hide"],mossnail:["core"],sprigling:["core"],lilyleap:["eye"],pondhop:["eye"],grovegiant:["core","gem"],tidemaw:["scale","fang"],boss:["horn","core","gem"],dragon:["dscale","dscale","dhorn"]};
const SEVER_PART={arm:"claw",arms:"claw",legs:"claw",tail:"tail",horns:"horn",head:"fang",wings:"wing"};
const BEST_DESC={goblin:"Cunning raiders of the woods.",crawler:"Skittering forest hunters with whip tails.",spitter:"Spits acid from range in rocky places.",charger:"Horned brutes that charge in straight lines.",
 scorchrat:"Ember-furred pests of the plains.",umbrawl:"Shadow prowlers that hunt at night.",gloomote:"Haunting spirits of the ruins.",thornback:"Calm unless provoked.",voltusk:"Migrating herds crackling with static.",
 puffalo:"Gentle grazers.",fluffin:"Timid fluffballs.",mossnail:"Slow and harmless.",sprigling:"Shy forest sprites.",lilyleap:"Shoreline hoppers.",pondhop:"Pond frogs with big eyes.",grovegiant:"Rare ancient forest giant.",
 tidemaw:"Rare sea terror of the coasts.",boss:"Ruin Warden, guardian of old stones.",dragon:"Apex wyrms. Rare parts of immense value."};
function bestiary(sp){if(!P.best)P.best={};if(!P.best[sp])P.best[sp]={seen:1,kills:0,parts:{}};return P.best[sp];}
function dropPart(e,item,fine){const k=fine?item+"+":item;pickups.push({x:e.x+e.w/2+(Math.random()-.5)*14,y:e.y+e.h+(Math.random()-.5)*6,item:k,t:0,sp:e.sp});}
function onSever(e,partName){const it=e.sp==="dragon"?(partName==="horns"?"dhorn":partName==="wings"?"wing":"tail"):SEVER_PART[partName];if(!it)return;
  dropPart(e,it,true);toast("Clean sever! A fine "+ITEMS[it].n.toLowerCase()+" drops.");}
function killDrops(e){const tbl=PART_DROPS[e.sp];if(!tbl)return;const b=bestiary(e.sp);b.kills++;
  dropPart(e,pick(tbl),false);if(Math.random()<0.3)dropPart(e,pick(tbl),false);
  if(e.sp==="dragon"){dropPart(e,"dscale",false);if(Math.random()<0.5)dropPart(e,"dheart",false);}}
let swordDmg=()=>1+((P.gear&&P.gear.sword)||0);
const RECIPES=[
 {id:"fangsword",n:"Fang Sword (sword +1)",need:{fang:1,wood:3},f:()=>{P.gear.sword=Math.max(P.gear.sword,1);}},
 {id:"drakeblade",n:"Drake Blade (sword +3)",need:{dscale:2,dhorn:1,wood:5},f:()=>{P.gear.sword=Math.max(P.gear.sword,3);}},
 {id:"hidearmor",n:"Hide Armor (+2 max ♥)",need:{hide:3,wood:2},f:()=>{if(P.gear.armor<1){hero.maxHp+=2-(P.gear.armor?0:0);P.gear.armor=1;}}},
 {id:"scalearmor",n:"Scale Armor (+4 max ♥)",need:{scale:3,core:1},f:()=>{if(P.gear.armor<2){hero.maxHp+=P.gear.armor===1?2:4;P.gear.armor=2;}}},
 {id:"hornaxe",n:"Horn Axe (1-hit chopping)",need:{horn:2,wood:3},f:()=>{P.gear.axe=2;P.inv.axe=(P.inv.axe||0)+1;}},
 {id:"focus",n:"Spell Focus (+30 mana, spells +1)",need:{core:2,eye:1,wood:2},f:()=>{if(!P.gear.focus){P.gear.focus=1;P.mag.max+=30;}}},
 {id:"swift",n:"Charm of Swiftness (+12% speed)",need:{claw:2,gem:1},f:()=>{P.gear.swift=1;}},
 {id:"heart",n:"Wyrmheart Charm (+3 max ♥)",need:{dheart:1},f:()=>{if(!P.gear.heart){P.gear.heart=1;hero.maxHp+=3;}}},
];
const have=k=>(P.inv[k]||0)+(ITEMS[k]&&ITEMS[k].part?(P.inv[k+"+"]||0):0);
function canCraft(r){return Object.entries(r.need).every(([k,n])=>have(k)>=n);}
function craftGear(id){const r=RECIPES.find(r=>r.id===id);if(!r||!canCraft(r))return false;if(!P.gear)P.gear={sword:0,armor:0};let fine=0,tot=0;
  for(const [k,n] of Object.entries(r.need))for(let i=0;i<n;i++){tot++;if(ITEMS[k].part&&(P.inv[k+"+"]||0)>0){P.inv[k+"+"]--;fine++;}else P.inv[k]--;}
  r.f();const master=fine>0&&fine>=tot-(r.need.wood||0);if(master){P.gear.master=(P.gear.master||0)+1;hero.maxHp+=1;}
  hero.hp=hero.maxHp;updateHearts();toast((master?"Masterwork! ":"Crafted: ")+r.n);SFX.chime();saveGame();return true;}
function gearMenu(){if(!P.gear)P.gear={sword:0,armor:0};showMenu("Forge & Workbench",`Sword +${P.gear.sword} · Armor ${P.gear.armor} · ${P.gear.focus?"Focus ":""}${P.gear.swift?"Swift ":""}${P.gear.heart?"Wyrmheart":""}\nFine parts make masterwork gear (+1 ♥).`,
  RECIPES.map(r=>({l:r.n+" — "+Object.entries(r.need).map(([k,n])=>`${n} ${ITEMS[k].ic||""}${ITEMS[k].n}`).join(", "),dis:!canCraft(r),f:()=>{craftGear(r.id);gearMenu();}})).concat([{l:"Wood crafts",f:craftMenu},{l:"Close"}]));}
function bestiaryMenu(){const ks=Object.keys(PART_DROPS);const b=P.best||{};
  showMenu("Bestiary",ks.map(k=>{const e=b[k];return e?`${monName(k)} · slain ${e.kills} · parts: ${PART_DROPS[k].filter((v,i,a)=>a.indexOf(v)===i).map(p=>ITEMS[p].ic).join(" ")}\n   ${BEST_DESC[k]||""}`:"??? (not yet encountered)";}).join("\n")+
  `\n\nDiscovered ${Object.keys(b).length}/${ks.length}`,[{l:"Close"}]);}
