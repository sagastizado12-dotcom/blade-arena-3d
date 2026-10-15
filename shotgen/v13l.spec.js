const {test}=require("@playwright/test");
test.use({viewport:{width:430,height:860},deviceScaleFactor:2});
test("leader shot",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA;B.mobs.length=0;B.world.min=12*60;for(let i=0;i<3600;i++)B.update();const f=B.fountainOf(B.SETS[0]);B.hero.x=(f.x-3)*16;B.hero.y=(f.y+3)*16;for(let i=0;i<60;i++)B.update();});
 await page.waitForTimeout(900);await page.screenshot({path:"/workspace/shots-blade/v13-leader-fountain.png"});});
