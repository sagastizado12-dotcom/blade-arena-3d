const {test}=require("@playwright/test");const S="/workspace/shots-blade/";const ev=(p,f,a)=>p.evaluate(f,a);
test.use({viewport:{width:1280,height:720}});
async function go(page){await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");}
test("v6",async({page})=>{test.setTimeout(120000);await go(page);
  await ev(page,()=>{__BA.world.min=11*60;});
  await page.click("#btnMap");await page.waitForTimeout(800);await page.screenshot({path:S+"v6-world.png"});await page.keyboard.press("KeyM");await page.waitForTimeout(300);
  await ev(page,()=>{document.getElementById("mapov").style.display="none";});
  // guild exterior
  await ev(page,()=>{const B=__BA,g=B.buildings.find(b=>b.kind==="guild"&&b.hall&&b.s===0);B.teleport(g.x+2,g.y+g.h+1);});await page.waitForTimeout(1200);
  await page.screenshot({path:S+"v6-guild.png"});
  // busy town
  await ev(page,()=>{const B=__BA,s=B.SETS[0];B.teleport(s.x+3,s.y+6);});await page.waitForTimeout(4000);
  await page.screenshot({path:S+"v6-busy-town.png"});
  // adventurers mid-fight
  await ev(page,()=>{const B=__BA;B.world.min=10*60;const R=Math.random;Math.random=()=>0.1;try{B.advHourly();}finally{Math.random=R;}
    const n=B.advs().find(n=>n.adv.state==="travel");const a=n.adv;B.world.min=(a.t0+(a.eta-a.t0)*0.5)-B.world.day*1440;const q=B.advWorldPos(n);B.teleport(Math.floor(q.x/16)-5,Math.floor(q.y/16)+3);document.getElementById("bloodToggle").click();});
  await page.waitForTimeout(900);await page.screenshot({path:S+"v6-adventurers.png"});
  await ev(page,()=>{const B=__BA,g=B.buildings.find(b=>b.kind==="guild"&&b.hall&&b.s===0);B.enterBuilding(g);});await page.waitForTimeout(1000);
  await page.screenshot({path:S+"v6-guild-inside.png"});
  await ev(page,()=>{__BA.exitBuilding?__BA.exitBuilding():null;});
});
