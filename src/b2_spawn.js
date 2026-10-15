function spawnEnemy(type,x,y){
  const e={
    type, x, y, w:12, h:12,
    vx:0,vy:0, hp:0, maxHp:0,
    dir:0, frame:0, anim:0, state:"chase",
    timer:0, atkCd:0, hurt:0, iframes:0,
    knockT:0, knockVx:0, knockVy:0,
    parts:{head:true,arm:true,legs:true,tail:true,horns:true,arms:true},
    dead:false, flash:0
  };
  if(type==="grunt"){e.hp=3;e.maxHp=3;e.spd=0.55;e.dmg=1}
  else if(type==="crawler"){e.hp=2;e.maxHp=2;e.spd=1.1;e.dmg=1;e.w=12;e.h=10}
  else if(type==="spitter"){e.hp=2;e.maxHp=2;e.spd=0.4;e.dmg=1}
  else if(type==="charger"){e.hp=4;e.maxHp=4;e.spd=0.5;e.dmg=1}
  else if(type==="boss"){e.hp=16;e.maxHp=16;e.spd=0.45;e.dmg=2;e.w=20;e.h=20;e.x=x-4;e.y=y-4}
  return e;
}
