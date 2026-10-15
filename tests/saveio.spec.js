const {test,expect}=require("@playwright/test");
const boot=async page=>{await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);};
test("title is clean (no HUD), Continue only with a save; export -> wipe -> import restores the game; Continue appears",async({page})=>{
  const errs=[];page.on("pageerror",e=>errs.push(e.message));await boot(page);await page.evaluate(()=>localStorage.removeItem("realmTenWindsSave4"));await page.reload();await page.waitForFunction(()=>window.__READY);await page.waitForTimeout(400);
  expect(await page.locator("#contBtn").isVisible()).toBe(false);expect(await page.locator("#btnPause").isVisible()).toBe(false);expect(await page.locator("#tsImport").isVisible()).toBe(true);
  await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  const code=await page.evaluate(()=>{__BA.closeMenu();__BA.P.gold=4321;__BA.P.heroName="Kestrel";return __BA.saveCode();});expect(code.startsWith("BR1:")).toBe(true);
  // pause menu has export/import
  await page.evaluate(()=>document.getElementById("btnPause").click());const labels=await page.locator("#menu button").allTextContents();expect(labels).toContain("💾 Export Save");expect(labels).toContain("📥 Import Save");await page.evaluate(()=>__BA.closeMenu());
  // simulate the separate Home Screen storage: no save
  await page.reload();await page.waitForFunction(()=>window.__READY);await page.evaluate(()=>localStorage.removeItem("realmTenWindsSave4"));await page.waitForTimeout(1700);
  expect(await page.locator("#contBtn").isVisible()).toBe(false);
  await page.click("#tsImport");await page.fill("#sioText",code);await page.click("#sioGo");await page.waitForFunction(()=>__BA.state==="play");
  const r=await page.evaluate(()=>({g:__BA.P.gold,n:__BA.P.heroName}));expect(r.g).toBe(4321);expect(r.n).toBe("Kestrel");
  await page.reload();await page.waitForFunction(()=>window.__READY);await page.waitForTimeout(400);expect(await page.locator("#contBtn").isVisible()).toBe(true);
  // bad code is rejected
  await page.click("#tsImport");await page.fill("#sioText","hello");await page.click("#sioGo");await expect(page.locator("#sioMsg")).toContainText("valid save");expect(errs).toEqual([]);});
test("a newer version.json triggers a cache purge and a one-time reload",async({page})=>{let loads=0;page.on("load",()=>loads++);
  await page.route("**/version.json*",r=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify({v:"9999999999"})}));await boot(page);
  await page.waitForFunction(()=>performance.getEntriesByType("navigation")[0]&&sessionStorage.getItem("brReloadFor9999999999")==="1",null,{timeout:8000});await page.waitForTimeout(5000);expect(loads).toBeGreaterThanOrEqual(2);expect(loads).toBeLessThan(4);});
test("export file download works",async({page})=>{await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");await page.evaluate(()=>{__BA.closeMenu();__BA.saveIO("export");});
  const [dl]=await Promise.all([page.waitForEvent("download"),page.click("#sioFile")]);expect(dl.suggestedFilename()).toBe("blade-realm-save.txt");});
test("legacy save keys from older versions are migrated (never deleted) and Continue loads them",async({page})=>{await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{__BA.closeMenu();__BA.P.gold=777;__BA.saveGame();const raw=localStorage.getItem("realmTenWindsSave4");localStorage.setItem("realmTenWindsSave3",raw);localStorage.removeItem("realmTenWindsSave4");localStorage.removeItem("realmTenWindsSave4_bak");window.onbeforeunload=null;});
  await page.evaluate(()=>{window.addEventListener("pagehide",e=>e.stopImmediatePropagation(),true);});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);
  const r=await page.evaluate(()=>({mig:window.__migratedFrom||null,old:!!localStorage.getItem("realmTenWindsSave3")}));expect(r.old).toBe(true);
  await page.waitForTimeout(400);expect(await page.locator("#contBtn").isVisible()).toBe(true);await page.click("#contBtn");await page.waitForFunction(()=>__BA.state==="play");expect(await page.evaluate(()=>__BA.P.gold)).toBe(777);});
test("export: Select all selects the whole code (fallback for in-app webviews without clipboard)",async({page})=>{await boot(page);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");await page.evaluate(()=>{__BA.closeMenu();__BA.saveIO("export");});
  await page.click("#sioSel");const r=await page.evaluate(()=>{const t=document.getElementById("sioText");return{s:t.selectionStart,e:t.selectionEnd,len:t.value.length,ro:t.readOnly};});expect(r.s).toBe(0);expect(r.e).toBe(r.len);expect(r.len).toBeGreaterThan(100);expect(r.ro).toBe(true);});
