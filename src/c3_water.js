// ===== RIVERS & LAKES ACROSS THE CONTINENT =====
LAKES2.push({x:822,y:132,rx:14,ry:9,isle:1},{x:640,y:330,rx:10,ry:7},{x:432,y:520,rx:16,ry:11,isle:1},{x:566,y:566,rx:9,ry:6},{x:176,y:556,rx:8,ry:6},
 {x:392,y:626,rx:12,ry:8,isle:1},{x:940,y:560,rx:11,ry:8},{x:902,y:340,rx:9,ry:7},{x:72,y:604,rx:10,ry:7},{x:700,y:480,rx:7,ry:5},{x:520,y:250,rx:6,ry:4},{x:300,y:470,rx:6,ry:5});
const RIVERS2=[[[722,292],[700,206],[738,120],[712,20]],[[600,418],[700,402],[850,424],[1020,404]],[[332,500],[318,560],[336,650],[302,760],[296,799]],
 [[822,520],[862,600],[838,684],[862,799]],[[236,442],[140,452],[60,440],[0,446]]];
const FISH_SPOTS=[];
function carveRiver2(pts,seed){let prev=null;const seg=[];for(let i=0;i<pts.length-1;i++){const [ax,ay]=pts[i],[bx,by]=pts[i+1];const L=Math.ceil(Math.hypot(bx-ax,by-ay));for(let s=0;s<L;s++){const u=s/L;seg.push([ax+(bx-ax)*u,ay+(by-ay)*u,Math.atan2(by-ay,bx-ax)]);}}
  seg.forEach(([x,y,a],j)=>{const w=Math.sin(j*0.05+seed)*5+Math.sin(j*0.017+seed*2)*7;const nx=-Math.sin(a),ny=Math.cos(a);const cx=Math.round(x+nx*w),cy=Math.round(y+ny*w);
    for(let k=-2;k<=2;k++)for(let m=0;m<=1;m++){const tx=cx+Math.round(nx*k)+(m&&Math.abs(nx)>Math.abs(ny)?0:0),ty=cy+Math.round(ny*k)+m;if(tx<1||ty<1||tx>=WW-1||ty>=WH-1)continue;const i=ty*WW+tx;
      if(SETS.some(q=>Math.hypot(tx-q.x,ty-q.y)<q.r+5))continue;if(OCC[i]>0)continue;const was=T[i];if((was===DEEP||was===SHAL)&&!RIVERM[i])continue;RIVERM[i]=1;ELEV[i]=0;
      if(was===ROAD||was===COBBLE||was===PIER||was===BRIDGE)T[i]=BRIDGE;else if(was!==DEEP||RIVERM[i])T[i]=Math.abs(k)<=1?DEEP:SHAL;}
    if(j%37===5)FISH_SPOTS.push({x:cx,y:cy});});}
function lakeExtras(){for(const L of LAKES2){if(L.isle){for(let y=-3;y<=3;y++)for(let x=-4;x<=4;x++){const d=Math.hypot(x/4,y/3);if(d>1)continue;const i=(L.y+y)*WW+L.x+x;T[i]=d>0.75?SAND:hash2(x,y,L.x)<0.3?TREE:GRASS;}}
    for(let k=0;k<3;k++)FISH_SPOTS.push({x:L.x+Math.round(Math.cos(k*2.1)*L.rx*0.8),y:L.y+Math.round(Math.sin(k*2.1)*L.ry*0.8)});
    // reeds on the shore
    for(let a=0;a<6.28;a+=0.12){const x=Math.round(L.x+Math.cos(a)*(L.rx+1.5)),y=Math.round(L.y+Math.sin(a)*(L.ry+1.5)),i=y*WW+x;if((T[i]===SAND||T[i]===GRASS)&&hash2(x,y,91)<0.45)T[i]=REED;}
    // dock if a settlement is close
    const s=SETS.find(q=>Math.hypot(q.x-L.x,q.y-L.y)<q.r+L.rx+26);if(s){const a=Math.atan2(s.y-L.y,s.x-L.x);for(let r=Math.max(L.rx,L.ry)+3;r>Math.min(L.rx,L.ry)*0.5;r--){const x=Math.round(L.x+Math.cos(a)*r),y=Math.round(L.y+Math.sin(a)*r);T[y*WW+x]=PIER;T[y*WW+x+1]=PIER;}}}}
{const _gr=genRiver;genRiver=function(){RIVERS2.forEach((r,i)=>carveRiver2(r,i*1.7));lakeExtras();_gr();};}
// jumping fish + fishing-spot ripples
const jumpFish=[];
const _drawWater=draw;draw=function(){_drawWater();if(!hero||!world||room||state!=="play")return;ctx.save();ctx.setTransform(RS,0,0,RS,-camX*RS,-camY*RS);
  for(const f of FISH_SPOTS){const x=f.x*TILE+8,y=f.y*TILE+8;if(x<camX-20||x>camX+W+20||y<camY-20||y>camY+H+20)continue;if(!isWater(tAt(f.x,f.y)))continue;const t=(frameN+f.x*13)%90/90;
    ctx.strokeStyle=`rgba(255,255,255,${0.5*(1-t)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,2+t*7,1+t*3,0,0,7);ctx.stroke();
    if((frameN+f.x*7+f.y)%240===0)jumpFish.push({x,y,t:0});}
  for(let i=jumpFish.length-1;i>=0;i--){const j=jumpFish[i];j.t++;const u=j.t/36;if(u>1){jumpFish.splice(i,1);continue;}const fx=j.x+u*14-7,fy=j.y-Math.sin(u*Math.PI)*12;
    ctx.save();ctx.translate(fx,fy);ctx.rotate(-Math.PI/2+u*Math.PI);ctx.fillStyle="#9fc8e8";ctx.beginPath();ctx.ellipse(0,0,3.5,1.6,0,0,7);ctx.fill();ctx.fillStyle="#6a98c0";ctx.fillRect(-5,-1,2,2);ctx.restore();
    if(j.t===35){ctx.fillStyle="rgba(255,255,255,.7)";ctx.fillRect(fx-2,j.y,4,1);}}
  ctx.restore();};
