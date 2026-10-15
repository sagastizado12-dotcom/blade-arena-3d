// ===== ROYAL: bright castle exterior, throne room, DQ-style King, profanity setting =====
// ---- castle exterior (96x88 logical, same palette as the town buildings) ----
function brightCastle(){const c=mkCanvas(192,176),g=c.getContext("2d");g.imageSmoothingEnabled=false;g.scale(2,2);const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};const OL="#3a2a20";
  const ST="#e8e0d0",ST2="#cfc6b4",ST3="#b4aa98";
  const stone=(x,y,w,h)=>{R(x-1,y-1,w+2,h+2,OL);R(x,y,w,h,ST);for(let yy=y+1;yy<y+h;yy+=4){R(x,yy+3,w,1,ST2);for(let xx=x+((yy-y)/4%2?3:0);xx<x+w;xx+=7)R(xx,yy,1,3,ST2);}R(x,y,w,1,"#fff8ec");R(x,y+h-2,w,2,ST3);};
  const cren=(x,y,w)=>{for(let xx=x;xx<x+w-2;xx+=5){R(xx-1,y-4,5,5,OL);R(xx,y-3,3,4,ST);R(xx,y-3,3,1,"#fff8ec");}};
  const roof=(cx,base,hw,h,col,hi,dk)=>{for(let i=0;i<h;i++){const w=Math.round(hw*(i+1)/h);R(cx-w-1,base-h+i,2*w+2,1,OL);R(cx-w,base-h+i,2*w,1,col);R(cx-w,base-h+i,Math.max(1,Math.round(w*.5)),1,hi);R(cx+w-2,base-h+i,2,1,dk);}R(cx,base-h-6,1,6,OL);R(cx+1,base-h-6,5,3,"#d83a3a");R(cx-1,base-h-1,3,2,"#ffd23a");};
  const win=(x,y)=>{R(x-1,y-1,5,7,OL);R(x,y,3,5,"#8ad0f0");R(x,y,3,1,"#c8f0ff");R(x+1,y,1,5,"#f4ecd8");};
  const banner=(x,y,col)=>{R(x-1,y-1,7,15,OL);R(x,y,5,12,col);R(x,y,5,2,"#ffd23a");R(x+2,y+4,1,5,"#ffd23a");R(x,y+12,2,2,col);R(x+3,y+12,2,2,col);};
  // courtyard (cobble + lawn + flower beds)
  R(4,70,88,18,"#7cc85a");for(let i=0;i<30;i++)R(6+((i*37)%84),71+((i*13)%15),1,1,"#5aa840");R(36,70,24,18,"#d8ccb0");for(let yy=72;yy<88;yy+=4)for(let xx=37+((yy/4)%2?2:0);xx<60;xx+=5)R(xx,yy,4,3,"#e8dcc0");
  for(const fx of [12,72]){R(fx,80,12,5,"#6a4a2a");for(let i=0;i<5;i++)R(fx+1+i*2,80+(i%2),2,2,["#ff5a6a","#ffd23a","#ff8ad8"][i%3]);}
  // outer curtain wall with gate
  stone(4,50,88,20);cren(4,50,88);
  R(38,52,20,18,OL);R(39,54,18,16,"#3a2418");R(40,53,16,2,OL);for(let xx=41;xx<56;xx+=3)R(xx,55,1,15,"#8a8a90");for(let yy=58;yy<70;yy+=4)R(39,yy,18,1,"#8a8a90");R(36,50,24,3,"#c8a040");
  win(14,58);win(26,58);win(66,58);win(78,58);
  // keep
  stone(26,22,44,28);cren(26,22,44);win(34,30);win(46,28);win(58,30);R(45,38,6,10,OL);R(46,39,4,9,"#8a4e28");
  roof(48,18,16,14,"#d84a3a","#f0705a","#a8302a");
  // corner towers with steep blue roofs
  for(const tx of [2,78]){stone(tx,14,16,56);win(tx+6,24);win(tx+6,40);roof(tx+8,14,11,18,"#3c64b0","#5a88d8","#2a4888");}
  banner(22,30,"#d83a3a");banner(69,30,"#d83a3a");banner(45,52,"#3c64b0");
  return c;}
