const {test}=require("@playwright/test");const S="/workspace/shots-blade/";
const ev=(p,f,a)=>p.evaluate(f,a);
test.use({viewport:{width:844,height:390},hasTouch:true});
test("v3 shots",async({page})=>{
  await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await ev(page,()=>{const B=__BA;B.world.min=10*60;const s=B.SETS[0];B.teleport(s.x+3,s.y+3);});await page.waitForTimeout(1500);
  await page.screenshot({path:S+"v3-town.png"});
  await ev(page,()=>{const B=__BA;const s=B.SETS[0];B.teleport(s.x-9,s.y+2);});await page.waitForTimeout(1200);await page.screenshot({path:S+"v3-town-river.png"});
  await ev(page,()=>{const B=__BA;B.world.min=19*60+30;const b=B.buildings.find(b=>b.s===0&&b.kind==="inn");B.enterBuilding(b);});await page.waitForTimeout(2500);await page.screenshot({path:S+"v3-tavern.png"});
  await ev(page,()=>{const B=__BA;B.leaveRoom&&B.leaveRoom();B.world.min=19*60+30;const b=B.buildings.find(b=>b.s===0&&b.kind==="guild");B.enterBuilding(b);});await page.waitForTimeout(2500);await page.screenshot({path:S+"v3-guild.png"});
  await ev(page,()=>{const B=__BA;B.leaveRoom&&B.leaveRoom();B.world.min=12*60;const b=B.buildings.find(b=>b.s===0&&b.kind==="guild");B.hero.x=(b.x+1.5)*16;B.hero.y=(b.y+b.h+1.5)*16;});await page.waitForTimeout(1200);await page.screenshot({path:S+"v3-guild-hall.png"});
  await page.click("#btnMap");await page.waitForTimeout(600);await page.screenshot({path:S+"v3-worldmap.png"});
});
test("cabin shot",async({page})=>{
  await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await ev(page,()=>{const B=__BA;B.world.min=11*60;const c=B.CABINS[2];B.teleport(c.x+1,c.y+5);});await page.waitForTimeout(1500);await page.screenshot({path:S+"v3-cabin.png"});
});
