// ===== UNIQUE RULER SPRITES (own sprite per ruler, 4 dirs x 3-frame walk) =====
const RW=24,RH=36,rulerCache=new Map();
const RULER_DEF=[
 {skin:"#f4ceac",hair:"#ecebf2",beard:1,crown:"gold",body:"#6e3296",bodyD:"#4a1f68",trim:"#f4f0e8",cape:"#b41e28",capeIn:"#7a1018",legs:"#3a2a4a",robe:1},
 {skin:"#f0c8a2",hair:"#c23c1e",braid:1,crown:"steel",body:"#9aa4b4",bodyD:"#646e80",trim:"#8a6644",cape:"#3250aa",capeIn:"#1e3270",legs:"#4a4f5c",armor:1},
 {skin:"#f6dcc4",hair:"#ece2bc",long:1,crown:"leaf",body:"#3c8c50",bodyD:"#24603a",trim:"#cfe8c0",cape:"#5aa868",capeIn:"#2c6c40",legs:"#3c8c50",gown:1},
 {skin:"#7a2838",hair:"#1a0e1e",horns:1,crown:null,body:"#34303c",bodyD:"#1c1a22",trim:"#8a1a22",cape:"#141016",capeIn:"#a01824",legs:"#221e28",armor:1,glow:1,big:1}];
function rulerSprite(k,dir,f){const key=k+":"+dir+":"+f;let c=rulerCache.get(key);if(c)return c;const D=RULER_DEF[k]||RULER_DEF[0];
  c=document.createElement("canvas");c.width=RW;c.height=RH;const g=c.getContext("2d");const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const side=dir===1||dir===2,back=dir===3,cx=12,st=f===1?1:f===2?-1:0,bob=f?1:0,oy=bob;
  // cape behind (front/side), on top when seen from back
  const cape=()=>{if(side){R(dir===1?14:6,13+oy,4,17,D.cape);R(dir===1?16:6,14+oy,2,15,D.capeIn);}else{R(cx-6,13+oy,12,18-(D.gown?0:1),D.cape);if(!back){R(cx-6,14+oy,1,16,D.capeIn);R(cx+5,14+oy,1,16,D.capeIn);}}};
  if(!back)cape();
  // legs / gown hem
  if(D.gown||D.robe){const hw=D.gown?7:6;R(cx-hw,21+oy,hw*2,10-oy,D.body);R(cx-hw,29,hw*2,2,D.bodyD);if(D.robe)R(cx-1,21+oy,2,9,D.trim);if(f){R(cx-3+st*2,31,3,2,"#2a1c14");}else{R(cx-4,31,3,2,"#2a1c14");R(cx+1,31,3,2,"#2a1c14");}}
  else{if(side){R(cx-2+st*2,24,3,8,D.legs);R(cx-1-st*2,24,3,8,D.legs);R(cx-2+st*2,31,4,2,"#1e1610");}else{R(cx-4,24,3,7+(st>0?0:1),D.legs);R(cx+1,24,3,7+(st<0?0:1),D.legs);R(cx-4,31-(st>0?1:0),3,2,"#1e1610");R(cx+1,31-(st<0?1:0),3,2,"#1e1610");}}
  // torso
  const tw=D.big?14:12;R(cx-tw/2,13+oy,tw,10,D.body);R(cx-tw/2,20+oy,tw,3,D.bodyD);
  if(D.armor){R(cx-tw/2,13+oy,tw,2,D.trim);if(!back){R(cx-2,15+oy,4,4,D.bodyD);R(cx-1,16+oy,2,2,k===3?"#c02030":"#d8dee8");}R(cx-tw/2-1,13+oy,3,3,D.bodyD);R(cx+tw/2-2,13+oy,3,3,D.bodyD);}
  if(D.robe&&!back){R(cx-tw/2,13+oy,tw,2,D.trim);R(cx-1,15+oy,2,7,D.trim);R(cx-4,21+oy,8,1,"#d8b040");}
  if(D.gown&&!back){R(cx-3,13+oy,6,2,D.trim);R(cx-4,19+oy,8,1,"#c8d0d8");}
  if(k===1){R(cx-tw/2,13+oy,tw,2,"#b08a5c");R(cx-tw/2,12+oy,tw,1,"#d0b088");}
  // arms (swing opposite legs)
  const arm=(x,dy)=>{R(x,14+oy+dy,3,8,D.armor?D.bodyD:D.body);R(x,21+oy+dy,3,2,D.armor?"#5a5a66":D.skin);};
  if(side)arm(dir===1?cx-1:cx-2,st>0?1:0);else{arm(cx-tw/2-2,st>0?-1:0);arm(cx+tw/2-1,st<0?-1:0);}
  // head
  const hy=2+oy,hx=cx-6;R(hx+1,hy+1,10,10,D.skin);R(hx,hy+3,12,6,D.skin);
  // hair
  if(back){R(hx,hy,12,11,D.hair);if(D.long)R(hx,hy+10,12,8,D.hair);if(D.braid){R(cx-1,hy+10,3,10,D.hair);R(cx-1,hy+13,3,1,"#8a2410");R(cx-1,hy+17,3,1,"#8a2410");}}
  else{R(hx,hy,12,4,D.hair);if(side){R(dir===1?hx+7:hx,hy,5,9,D.hair);}else{R(hx,hy+2,2,7,D.hair);R(hx+10,hy+2,2,7,D.hair);}
    if(D.long){R(hx-1,hy+3,2,14,D.hair);R(hx+11,hy+3,2,14,D.hair);}
    if(D.braid&&!side){R(hx-1,hy+6,2,11,D.hair);R(hx-1,hy+10,2,1,"#8a2410");R(hx-1,hy+14,2,1,"#8a2410");}
    // face
    const ex=side?(dir===1?[hx+2]:[hx+8]):[hx+3,hx+7];for(const x of ex){R(x,hy+6,2,2,D.glow?"#ff5020":"#2a1a14");if(!D.glow)R(x,hy+6,1,1,"#fff");}
    if(D.glow)for(const x of ex){g.fillStyle="rgba(255,120,40,.45)";g.fillRect(x-1,hy+5,4,4);}
    if(D.beard){if(side)R(dir===1?hx+1:hx+6,hy+8,5,6,D.hair);else{R(hx+2,hy+8,8,6,D.hair);R(hx+3,hy+14,6,2,D.hair);R(hx+4,hy+9,4,1,"#c0a090");}}
    else if(!D.glow)R(cx-1,hy+9,2,1,k===0?"#8a5040":"#c05060");}
  // crowns
  if(D.crown==="gold"){R(hx+1,hy-3,10,3,"#e8b830");R(hx+1,hy-5,2,2,"#e8b830");R(hx+5,hy-6,2,3,"#e8b830");R(hx+9,hy-5,2,2,"#e8b830");if(!back)R(hx+5,hy-2,2,1,"#d02030");R(hx+1,hy-1,10,1,"#a07818");}
  if(D.crown==="steel"){R(hx,hy+1,12,2,"#c8d0dc");R(hx+5,hy-1,2,2,"#e0e6ee");if(!back)R(hx+5,hy+1,2,1,"#3a7ad0");}
  if(D.crown==="leaf"){R(hx+1,hy,10,1,"#d8dee8");R(hx+2,hy-2,2,2,"#58b060");R(hx+5,hy-3,2,3,"#d8dee8");R(hx+8,hy-2,2,2,"#58b060");if(!back)R(hx+5,hy-2,2,1,"#a8e0ff");}
  if(D.horns){const hc="#d8ccb0",hd="#8a7c64";R(hx-2,hy-1,3,4,hc);R(hx-4,hy-4,3,4,hc);R(hx-5,hy-8,2,5,hd);R(hx+11,hy-1,3,4,hc);R(hx+13,hy-4,3,4,hc);R(hx+15,hy-8,2,5,hd);}
  if(back)cape();
  // dark outline + 1px shade on right edge (DQ-ish)
  const id=g.getImageData(0,0,RW,RH),d=id.data,a=i=>d[i*4+3]>0,out=[];for(let y=0;y<RH;y++)for(let x=0;x<RW;x++){const i=y*RW+x;if(a(i))continue;if((x>0&&a(i-1))||(x<RW-1&&a(i+1))||(y>0&&a(i-RW))||(y<RH-1&&a(i+RW)))out.push(i);}
  for(const i of out){d[i*4]=24;d[i*4+1]=16;d[i*4+2]=22;d[i*4+3]=255;}g.putImageData(id,0,0);rulerCache.set(key,c);return c;}
