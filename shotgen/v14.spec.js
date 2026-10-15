const {test}=require("@playwright/test");
test.use({viewport:{width:430,height:860},deviceScaleFactor:2});
test("v14 shot",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA;B.mobs.length=0;B.world.min=12*60;for(let i=0;i<600;i++)B.update();const h=B.hero;const L=B.npcs.filter(n=>n.alive&&!n.inside&&n.s===0&&n.role!=="guard").slice(0,6);
  const off=[[-34,-18],[30,-20],[-30,22],[32,20],[0,-36],[0,34]];L.forEach((n,i)=>{n.x=h.x+off[i][0];n.y=h.y+off[i][1];n.pauseT=999;});for(let i=0;i<3;i++)B.update();});
 await page.waitForTimeout(800);await page.screenshot({path:"/workspace/shots-blade/v14-name-tags.png"});});
