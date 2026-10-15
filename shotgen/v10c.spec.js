const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:720}});
test("conv",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{const B=__BA;const w=B.npcs.find(n=>B.canWoo(n)&&B.personaOf(n)==="cheerful")||B.npcs.find(n=>B.canWoo(n));w.aff=58;w.x=B.hero.x+20;w.y=B.hero.y;
    B.world.day+=1;const r=B.romanceChoose(w,"compliment");B.romanceTalk(w,`You: "Your smile brightens the whole street."\n${w.name}: ${r.reply}`);});
  await page.waitForTimeout(250);await page.screenshot({path:"/workspace/shots-blade/v10-conversation.png"});});
