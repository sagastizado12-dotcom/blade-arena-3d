const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:720}});
test("flirty",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{const B=__BA;B.world.min=11*60;const n=B.npcs.find(n=>B.isFlirty(n)&&!n.inside);B.hero.x=n.x+26;B.hero.y=n.y+6;});
  await page.waitForFunction(()=>__BA.flirtFx().length>0,null,{timeout:4000});await page.waitForTimeout(500);await page.screenshot({path:"/workspace/shots-blade/v8-flirty.png"});});
