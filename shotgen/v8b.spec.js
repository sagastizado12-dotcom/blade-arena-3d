const {test}=require("@playwright/test");const S="/workspace/shots-blade/";
test.use({viewport:{width:1280,height:720}});
test("castle+king",async({page})=>{page.on("pageerror",e=>console.log("ERR",e.message));page.on("console",m=>{if(m.type()!=="log")console.log("C",m.text())});await page.addInitScript(()=>{window.__FAST=true;localStorage.setItem("realmIntroSeen","1");});
  await page.goto("/");await page.waitForFunction(()=>window.__READY);await page.click("#startBtn");await page.waitForFunction(()=>__BA.state==="play");
  await page.evaluate(()=>{const B=__BA,c=B.castleObj();B.world.min=11*60;B.teleport(c.x+3,c.y+4);});await page.waitForTimeout(1500);await page.screenshot({path:S+"v8-castle.png"});
  await page.evaluate(()=>{const B=__BA,Z=6,c=document.createElement("canvas");c.width=1240;c.height=330;const g=c.getContext("2d");g.imageSmoothingEnabled=false;g.fillStyle="#2a1a2a";g.fillRect(0,0,c.width,c.height);
    g.fillStyle="#ffe9a0";g.font="bold 18px monospace";g.fillText("KING ALDRIC — down / left / right / up  (step · neutral · step)",12,26);let x=12;
    for(const d of [0,1,2,3])for(const f of [10,0,14]){g.drawImage(B.chibi(B.KING_LOOK,d,f),x,40,20*Z/1.5|0,30*Z/1.5|0);x+=20*Z/1.5+6;}
    c.id="sheet";c.style.cssText="position:fixed;left:20px;top:20px;z-index:99";document.body.appendChild(c);});
  await page.locator("#sheet").screenshot({path:S+"v8-king.png"});
  });
