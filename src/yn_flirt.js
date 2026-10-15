// ===== FLIRTY TOWNSWOMEN (adults only, PG-13): visible reactions as the hero walks by; fully clothed tavern dancers =====
const isFlirty=n=>n&&n.alive&&!n.adv&&n.role!=="leader"&&n.role!=="receptionist"&&n.role!=="child"&&n.age>=18&&isWoman(n)&&(n.id*7+3)%3===0&&n.spouse!==-2&&!(n.spouse===-1&&nightHome(n));
const FLIRT_CLEAN=["Hey there, hero~","Come see me tonight?","Well, hello handsome!","Walk me home later?","*wink*","Looking good today, hero~","You again? I was hoping~","Save a dance for me?"];
const FLIRT_ROUGH=["Damn, hero, looking good~","Hell, you clean up nice!","Come see me tonight, you handsome bastard~","Hell of a sword arm you've got~"];
const EMOTES=["♥","😉","💋","♥♥"];
let flirtFx=[];
function flirtTick(){if(room||frameN%6!==0)return;for(const n of npcs){if(n.inside||!isFlirty(n))continue;const d=Math.hypot(n.x+8-hero.x-6,n.y+8-hero.y-6);if(d>48)continue;
  if((n.flirtCd||0)>frameN)continue;n.flirtCd=frameN+60*25+((n.id*97)%600);
  n.vdir=Math.abs(hero.x-n.x)>Math.abs(hero.y-n.y)?(hero.x<n.x?1:2):(hero.y<n.y?3:0);n.pauseT=90;
  const pool=prof()?FLIRT_CLEAN.concat(FLIRT_ROUGH):FLIRT_CLEAN;say(n,pool[(n.id+world.day+(n.flirtN||0))%pool.length],170);n.flirtN=(n.flirtN||0)+1;
  flirtFx.push({n,e:EMOTES[(n.id+n.flirtN)%EMOTES.length],life:90});const k=n.flirtN%3;if(k===0)n.cheer=absMin()+2;if(k===1)n.followT=70;
  n.friend=Math.min(100,(n.friend||0)+1);n.flirted=(n.flirted||0)+1;}
  for(const n of npcs)if(n.followT>0){n.followT-=6;const fl=npcs.filter(q=>q.followT>0),si=fl.indexOf(n),sa=Math.PI*0.5+(si-(fl.length-1)/2)*0.9;const tx=hero.x+Math.cos(sa)*24,ty=hero.y-Math.sin(sa)*-24;const dx=tx-n.x,dy=ty-n.y,l=Math.hypot(dx,dy);if(l>3){const v=Math.min(l,l>40?3:1.2);n.x+=dx/l*v;n.y+=dy/l*v;}}}
const _updF=update;update=function(){_updF();if(hero&&state==="play"&&!hero.dead){try{flirtTick();}catch(e){}for(const f of flirtFx)f.life--;flirtFx=flirtFx.filter(f=>f.life>0);}};
const _drawF=draw;draw=function(){_drawF();if(room||!flirtFx.length)return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);ctx.textAlign="center";
  for(const f of flirtFx){const a=Math.min(1,f.life/20);ctx.globalAlpha=a;ctx.font="9px system-ui";ctx.fillStyle="#ff5a8a";ctx.fillText(f.e,f.n.x+8+Math.sin(f.life*.2)*2,f.n.y-26-(90-f.life)*0.12);}ctx.restore();};
// tavern dancers at night (fully clothed, cheerful)
const _roomNpcsF=roomNpcs;roomNpcs=function(){const L=_roomNpcsF();if(!room||room.b.kind!=="inn")return L;const h=hour();if(!(h>=19||h<2))return L;
  let k=0;for(const r of L){if(k>=2)break;if(r.n&&r.pose==="sit"&&isWoman(r.n)){r.pose="dance";r.x=(room.w/2-1.5+k*3)*16;r.y=(room.h/2)*16;k++;}}return L;};
