import {chromium} from 'playwright';const b=await chromium.launch();const p=await b.newPage({viewport:{width:844,height:390}});
await p.addInitScript(()=>{localStorage.setItem("realmIntroSeen","1");window.__FAST=true;});
await p.goto('http://localhost:8125/');await p.waitForFunction(()=>window.__READY);await p.click('#startBtn');
await p.evaluate(()=>{__BA.world.min=11*60;__BA.teleport(__BA.SETS[0].x+1,__BA.SETS[0].y+1);});await p.waitForTimeout(1500);await p.screenshot({path:'/workspace/shots-blade/v2-before-town.png'});await b.close();
