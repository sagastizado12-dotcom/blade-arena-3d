const {test}=require("@playwright/test");const S="/workspace/shots-blade/";
test.use({viewport:{width:1280,height:720}});
test("throne",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(async()=>{const B=__BA;B.world.min=11*60;B.enterBuilding({kind:"castle",id:-5,s:0});});await page.waitForFunction(()=>__BA.room,null,{timeout:5000});await page.waitForTimeout(1500);
  await page.evaluate(()=>{const h=__BA.hero;h.y-=60;});await page.waitForTimeout(400);await page.screenshot({path:S+"v8-throne.png"});});
