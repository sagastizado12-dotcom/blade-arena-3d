const {test,expect,devices}=require("@playwright/test");
const {defaultBrowserType,...iphone}=devices["iPhone 13"];
test.use({...iphone});
async function open(page){await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});await page.goto("/");await page.waitForFunction(()=>window.__READY);
  await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");await page.evaluate(()=>{__BA.closeMenu&&__BA.closeMenu();__BA.toggleMap();const M=__BA.getMapM();M.z=3;});await page.waitForTimeout(200);
  const cdp=await page.context().newCDPSession(page);const box=await page.locator("#mapc").boundingBox();return{cdp,box};}
const touch=(cdp,type,pts)=>cdp.send("Input.dispatchTouchEvent",{type,touchPoints:pts.map((p,i)=>({x:p[0],y:p[1],id:i}))});
test("iPhone: one-finger drag pans the world map (and a tiny move is a tap, not a pan)",async({page})=>{
  const errs=[];page.on("pageerror",e=>errs.push(e.message));const {cdp,box}=await open(page);
  await page.evaluate(()=>{const M=__BA.getMapM();M.cx=500;M.cy=400;});const cx=box.x+box.width/2,cy=box.y+box.height/2;
  const c0=await page.evaluate(()=>({x:__BA.getMapM().cx,y:__BA.getMapM().cy}));
  await touch(cdp,"touchStart",[[cx,cy]]);for(let i=1;i<=10;i++){await touch(cdp,"touchMove",[[cx-i*12,cy-i*6]]);await page.waitForTimeout(16);}await page.waitForTimeout(150);await touch(cdp,"touchEnd",[]);
  const c1=await page.evaluate(()=>({x:__BA.getMapM().cx,y:__BA.getMapM().cy}));
  expect(c1.x).toBeGreaterThan(c0.x+5);expect(c1.y).toBeGreaterThan(c0.y+2);
  // tap: < 8px movement does not pan
  await touch(cdp,"touchStart",[[cx,cy]]);await touch(cdp,"touchMove",[[cx+3,cy+2]]);await touch(cdp,"touchEnd",[]);await page.waitForTimeout(100);
  const c2=await page.evaluate(()=>({x:__BA.getMapM().cx,y:__BA.getMapM().cy,open:!document.getElementById("mapov").classList.contains("hidden")}));
  expect(Math.abs(c2.x-c1.x)).toBeLessThan(0.01);expect(c2.open).toBe(true);expect(errs).toEqual([]);});
test("iPhone: a fast flick keeps gliding (inertia), and pinch zooms around the pinch point",async({page})=>{
  const {cdp,box}=await open(page);await page.evaluate(()=>{const M=__BA.getMapM();M.cx=500;M.cy=400;});const cx=box.x+box.width/2,cy=box.y+box.height/2;
  await touch(cdp,"touchStart",[[cx,cy]]);for(let i=1;i<=5;i++){await touch(cdp,"touchMove",[[cx-i*25,cy]]);await page.waitForTimeout(10);}const atRelease=await page.evaluate(()=>__BA.getMapM().cx);await touch(cdp,"touchEnd",[]);
  await page.waitForTimeout(400);const after=await page.evaluate(()=>__BA.getMapM().cx);expect(after).toBeGreaterThan(atRelease+0.5);
  await page.waitForTimeout(800);
  const z0=await page.evaluate(()=>__BA.getMapM().z);const px=cx+60,py=cy-40;
  await touch(cdp,"touchStart",[[px-20,py],[px+20,py]]);for(let i=1;i<=8;i++){await touch(cdp,"touchMove",[[px-20-i*8,py],[px+20+i*8,py]]);await page.waitForTimeout(16);}await touch(cdp,"touchEnd",[]);
  const z1=await page.evaluate(()=>__BA.getMapM().z);expect(z1).toBeGreaterThan(z0);
  const r=await page.evaluate(()=>{const M=__BA.getMapM();M.z=2;M.cx=500;M.cy=400;const c=document.getElementById("mapc");const px=c.clientWidth/2+60,py=c.clientHeight/2-40;
    const s0=__BA_ms();const w0=M.cx+(px-c.clientWidth/2)/s0;window.__mapZoomAt(1,px,py);const s1=__BA_ms();const w1=M.cx+(px-c.clientWidth/2)/s1;return{z:M.z,w0,w1};});
  expect(r.z).toBe(3);expect(Math.abs(r.w1-r.w0)).toBeLessThan(0.6);});
