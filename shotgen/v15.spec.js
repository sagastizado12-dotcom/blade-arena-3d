const {test}=require("@playwright/test");const fs=require("fs");
test("sheet",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 const d=await page.evaluate(()=>__BA.monSheet(3).toDataURL());fs.writeFileSync(process.env.OUT||"/workspace/shots-blade/v15-monsters.png",Buffer.from(d.split(",")[1],"base64"));});
