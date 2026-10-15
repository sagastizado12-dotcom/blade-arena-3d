const {test}=require("@playwright/test");
test.use({viewport:{width:430,height:860},deviceScaleFactor:2});
test("v12 shots",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA;B.mobs.length=0;B.world.min=9*60+30;for(let i=0;i<1800;i++)B.update();const n=B.npcs.find(x=>x.s===0&&x.job==="blacksmith"&&x.wp)||B.npcs.find(x=>x.s===0&&x.wp);B.hero.x=n.wp.x-30;B.hero.y=n.wp.y+20;n.x=n.wp.x;n.y=n.wp.y;for(let i=0;i<120;i++)B.update();});
 await page.waitForTimeout(900);await page.screenshot({path:"/workspace/shots-blade/v12-village-jobs.png"});
 await page.evaluate(()=>{const B=__BA;const n=B.npcs.find(x=>x.s===0&&x.job==="blacksmith")||B.npcs.find(x=>x.s===0&&x.job);B.P.inv.wood=30;for(let d=0;d<4;d++){B.world.day++;B.helpJob(n);}B.talk(n);});
 await page.waitForTimeout(600);await page.screenshot({path:"/workspace/shots-blade/v12-friendship.png"});});
