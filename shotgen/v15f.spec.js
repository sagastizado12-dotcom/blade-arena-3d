const {test}=require("@playwright/test");
test.use({viewport:{width:430,height:860},deviceScaleFactor:2});
test("fight",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA;B.world.min=14*60;let x=0,y=0;for(let k=0;k<4000;k++){const tx=40+Math.floor(Math.random()*900),ty=40+Math.floor(Math.random()*700);let ok=true;for(let dy=-5;dy<=5&&ok;dy++)for(let dx=-7;dx<=7;dx++){const t=B.tAt(tx+dx,ty+dy);if(t!==B.GRASS&&t!==B.FLOWER){ok=false;break;}}
   if(ok&&!B.SETS.some(s=>Math.hypot(s.x-tx,s.y-ty)<s.r+10)){x=tx;y=ty;break;}}B.teleport(x,y);B.mobs.length=0;const h=B.hero;
  const L=[["orc",-40,-10],["goblin",36,-18],["wolfman",30,22],["slime",-30,26],["mudgolem",4,-44]];for(const [k,dx,dy] of L){const e=B.spawnMob(k,h.x+dx,h.y+dy,{});e.provoked=true;}
  for(let i=0;i<8;i++)B.update();});
 await page.keyboard.press("Space");await page.waitForTimeout(120);await page.screenshot({path:"/workspace/shots-blade/v15-monster-fight.png"});});
