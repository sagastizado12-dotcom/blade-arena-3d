const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:720}});
test("sell",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{const B=__BA,P=B.P;const g=B.guildObj();g.reg=true;g.rank=2;g.pts=95;g.kills={"Blue Slime":14,"Orc":6,"Goblin":9,"Orc Warchief":1};g.killPts=52;
    Object.assign(P.inv,{fang:4,"fang+":1,core:3,tusk:5,hide:2,eye:1,dscale:2,dhorn:1,dheart:1});P.gold=128;
    B.teleport(170,146);const m=B.spawnMob("orc",B.hero.x+30,B.hero.y,{persist:true});B.onKill(m);B.partSellMenu(()=>{});});
  await page.waitForTimeout(400);await page.screenshot({path:"/workspace/shots-blade/v10-guild-sell.png"});});
