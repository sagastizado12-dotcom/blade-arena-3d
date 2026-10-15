const {test}=require("@playwright/test");const S="/workspace/shots-blade/";const ev=(p,f,a)=>p.evaluate(f,a);
test.use({viewport:{width:844,height:390}});
async function go(page){await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");}
test("walk frames",async({page})=>{await go(page);await page.evaluate(()=>{window.__VW=0;window.__RS=document.getElementById("game").width/ (window.__BA.W||document.getElementById("game").width/2);});
  await ev(page,()=>{const B=__BA;B.world.min=11*60;const s=B.SETS[0];B.teleport(s.x+8,s.y);B.mobs.length=0;});await page.waitForTimeout(800);
  await page.keyboard.down("KeyD");await page.waitForTimeout(300);
  for(let i=0;i<16;i++){await page.screenshot({path:`/tmp/wf/f${String(i).padStart(2,"0")}.png`,clip:await ev(page,()=>{const c=document.getElementById("game"),r=c.getBoundingClientRect();const k=r.width/c.width*2;const x=r.left+(__BA.hero.x+6-__BA.camX)*k,y=r.top+(__BA.hero.y+4-__BA.camY)*k;return{x:Math.round(Math.max(0,x-45)),y:Math.round(Math.max(0,y-55)),width:90,height:90};})});await page.waitForTimeout(45);}
  await page.keyboard.up("KeyD");await page.keyboard.down("KeyS");for(let i=16;i<28;i++){await page.screenshot({path:`/tmp/wf/f${String(i).padStart(2,"0")}.png`,clip:await ev(page,()=>{const c=document.getElementById("game"),r=c.getBoundingClientRect();const k=r.width/c.width*2;const x=r.left+(__BA.hero.x+6-__BA.camX)*k,y=r.top+(__BA.hero.y+4-__BA.camY)*k;return{x:Math.round(Math.max(0,x-45)),y:Math.round(Math.max(0,y-55)),width:90,height:90};})});await page.waitForTimeout(45);}
  await page.keyboard.up("KeyS");
});
test("women group",async({page})=>{await go(page);
  await ev(page,()=>{const B=__BA;B.world.min=11*60;const s=B.SETS[0];B.teleport(s.x,s.y+2);B.mobs.length=0;
    const W=B.npcs.filter(n=>B.isWoman(n)&&n.alive&&!["guard","knight"].includes(B.npcLookC(n).cls)).slice(0,12);W.forEach((n,i)=>{n.x=B.hero.x-130+(i%6)*44;n.y=B.hero.y-50+Math.floor(i/6)*46;n.inside=false;n.pauseT=99999;n.vdir=0;});
    window.__w=W;});await page.waitForTimeout(600);await ev(page,()=>{for(const n of window.__w){n.vdir=0;n.pauseT=30;}});await page.waitForTimeout(40);await page.screenshot({path:S+"v4-women.png",clip:{x:150,y:100,width:540,height:200}});
});
