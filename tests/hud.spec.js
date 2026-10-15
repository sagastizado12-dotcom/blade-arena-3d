const {test,expect}=require("@playwright/test");
const SEL=["#btnPause","#btnSave","#btnShop","#qs0","#qs1","#mini","#miniz","#hpNum","#lvBadge","#mpNum","#bars .xp","#bars .hg","#clock","#gold","#btnMap","#btnBag","#btnCrown","#btnSnd","#btnA","#btnB","#sp_fireball","#sp_thunder","#sp_heal","#sp_air","#stickBase","#toasts > div"];
const TOP=["#btnPause","#btnSave","#btnShop","#qs0","#qs1","#mini","#miniz","#hpNum","#lvBadge","#mpNum","#bars .xp","#bars .hg","#clock","#gold","#btnMap","#btnBag","#btnCrown","#btnSnd"];
async function boxes(page,sels){return page.evaluate(sels=>{const o=[];for(const s of sels)for(const e of document.querySelectorAll(s)){const cs=getComputedStyle(e);if(cs.display==="none"||cs.visibility==="hidden"||!e.offsetParent&&cs.position!=="fixed")continue;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)continue;o.push({s,x:r.left,y:r.top,w:r.width,h:r.height});}return o;},sels);}
const inter=(a,b)=>a.x<b.x+b.w-1&&a.x+a.w>b.x+1&&a.y<b.y+b.h-1&&a.y+a.h>b.y+1;
function overlaps(B){const bad=[];for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const a=B[i],b=B[j];if(a.s===b.s&&a.s.includes(">"))continue;if(inter(a,b))bad.push(`${a.s}×${b.s}`);}return bad;}
for(const [w,h] of [[390,844],[375,667],[430,932],[844,390],[667,375]]){
  test(`HUD has no overlapping elements at ${w}x${h}`,async({page})=>{await page.setViewportSize({width:w,height:h});await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
    await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
    await page.evaluate(()=>{__BA.closeMenu();__BA.P.inv.potion=8;__BA.toast("Buy a house in Dunecrest so Opal (F) can stay home, and also remember to visit the guild board.");__BA.toast("Second notice");__BA.toast("Third notice");});await page.waitForTimeout(500);
    const B=await boxes(page,SEL);expect(B.length).toBeGreaterThan(15);expect(overlaps(B)).toEqual([]);
    for(const b of B){expect(b.x).toBeGreaterThanOrEqual(-1);expect(b.y).toBeGreaterThanOrEqual(-1);expect(b.x+b.w).toBeLessThanOrEqual(w+1);expect(b.y+b.h).toBeLessThanOrEqual(h+1);}
    if(h>w){// toasts never over the top panel, at most 2 lines each
      const T=B.filter(b=>b.s==="#toasts > div");const top=B.filter(b=>TOP.includes(b.s));for(const t of T){for(const q of top)expect(inter(t,q),`toast over ${q.s}`).toBe(false);expect(t.h).toBeLessThanOrEqual(40);}expect(T.length).toBeLessThanOrEqual(2);
      const g=await page.locator("#game").boundingBox();for(const t of T)expect(t.y).toBeGreaterThanOrEqual(g.y);}
    // world map screen
    await page.evaluate(()=>__BA.toggleMap());await page.waitForTimeout(400);
    for(const z of [0,2,4]){await page.evaluate(z=>{__BA.getMapM().z=z;__BA.drawFullMap();},z);
      const M=await boxes(page,["#mapinfo","#mapX","#mapZin","#mapZout","#mapzl","#mapMe","#mapLeg"]);expect(overlaps(M)).toEqual([]);
      const L=await page.evaluate(()=>window.__mapLabels||[]);for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++)expect(inter(L[i],L[j]),`${L[i].t}×${L[j].t}`).toBe(false);}
  });}
