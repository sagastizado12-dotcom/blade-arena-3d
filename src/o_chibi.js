// ===== CHIBI PIXEL CHARACTERS (original generator) =====
const CW=20,CHH=30;
const shade=(c,f)=>[clamp(c[0]*f,0,255)|0,clamp(c[1]*f,0,255)|0,clamp(c[2]*f,0,255)|0];
const RACES={human:{skins:[[247,210,175],[230,180,140],[196,140,100],[140,95,65],[255,224,200]]},elf:{skins:[[250,222,200],[236,205,185]],ears:1},orc:{skins:[[110,170,80],[90,150,70]],tusk:1},goblin:{skins:[[150,200,80],[130,185,70]],ears:2},dwarf:{skins:[[240,190,150],[220,165,125]],beard:1}};
const HAIRC=[[70,45,25],[30,24,24],[220,170,70],[180,70,30],[235,235,240],[120,80,160],[200,110,60],[60,60,70]];
const CLS={warrior:{cloth:[150,60,50],armor:1,prop:"sword"},knight:{cloth:[90,100,140],armor:1,helm:1,prop:"sword"},mage:{cloth:[70,60,170],robe:1,hat:[60,50,150],prop:"staff"},archer:{cloth:[60,130,60],cloak:[40,90,40],prop:"bow"},
 rogue:{cloth:[60,55,70],cloak:[40,35,50],hood:1,prop:"dagger"},cleric:{cloth:[235,230,215],robe:1,trim:[230,190,70],prop:"staff"},berserker:{cloth:[130,70,40],armor:0,prop:"axe"},gob:{cloth:[110,80,50],prop:"dagger"},gsling:{cloth:[90,70,40],prop:"sling"},shaman:{cloth:[90,40,110],hood:1,cloak:[70,30,90],prop:"staff"},orc:{cloth:[90,60,40],armor:0,prop:"axe"},orcclub:{cloth:[80,70,50],prop:"club"},chief:{cloth:[120,30,30],armor:1,helm:1,prop:"axe"},
 barmaid:{cloth:[180,60,80],apron:1,prop:"mug"},bartender:{cloth:[90,70,50],apron:1,prop:"mug"},shop:{cloth:[60,120,170],apron:1},farmer:{cloth:[170,140,70],hat:"straw"},guard:{cloth:[110,110,130],armor:1,helm:1,prop:"spear"},
 smith:{cloth:[90,60,40],apron:1,prop:"hammer"},fisher:{cloth:[60,140,170],hat:"cap"},noble:{cloth:[140,40,90],trim:[240,200,80],robe:1},villager:{cloth:[120,150,90]},child:{cloth:[230,140,60]},hero:{cloth:[50,110,200],cape:[200,50,60],prop:"sword"}};
function chibiLook(seed,cls,race){const h=k=>Math.floor(hash2(seed,k,77)*9973);race=race||"human";
  const R=RACES[race];return{race,cls,skin:R.skins[h(2)%R.skins.length],hair:HAIRC[h(4)%HAIRC.length],style:["short","long","spiky","bun","pony","bald"][h(5)%6],beard:R.beard||(race==="human"&&h(6)%3===0),eye:[[60,120,200],[60,140,70],[110,70,40],[150,60,160]][h(7)%4]};}
