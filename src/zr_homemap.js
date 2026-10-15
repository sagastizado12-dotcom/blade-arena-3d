// ===== MY HOMES ON THE WORLD MAP AND MINIMAP =====
function homeSpots(){const out=[];for(const b of buildings){if(!b)continue;const mine=owns(b);if(!mine&&!(b.cabin&&b.kind==="forsale"))continue;
  out.push({b,mine,x:b.x+b.w/2,y:b.y+b.h/2,name:b.cabin?b.cabinName:`Home in ${SETS[b.s].name}`});}return out;}
function houseIcon(g,x,y,sz,fill,edge){g.save();g.beginPath();g.moveTo(x,y-sz);g.lineTo(x+sz,y-sz*0.1);g.lineTo(x+sz*0.7,y-sz*0.1);g.lineTo(x+sz*0.7,y+sz*0.8);g.lineTo(x-sz*0.7,y+sz*0.8);g.lineTo(x-sz*0.7,y-sz*0.1);g.lineTo(x-sz,y-sz*0.1);g.closePath();
  g.fillStyle=fill;g.fill();g.lineWidth=1.5;g.strokeStyle=edge;g.stroke();g.fillStyle=edge;g.fillRect(x-sz*0.2,y+sz*0.25,sz*0.4,sz*0.55);g.restore();}
function drawHomesMap(g,P2,txt,z){const pts=[];for(const h of homeSpots()){const [x,y]=P2(h.x,h.y);
  if(h.mine){const sz=5+z*1.2;houseIcon(g,x,y,sz,"#ffd23a","#5a3a08");if(z>=2)txt(z>=3?h.name:"Home",x,y+sz+12,"#ffe680",11);pts.push({x,y,h});}
  else if(z>=1){houseIcon(g,x,y,4+z*0.8,"rgba(190,190,190,.55)","rgba(60,60,60,.7)");if(z>=3)txt(homePrice(h.b)+"g",x,y+16,"#ddd",10);pts.push({x,y,h});}}
  window.__homesMap=pts;drawLeadersMap(g,P2,txt,z);drawFamilyMap(g,P2,txt,z);}
function homePopup(h){let el=document.getElementById("homepop");if(!el){el=document.createElement("div");el.id="homepop";el.style.cssText="position:absolute;left:50%;bottom:70px;transform:translateX(-50%);background:rgba(20,10,25,.95);border:2px solid #e8c060;border-radius:10px;padding:10px 14px;color:#ffe6a8;font:14px system-ui;z-index:5;text-align:center;min-width:220px";document.getElementById("mapov").appendChild(el);}
  const d=Math.round(Math.hypot(h.x-hero.x/TILE,h.y-hero.y/TILE));el.innerHTML=`<b>${h.mine?"🏠 ":""}${h.name}</b><br>${h.mine?"Your home":"For sale · "+homePrice(h.b)+"g"} · ${d} tiles away<br>`;
  if(h.mine){const bt=document.createElement("button");bt.id="homeTravel";bt.textContent="✨ Fast travel home";bt.style.cssText="margin-top:6px;padding:6px 12px;border-radius:8px;border:1px solid #e8c060;background:#5a3a08;color:#ffe680;font-weight:bold";bt.onclick=e=>{e.stopPropagation();el.remove();toggleMap();travelHome(h.b);};el.appendChild(bt);}
  const x=document.createElement("button");x.textContent="✕";x.style.cssText="margin:6px 0 0 8px;padding:6px 10px;border-radius:8px;border:1px solid #888;background:#222;color:#fff";x.onclick=e=>{e.stopPropagation();el.remove();};el.appendChild(x);}
function homeTap(cx,cy){for(const p of window.__homesMap||[])if(Math.hypot(p.x-cx,p.y-cy)<16){homePopup(p.h);return true;}return false;}
function drawHomesMini(mg,P2){for(const h of homeSpots())if(h.mine){const [x,y]=P2(h.x,h.y);houseIcon(mg,x,y,4,"#ffd23a","#5a3a08");}}
