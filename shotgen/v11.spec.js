const {test}=require("@playwright/test");
test.use({viewport:{width:390,height:844},deviceScaleFactor:2});
test("map",async({page})=>{test.setTimeout(90000);await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY,null,{timeout:60000});await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{const B=__BA;B.teleport(150,150);B.hero.dir=2;const g=B.guildObj();g.reg=true;const J=B.genGuildJobs();g.active.push({...J[0]});});
  await page.click("#btnMap");await page.waitForTimeout(200);await page.click("#mapZout");await page.click("#mapZout");await page.click("#mapLeg");await page.waitForTimeout(400);
  await page.screenshot({path:"/workspace/shots-blade/v11-map-zoomed-out.png"});
  await page.click("#mapLeg");await page.click("#mapZin");await page.click("#mapZin");await page.click("#mapZin");await page.click("#mapZin");await page.click("#mapMe");await page.waitForTimeout(400);
  await page.screenshot({path:"/workspace/shots-blade/v11-map-zoomed-in.png"});});
