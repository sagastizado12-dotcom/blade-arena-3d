// ===== LEVEL GROWTH: max HP / MP rise each level and refill =====
const hpGain=lv=>lv>=20?3:lv>=10?2:1, mpGain=lv=>lv>=20?14:lv>=10?10:6;
function hpForLv(lv){let s=6;for(let l=2;l<=lv;l++)s+=hpGain(l);return s;}
function mpForLv(lv){let s=100;for(let l=2;l<=lv;l++)s+=mpGain(l);return s+((P&&P.rank)||0)*15;}
function recomputeMax(){if(!P||!hero)return;const lv=P.lv||1;hero.maxHp=hpForLv(lv)+(P.extraHp||0);hero.hp=Math.min(hero.hp,hero.maxHp);if(P.mag){P.mag.max=mpForLv(lv);P.mag.mp=Math.min(P.mag.mp,P.mag.max);}try{updateHearts();}catch(_){}}
gainExp=function(n,x,y){if(!P)return;P.lv=P.lv||1;P.exp=(P.exp||0)+n;if(x!=null)floatText(x,y-10,"+"+n+" EXP","#9cff7a");
  while(P.exp>=expNeed(P.lv)){P.exp-=expNeed(P.lv);P.lv++;const h0=hero.maxHp,m0=P.mag?P.mag.max:0;recomputeMax();const dh=hero.maxHp-h0,dm=P.mag?P.mag.max-m0:0;
    hero.hp=hero.maxHp;if(P.mag)P.mag.mp=P.mag.max;updateHearts();SFX.chime();floatText(hero.x+6,hero.y-18,`LEVEL UP! +${dh} HP +${dm} MP`,"#ffe680");
    toast(`LEVEL UP! Level ${P.lv}: +${dh} HP +${dm} MP`);burst(hero.x+6,hero.y+6,[255,240,140],30,1.6,2);window.__lastLvUp={dh,dm};}};
{const _lg=loadGame;loadGame=function(){const r=_lg.apply(this,arguments);if(r)recomputeMax();return r;};}
{const _ck=checkRank;checkRank=function(){const r=_ck.apply(this,arguments);if(P&&P.mag){const mp=P.mag.mp;P.mag.max=mpForLv(P.lv||1);P.mag.mp=Math.min(Math.max(mp,0),P.mag.max);}return r;};}
