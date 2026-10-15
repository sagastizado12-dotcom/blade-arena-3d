// ===== BAG: select items, detail panel, contextual actions, quick-use slots =====
Object.assign(ITEMS,{
 potion:{...ITEMS.potion,n:"Health Potion",ic:"🧪",use:{hp:4},d:"A red tonic that restores 4 ♥."},
 mpot:{n:"Mana Potion",p:18,ic:"🔷",use:{mp:50},d:"Restores 50 MP."},
 tonic:{n:"Stamina Tonic",p:14,ic:"🍵",use:{stam:1},d:"Refills stamina; sprinting costs nothing for 60s."},
 stew:{n:"Fish Stew",p:16,ic:"🍲",food:50,use:{hp:2,buff:"def"},d:"Hearty stew. +2 ♥ and Defense up until evening."},
 roast:{n:"Roast Meat",p:16,ic:"🍖",food:50,use:{hp:2,buff:"atk"},d:"Juicy roast. +2 ♥ and Attack up until evening."},
 antidote:{n:"Antidote",p:12,ic:"🌿",use:{cure:1},d:"Cures poison and wards against it for 2 minutes."}});
for(const k of ["bread","pie","fish","meat","berry"])if(ITEMS[k]){ITEMS[k].use=ITEMS[k].use||{hp:k==="pie"?2:1};ITEMS[k].ic=ITEMS[k].ic||{bread:"🍞",pie:"🥧",fish:"🐟",meat:"🥩",berry:"🫐"}[k];}
ITEMS.axe.ic="🪓";ITEMS.axe.equip="axe";ITEMS.axe.d="Chops trees faster.";
for(const k of ["mpot","tonic","antidote"])if(!SHOP_ITEMS.includes(k))SHOP_ITEMS.push(k);
const ITEM_DESC={wood:"Building material for crafts and repairs.",herb:"A medicinal herb.",gem:"A precious gem. Sells well.",pearl:"A lustrous pearl.",flowers:"A lovely gift.",ring:"For a proposal.",pelt:"Animal pelt for tailors."};
const isConsumable=k=>!!(ITEMS[k]&&ITEMS[k].use);
let curShop=null,curChest=null;
const _shopMenuB=shopMenu;shopMenu=function(sid){const ws=world.sets[sid];for(const k of SHOP_ITEMS)if(ws.stock[k]==null)ws.stock[k]=5;curShop={sid,x:hero.x,y:hero.y};_shopMenuB(sid);
  const m=document.querySelector("#menu .mbtns");if(m&&!m.querySelector(".sellbag")){const b=document.createElement("button");b.className="sellbag";b.textContent="Sell from bag";b.onclick=e=>{e.stopPropagation();bagMenu();};m.insertBefore(b,m.lastChild);}};
const _homeStorageB=homeStorage;homeStorage=function(b){curChest={b,x:hero.x,y:hero.y};return _homeStorageB(b);};
const nearCtx=c=>c&&Math.hypot(c.x-hero.x,c.y-hero.y)<48;
function useItem(k,quiet){const it=ITEMS[k];if(!it||!it.use||!(P.inv[k]>0))return false;const u=it.use;P.inv[k]--;const fx=[];
  if(u.hp){const h0=hero.hp;hero.hp=Math.min(hero.maxHp,hero.hp+u.hp);updateHearts();fx.push("+"+(hero.hp-h0)+" HP");floatText(hero.x+6,hero.y-10,"+"+(hero.hp-h0)+"♥","#ff7a8a");}
  if(u.mp&&P.mag){const m0=P.mag.mp;P.mag.mp=Math.min(P.mag.max,P.mag.mp+u.mp);fx.push("+"+Math.round(P.mag.mp-m0)+" MP");floatText(hero.x+6,hero.y-18,"+"+Math.round(P.mag.mp-m0)+" MP","#7ab8ff");}
  if(u.stam){hero.stam=100;P.tonicUntil=performance.now()+60000;fx.push("Stamina full");}
  if(u.cure){hero.poison=0;P.wardUntil=performance.now()+120000;fx.push("Cured");}
  if(u.buff){P.buff={k:u.buff,until:world.day*1440+20*60};fx.push((u.buff==="atk"?"Attack":"Defense")+" up");}
  if(it.food)P.hunger=Math.min(100,(P.hunger||0)+it.food);
  burst(hero.x+6,hero.y+4,[140,255,160],10,1,2);SFX.chime&&SFX.chime();if(!quiet)toast(`${it.n}: ${fx.join(", ")||"used"}`);updateQuick();updateBuffs();return true;}
