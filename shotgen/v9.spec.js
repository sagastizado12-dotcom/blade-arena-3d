const {test}=require("@playwright/test");
test.use({viewport:{width:1280,height:720}});
test("ranks",async({page})=>{test.setTimeout(120000);await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{document.querySelectorAll("#tl,#hudR,#bars,#hudL,#stickZone,#btnA,#btnB,.sp4,#buffs,#toasts,.toast").forEach(e=>e.style.visibility="hidden");});
  for(const k of ["fireball","thunder","heal","air"])for(const lv of [1,5,10]){
    await page.evaluate(([k,lv])=>{const B=__BA;B.world.min=12*60;B.teleport(170,146);B.mobs.length=0;B.hero.dir=2;B.hero.hp=B.hero.maxHp;
      for(let i=0;i<3;i++){const m=B.spawnMob("slime",B.hero.x+70+i*26,B.hero.y-20+i*18,{persist:true});if(m){m.hp=m.maxHp=999;m.def={...m.def,beh:"pea"};}}
      B.P.mag.xp[k]=(lv-1)*8;B.P.mag.mp=999;for(const s in B.SPCD)B.SPCD[s]=0;B.particles().length=0;},[k,lv]);
    await page.waitForTimeout(400);await page.evaluate(k=>__BA.castSpell(k),k);
    await page.waitForTimeout({fireball:330,thunder:90,heal:280,air:260}[k]);
    await page.screenshot({path:`/tmp/sr/${k}-${lv}.png`,clip:{x:340,y:150,width:600,height:400}});}});