let rulerK=0;
function drawRulerSpr(k,x,y,dir,frame,scale){const ph=frame>=10&&frame<18?Math.floor((frame-10)/2)%4:-1;const f=ph<0?0:[1,0,2,0][ph];const s=rulerSprite(k,dir|0,f);const sc=(scale||1)*(RULER_DEF[k]&&RULER_DEF[k].big?1.2:1)*0.95;
  ctx.drawImage(s,Math.round(x-RW*sc/2),Math.round(y-RH*sc+2),Math.round(RW*sc),Math.round(RH*sc));}
{const _rn=roomNpcs;roomNpcs=function(){const L=_rn.apply(this,arguments);if(room&&room.b&&room.b.kind==="castle")rulerK=kOf(room.b.s);return L;};}
{const _dc=drawChibi;drawChibi=function(L,x,y,dir,frame,scale){if(L===KING_LOOK||(L&&L.rulerK!=null))return drawRulerSpr(L.rulerK!=null?L.rulerK:rulerK,x,y,dir,frame,scale);return _dc.apply(this,arguments);};}
function rulerSheet(){const c=document.createElement("canvas");const sc=4,cw=RW*sc+8;c.width=cw*12+20;c.height=4*(RH*sc+40)+20;const g=c.getContext("2d");g.fillStyle="#2b2433";g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
  for(let k=0;k<4;k++){const y=10+k*(RH*sc+40);g.fillStyle="#fff";g.font="bold 20px sans-serif";g.fillText(KINGDOMS[k].ruler+" — "+KINGDOMS[k].name,12,y+20);let i=0;for(const dir of [0,1,2,3])for(const f of [0,1,2]){g.drawImage(rulerSprite(k,dir,f),10+i*cw,y+28,RW*sc,RH*sc);i++;}}return c.toDataURL();}