// tonic: free sprinting
const _updMain=update;update=function(){const t=P&&P.tonicUntil>performance.now();const s0=hero&&hero.stam;_updMain();if(t&&hero&&hero.sprinting)hero.stam=Math.max(hero.stam,s0);if(frameN%30===0)updateBuffs();};
function toggleEquip(k){P.eqOff=P.eqOff||{};if(k==="axe"){if(P.eqOff.axe){P.inv.axe=(P.inv.axe||0)+P.eqOff.axe;P.eqOff.axe=0;toast("Axe equipped.");}else{P.eqOff.axe=P.inv.axe;P.inv.axe=0;toast("Axe unequipped.");}return;}
  if(P.eqOff[k]!=null){P.gear[k]=P.eqOff[k];delete P.eqOff[k];toast("Equipped.");}else{P.eqOff[k]=P.gear[k];P.gear[k]=k==="sword"||k==="armor"?0:false;toast("Unequipped.");}
  if(k==="heart"){updateHearts();}}
function bagEntries(){const L=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]).map(k=>({k,n:P.inv[k]}));
  if(P.eqOff&&P.eqOff.axe)L.push({k:"axe",n:P.eqOff.axe,off:1});
  const G=P.gear||{};for(const [g,nm,ic] of [["sword","Sword","🗡"],["armor","Armor","🛡"],["focus","Focus Charm","🔮"],["swift","Swift Charm","🪶"],["heart","Wyrmheart Charm","❤"]]){const off=P.eqOff&&P.eqOff[g]!=null;if(G[g]||off)L.push({k:"gear:"+g,g,nm:nm+(g==="sword"?` +${off?P.eqOff[g]:G[g]}`:g==="armor"?` ${off?P.eqOff[g]:G[g]}`:""),ic,n:1,off,gear:1});}
  return L;}
function bagMenu(sel){const L=bagEntries();const e=sel&&L.find(x=>x.k===sel);P.quick=P.quick||[null,null];
  let body="Tap an item to select it.";const btn=[];
  if(e){const it=e.gear?{n:e.nm,ic:e.ic,d:"Crafted gear."}:ITEMS[e.k];body=`${it.ic||"•"}  ${it.n}${e.gear?"":"  ×"+e.n}${e.off?"  (unequipped)":e.gear||e.k==="axe"?"  (equipped)":""}\n${it.d||ITEM_DESC[e.k]||(it.part?"Monster part for crafting.":it.food?"Food.":"")}${it.p?"\nValue: "+it.p+"g":""}`;
    if(isConsumable(e.k)){btn.push({l:it.food&&!it.use.mp?"Eat":"Use",cls:"act",f:()=>{useItem(e.k);bagMenu(P.inv[e.k]>0?e.k:null);}});
      for(const i of [0,1])btn.push({l:P.quick[i]===e.k?`Remove from quick slot ${i+1}`:`Set quick slot ${i+1}`,f:()=>{P.quick[i]=P.quick[i]===e.k?null:e.k;updateQuick();bagMenu(e.k);}});}
    if(e.gear||e.k==="axe")btn.push({l:e.off?"Equip":"Unequip",cls:"act",f:()=>{toggleEquip(e.gear?e.g:"axe");bagMenu(e.k);}});
    if(!e.gear&&!e.off){btn.push({l:"Drop one",f:()=>{P.inv[e.k]--;toast("Dropped "+ITEMS[e.k].n+".");bagMenu(P.inv[e.k]>0?e.k:null);}});
      if(nearCtx(curShop)&&ITEMS[e.k].p)btn.push({l:`Sell for ${Math.max(1,Math.round(ITEMS[e.k].p*0.6))}g`,f:()=>{P.inv[e.k]--;const g=Math.max(1,Math.round(ITEMS[e.k].p*0.6));P.gold+=g;floatText(hero.x,hero.y-10,"+"+g+"g","#ffd84a");bagMenu(P.inv[e.k]>0?e.k:null);}});
      if(nearCtx(curChest))btn.push({l:"Store in chest",f:()=>{P.homeStore=P.homeStore||{};const st=P.homeStore[curChest.b.id]=P.homeStore[curChest.b.id]||{};st[e.k]=(st[e.k]||0)+1;P.inv[e.k]--;bagMenu(P.inv[e.k]>0?e.k:null);}});}
    btn.push({l:"◂ Deselect",f:()=>bagMenu()});}
  const list=L.map(x=>{const it=x.gear?{n:x.nm,ic:x.ic}:ITEMS[x.k];return{l:`${it.ic||"•"} ${it.n}${x.gear?"":" ×"+x.n}${x.off?" (off)":""}${P.quick.includes(x.k)?" ⚡":""}`,cls:"job item"+(x.k===sel?" sel":""),f:()=>bagMenu(x.k)};});
  showMenu("Bag",body,btn.concat(list.length?list:[{l:"(empty)",dis:true}]).concat([{l:"More…",f:()=>_invMenuB()},{l:"Close"}]));
  const s=document.querySelector("#menu button.sel");if(s&&!e)s.scrollIntoView({block:"nearest"});}
