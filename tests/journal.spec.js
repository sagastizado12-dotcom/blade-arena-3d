const {test,expect}=require("@playwright/test");
const ago=async(page,ms)=>{await page.addInitScript(ms=>{if(sessionStorage.getItem("agoDone"))return;sessionStorage.setItem("agoDone","1");const d=JSON.parse(localStorage.getItem("realmTenWindsSave4"));d.P.lastSaved=Date.now()-ms;localStorage.setItem("realmTenWindsSave4",JSON.stringify(d));},ms);};
const boot=async page=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);};
test("away-time: a save from 10h ago yields a first-person 'While you were away' scroll with modest rewards; journal back-filled and logs new events",async({page})=>{
  const errs=[];page.on("pageerror",e=>errs.push(e.message));await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  const g0=await page.evaluate(()=>{const B=__BA;B.closeMenu();B.P.titles=["Dragonslayer of Aldmoor"];B.P.guild=B.P.guild||{};B.P.guild.reg=true;B.P.journal=undefined;B.P.journalInit=false;B.saveGame();
    const d=JSON.parse(localStorage.getItem("realmTenWindsSave4"));window.addEventListener("pagehide",e=>e.stopImmediatePropagation(),true);document.addEventListener("visibilitychange",e=>e.stopImmediatePropagation(),true);return d.P.gold;});
  await ago(page,10*3600*1000);await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#contBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.waitForSelector("#awayScroll",{timeout:5000});const txt=await page.locator("#awayScroll").innerText();expect(txt).toContain("While you were away");expect(txt).toMatch(/\bI\b/);
  const r=await page.evaluate(()=>{const P=__BA.P;return{gold:P.gold,lv:P.lv||1,j:(P.journal||[]).map(e=>e.k+"|"+e.t)};});
  expect(r.gold).toBeGreaterThan(g0);expect(r.gold-g0).toBeLessThanOrEqual(60+r.lv*25);
  expect(r.j.some(s=>s.startsWith("away|"))).toBe(true);expect(r.j.some(s=>s.includes("Dragonslayer of Aldmoor"))).toBe(true);
  await page.click("#awayOk");
  // live logging
  await page.evaluate(()=>{__BA.P.titles.push("Demonslayer");});await page.waitForTimeout(1200);
  await page.evaluate(()=>document.getElementById("btnPause").click());await page.click("#menu button:has-text('Journal')");const jt=await page.locator("#menu").innerText();
  expect(jt).toContain("Hero Journal");expect(jt).toContain("Demonslayer");expect(errs).toEqual([]);});
test("away sim respects caps and state (no demon-border hunts after Nethervale falls) and a short absence gives nothing",async({page})=>{await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  const r=await page.evaluate(()=>{const B=__BA;B.closeMenu();const K=B.kState();K.demonFallen=true;let demon=0,maxG=0;for(let i=0;i<30;i++){const g0=B.P.gold;const a=B.awaySim(1e9);maxG=Math.max(maxG,B.P.gold-g0);if(a.lines.some(l=>/demon/i.test(l)))demon++;}
    const none=B.awaySim(5*60*1000);return{demon,maxG,lv:B.P.lv||1,none};});
  expect(r.demon).toBe(0);expect(r.maxG).toBeLessThanOrEqual((60+r.lv*25)*10+5);expect(r.none).toBe(null);});
test("calendar: 1 game year = 30 real days; 15 real days away advances half a year with ticks, HUD shows season/year",async({page})=>{
  const errs=[];page.on("pageerror",e=>errs.push(e.message));await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  const d0=await page.evaluate(()=>{const B=__BA;B.closeMenu();B.saveGame();const d=JSON.parse(localStorage.getItem("realmTenWindsSave4"));window.addEventListener("pagehide",e=>e.stopImmediatePropagation(),true);return d.world.day;});
  expect(await page.evaluate(()=>Math.round(30*86400000/(28*1440*__BA.MS_PER_GAME_MIN)))).toBe(1);
  await ago(page,15*86400000);await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#contBtn");await page.waitForFunction(()=>__BA.state==="play");
  const r=await page.evaluate(()=>({day:__BA.world.day,cal:__BA.calStr(),clock:document.getElementById("clock").textContent}));
  expect(r.day-d0).toBeGreaterThanOrEqual(13);expect(r.day-d0).toBeLessThanOrEqual(15);expect(r.clock).toMatch(/Year \d/);
  await page.waitForSelector("#awayScroll",{timeout:5000});expect(await page.locator("#awayScroll").innerText()).toContain("Year");expect(errs).toEqual([]);});
