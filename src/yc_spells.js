// ===== SPELL PROGRESSION: levels, stats, perks (skill tree) =====
const SPELL_INFO={
 fireball:{desc:"Hurls a blazing orb that explodes on impact, scorching every foe nearby.",stat:lv=>`Damage ${2+Math.floor(lv/2)} · blast radius ${26+Math.round((4+lv*.5)*2)}px`},
 thunder:{desc:"Fires a lightning bolt where you face. It chains to nearby foes on hit and shatters enemy bolts.",stat:lv=>`Damage ${2+Math.floor(lv/2)} · ${Math.min(5,2+Math.floor((lv-1)/3))} chain jumps`},
 heal:{desc:"A warm golden light that restores your HP and mends nearby party members.",stat:lv=>`Heals ${2+Math.floor(lv/2)} HP`},
 air:{desc:"Throws a razor wind blade that flies straight ahead.",stat:lv=>`Damage ${1+Math.floor(lv/2)} · speed 4.6`},
};
const PERKS={
 fireball:[{id:"split",lv:3,n:"Split Fire",d:"Fire splits into 3 orbs in a fan."},{id:"big",lv:6,n:"Wildfire",d:"Explosions are 40% larger."},{id:"inferno",lv:9,n:"Inferno",d:"+2 damage."}],
 thunder:[{id:"stun",lv:3,n:"Stunning Bolt",d:"Struck foes are stunned for 1.5s."},{id:"wide",lv:6,n:"Wide Arc",d:"Chains reach 30% farther."},{id:"over",lv:9,n:"Overcharge",d:"+2 damage."}],
 heal:[{id:"regen",lv:3,n:"Regeneration",d:"Also restores 1 HP every 2s for 10s."},{id:"group",lv:6,n:"Group Mend",d:"Fully heals party members in range."},{id:"purify",lv:9,n:"Purify",d:"+2 healing and cures poison."}],
 air:[{id:"pierce",lv:3,n:"Piercing Gale",d:"Air Slash pierces through every foe."},{id:"twin",lv:6,n:"Twin Slash",d:"Fires two blades."},{id:"gale",lv:9,n:"Tempest",d:"+1 damage and strong knockback."}],
};
const hasPerk=(k,id)=>!!(P.mag.perks&&P.mag.perks[k]&&P.mag.perks[k].includes(id));
const XPL=8;const spellXpInfo=k=>{const x=P.mag.xp[k]||0;return{lv:spellLv(k),cur:x%XPL,need:XPL};};
const _castSpellP=castSpell;castSpell=function(k){k=k||curSpell;const n0=fx.length;const ok=_castSpellP(k);if(!ok)return ok;const lv=spellLv(k);const made=fx.slice(n0);
  if(k==="fireball"){for(const f of made){if(f.k!=="fireball")continue;if(hasPerk(k,"inferno"))f.dmg+=2;if(hasPerk(k,"big"))f.r*=1.4;
      if(hasPerk(k,"split")){const a=Math.atan2(f.vy,f.vx),sp=Math.hypot(f.vx,f.vy);for(const da of [-0.3,0.3])fx.push({...f,vx:Math.cos(a+da)*sp,vy:Math.sin(a+da)*sp,split:1});}}}
  if(k==="air"){for(const f of made){if(f.k!=="air")continue;f.pierce=hasPerk(k,"pierce");if(hasPerk(k,"gale")){f.dmg+=1;f.gale=1;}
      if(hasPerk(k,"twin")){const nx=-Math.sin(f.ang)*8,ny=Math.cos(f.ang)*8;fx.push({...f,x:f.x+nx,y:f.y+ny,hit:new Set()});f.x-=nx;f.y-=ny;}}}
  if(k==="thunder"){const tb=tbolts[tbolts.length-1];if(ok&&tb&&!tb.perk){tb.perk=1;tb.stun=hasPerk(k,"stun");if(hasPerk(k,"wide"))tb.range=1.3;if(hasPerk(k,"over"))tb.dmg+=2;}}
  if(k==="heal"){if(hasPerk(k,"purify")){hero.hp=Math.min(hero.maxHp,hero.hp+2);hero.poison=0;updateHearts();}if(hasPerk(k,"regen"))hero.regenT=600;
    if(hasPerk(k,"group"))for(const n of partyMembers())if(n.adv&&Math.hypot(n.x-hero.x,n.y-hero.y)<160)n.adv.hp=n.adv.max||n.adv.hp;}
  return ok;};
const _updateMagicP=updateMagic;updateMagic=function(){_updateMagicP();if(hero.regenT>0){hero.regenT--;if(hero.regenT%120===0&&hero.hp<hero.maxHp){hero.hp++;updateHearts();floatText(hero.x+6,hero.y-8,"+1","#7dff8a");}}
  for(const e of mobs){if(e.stun>0){e.stun--;e.vx=0;e.vy=0;if(e.stun%20===0)burst(e.x+e.w/2,e.y,[255,240,120],3,0.6,1);}}
  for(const f of fx)if(f.gale&&f.hit)for(const e of f.hit)if(!e.galed){e.galed=1;e.knockVx=(e.knockVx||0)+Math.cos(f.ang)*4;e.knockVy=(e.knockVy||0)+Math.sin(f.ang)*4;e.knockT=12;}};
function spellsMenu(sel){const m=P.mag;m.perks=m.perks||{};sel=sel||null;
  if(sel){const s=SPELLS[sel],xi=spellXpInfo(sel),bar="▰".repeat(Math.round(xi.cur/xi.need*10))+"▱".repeat(10-Math.round(xi.cur/xi.need*10));const info=SPELL_INFO[sel];
    const nxt=info.stat(xi.lv+1);const tree=PERKS[sel].map(p=>`${hasPerk(sel,p.id)?"★":xi.lv>=p.lv?"☆":"🔒"} Lv${p.lv} ${p.n} — ${p.d}`).join("\n");
    showMenu(`${s.ic} ${s.n} — Lv ${xi.lv}`,`${info.desc}\n\nXP ${bar} ${xi.cur}/${xi.need}\n${info.stat(xi.lv)}\nMana ${s.mp} · Cooldown ${(SPCDMS(sel)/1000).toFixed(1)}s\nNext level: ${nxt}\n\nUpgrade path:\n${tree}`,
      PERKS[sel].filter(p=>!hasPerk(sel,p.id)).map(p=>({l:`Unlock ${p.n} (Lv ${p.lv})`,cls:"perk",dis:xi.lv<p.lv,f:()=>{(m.perks[sel]=m.perks[sel]||[]).push(p.id);SFX.chime();toast("Perk unlocked: "+p.n+"!");saveGame();spellsMenu(sel);}}))
      .concat([{l:"◂ All spells",f:()=>spellsMenu()},{l:"Close"}]));return;}
  showMenu("Spells","Your four spells grow stronger every time you cast them. Milestone levels unlock perks.",SPELL_ORDER.map(k=>{const xi=spellXpInfo(k),s=SPELLS[k];const np=PERKS[k].filter(p=>!hasPerk(k,p.id)&&xi.lv>=p.lv).length;
    return{l:`${s.ic} ${s.n}  Lv ${xi.lv}  [${"▰".repeat(Math.round(xi.cur/xi.need*6))}${"▱".repeat(6-Math.round(xi.cur/xi.need*6))}]  ${s.mp} MP${np?"  ✦ perk ready":""}`,cls:"job",f:()=>spellsMenu(k)};}).concat([{l:"Close"}]));}
