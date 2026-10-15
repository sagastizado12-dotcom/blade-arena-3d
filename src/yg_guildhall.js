// ===== GRAND GUILD HALL: distinct facade, crest, banners, courtyard =====
const isGrand=b=>b&&b.kind==="guild"&&b.hall;
let grandCache=null;
function grandSprite(lit){const key=lit?1:0;grandCache=grandCache||{};if(grandCache[key])return grandCache[key];const W=96,H=112;const c=mkCanvas(W*2,H*2),g=c.getContext("2d");g.imageSmoothingEnabled=false;g.scale(2,2);
  const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};const OL="#1e1610";
  // wings (stone ground floor, dark-wood upper)
  for(const wx of [0,64]){R(wx,52,32,60,OL);R(wx+1,74,30,37,"#8c8a86");for(let yy=76;yy<110;yy+=5)for(let xx=wx+1+((yy/5)%2?0:4);xx<wx+31;xx+=8)R(xx,yy,7,4,"#a4a29c");
    R(wx+1,56,30,18,"#4a3020");for(let xx=wx+3;xx<wx+31;xx+=7)R(xx,56,2,18,"#2e1c12");R(wx+1,64,30,2,"#2e1c12");
    R(wx-1,44,34,12,OL);R(wx,45,32,10,"#2a4a8a");for(let xx=wx;xx<wx+32;xx+=4)R(xx,47,3,1,"#3c64b0");R(wx,54,32,2,"#d8b040");
    for(const k of [6,20]){R(wx+k,80,7,10,OL);R(wx+k+1,81,5,8,lit?"#ffd870":"#7ab0d8");R(wx+k+3,81,1,8,"#2e1c12");}}
  // central keep + clock tower
  R(26,30,44,82,OL);R(27,64,42,47,"#9a9892");for(let yy=66;yy<110;yy+=5)for(let xx=27+((yy/5)%2?0:5);xx<69;xx+=10)R(xx,yy,9,4,"#b2b0aa");
  R(27,40,42,24,"#4a3020");for(let xx=29;xx<69;xx+=8)R(xx,40,2,24,"#2e1c12");R(27,51,42,2,"#2e1c12");
  R(36,6,24,36,OL);R(37,14,22,27,"#8c8a86");R(34,2,28,10,OL);R(35,3,26,8,"#2a4a8a");R(44,-1,8,5,OL);R(45,0,6,4,"#d8b040");
  R(41,17,14,14,OL);R(42,18,12,12,"#f4ecd8");R(47,19,2,6,OL);R(48,24,5,1,OL);R(42,18,12,1,"#d8b040");
  R(24,28,48,4,OL);R(25,29,46,2,"#d8b040");
  // great arched double door
  R(38,86,20,26,OL);R(40,92,16,20,"#5a3420");R(41,88,14,4,"#5a3420");R(47,90,2,22,OL);for(const yy of [96,104])R(40,yy,16,1,"#2e1c12");R(45,100,1,2,"#ffd23a");R(50,100,1,2,"#ffd23a");
  // crest: shield with crossed swords, banner over the doors
  R(40,66,16,16,OL);R(41,67,14,12,"#2a4a8a");R(43,79,10,2,"#2a4a8a");R(45,81,6,1,"#2a4a8a");R(41,67,14,1,"#d8b040");
  for(let i=0;i<10;i++){R(43+i,69+i,1,1,"#e8e8f0");R(52-i,69+i,1,1,"#e8e8f0");}R(42,77,3,1,"#d8b040");R(51,77,3,1,"#d8b040");
  R(32,82,32,6,OL);R(33,83,30,4,"#b02a2a");g.fillStyle="#ffe8a0";g.font="bold 4px monospace";g.textAlign="center";g.fillText("GUILD",48,86.5);
  // tall banners
  for(const bx of [29,61]){R(bx,56,8,30,OL);R(bx+1,57,6,26,"#2a4a8a");R(bx+1,57,6,2,"#d8b040");R(bx+3,62,2,14,"#d8b040");R(bx+1,83,2,3,"#2a4a8a");R(bx+5,83,2,3,"#2a4a8a");}
  // flags on the tower & wings
  for(const [fx,fy,col] of [[47,-12,"#2a4a8a"],[8,32,"#d8b040"],[86,32,"#d8b040"]]){R(fx,fy,1,14,OL);R(fx+1,fy,9,6,col);R(fx+1,fy+5,4,2,col);}
  c.lw=W;c.lh=H;grandCache[key]=c;return c;}
const _drawBuildingG=drawBuilding;drawBuilding=function(b){if(!isGrand(b))return _drawBuildingG(b);const lit=world&&(hour()>=19||hour()<6);const s=grandSprite(lit);const x=b.x*16-16,y=(b.y+b.h)*16-s.lh;
  ctx.fillStyle="rgba(30,15,10,.25)";ctx.beginPath();ctx.ellipse(b.x*16+32,(b.y+b.h)*16+2,54,8,0,0,7);ctx.fill();ctx.drawImage(s,x,y,s.lw,s.lh);
  // courtyard: torches, weapon rack, notice boards, training dummies
  const by=(b.y+b.h)*16,t=frameN;const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  for(const tx of [b.x*16+12,b.x*16+50]){R(tx,by-14,2,10,"#3a2a1a");const f=Math.sin(t*.3+tx)*1;R(tx-1,by-18+f,4,4,"#ff9a30");R(tx,by-17+f,2,2,"#fff0a0");}
  R(b.x*16-14,by+4,14,10,"#5a3a22");R(b.x*16-13,by+5,12,6,"#e8d8b0");for(let i=0;i<3;i++)R(b.x*16-12+i*4,by+6,3,4,["#fff","#ffe8c0","#f0f0ff"][i]);R(b.x*16-12,by+14,2,4,"#3a2a1a");R(b.x*16-3,by+14,2,4,"#3a2a1a");
  R(b.x*16+64,by+4,14,2,"#5a3a22");R(b.x*16+64,by+12,14,2,"#5a3a22");for(let i=0;i<4;i++){R(b.x*16+65+i*3,by,1,13,"#c8ccd8");R(b.x*16+64+i*3,by+10,3,1,"#7a5636");}
  for(const dx of [b.x*16-26,b.x*16+86]){R(dx+3,by+6,2,14,"#7a5636");R(dx,by+9,8,2,"#7a5636");R(dx+1,by+2,6,5,"#c8a070");R(dx+2,by+3,1,1,"#3a2a1a");R(dx+5,by+3,1,1,"#3a2a1a");R(dx+1,by+11,6,5,"#b89060");}};