castleSprite=function(){return brightCastle();};
// ---- King look: DQ6-style chibi, crown, royal cape, white beard ----
CLS.king={cloth:[120,50,160],trim:[240,200,80],robe:1,cape:[200,40,50]};
const KING_LOOK=(()=>{const L=chibiLook(4242,"king","human");return{...L,cls:"king",hair:[236,236,242],beard:true,style:"short",king:1,fem:false,skin:[244,206,172]};})();
const _chibiK=chibi;const kingCache=new Map();
chibi=function(L,dir,frame){const s=_chibiK(L,dir,frame);if(!L||!L.king)return s;const key=dir+":"+frame;let c=kingCache.get(key);if(c)return c;
  c=mkCanvas(s.width,s.height);const g=c.getContext("2d");g.imageSmoothingEnabled=false;g.drawImage(s,0,0);
  const d=g.getImageData(0,0,c.width,c.height).data;let top=0;outer:for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>40){top=y;break outer;}
  let l=c.width,r=0;for(let x=0;x<c.width;x++)if(d[((top+2)*c.width+x)*4+3]>40){l=Math.min(l,x);r=Math.max(r,x);}const sc=c.width/CW;const u=Math.max(1,Math.round(sc));const cx=Math.round((l+r)/2),w=Math.max(6*u,Math.round((r-l)*0.7));
  const y0=top+2*u;const gold="#ffd23a",dk="#7a5008";
  g.fillStyle=dk;g.fillRect(cx-w/2,y0+2*u,w,u);g.fillStyle=gold;g.fillRect(cx-w/2,y0,w,2*u);
  for(const px of [cx-w/2,cx-(u>>1),cx+w/2-u]){g.fillStyle=gold;g.fillRect(px,y0-2*u,u,2*u);g.fillStyle="#fff6a0";g.fillRect(px,y0-2*u,u,u);}
  g.fillStyle="#fff6a0";g.fillRect(cx-w/2,y0,w,u);g.fillStyle="#e83a5a";g.fillRect(cx-(u>>1),y0+u,u,u);g.fillStyle="#3a8af0";g.fillRect(cx-w/2+u,y0+u,u,u);g.fillRect(cx+w/2-2*u,y0+u,u,u);
kingCache.set(key,c);return c;};
// ---- profanity setting ----
const prof=()=>!P||P.prof!==false;
const ROUGH={guard:["Keep your damn nose clean, stranger.","Hell of a long shift. My feet are killing me.","If those bastard bandits show up again, they'll regret it."],
 adventurer:["Damn goblins nearly took my ear off.","Hell yes, payday!","That job was a pain in the ass, but the coin's good."],
 drunk:["*hic* Another damn round!","This ale tastes like shit... I love it.","Who're you calling a drunk, you old bastard?"],
 villager:["Damn weather's turned again.","Hell, the prices at market these days!","My lazy ass of a brother still owes me coin."]};
const CLEAN={guard:["Keep your nose clean, stranger.","Long shift. My feet are aching.","If those bandits show up again, they'll regret it."],
 adventurer:["Those goblins nearly took my ear off.","Payday, at last!","That job was a real pain, but the coin's good."],
 drunk:["*hic* Another round!","This ale tastes awful... I love it.","Who're you calling a drunk, old-timer?"],
 villager:["The weather's turned again.","Goodness, the prices at market these days!","My lazy brother still owes me coin."]};
function banterKind(n){if(n.adv)return"adventurer";if(n.role==="guard")return"guard";if(n.inside&&(hour()>=19||hour()<3)&&n.role!=="innkeeper"&&n.role!=="child")return"drunk";if(n.role==="child"||n.role==="leader"||n.role==="receptionist")return null;return"villager";}
function banterLine(n){const k=banterKind(n);if(!k)return null;const L=(prof()?ROUGH:CLEAN)[k];return L[(n.id+world.day)%L.length];}
const _dialogLinesR=dialogLines;dialogLines=function(n){const L=_dialogLinesR(n);const b=banterLine(n);if(b&&Array.isArray(L))L.push('"'+b+'"');return L;};
// ambient chatter + party shouts also respect the setting
const CHAT_ROUGH=[["Damn, it's hot today.","Hell of a summer."],["Heard about the dragon?","Scared the shit out of me."],["Those bandits again?","Bastards hit the east road."],["Another round!","Your ass is paying this time!"]];
const _sayR=say;say=function(n,t,life){if(!prof())t=t.replace(/\bdamn(ed)?\b/gi,"darn").replace(/\bhell\b/gi,"heck").replace(/\bshit\b/gi,"daylights").replace(/\bbastards?\b/gi,m=>m.endsWith("s")?"rogues":"rogue").replace(/\bass\b/gi,"rear");return _sayR(n,t,life);};
if(typeof CHAT!=="undefined")for(const c of CHAT_ROUGH)CHAT.push(c);
