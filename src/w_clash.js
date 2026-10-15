// ===== MAGIC CLASHES =====
function elemOfCol(c){if(!c)return"arcane";const [r,g,b]=c;if(b>200&&r>140&&g<200)return"lightning";if(b>=200&&r<200)return"ice";if(r>200&&g<200&&b<120)return"fire";if(g>r&&g>b)return"earth";return"arcane";}
const FX_EL={fireball:"fire",air:"air"};
function projPow(p){return p.pow!=null?p.pow:(p.dmg||1)*(p.lv||1);}
function fxPow(f){return f.pow!=null?f.pow:(f.dmg||1);}
function clashFX(x,y,col,steam){burst(x,y,col,18,1.8,2);fx.push({k:"ring",x,y,r:2,max:16,life:16,col});if(steam)for(let i=0;i<14;i++)particles.push({x:x+(Math.random()-.5)*8,y,z:6,vx:(Math.random()-.5)*.6,vy:-.2-Math.random()*.4,vz:.6,life:40,max:40,col:[235,240,245],size:3,kind:"magic"});
  if(SFX.clash)SFX.clash(steam);}
SFX.clash=(steam)=>{try{tone(steam?330:520,0.35,{v:0.05,a:0.01});tone(steam?247:780,0.4,{v:0.035,delay:0.05,a:0.02});}catch(_){}};
let clashCount=0;
function updateClashes(){if(!projectiles.length)return;
  for(const p of projectiles){if(p.dead)continue;for(const w of walls){if(p.x>w.x-2&&p.x<w.x+w.w+2&&p.y>w.y-2&&p.y<w.y+w.h+2){p.dead=true;const el=elemOfCol(p.col);clashFX(p.x,p.y,el==="lightning"?[200,180,255]:[190,140,80],false);clashCount++;break;}}}
  // projectile vs projectile
  for(const f of fx){if(f.life<=0||!FX_EL[f.k]&&!f.ally)continue;const fe=f.ally?"ice":FX_EL[f.k];
    for(const p of projectiles){if(p.dead||p.friendly)continue;if(Math.hypot(p.x-f.x,p.y-f.y)>(p.r||3)+6)continue;const pe=elemOfCol(p.col);
      const fp=fxPow(f),pp=projPow(p);
      if((fe==="fire"&&pe==="ice")||(fe==="ice"&&pe==="fire")){f.life=0;p.dead=true;clashFX((f.x+p.x)/2,(f.y+p.y)/2,[230,235,240],true);}
      else if(fp===pp){f.life=0;p.dead=true;clashFX((f.x+p.x)/2,(f.y+p.y)/2,[255,240,200],false);}
      else if(fp>pp){f.pow=fp-pp;f.dmg=Math.max(1,f.pow);p.dead=true;clashFX(p.x,p.y,[255,230,160],false);}
      else{p.pow=pp-fp;p.dmg=Math.max(1,Math.ceil(p.pow/(p.lv||1)));f.life=0;clashFX(f.x,f.y,[255,160,160],false);}
      clashCount++;if(f.life<=0)break;}}
  // reflected projectiles damage monsters
  for(const p of projectiles){if(!p.friendly||p.dead)continue;for(const e of mobs){if(e.dead)continue;if(Math.hypot(e.x+e.w/2-p.x,e.y+e.h/2-p.y)<e.w/2+4){p.dead=true;e.iframes=0;e._spell=1;if(e.sp==="dragon")hitDragon(e,0);else hurtEnemy(e,p.dmg||1,Math.atan2(p.vy,p.vx),true);break;}}}
  projectiles=projectiles.filter(p=>!p.dead);}
const _updateMagicC=updateMagic;updateMagic=function(){_updateMagicC();try{updateClashes();}catch(e){}};
// friendly (reflected) bolts must not hurt the hero: tag check in hero-hit