const _invMenuB=invMenu;invMenu=function(){bagMenu();};
// quick-use slots in the top-left row + active buff icons
function updateQuick(){const tl=document.getElementById("tl");if(!tl||!P)return;P.quick=P.quick||[null,null];
  for(const i of [0,1]){let b=document.getElementById("qs"+i);if(!b){b=document.createElement("button");b.id="qs"+i;b.className="rb qs";b.addEventListener("click",ev=>{ev.stopPropagation();const k=P.quick[i];if(!k)return bagMenu();if(!useItem(k))toast("None left: "+ITEMS[k].n);});b.addEventListener("touchstart",ev=>ev.stopPropagation(),{passive:true});tl.appendChild(b);}
    const k=P.quick[i];b.innerHTML=k?`${ITEMS[k].ic||"•"}<sub>${P.inv[k]||0}</sub>`:"";b.classList.toggle("empty",!k);b.style.opacity=k&&!(P.inv[k]>0)?.45:1;b.setAttribute("aria-label",k?"Quick use "+ITEMS[k].n:"Empty quick slot");}
  if(typeof layoutHUD==="function"&&!updateQuick._l){updateQuick._l=1;layoutHUD();}}
function updateBuffs(){let el=document.getElementById("buffs");if(!el){el=document.createElement("div");el.id="buffs";document.body.appendChild(el);}if(!P||!hero)return;const now=performance.now(),ic=[];
  if(P.buff&&P.buff.until>world.day*1440+world.min)ic.push(P.buff.k==="atk"?"⚔️":P.buff.k==="def"?"🛡":"✨");if(P.tonicUntil>now)ic.push("🍵");if(P.wardUntil>now)ic.push("🌿");if(hero.regenT>0)ic.push("💚");
  const h=ic.join("");if(el.textContent!==h)el.textContent=h;const hl=document.getElementById("hudL");if(hl){const r=hl.getBoundingClientRect();el.style.left=r.left+"px";el.style.top=(r.bottom+4)+"px";}}
{const st=document.createElement("style");st.textContent=`#tl .qs{position:relative;font-size:16px}#tl .qs.empty{background:rgba(20,12,6,.35)!important;border:2px dashed #c8902c99!important;box-shadow:inset 0 0 6px #0008!important;opacity:.8!important}#tl .qs sub{position:absolute;right:3px;bottom:1px;font-size:10px;color:#fff;text-shadow:0 1px 2px #000}
#buffs{position:fixed;z-index:30;font-size:16px;pointer-events:none;letter-spacing:2px;filter:drop-shadow(0 1px 1px #000)}
.mbtns button.item.sel{outline:2px solid #ffd84a;background:#5a4420!important}.mbtns button.act{background:#2a6a3a!important}.mbtns button.sellbag{background:#6a5020!important}`;document.head.appendChild(st);}
const _buildHUDB=buildHUD;buildHUD=function(){_buildHUDB();setTimeout(()=>{updateQuick();updateBuffs();},0);};
setTimeout(()=>{try{updateQuick();}catch(e){}},0);
