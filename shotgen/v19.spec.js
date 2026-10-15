const {test}=require("@playwright/test");
test("duel outside",async({page})=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
 await page.evaluate(()=>{const B=__BA,S=B.SETS[0];B.closeMenu();B.mobs.length=0;B.world.min=13*60;B.teleport(S.x+2,S.y+3);for(let i=0;i<5;i++)B.update();B.issueChallenge(false);[...document.querySelectorAll("#menu button")].find(b=>/Accept/.test(b.textContent)).click();
   [...document.querySelectorAll("#menu button")].find(b=>/Go to duel/.test(b.textContent)).click();});
 await page.waitForTimeout(2600);await page.evaluate(()=>{const D=__BA.getDPend();if(D)__BA.teleport(D.x-2,D.y);__BA.hero.hp=__BA.hero.maxHp;});await page.waitForTimeout(1500);
 await page.evaluate(()=>{__BA.closeMenu();__BA.hero.hp=__BA.hero.maxHp;});await page.waitForTimeout(300);await page.screenshot({path:"/workspace/shots-blade/v19-duel-outside.png"});});
