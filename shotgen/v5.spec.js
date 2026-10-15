const {test}=require("@playwright/test");const S="/workspace/shots-blade/";const ev=(p,f,a)=>p.evaluate(f,a);
test.use({viewport:{width:1280,height:720}});
async function go(page){await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");}
test("lineup",async({page})=>{await go(page);
  await ev(page,()=>{const B=__BA,Z=4,c=document.createElement("canvas");c.width=1240;c.height=700;const g=c.getContext("2d");g.imageSmoothingEnabled=false;g.fillStyle="#3a6a3a";g.fillRect(0,0,c.width,c.height);
    g.font="bold 14px monospace";g.fillStyle="#fff";let y=8;
    const row=(label,items)=>{g.fillStyle="#ffe9a0";g.fillText(label,8,y+14);let x=8;y+=18;for(const [L,d,f] of items){g.drawImage(B.chibi(L,d,f),x,y,20*Z/1.6|0,30*Z/1.6|0);x+=20*Z/1.6+4;}y+=30*Z/1.6+6;};
    row("HERO — down / left / right / up  (step, neutral, step)  · attack · cast · hurt",[0,1,2,3].flatMap(d=>[[B.HERO_LOOK,d,10],[B.HERO_LOOK,d,0],[B.HERO_LOOK,d,14]]).concat([[B.HERO_LOOK,0,4],[B.HERO_LOOK,2,4],[B.HERO_LOOK,0,6],[B.HERO_LOOK,0,7]]));
    const cls=["warrior","mage","archer","rogue","cleric","berserker"];
    row("ADVENTURERS — warrior, mage, archer, rogue, cleric, berserker (front / side)",cls.flatMap((k,i)=>{const L=B.chibiLook(1000+i*17,k,"human");return[[L,0,0],[L,2,10]];}));
    const ad=B.npcs.filter(n=>n.alive);const W=ad.filter(n=>B.isWoman(n)).slice(0,14).map(n=>[B.npcLookC(n),0,0]);row("WOMEN — every look unique",W);
    const M=ad.filter(n=>!B.isWoman(n)&&n.age>=18&&n.age<60).slice(0,14).map(n=>[B.npcLookC(n),0,0]);row("MEN — villagers, guards, smiths, nobles…",M);
    const E=ad.filter(n=>n.age>=60).slice(0,7).map(n=>[B.npcLookC(n),0,0]),K=ad.filter(n=>n.age<15).slice(0,7).map(n=>[B.npcLookC(n),0,0]);row("ELDERS & CHILDREN",E.concat(K));
    const im=new Image();im.src=c.toDataURL();im.id="lineup";im.style.cssText="position:fixed;left:20px;top:10px;z-index:9999;image-rendering:pixelated";document.body.appendChild(im);});
  await page.waitForTimeout(300);await page.locator("#lineup").screenshot({path:S+"v5-characters.png"});
});
test("town + walk",async({page})=>{await go(page);
  await ev(page,()=>{const B=__BA;B.world.min=11*60;const s=B.SETS[0];B.teleport(s.x+8,s.y);B.mobs.length=0;});await page.waitForTimeout(1200);
  await page.screenshot({path:S+"v5-town.png"});
  let i=0;for(const k of ["KeyS","KeyA","KeyD","KeyW"]){await page.keyboard.down(k);await page.waitForTimeout(200);
    for(let j=0;j<10;j++){const clip=await ev(page,()=>{const c=document.getElementById("game"),r=c.getBoundingClientRect();const k=r.width/c.width*2;const x=r.left+(__BA.hero.x+6-__BA.camX)*k,y=r.top+(__BA.hero.y+4-__BA.camY)*k;return{x:Math.round(x-40),y:Math.round(y-58),width:80,height:96};});
      await page.screenshot({path:`/tmp/w5/f${String(i++).padStart(2,"0")}.png`,clip});await page.waitForTimeout(40);}
    await page.keyboard.up(k);await page.waitForTimeout(150);}
});
