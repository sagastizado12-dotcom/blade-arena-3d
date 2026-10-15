const {test,expect}=require("@playwright/test");
async function boot(page){await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);}
async function fresh(page){await boot(page);await page.evaluate(()=>localStorage.clear());await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");await page.evaluate(()=>{__BA.closeMenu();__BA.world.min=12*60;__BA.mobs.length=0;});}
async function oldSave(page){await fresh(page);
  // simulate a pre-v18 save: sided with demons / demon peace, no champion state, Malzareth fields missing
  await page.evaluate(()=>{const B=__BA,K=B.kState();K.side="demon";K.demonPeace=true;K.champ={};delete K.demonFallen;B.saveGame();});
  await page.reload();await page.waitForFunction(()=>window.__READY);await page.click("#contBtn");await page.waitForFunction(()=>__BA.state==="play");await page.evaluate(()=>{__BA.closeMenu();__BA.world.min=12*60;__BA.mobs.length=0;});
  expect(await page.evaluate(()=>__BA.kState().side)).toBe("demon");}
async function walk(page,from,key){await page.evaluate(f=>{const B=__BA,c=B.demonCastle();B.teleport(c.x+3+f[0],c.y+f[1]);B.mobs.length=0;},from);
  expect(await page.evaluate(()=>__BA.mobs.some(m=>m.malz&&!m.dead))).toBe(false);
  await page.keyboard.down(key);let hit=false;for(let i=0;i<60&&!hit;i++){await page.waitForTimeout(150);hit=await page.evaluate(()=>__BA.mobs.some(m=>m.malz&&!m.dead));}await page.keyboard.up(key);
  const banner=await page.evaluate(()=>{const d=document.getElementById("malzBanner");return d?d.textContent:"";});return{hit,banner};}
for(const [label,setup] of [["fresh save",fresh],["migrated older save (side=demon, demon peace)",oldSave]]){
  test(`Malzareth (${label}): walking on foot up to the castle door starts the fight with a banner`,async({page})=>{const errs=[];page.on("pageerror",e=>errs.push(e.message));await setup(page);
    const r=await walk(page,[0,16],"ArrowUp");expect(r.hit).toBe(true);expect(r.banner).toContain("MALZARETH, THE DEMON KING");expect(errs).toEqual([]);});
  test(`Malzareth (${label}): walking in from the side courtyard starts the fight`,async({page})=>{await setup(page);const r=await walk(page,[-12,4],"ArrowRight");expect(r.hit).toBe(true);});
  test(`Malzareth (${label}): entering the castle door (interior) starts the fight`,async({page})=>{await setup(page);
    await page.evaluate(()=>{const B=__BA,c=B.demonCastle();B.teleport(c.x+3,c.y+30);for(let i=0;i<3;i++)B.update();B.enterBuilding({kind:"castle",id:-10-c.s,s:c.s});});
    await page.waitForFunction(()=>__BA.mobs.some(m=>m.malz&&!m.dead),null,{timeout:5000});});
}
test("Demon King marker is drawn on the world map when fully zoomed out (and at max zoom)",async({page})=>{await fresh(page);
  for(const zz of ["min","max"]){const r=await page.evaluate(zz=>{const B=__BA;if(document.getElementById("mapov").classList.contains("hidden"))B.toggleMap();const M=B.getMapM();for(let i=0;i<10;i++)document.getElementById(zz==="min"?"mapZout":"mapZin").click();
      const c=B.demonCastle();if(zz==="max"){M.cx=c.x+3;M.cy=c.y+1.5;}B.drawFullMap();if(zz==="max")M.z=M.z;const cv=document.getElementById("mapc");const s=window.__BA_ms();const k=cv.width/cv.clientWidth;
      const mx=cv.clientWidth/2+(c.x+3-M.cx)*s,my=cv.clientHeight/2+(c.y+1.5-M.cy)*s;const d=cv.getContext("2d").getImageData(Math.round(mx*k)-12,Math.round(my*k)-12,24,24).data;let red=0;for(let i=0;i<d.length;i+=4)if(d[i]>180&&d[i+1]<110&&d[i+2]<110)red++;return{red,mx,my,z:M.z};},zz);
    expect(r.red,JSON.stringify(r)).toBeGreaterThan(8);}
});
