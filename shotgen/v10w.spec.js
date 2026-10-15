const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:900}});
test("wm",async({page})=>{test.setTimeout(90000);await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY,null,{timeout:60000});await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{document.getElementById("btnMap").click();});await page.waitForTimeout(600);
  await page.screenshot({path:"/workspace/shots-blade/v10-worldmap.png"});});