const chibiCache=new Map();
function chibi(L,dir,frame){const key=JSON.stringify([L.race,L.cls,L.skin,L.hair,L.style,L.beard,L.noArm,dir,frame,L.fem,L.build,L.acc,L.cloth,L.lip,L.eye]);let c=chibiCache.get(key);if(c)return c;
  const img={w:CW,h:CHH,data:new Uint8ClampedArray(CW*CHH*4)};const P2=(x,y,col)=>px(img,x,y,col),Rc=(x,y,w,h,col)=>fillRect(img,x,y,w,h,col);
  const C2=CLS[L.cls]||CLS.villager;const cl=L.cloth&&!C2.armor?L.cloth:C2.cloth,cd=shade(cl,.72),cli=shade(cl,1.18);const sk=L.skin,skd=shade(sk,.82);const hr=L.hair,hd=shade(hr,.7),hl=shade(hr,1.25);
  const oy=4;const ph=frame>=10&&frame<18?frame-10:-1;const walk=ph>=0?Math.round(Math.sin(ph*Math.PI/4)*2):frame===18?1:frame===1?1:frame===2?-1:0;const asw=Math.sign(walk);const fem=!!L.fem,bld=L.build||0;const sit=frame===3,gest=frame===4,drink=frame===5;const side=dir===1||dir===2,back=dir===3;
  // cape
  if(C2.cape&&!back){Rc(4,oy+12,12,9,shade(C2.cape,.8));}
  if(C2.cape&&back){Rc(4,oy+12,12,10,C2.cape);Rc(4,oy+12,12,2,shade(C2.cape,1.2));}
  // legs/feet
  if(!sit){const lc=C2.armor?[110,110,125]:[70,60,80];if(C2.robe){Rc(5,oy+16,10,9,cl);Rc(5,oy+16,2,9,cli);Rc(13,oy+16,2,9,cd);Rc(7+walk,oy+24,2,2,[60,40,30]);Rc(11-walk,oy+24,2,2,[60,40,30]);}
    else if(fem&&!C2.armor&&L.skirt){const sc2=shade(cl,.85);Rc(4-(bld>1?1:0),oy+19,12+(bld>1?2:0),3,sc2);Rc(5,oy+22,10,1,shade(sc2,.8));Rc(6+(side?walk:0),oy+23,3,1,sk);Rc(11-(side?walk:0),oy+23,3,1,skd);Rc(6+(side?walk:0),oy+24,3,2,[90,40,50]);Rc(11-(side?walk:0),oy+24,3,2,[90,40,50]);}
    else if(side){Rc(8+walk,oy+19,3,5,lc);Rc(9-walk,oy+19,3,5,shade(lc,.8));Rc(8+walk*2,oy+24,4,2,[60,40,30]);}
    else{Rc(6,oy+19+(walk>0?-1:0),3,5,lc);Rc(11,oy+19+(walk<0?-1:0),3,5,shade(lc,.8));Rc(6,oy+24+(walk>0?-1:0),3,2,[60,40,30]);Rc(11,oy+24+(walk<0?-1:0),3,2,[60,40,30]);}}
  // body
  const by=oy+13+(sit?2:0);Rc(5,by,10,7,cl);Rc(5,by,10,1,cli);Rc(13,by+1,2,6,cd);
  if(C2.armor){Rc(5,by,10,6,[170,175,190]);Rc(5,by,10,1,[230,235,245]);Rc(9,by+1,2,5,[120,125,140]);Rc(4,by,2,2,[200,205,215]);Rc(14,by,2,2,[200,205,215]);}
  if(C2.apron&&!back){Rc(6,by+2,8,6,[240,236,225]);Rc(6,by+2,8,1,[255,255,255]);}
  if(C2.trim){Rc(9,by,2,7,C2.trim);}
  if(C2.cloak){Rc(4,by,2,8,C2.cloak);Rc(14,by,2,8,C2.cloak);}
  if(fem&&!sit){/* feminine silhouette: tasteful bust shading + fuller hips, fully clothed */
    if(!back){if(side){const fx=dir===1?4:14;Rc(fx,by+1,2,3,cl);P2(fx,by+3,cd);}else{Rc(5,by+1,10,3,cl);Rc(6,by+1,3,2,cli);Rc(11,by+1,3,2,cli);Rc(6,by+3,8,1,cd);P2(9,by+2,cd);P2(10,by+2,cd);}}
    Rc(5,by+4,10,1,shade(cl,.9));Rc(6,by+4,8,1,cl);/* waist */
    const hw=bld===2?2:1;Rc(5-hw,by+5,10+hw*2,2,cl);Rc(5-hw,by+5,1,2,cd);Rc(14+hw,by+5,1,2,cd);}
  Rc(5,by+6,10,1,fem?(L.belt||[150,70,90]):[90,60,30]);
  // arms
  const ay=by+1+(gest?-3:asw);const lay=by+1-asw;Rc(3,lay,2,5,cl);P2(3,lay+5,sk);P2(4,lay+5,sk);
  if(L.noArm){Rc(15,by+1,2,2,[170,30,40]);}else if(!side||dir===2){Rc(15,ay,2,5,cl);Rc(15,ay+5,2,1,sk);}
  // prop in right hand
  const hx=16,hy=(drink?by-1:ay+5);const pr=L.noArm?null:C2.prop;
  if(pr==="sword"){Rc(hx,hy-8,1,8,[220,228,240]);P2(hx,hy-9,[255,255,255]);Rc(hx-1,hy-1,3,1,[200,160,60]);}
  if(pr==="dagger"){Rc(hx,hy-4,1,4,[220,228,240]);Rc(hx-1,hy,3,1,[120,80,40]);}
  if(pr==="staff"){Rc(hx,hy-12,1,16,[130,85,40]);Rc(hx-1,hy-14,3,3,[120,220,255]);P2(hx,hy-13,[255,255,255]);}
  if(pr==="spear"){Rc(hx,hy-12,1,16,[130,85,40]);Rc(hx-1,hy-14,3,2,[220,228,240]);}
  if(pr==="axe"){Rc(hx,hy-7,1,8,[130,85,40]);Rc(hx+1,hy-8,3,4,[200,205,215]);}
  if(pr==="hammer"){Rc(hx,hy-5,1,6,[130,85,40]);Rc(hx-1,hy-7,4,3,[150,150,160]);}
  if(pr==="bow"){for(let i=0;i<9;i++)P2(hx+1+(i>1&&i<7?1:0),hy-7+i,[140,90,40]);Rc(hx+1,hy-7,1,9,[230,230,230]);}
  if(pr==="club"&&!L.noArm){Rc(hx,hy-7,2,8,[120,80,40]);Rc(hx-1,hy-9,4,3,[100,65,30]);}
  if(pr==="sling"&&!L.noArm){Rc(hx,hy-3,1,4,[150,110,60]);P2(hx+1,hy-4,[120,120,120]);}
  if(pr==="mug"){Rc(hx,hy-2,3,3,[150,100,50]);Rc(hx,hy-3,3,1,[255,250,230]);P2(hx+3,hy-1,[150,100,50]);}
  // head (big)
  const hy0=oy+(sit?2:0)+(frame===0||frame>2?0:Math.abs(walk)?-0:0);Rc(4,hy0+2,12,11,sk);Rc(5,hy0+1,10,1,sk);Rc(14,hy0+3,2,9,skd);Rc(5,hy0+12,10,1,skd);
  const R=RACES[L.race];
  if(R.ears===1){Rc(2,hy0+6,2,2,sk);P2(1,hy0+5,sk);Rc(16,hy0+6,2,2,skd);P2(18,hy0+5,skd);}
  if(R.ears===2){Rc(1,hy0+5,3,3,sk);P2(0,hy0+4,sk);Rc(16,hy0+5,3,3,skd);P2(19,hy0+4,skd);}
  if(!back){const ey=hy0+7;
    if(dir===0){Rc(6,ey,2,3,[255,255,255]);Rc(12,ey,2,3,[255,255,255]);Rc(7,ey+1,1,2,L.eye);Rc(12,ey+1,1,2,L.eye);P2(7,ey+1,[20,20,30]);P2(12,ey+1,[20,20,30]);
      if(fem){P2(6,ey-1,[30,20,30]);P2(13,ey-1,[30,20,30]);P2(5,ey,[30,20,30]);P2(14,ey,[30,20,30]);}
      P2(9,ey+3,skd);if(fem&&!gest){Rc(9,ey+4,2,1,L.lip||[200,80,90]);}else if(gest)Rc(9,ey+4,2,1,[150,50,50]);else P2(10,ey+4,[160,80,70]);Rc(5,ey+3,1,1,[255,160,150]);Rc(14,ey+3,1,1,[255,160,150]);}
    else{const ex=dir===1?5:13;Rc(ex,ey,2,3,[255,255,255]);P2(dir===1?ex:ex+1,ey+1,L.eye);P2(dir===1?ex:ex+1,ey+2,[20,20,30]);}
    if(R.tusk&&dir===0){P2(7,hy0+11,[255,255,240]);P2(12,hy0+11,[255,255,240]);}
    if(L.beard){Rc(5,hy0+10,10,4,hr);Rc(6,hy0+14,8,2,hd);Rc(8,hy0+10,4,1,[150,60,60]);}}
  // hair
  if(L.style!=="bald"||back){Rc(4,hy0,12,4,hr);Rc(5,hy0-1,10,1,hr);Rc(5,hy0,6,1,hl);Rc(3,hy0+2,2,4,hr);Rc(15,hy0+2,2,4,hd);
    if(back)Rc(4,hy0,12,12,hr),Rc(4,hy0+10,12,2,hd);
    if(L.style==="long"){Rc(3,hy0+2,2,11,hr);Rc(15,hy0+2,2,11,hd);}
    if(L.style==="spiky"){P2(5,hy0-2,hr);P2(8,hy0-2,hr);P2(11,hy0-2,hr);P2(14,hy0-1,hr);}
    if(L.style==="bun"){Rc(8,hy0-3,4,3,hr);P2(9,hy0-3,hl);}
    if(L.style==="pony"){Rc(15,hy0+3,3,6,hr);}
    if(L.style==="wavy"){Rc(2,hy0+2,3,13,hr);Rc(15,hy0+2,3,13,hd);for(let k=0;k<5;k++){P2(2+(k%2),hy0+4+k*2,hl);}}
    if(L.style==="twin"){Rc(1,hy0+3,3,8,hr);Rc(16,hy0+3,3,8,hd);P2(2,hy0+3,hl);Rc(1,hy0+2,3,1,L.accC||[230,80,110]);Rc(16,hy0+2,3,1,L.accC||[230,80,110]);}
    if(L.style==="braid"){Rc(15,hy0+4,2,3,hr);Rc(16,hy0+7,2,3,hd);Rc(15,hy0+10,2,3,hr);Rc(16,hy0+13,2,2,hd);}
    if(L.style==="bob"){Rc(3,hy0+2,2,8,hr);Rc(15,hy0+2,2,8,hd);Rc(4,hy0+9,2,1,hd);Rc(14,hy0+9,2,1,hd);}
    if(L.style==="updo"){Rc(6,hy0-4,8,4,hr);Rc(7,hy0-5,6,1,hr);P2(8,hy0-4,hl);P2(10,hy0-4,hl);}
    if(L.style==="side"){Rc(2,hy0+2,3,10,hr);Rc(1,hy0+11,3,3,hd);Rc(5,hy0+3,6,1,hr);}
    if(L.style==="curly"){for(let k=0;k<6;k++){Rc(2+(k%2),hy0+1+k*2,2,2,k%2?hd:hr);Rc(16-(k%2),hy0+1+k*2,2,2,k%2?hr:hd);}Rc(4,hy0-2,12,2,hr);}
    if(dir===0&&L.style!=="bald")Rc(5,hy0+3,4,1,hr);}
  // hats / helms / hoods
  if(C2.hat&&C2.hat.length===3){const hc=C2.hat;Rc(2,hy0+2,16,2,hc);Rc(5,hy0-1,10,3,hc);Rc(7,hy0-4,6,3,hc);Rc(8,hy0-6,4,2,hc);Rc(10,hy0-8,3,2,shade(hc,1.2));Rc(5,hy0+1,10,1,[230,190,70]);}
  if(C2.hat==="straw"){Rc(1,hy0+1,18,2,[230,200,110]);Rc(5,hy0-2,10,3,[220,185,95]);Rc(5,hy0,10,1,[190,60,50]);}
  if(C2.hat==="cap"){Rc(4,hy0-1,12,3,[50,90,150]);if(dir===0)Rc(5,hy0+2,10,1,[40,70,120]);}
  if(C2.helm){Rc(3,hy0-1,14,5,[170,175,190]);Rc(4,hy0-1,12,1,[230,235,245]);Rc(9,hy0-3,2,2,[200,60,60]);if(!back&&dir===0)Rc(9,hy0+4,2,4,[150,155,170]);}
  if(C2.hood){Rc(3,hy0-1,14,5,C2.cloak);Rc(2,hy0+3,2,9,C2.cloak);Rc(16,hy0+3,2,9,shade(C2.cloak,.8));if(back)Rc(3,hy0,14,12,C2.cloak);}
  if(fem&&L.acc&&!C2.helm){const ac=L.accC||[230,80,110];
    if(L.acc==="flower"){Rc(14,hy0,3,3,ac);P2(15,hy0+1,[255,240,120]);}
    if(L.acc==="band"&&!C2.hat){Rc(4,hy0+1,12,1,ac);}
    if(L.acc==="earring"&&!back&&dir===0){P2(3,hy0+9,[255,220,90]);P2(16,hy0+9,[255,220,90]);}
    if(L.acc==="ribbon"&&!C2.hat){Rc(8,hy0-3,4,2,ac);P2(7,hy0-2,ac);P2(12,hy0-2,ac);}
    if(L.acc==="necklace"&&!back){Rc(7,by,6,1,[240,210,90]);P2(9,by+1,ac);}
    if(L.acc==="scarf"&&!back){Rc(5,by,10,2,ac);Rc(12,by+2,2,3,ac);}
    if(L.acc==="glasses"&&!back&&dir===0){Rc(5,hy0+7,4,1,[60,40,40]);Rc(11,hy0+7,4,1,[60,40,40]);P2(9,hy0+7,[60,40,40]);P2(10,hy0+7,[60,40,40]);}}
  // outline
  const src=new Uint8ClampedArray(img.data);const A=(x,y)=>x<0||y<0||x>=CW||y>=CHH?0:src[(y*CW+x)*4+3];
  for(let y=0;y<CHH;y++)for(let x=0;x<CW;x++){const i=(y*CW+x)*4;if(!src[i+3]&&(A(x-1,y)||A(x+1,y)||A(x,y-1)||A(x,y+1))){img.data[i]=28;img.data[i+1]=16;img.data[i+2]=26;img.data[i+3]=255;}}
  c=mkCanvas(CW,CHH);c.getContext("2d").putImageData(new ImageData(img.data,CW,CHH),0,0);chibiCache.set(key,c);return c;}
