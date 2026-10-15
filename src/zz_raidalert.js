// ===== v20: town raid alert (map markers, townsfolk huddle at the fountain, alarm bell) =====
let RAIDA={sid:null,mobs:[],bellT:0,bells:0};
function raidMobsOf(S){const ws=world.sets[S.id];const R=wallR(S)+4;return mobs.filter(m=>!m.dead&&m.hp>0&&!m.duel&&!m.malz&&(m.raidOf===S.id||(ws&&ws.raid&&m.def&&m.def.beh!=="pea"&&Math.hypot(m.x/TILE-S.x,m.y/TILE-S.y)<R)));}
function raidAlertTick(){RAIDA.sid=null;RAIDA.mobs=[];if(!world||!hero||room)return;const S=townOfTile(hero.x/TILE,hero.y/TILE);if(!S)return;const L=raidMobsOf(S);if(!L.length)return;RAIDA.sid=S.id;RAIDA.mobs=L;}
const raidActive=sid=>RAIDA.sid!=null&&(sid==null||RAIDA.sid===sid);
// bell: three inharmonic partials with long decay, into the SFX bus (respects mute/volume)
function bellStrike(){RAIDA.bells++;try{audioInit&&audioInit();const c=AU.ctx;if(!c||!AU.sfx)return;const t=c.currentTime;for(const [mul,amp,dec] of [[1,.35,1.6],[2.76,.18,1.0],[5.4,.08,.6],[0.5,.12,1.8]]){const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=660*mul;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp,t+0.005);g.gain.exponentialRampToValueAtTime(0.0008,t+dec);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+dec+0.05);}}catch(_){}}
{const _u=update;update=function(){_u();try{const was=RAIDA.sid;raidAlertTick();const now=performance.now();
  if(RAIDA.sid!=null){if(was==null){toast(`🔔 ${SETS[RAIDA.sid].name} is under attack! Townsfolk are gathering at the fountain.`);RAIDA.bellT=0;}if(now>=RAIDA.bellT){bellStrike();RAIDA.bellT=now+(RAIDA.bells%3===2?1500:550);}}
  else if(was!=null){toast(`🔕 The raid on ${SETS[was].name} is over.`);for(const n of npcs)if(n.huddle){n.huddle=false;n.wp=null;n.wspot=null;}}}catch(_){}};}
// townsfolk huddle at the fountain, spread on rings; guards keep fighting
const isGuardN=n=>n.role==="guard"||n.guard||n.soldier;
function huddleSpot(n,S){const f=typeof fountainOf==="function"?fountainOf(S):null;const cx=f?f.x+0.5:S.x,cy=f?f.y+0.5:S.y;
  const peers=npcs.filter(o=>o.alive&&o.s===S.id&&!isGuardN(o)&&!o.adv).sort((a,b)=>a.id-b.id);const i=Math.max(0,peers.indexOf(n));
  let ring=0,k=i,cap=8;while(k>=cap){k-=cap;ring++;cap=8+ring*6;}const r=2.2+ring*1.6,a=k/cap*6.283+ring*0.4;return{x:(cx+Math.cos(a)*r)*TILE-8,y:(cy+Math.sin(a)*r)*TILE-12};}
{const _nt=npcTarget;npcTarget=function(n){if(raidActive(n.s)&&!isGuardN(n)&&!n.adv&&!n.duelist&&!(P.party||[]).includes(n.id)&&!(typeof isWife==="function"&&isWife(n)&&n.s!==RAIDA.sid)){const S=SETS[n.s];n.huddle=true;n.inside=false;n.pauseT=0;return huddleSpot(n,S);}return _nt(n);};}
// map + minimap markers for attacking monsters
let raidStash=null;{const _dh=drawHomesMap;drawHomesMap=function(g,P2,txt,z){raidStash={g,P2,txt,z};return _dh.apply(this,arguments);};}
{const _df=drawFullMap;drawFullMap=function(){const r=_df.apply(this,arguments);try{if(raidStash&&RAIDA.mobs.length){const {g,P2,txt,z}=raidStash;const pulse=3+Math.sin(performance.now()/180)*1.2;g.save();g.globalAlpha=1;g.globalCompositeOperation="source-over";try{g.filter="none";}catch(_){}
  for(const m of RAIDA.mobs){const [x,y]=P2((m.x+m.w/2)/TILE,(m.y+m.h/2)/TILE);g.fillStyle="rgba(255,30,30,.35)";g.beginPath();g.arc(x,y,pulse+5,0,7);g.fill();g.fillStyle="#ff2a2a";g.strokeStyle="#000";g.lineWidth=1.5;g.beginPath();g.arc(x,y,4,0,7);g.fill();g.stroke();}
  const S=SETS[RAIDA.sid];const [sx,sy]=P2(S.x,S.y);txt(`⚠ RAID (${RAIDA.mobs.length})`,sx,sy-30,"#ff6a5a",12);g.restore();}else window.__rerr="nostash:"+!!raidStash+":"+RAIDA.mobs.length;}catch(err){window.__rerr=String(err);}return r;};}
{const _dm=drawMini;drawMini=function(){_dm.apply(this,arguments);try{if(room||!RAIDA.mobs.length)return;const R=MINI_R[miniZ],sx=mini.width/(R*2),sy=mini.height/(R*1.5),W=mini.width/2,H=mini.height/2;mg.save();
  for(const m of RAIDA.mobs){const dx=(m.x/TILE-hero.x/TILE)*sx,dy=(m.y/TILE-hero.y/TILE)*sy;dx=Math.max(-W+4,Math.min(W-4,dx));dy=Math.max(-H+4,Math.min(H-4,dy));mg.fillStyle="#ff2020";mg.strokeStyle="#000";mg.lineWidth=1;mg.beginPath();mg.arc(W+dx,H+dy,2.5,0,7);mg.fill();mg.stroke();}mg.restore();}catch(_){}};}
{const _ic=issueChallenge;issueChallenge=function(){if(RAIDA.sid!=null)return null;return _ic.apply(this,arguments);};}
