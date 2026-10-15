// ===== 16-BIT JRPG CHARACTER STYLE (original): ~16x28 figure, head ≈ 1/3, 3-4 tone shading, dark outline =====
// Overrides chibi(): same frame codes. 0 idle · 1/2 legacy walk · 10-17 speed-synced phases (→4-frame cycle) · 18 stop
// 3 sit · 4 attack/gesture · 5 drink · 6 cast · 7 hurt. Left facing is the mirrored right sprite.
const T4=c=>[shade(c,1.28),c,shade(c,.74),shade(c,.5)];
const METAL=[190,196,210];
Object.assign(CLS.hero,{cloth:[40,140,150],cape:[176,36,56],band:[240,200,80],pauld:1,prop:"sword",boots:[110,70,40]});
Object.assign(CLS.warrior,{cloth:[170,50,45],armor:1,prop:"sword",shield:1,band:[220,200,90]});
Object.assign(CLS.berserker,{cloth:[120,70,40],bare:1,fur:[200,180,150],band:[200,40,40],prop:"axe"});
Object.assign(CLS.cleric,{hat:"mitre"});Object.assign(CLS.archer,{quiver:1});
Object.assign(HERO_LOOK,{hair:[176,70,40],style:"hero",skin:[248,212,178],eye:[60,110,190]});
chibi=function(L,dir,frame){const key=JSON.stringify(L)+"|"+dir+"|"+frame;let c=chibiCache.get(key);if(c)return c;
  const flip=dir===1;if(flip)dir=2;
  const img={w:CW,h:CHH,data:new Uint8ClampedArray(CW*CHH*4)};const P2=(x,y,col)=>{if(col)px(img,x,y,col);},R=(x,y,w,h,col)=>{if(col&&w>0&&h>0)fillRect(img,x,y,w,h,col);};
  const SB=(x,y,w,h,t)=>{R(x,y,w,h,t[1]);R(x,y,1,h,t[0]);R(x+w-1,y,1,h,t[2]);R(x,y+h-1,w,1,t[2]);P2(x+w-1,y+h-1,t[3]);};
  const C=CLS[L.cls]||CLS.villager;const fem=!!L.fem,eld=!!L.elder,bld=L.build||0;
  const cl=T4(L.cloth&&!C.armor?L.cloth:C.cloth),sk=T4(L.skin),hr=T4(L.hair);
  const side=dir===2,back=dir===3,front=dir===0;
  const ph=frame>=10&&frame<18?frame-10:-1;const q=ph>=0?Math.floor(ph/2):frame===1?0:frame===2?2:frame===18?0:-1; // 0 L-step,1 pass,2 R-step,3 pass
  const sit=frame===3,atk=frame===4,drink=frame===5,cast=frame===6,hurt=frame===7;
  const hy=2+(eld?1:0)+(hurt?1:0); // head top
  const by=12+(eld?1:0);           // body top
  const metal=T4(METAL),boot=T4(C.boots||[90,60,40]),pant=T4(C.armor?[120,120,140]:fem&&L.skirt?L.skin:[80,70,95]);
  // ---- cape / cloak behind ----
  const capeC=C.cape||C.cloak;if(capeC){const t=T4(capeC);const len=C.cape?13:10;
    if(back){SB(4,by,12,len,t);R(5,by,10,1,t[0]);}else if(side){SB(4,by+1,4,len-1,t);if(q>=0){SB(2,by+3,3,len-4,t);}}else{R(4,by+1,1,len-2,t[2]);R(15,by+1,1,len-2,t[3]);}}
  if(C.quiver&&!front){const t=T4([140,90,50]);if(back)SB(11,by-1,3,8,t);else SB(5,by,2,6,t);R(back?11:5,by-2,back?3:2,1,[240,240,240]);}
  // ---- legs ----
  if(sit){SB(6,by+8,8,3,pant);R(6,by+11,3,2,boot[1]);R(11,by+11,3,2,boot[1]);}
  else if(C.robe){const t=cl;for(let i=0;i<9;i++){const w=10+Math.floor(i/3)*1;SB(10-w/2|0,by+7+i,w,1,t);}R(5,by+7,1,9,t[0]);R(14,by+7,1,9,t[2]);
    const fo=side?(q===0?2:q===2?-1:0):0;R(7+fo,27,2,1,boot[2]);R(11-(side?0:0),27,2,1,boot[2]);}
  else{const lift=(l)=>q===(l?2:0)?1:0;
    if(side){const st=q===0||q===2;const fx=st?(q===0?3:-2):0;
      SB(8-fx,by+8,3,7,T4(pant[2]));SB(8-fx,by+14,4,2,T4(boot[2]));SB(9+fx,by+8,3,7-(st?0:0),pant);SB(9+fx,by+14,4,2,boot);}
    else{const lL=lift(0),lR=lift(1);SB(6,by+8,3,7-lL,pant);SB(11,by+8,3,7-lR,pant);SB(5,by+14-lL,4,2,boot);SB(11,by+14-lR,4,2,boot);if(back){P2(5,by+15-lL,boot[3]);P2(14,by+15-lR,boot[3]);}}}
  // ---- torso ----
  const tw=side?8:10,tx=side?6:5;const tor=C.armor?metal:cl;
  if(!C.robe||true)SB(tx,by,tw,8,tor);
  if(C.armor){R(tx+1,by+1,tw-2,1,metal[0]);if(front){R(9,by+2,2,5,T4(C.cloth)[1]);R(tx,by+7,tw,1,T4(C.cloth)[2]);}}
  if(C.bare&&front){SB(7,by+1,6,5,sk);R(9,by+2,2,1,sk[2]);}
  if(C.fur){const t=T4(C.fur);R(tx-1,by,tw+2,2,t[1]);R(tx-1,by,tw+2,1,t[0]);for(let i=0;i<tw+2;i+=2)P2(tx-1+i,by+2,t[2]);}
  if(C.apron&&!back){const t=T4([244,240,228]);SB(side?10:7,by+3,side?3:6,7,t);}
  if(C.trim&&!back){R(9,by,2,C.robe?15:8,T4(C.trim)[1]);R(9,by,1,C.robe?15:8,T4(C.trim)[0]);}
  if(fem&&!sit&&!C.armor){ // tasteful feminine silhouette, fully clothed
    if(front){SB(6,by+2,4,2,cl);SB(10,by+2,4,2,cl);R(6,by+4,8,1,cl[2]);}
    if(side){SB(13,by+2,2,2,cl);}
    const hw=bld===2?2:1;R(tx-hw+(side?1:0),by+6,tw+hw*2-(side?1:0),2,cl[1]);R(tx-hw+(side?1:0),by+7,tw+hw*2-(side?1:0),1,cl[2]);
    if(L.skirt&&!C.robe){const sc=T4(shade(L.cloth||C.cloth,.82));for(let i=0;i<5;i++){const w=tw+2+Math.floor(i/2)*2;SB(10-(w>>1)+(side?0:0),by+8+i,w,1,sc);}}}
  R(tx,by+7,tw,1,fem?T4(L.belt||[150,70,90])[1]:[90,60,30]);if(front&&!C.robe)P2(9,by+7,[230,200,90]);
  if(C.pauld){SB(3,by,3,2,metal);SB(14,by,3,2,metal);}
  // ---- arms ----
  const armC=C.bare?sk:C.armor?metal:cl;let hand=null;
  if(side){const sw=q===0?2:q===2?-2:0;
    if(atk){SB(11,by+2,5,2,armC);R(16,by+2,2,2,sk[1]);hand=[17,by+2,"fwd"];}
    else if(cast){SB(10,by-3,2,5,armC);R(10,by-4,2,1,sk[1]);hand=[10,by-4,"up"];}
    else if(drink){SB(10,by+1,2,3,armC);R(11,by-1,2,2,sk[1]);hand=[12,by-1,"mouth"];}
    else{SB(9+sw,by+1,3,6,armC);R(9+sw,by+7,3,1,sk[1]);hand=[10+sw,by+7,"down"];}
    if(C.shield&&!back){const t=T4([150,60,40]);SB(5,by+2,4,6,t);P2(6,by+4,[240,210,90]);}}
  else{const sL=q===0?-1:q===2?1:0;
    if(cast){SB(2,by-3,2,5,armC);SB(16,by-3,2,5,armC);R(2,by-4,2,1,sk[1]);R(16,by-4,2,1,sk[1]);hand=[16,by-4,"up"];}
    else{SB(3,by+1+(sL>0?1:0),2,6-(sL>0?1:0),armC);R(3,by+7,2,1,sk[1]);
      if(atk&&!back){SB(15,by-2,2,5,armC);R(15,by-3,2,1,sk[1]);hand=[16,by-3,"up"];}
      else if(drink){SB(14,by+1,2,3,armC);R(13,by,2,2,sk[1]);hand=[14,by-1,"mouth"];}
      else{SB(15,by+1+(sL<0?1:0),2,6-(sL<0?1:0),armC);R(15,by+7,2,1,sk[1]);hand=[16,by+7,"down"];}}
    if(C.shield&&front){const t=T4([150,60,40]);SB(1,by+2,4,6,t);R(2,by+3,2,1,t[0]);P2(2,by+5,[240,210,90]);}}
  if(back&&capeC){const t=T4(capeC);const len=C.cape?14:10;SB(4,by,12,len,t);R(5,by,10,1,t[0]);R(9,by+2,1,len-3,t[2]);}
  // ---- head ----
  const hx=side?6:5;SB(hx,hy+2,side?9:10,8,sk);R(hx+1,hy+9,side?7:8,1,sk[2]);
  if(!back){if(front){const ey=hy+5;if(hurt){P2(7,ey+1,[30,20,30]);P2(8,ey,[30,20,30]);P2(12,ey+1,[30,20,30]);P2(11,ey,[30,20,30]);}
      else{R(7,ey,2,3,[255,255,255]);R(11,ey,2,3,[255,255,255]);R(8,ey,1,3,[24,16,28]);R(11,ey,1,3,[24,16,28]);P2(8,ey+2,L.eye||[60,110,190]);P2(11,ey+2,L.eye||[60,110,190]);
        if(fem){R(7,ey-1,2,1,[24,16,28]);R(11,ey-1,2,1,[24,16,28]);}}
      R(9,ey+4,2,1,fem?(L.lip||[200,80,90]):sk[2]);if(fem||L.cls==="child"){P2(6,ey+3,[255,150,150]);P2(13,ey+3,[255,150,150]);}
      if(eld){R(7,ey-1,2,1,sk[2]);R(11,ey-1,2,1,sk[2]);}}
    else{const ey=hy+5;if(hurt){P2(12,ey+1,[30,20,30]);}else{R(12,ey,2,3,[255,255,255]);R(13,ey,1,3,[24,16,28]);P2(13,ey+2,L.eye||[60,110,190]);if(fem)R(12,ey-1,2,1,[24,16,28]);}
      P2(15,ey+2,sk[1]);P2(15,ey+3,sk[2]);R(13,ey+4,2,1,fem?(L.lip||[200,80,90]):sk[2]);SB(8,ey,2,3,sk);P2(8,ey+1,sk[2]);}
    if(L.beard){const t=hr;if(front){SB(6,hy+8,8,3,t);R(8,hy+8,4,1,sk[2]);}else SB(10,hy+8,5,3,t);}}
  // ---- hair ----
  const st=L.style;const hood=C.hood,helm=C.helm;
  if(!helm&&!hood&&!(st==="bald"&&!back)){
    SB(4,hy,12,3,hr);R(5,hy-1,10,1,hr[1]);R(5,hy,6,1,hr[0]);
    if(back){SB(4,hy,12,9,hr);R(5,hy+1,4,1,hr[0]);}
    else if(side){SB(4,hy+1,5,7,hr);R(9,hy+2,6,1,hr[1]);}
    else{R(4,hy+2,1,5,hr[1]);R(15,hy+2,1,5,hr[2]);R(5,hy+2,3,1,hr[1]);R(11,hy+2,4,1,hr[1]);}
    const lng=(n)=>{if(side)SB(4,hy+3,4,n,hr);else{SB(3,hy+2,2,n,hr);SB(15,hy+2,2,n,hr);if(back)SB(4,hy+8,12,n-6,hr);}};
    if(st==="hero"){for(const [x,y] of [[4,-2],[7,-3],[10,-3],[13,-2],[15,0],[3,0]])R(x,hy+y,2,3,hr[1]),P2(x,hy+y,hr[0]);if(front){R(8,hy+2,3,2,hr[1]);P2(9,hy+4,hr[2]);}}
    if(st==="spiky"){for(const x of [4,7,10,13])R(x,hy-2,2,2,hr[1]);}
    if(st==="long")lng(10);
    if(st==="wavy"){lng(12);if(!side)for(let k=0;k<6;k++){P2(3+(k%2),hy+3+k*2,hr[0]);P2(16-(k%2),hy+3+k*2,hr[2]);}}
    if(st==="pony"){if(side)SB(2,hy+2,3,8,hr);else if(back)SB(8,hy+3,4,10,hr);else R(15,hy+3,2,4,hr[1]);R(back?8:side?3:15,hy+2,back?4:2,1,[220,60,90]);}
    if(st==="side"){if(!side)SB(15,hy+2,3,10,hr);else SB(3,hy+3,3,9,hr);}
    if(st==="braid"){const bx=back?9:side?3:15;for(let k=0;k<4;k++)SB(bx+(k%2),hy+4+k*3,2,3,hr);}
    if(st==="twin"){SB(1,hy+2,3,8,hr);SB(16,hy+2,3,8,hr);R(1,hy+1,3,1,T4(L.accC||[230,80,110])[1]);R(16,hy+1,3,1,T4(L.accC||[230,80,110])[1]);}
    if(st==="bob"){if(!side){SB(3,hy+2,2,7,hr);SB(15,hy+2,2,7,hr);}else SB(4,hy+2,5,8,hr);if(back)SB(4,hy+7,12,3,hr);}
    if(st==="bun"||st==="updo"){SB(7,hy-3,6,3,hr);P2(8,hy-3,hr[0]);}
    if(st==="curly"){for(let k=0;k<5;k++){SB(3,hy+1+k*2,2,2,k%2?hr:T4(hr[2]));SB(15,hy+1+k*2,2,2,k%2?T4(hr[2]):hr);}}
    if(front&&st!=="hero"&&st!=="bald")R(5,hy+2,4,1,hr[1]);}
  if(side&&q>=0&&!helm&&!hood&&st!=="bald"){R(3,hy+1,1,3,hr[2]);P2(2,hy+2,hr[2]);if(fem&&L.acc==="scarf")SB(2,by+1,4,2,T4(L.accC||[230,80,110]));}
  if(hood){const t=T4(C.cloak||C.cloth);SB(4,hy-1,12,5,t);if(!back){SB(3,hy+2,2,9,t);SB(15,hy+2,2,9,t);if(side)SB(4,hy+2,4,8,t);}else SB(4,hy+2,12,9,t);}
  if(helm){SB(4,hy-1,12,6,metal);R(5,hy,10,1,metal[0]);R(9,hy-3,2,2,[200,50,50]);if(front)R(9,hy+4,2,3,metal[2]);if(back)SB(4,hy+4,12,4,metal);}
  if(C.band&&!helm&&!hood){R(4,hy+2,12,1,T4(C.band)[1]);if(back||side){R(back?9:4,hy+3,2,3,T4(C.band)[2]);}}
  const hat=C.hat;
  if(hat&&hat.length===3){const t=T4(hat);SB(2,hy+1,16,2,t);SB(5,hy-2,10,3,t);SB(7,hy-4,6,2,t);R(9,hy-6,3,2,t[1]);R(11,hy-7,2,1,t[0]);R(5,hy,10,1,[230,190,70]);}
  if(hat==="straw"){const t=T4([232,200,110]);SB(1,hy,18,2,t);SB(5,hy-2,10,3,t);R(5,hy,10,1,[190,60,50]);}
  if(hat==="cap"){const t=T4([50,90,150]);SB(4,hy-1,12,3,t);if(front)R(5,hy+2,10,1,t[2]);if(side)R(13,hy+1,4,1,t[2]);}
  if(hat==="mitre"){const t=T4([245,240,225]);SB(6,hy-4,8,5,t);R(9,hy-4,2,5,[230,190,70]);}
  // accessories for women
  if(fem&&L.acc&&!helm){const ac=T4(L.accC||[230,80,110]);
    if(L.acc==="flower")SB(13,hy-1,3,3,ac);if(L.acc==="ribbon"&&!hat)R(7,hy-2,6,2,ac[1]);if(L.acc==="band"&&!hat&&!C.band)R(4,hy+1,12,1,ac[1]);
    if(L.acc==="earring"&&front){P2(4,hy+7,[255,220,90]);P2(15,hy+7,[255,220,90]);}if(L.acc==="necklace"&&front){R(7,by,6,1,[240,210,90]);P2(9,by+1,ac[1]);}
    if(L.acc==="scarf"&&!back){SB(tx,by,tw,2,ac);}if(L.acc==="glasses"&&front){R(6,hy+5,4,1,[60,40,40]);R(10,hy+5,4,1,[60,40,40]);}}
  if(eld&&!back&&!side&&L.cls!=="noble"&&!C.prop&&!L.noArm){R(17,by+2,1,14,[120,80,40]);R(16,by+1,2,1,[120,80,40]);} // walking cane
  // ---- prop in hand ----
  const pr=L.noArm?null:C.prop;if(pr&&hand&&!back){const [x,y,m]=hand;const blade=[[230,236,248],[180,190,210]];const wood=[130,85,40];
    const up=m==="up"||m==="down"&&false;
    if(pr==="sword"){if(m==="fwd"){R(x,y,6,1,blade[0]);R(x,y+1,6,1,blade[1]);R(x-1,y-1,1,4,[200,160,60]);}else if(m==="up"){R(x,y-8,1,8,blade[0]);R(x+1,y-8,1,8,blade[1]);R(x-1,y,4,1,[200,160,60]);}else{R(x,y-7,1,8,blade[0]);R(x+1,y-7,1,8,blade[1]);R(x-1,y,4,1,[200,160,60]);}}
    if(pr==="dagger"){R(x,y-4,1,4,blade[0]);R(x-1,y,3,1,[120,80,40]);}
    if(pr==="staff"){R(x,y-12,1,17,wood);R(x-1,y-14,3,3,[120,220,255]);P2(x,y-13,[255,255,255]);}
    if(pr==="spear"){R(x,y-13,1,18,wood);R(x-1,y-15,3,2,blade[0]);}
    if(pr==="axe"){R(x,y-8,1,10,wood);SB(x+1,y-9,4,5,T4([200,205,215]));}
    if(pr==="hammer"){R(x,y-5,1,7,wood);SB(x-1,y-8,4,3,T4([150,150,160]));}
    if(pr==="bow"){for(let i=0;i<11;i++)P2(x+1+(i>1&&i<9?1:0),y-8+i,[140,90,40]);R(x+1,y-8,1,11,[235,235,235]);}
    if(pr==="mug"){SB(x-1,y-2,3,3,T4([150,100,50]));R(x-1,y-3,3,1,[255,250,230]);}
    if(pr==="club"){R(x,y-7,2,8,[120,80,40]);SB(x-1,y-10,4,4,T4([100,65,30]));}
    if(pr==="sling"){R(x,y-3,1,4,[150,110,60]);}}
  if(pr==="sword"&&back){R(12,by-2,1,10,[200,206,220]);R(11,by+1,3,1,[200,160,60]);} // sword on back
  // ---- outline ----
  const src=new Uint8ClampedArray(img.data);const A=(x,y)=>x<0||y<0||x>=CW||y>=CHH?0:src[(y*CW+x)*4+3];
  for(let y=0;y<CHH;y++)for(let x=0;x<CW;x++){const i=(y*CW+x)*4;if(!src[i+3]&&(A(x-1,y)||A(x+1,y)||A(x,y-1)||A(x,y+1))){img.data[i]=24;img.data[i+1]=14;img.data[i+2]=24;img.data[i+3]=255;}}
  if(flip){const d=img.data,o=new Uint8ClampedArray(d.length);for(let y=0;y<CHH;y++)for(let x=0;x<CW;x++){const a=(y*CW+x)*4,b=(y*CW+(CW-1-x))*4;o[b]=d[a];o[b+1]=d[a+1];o[b+2]=d[a+2];o[b+3]=d[a+3];}img.data=o;}
  c=mkCanvas(CW,CHH);c.getContext("2d").putImageData(new ImageData(img.data,CW,CHH),0,0);chibiCache.set(key,c);return c;};
// elders & children: age-appropriate looks
const _npcLookC5=npcLookC;npcLookC=function(n){if(n._look)return n._look;const L=_npcLookC5(n);if(n.age>=60){L.elder=1;L.hair=[[220,220,225],[190,190,195],[160,160,170]][n.look%3];if(!L.fem&&n.look%3===0)L.style="bald";if(!L.fem&&n.look%2)L.beard=true;delete L.skirt;}
  if(n.age<15){L.fem=0;L.beard=false;L.cls="child";L.cloth=[[230,140,60],[90,160,220],[220,90,120],[110,180,90],[200,170,60],[150,110,200]][n.look%6];}else if(!L.cloth&&["villager","farmer","fisher","shop"].includes(L.cls))L.cloth=shade((CLS[L.cls]||CLS.villager).cloth,0.75+(n.look%7)/12);return L;};