const ROLE_CLS={leader:"noble",innkeeper:"bartender",shopkeeper:"shop",guard:"guard",smith:"smith",fisher:"fisher",farmer:"farmer",child:"child",receptionist:"barmaid",adventurer:null};
function npcLookC(n){if(!n._look){const cls=n.adv?n.adv.cls:ROLE_CLS[n.role]||"villager";n._look=chibiLook(n.look,cls,"human");
  if(n.role==="innkeeper"&&n.look%2)n._look.cls="barmaid";}return n._look;}
const HERO_LOOK={race:"human",cls:"hero",skin:[247,210,175],hair:[90,55,30],style:"spiky",beard:false,eye:[60,120,200]};
function dir4(dx,dy,old){if(Math.abs(dx)+Math.abs(dy)<0.05)return old;const ax=Math.abs(dx),ay=Math.abs(dy);
  /* diagonal: keep the current facing while it still matches one axis, so turns don't flicker */
  if(old!=null){if((old===1&&dx<0||old===2&&dx>0)&&ax>=ay*0.6)return old;if((old===3&&dy<0||old===0&&dy>0)&&ay>=ax*0.6)return old;}
  return ax>ay?(dx<0?1:2):(dy<0?3:0);}
function drawChibi(L,x,y,dir,frame,scale){const s=chibi(L,dir,frame);const sc=scale||1,hs=sc*(L.ht||1),ws=sc*(L.wd||1);ctx.drawImage(s,Math.round(x-CW*ws/2),Math.round(y-CHH*hs),Math.round(CW*ws),Math.round(CHH*hs));}
