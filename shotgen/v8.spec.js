const {test}=require("@playwright/test");
for(const [n,w,h] of [["portrait",390,844],["portrait-small",375,667]])test("v7 "+n,async({page})=>{await page.setViewportSize({width:w,height:h});
  await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{__BA.world.min=10*60;});await page.waitForTimeout(3000);await page.screenshot({path:"/workspace/shots-blade/v8-"+n+".png"});});
