// ===== NEAR-INVULNERABLE HERO: 10x HP, big growth, 65% damage resistance, regen, longer i-frames =====
const HERO_RESIST=0.65,HP_SCALE=10;let lastHurtF=-1e9,healWatch=null;
hpForLv=function(lv){let s=60;for(let l=2;l<=lv;l++)s+=l>=20?18:l>=10?12:8;return s;};
{const _hh=hurtHero;hurtHero=function(dmg,ang){if(hero.iframes>0||hero.dodgeT>0||hero.dead)return;let d=Math.max(1,Math.round(dmg*HP_SCALE*(1-HERO_RESIST)));d=Math.min(d,Math.max(1,Math.floor(hero.maxHp*0.4)));
  if(d>=hero.hp&&hero.hp>hero.maxHp*0.5)d=hero.hp-1; // never one-shot from healthy
  lastHurtF=frameN;healWatch=null;_hh(d,ang);if(!hero.dead){hero.iframes=Math.max(hero.iframes,70);floatText(hero.x+6,hero.y-10,"-"+d,"#ff6a6a");}healWatch=hero.hp;};}
const _updTough=update;update=function(){if(hero&&healWatch==null)healWatch=hero.hp;const before=hero?hero.hp:0;_updTough();if(!hero||state!=="play"||hero.dead)return;
  // scale small heals (food, potions, Heal spell, regen perks) to the new HP scale
  if(hero.hp>before&&hero.hp-before<=12&&!hero._regenTick){hero.hp=Math.min(hero.maxHp,before+(hero.hp-before)*HP_SCALE);try{updateHearts();}catch(_){}}
  hero._regenTick=false;const calm=frameN-lastHurtF>300&&frameN-(typeof lastMonHitF==="number"?lastMonHitF:-1e9)>300;
  if(calm&&hero.hp<hero.maxHp&&frameN%30===0){hero._regenTick=true;hero.hp=Math.min(hero.maxHp,hero.hp+Math.max(1,Math.round(hero.maxHp*0.01)));}};
{const _rs=resetHero;resetHero=function(){_rs.apply(this,arguments);hero.maxHp=hpForLv(1);hero.hp=hero.maxHp;};}
{const _nw=newWorld;newWorld=function(){const r=_nw.apply(this,arguments);if(hero){hero.maxHp=hpForLv(1)+(P.extraHp||0);hero.hp=hero.maxHp;}return r;};}
{const _lg=loadGame;loadGame=function(){const old=null;const r=_lg.apply(this,arguments);if(r&&hero){const m=hpForLv(P.lv||1)+(P.extraHp||0);if(hero.maxHp<m||hero.hp<=12&&m>=60){hero.maxHp=m;hero.hp=m;}try{updateHearts();}catch(_){}}return r;};}
