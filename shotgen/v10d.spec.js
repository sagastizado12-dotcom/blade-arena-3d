const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:720}});
async function boot(page){await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY,null,{timeout:60000});await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");}
test("destruction",async({page})=>{test.setTimeout(90000);await boot(page);
  await page.evaluate(()=>{const B=__BA;B.world.min=11*60;const hs=B.buildings.filter(b=>b.kind==="house"&&b.s===0).slice(0,3);B.world.bld[hs[0].id].dmg=0.25;B.world.bld[hs[1].id].dmg=0.55;B.world.bld[hs[2].id].dmg=0.85;
    B.teleport(hs[1].x+2,hs[1].y+hs[1].h+2);const w=B.WALLS2().filter(w=>w.s===0).slice(0,4);for(const x of w)B.spellStructHit(x.x*16+8,x.y*16+8,9,3);});
  await page.waitForTimeout(800);await page.screenshot({path:"/workspace/shots-blade/v10-destruction.png"});});
test("war",async({page})=>{test.setTimeout(90000);await boot(page);
  await page.evaluate(()=>{const B=__BA;B.world.min=12*60;B.declareWar(1,true);const S=B.SETS[10];B.teleport(S.x,S.y+S.r+6);B.mobs.length=0;
    for(let i=0;i<3;i++)B.spawnMob("knight",B.hero.x+40+i*20,B.hero.y-30+i*15,{persist:true,provoked:true,kingdom:1});B.spawnMob("champion",B.hero.x-50,B.hero.y-20,{persist:true,champOf:1,kingdom:1});});
  await page.waitForTimeout(900);await page.evaluate(()=>__BA.kingdomsMenu());await page.waitForTimeout(300);await page.screenshot({path:"/workspace/shots-blade/v10-war.png"});});
test("demon",async({page})=>{test.setTimeout(90000);await boot(page);
  await page.evaluate(()=>{const B=__BA;B.world.min=13*60;const S=B.SETS[16];B.teleport(S.x,S.y-S.r+8);B.mobs.length=0;for(let i=0;i<3;i++)B.spawnMob(i?"demon":"demonbrute",B.hero.x+60+i*20,B.hero.y+30,{persist:true,provoked:true});});
  await page.waitForTimeout(1200);await page.screenshot({path:"/workspace/shots-blade/v10-demon-kingdom.png"});});
