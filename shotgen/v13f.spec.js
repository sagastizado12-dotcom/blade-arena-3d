const {test}=require("@playwright/test");
test.use({viewport:{width:430,height:860},deviceScaleFactor:2});
test("family shot",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA,P=B.P;B.mobs.length=0;P.gold=99999;const cab=B.buildings.filter(x=>x.cabin&&x.kind==="forsale");B.buyHome(cab[0]);B.buyHome(cab[1]);
  const W=B.npcs.filter(n=>B.canWoo(n)&&n.s===0).slice(0,2);P.inv.ring=2;W.forEach(w=>{w.aff=90;w.friend=95;w.confessed=true;P.dating.push(w.id);B.propose(w);});B.assignWifeHome(W[0],cab[0].id);B.assignWifeHome(W[1],cab[1].id);
  B.pregRoll(cab[0],true);B.world.day+=11;B.familyBirths();B.pregRoll(cab[1],true);B.familyMenu();});
 await page.waitForTimeout(700);await page.screenshot({path:"/workspace/shots-blade/v13-family.png"});});
