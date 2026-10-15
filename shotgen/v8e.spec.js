const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:720}});
test("night",async({page})=>{page.on("pageerror",e=>console.log("ERR",e.message));page.on("console",m=>console.log("C",m.text().slice(0,200)));await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{const B=__BA;B.world.min=22*60;B.world.weather="clear";const s=B.SETS[0];B.teleport(s.x+1,s.y+3);});await page.waitForTimeout(4000);
  await page.screenshot({path:"/workspace/shots-blade/v8-night-town.png"});
  await page.evaluate(()=>{const B=__BA,inn=B.buildings.find(b=>b.kind==="inn"&&b.s===0);B.enterBuilding(inn);});await page.waitForFunction(()=>__BA.room,null,{timeout:5000});await page.waitForTimeout(3000);
  await page.screenshot({path:"/workspace/shots-blade/v8-night-tavern.png"});});
