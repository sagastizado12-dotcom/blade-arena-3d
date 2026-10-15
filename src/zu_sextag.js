// ===== F / M TAGS AFTER NPC NAMES =====
const FEM_TITLES=/^(Queen|Lady|Princess|Duchess|Dame|Mother|Sister|Grandma|Aunt)\b/i,MALE_TITLES=/^(King|Lord|Prince|Duke|Sir|Father|Brother|Grandpa|Uncle|Demon Lord)\b/i;
function sexOf(n){if(!n)return null;if(n.sex)return n.sex;let s=null;const nm=String(n.name||"");
  if(FEM_TITLES.test(nm))s="F";else if(MALE_TITLES.test(nm))s="M";
  else{const first=nm.replace(/^(the\s+)/i,"").split(/\s+/)[0];if(typeof FEM_NAMES!=="undefined"&&FEM_NAMES.has(first))s="F";
    else if(["Quinn","Gale","Sol","Pip"].includes(first))s=n.look%2===0?"F":"M";else if(n._look&&n._look.fem)s="F";else s="M";}
  n.sex=s;return s;}
function assignSexes(){for(const n of npcs)sexOf(n);}
const sexTagTxt=n=>{const s=sexOf(n);return s?` (${s})`:"";};
const SEX_CSS=document.createElement("style");SEX_CSS.textContent=`.sx{display:inline-block;font:bold .72em system-ui;padding:0 .35em;margin-left:.25em;border-radius:.5em;line-height:1.35em;vertical-align:.08em}.sx-F{background:#ffd0e4;color:#a0144e}.sx-M{background:#cfe4ff;color:#14468f}`;document.head.appendChild(SEX_CSS);
// name -> sex lookup, including rulers that appear only as names
function sexNameMap(){const m=new Map();for(const k of (typeof KINGDOMS!=="undefined"?KINGDOMS:[]))m.set(k.ruler,k.fem?"F":"M");for(const n of npcs){if(n.name&&!m.has(n.name))m.set(n.name,sexOf(n));}return m;}
let sexMapCache=null,sexMapN=-1;const sexMap=()=>{if(!sexMapCache||sexMapN!==npcs.length){sexMapCache=sexNameMap();sexMapN=npcs.length;}return sexMapCache;};
let talkFocus=null;
function tagMenuNames(root){const M=sexMap();if(!M.size)return;const names=[...M.keys()].filter(Boolean).sort((a,b)=>b.length-a.length);
  const txtAll=root.textContent;const present=names.filter(nm=>txtAll.includes(nm));if(!present.length)return;
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const re=new RegExp(`(^|[^A-Za-z'])(${present.map(esc).join("|")})(?![A-Za-z'])(?!\\s?\\((?:F|M)\\))`,"g");
  const walk=node=>{if(node.nodeType===3){const t=node.nodeValue;if(!re.test(t))return;re.lastIndex=0;const frag=document.createDocumentFragment();let last=0,m;
      while((m=re.exec(t))){const end=m.index+m[0].length;frag.appendChild(document.createTextNode(t.slice(last,end)));let s=M.get(m[2]);if(talkFocus&&talkFocus.name===m[2])s=sexOf(talkFocus);
        const sp=document.createElement("span");sp.className="sx sx-"+s;sp.textContent="("+s+")";frag.appendChild(document.createTextNode(" "));frag.appendChild(sp);last=end;}
      frag.appendChild(document.createTextNode(t.slice(last)));node.parentNode.replaceChild(frag,node);return;}
    if(node.nodeType===1&&!node.classList.contains("sx"))[...node.childNodes].forEach(walk);};walk(root);}
{const _sm=showMenu;showMenu=function(t,x,b){const r=_sm.apply(this,arguments);try{tagMenuNames(menuEl);}catch(_){}return r;};}
{const _tk=talk;talk=function(n){talkFocus=n;try{return _tk(n);}finally{setTimeout(()=>{if(talkFocus===n)talkFocus=null;},0);}};}
// toasts and news: plain-text tag
function tagPlain(t){if(typeof t!=="string")return t;const M=sexMap();for(const [nm,s] of M){if(!nm||!t.includes(nm))continue;t=t.replace(new RegExp(`(^|[^A-Za-z'])(${nm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})(?![A-Za-z'])(?!\\s?\\((?:F|M)\\))`,"g"),`$1$2 (${s})`);}return t;}
{const _to=toast;toast=function(t,...a){return _to(tagPlain(t),...a);};}
{const _an=addNews;addNews=function(s,t,...a){return _an(s,tagPlain(t),...a);};}
// floating name tag above nearby NPCs
{const _d=drawNpc;drawNpc=function(n){_d(n);if(n.inside||!n.alive||!hero||!n.name)return;if(Math.hypot(n.x-hero.x,n.y-hero.y)>44)return;const s=sexOf(n);
  const first=n.name.split(" ")[0];ctx.save();ctx.font="bold 8px system-ui";ctx.textAlign="left";const w=ctx.measureText(first).width;const tw=w+14;const x=Math.round(n.x+8-tw/2),y=n.y-(n.role==="leader"?24:17);
  ctx.fillStyle="rgba(0,0,0,.6)";ctx.fillRect(x-2,y-8,tw+3,11);ctx.fillStyle="#fff";ctx.fillText(first,x,y);ctx.fillStyle=s==="F"?"#ffd0e4":"#cfe4ff";ctx.fillRect(x+w+2,y-7,10,9);ctx.fillStyle=s==="F"?"#c0185e":"#14468f";ctx.fillText(s,x+w+3.5,y);ctx.restore();};}
// map labels for leaders
{const _dl=drawLeadersMap;drawLeadersMap=function(g,P2,txt,z){if(z<3)return;for(const n of npcs)if(n.role==="leader"&&n.alive&&!n.inside){const [x,y]=P2((n.x+8)/TILE,(n.y+12)/TILE);txt("★",x,y+4,"#ffd84a",13);
  if(z>=4){const s=sexOf(n);txt(n.name.split(" ")[0],x-5,y+16,"#ffe8b0",10);g.font="bold 9px system-ui";const w=g.measureText(n.name.split(" ")[0]).width;txt(s,x+w/2+2,y+16,s==="F"?"#ff8cc0":"#7fb6ff",9);}}};}
{const _mk=makeNpc;makeNpc=function(){const n=_mk.apply(this,arguments);if(n&&n.name){n.sex=null;sexOf(n);}return n;};}
{const _u=update;let sxT=0;update=function(){_u();if((++sxT)%120===1&&npcs)for(const n of npcs)if(!n.sex)sexOf(n);};}
