// ===== GUILD BUYS MONSTER PARTS + KILL GUILD POINTS =====
const GUILD_BONUS=1.25;
function partRarity(k){const b=k.replace("+","");return (/^d(scale|horn|heart)$/.test(b)?1.6:1)*(ITEMS[k]&&ITEMS[k].fine?1.15:1);}
function guildPartPrice(k){const it=ITEMS[k];if(!it||!it.part)return 0;return Math.max(1,Math.round(it.p*0.5*GUILD_BONUS*partRarity(k)));}
function sellableParts(){return Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]&&ITEMS[k].part).sort((a,b)=>guildPartPrice(b)-guildPartPrice(a));}
function sellPart(k,n){const have=P.inv[k]||0;n=Math.min(n,have);if(n<=0)return 0;const g=guildPartPrice(k)*n;P.inv[k]-=n;if(P.inv[k]<=0)delete P.inv[k];P.gold+=g;try{SFX.coin();}catch(_){}return g;}
function partSellMenu(back){const ks=sellableParts();
  const btns=[];for(const k of ks){const it=ITEMS[k],pr=guildPartPrice(k);
    btns.push({l:`${it.ic||"•"} ${it.n} ×${P.inv[k]}: ${pr}g each`,cls:"job",f:()=>{const g=sellPart(k,1);toast(`Sold ${it.n} for ${g}g.`);partSellMenu(back);}});
    if(P.inv[k]>1)btns.push({l:`   ↳ Sell all ${P.inv[k]} (${pr*P.inv[k]}g)`,f:()=>{const c=P.inv[k];const g=sellPart(k,c);toast(`Sold ${c} ${it.n} for ${g}g.`);partSellMenu(back);}});}
  if(ks.length>1)btns.push({l:`Sell ALL parts (${ks.reduce((s,k)=>s+guildPartPrice(k)*P.inv[k],0)}g)`,f:()=>{let g=0;for(const k of ks)g+=sellPart(k,P.inv[k]);toast(`Sold every part for ${g}g.`);partSellMenu(back);}});
  btns.push({l:"Back",f:back});
  showMenu("Sell Monster Parts",`The guild pays ${Math.round((GUILD_BONUS-1)*100)}% over shop prices for monster parts.\nYou have ${P.gold}g.${ks.length?"":"\n\nYou carry no monster parts."}`,btns);saveGame&&saveGame();}
function withSellBtn(fn,backFn){return function(sid){const sm=showMenu;showMenu=function(t,txt,b){if(Array.isArray(b)){const i=Math.max(0,b.length-1);b=b.slice();b.splice(i,0,{l:"💰 Sell Monster Parts",cls:"sellparts",f:()=>partSellMenu(()=>backFn(sid))});}showMenu=sm;return sm(t,txt,b);};try{return fn(sid);}finally{showMenu=sm;}};}
{const _g=guildMenu;guildMenu=withSellBtn(_g,s=>guildMenu(s));const _b=boardMenu;boardMenu=withSellBtn(_b,s=>boardMenu(s));}
// --- kill guild points ---
function killGP(e){const d=e.def||{};if(e.sp==="dragon"||/dragon/.test(e.sp||""))return 60;
  const hp=e.maxHp||d.hp||1;let p=Math.max(1,Math.round(hp/2.2));p+=(d.tier||1)-1;if(d.elite)p+=8;if(d.rare)p+=6;if(d.boss||e.sp==="boss")p+=12;return Math.min(45,p);}
const _onKillGP=onKill;onKill=function(e){_onKillGP(e);try{const g=guild();const d=e.def||{};const nm=d.name||(typeof monName==="function"&&monName(e.sp))||e.sp;
  g.kills=g.kills||{};g.kills[nm]=(g.kills[nm]||0)+1;if(!g.reg||e._byGuard)return;
  let n=killGP(e);if(g.rank>=3&&n<=2&&e.sp!=="dragon")n=Math.random()<0.5?1:0; // weak prey barely counts for veterans
  if(n<=0)return;g.pts+=n;g.killPts=(g.killPts||0)+n;floatText(e.x+(e.w||12)/2,e.y-16,"+"+n+" GP","#8fd0ff");window.__lastGP=n;guildRankUp();}catch(_){}};
{const _gc=guildCard;guildCard=function(){const g=guild();let s=_gc();if(!g.reg)return s;const k=Object.entries(g.kills||{}).sort((a,b)=>b[1]-a[1]);
  return s+`\nPoints from kills: ${g.killPts||0}\nKills by type: `+(k.length?k.map(([n,c])=>`${n} ×${c}`).join(", "):"none");};}
