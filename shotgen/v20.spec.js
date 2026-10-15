const {test}=require("@playwright/test");
test("raid alert",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA,S=B.SETS[0],ws=B.world.sets[0];B.closeMenu();B.world.min=11*60;B.mobs.length=0;const f=B.fountainOf(S);B.teleport((f?f.x:S.x)+1,(f?f.y:S.y)+5);ws.raid={until:1e9,spawned:true,n:4};const R=B.wallR(S);
   const sp=Object.keys(B.SPECIES).find(k=>/wolf/.test(k))||"goblin";for(let i=0;i<5;i++){const a=i*1.25;B.spawnMob(sp,(S.x+Math.cos(a)*(R-3))*16,(S.y+Math.sin(a)*(R-3))*16,{raidOf:0});}for(let i=0;i<1400;i++)B.update();for(const m of B.mobs)m.hp=Math.max(m.hp,1);});
 await page.evaluate(()=>__BA.closeMenu());await page.waitForTimeout(600);await page.screenshot({path:"/workspace/shots-blade/v20-raid-alert.png"});});
