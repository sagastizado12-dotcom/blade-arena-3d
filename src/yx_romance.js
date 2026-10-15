// ===== CONVERSATIONS & ROMANCE (adult women 18+ only; PG-13; fade to black) =====
const AFF_STAGES=[[0,"Stranger"],[20,"Friend"],[40,"Close"],[60,"Crush"],[80,"In Love"]];
const affStage=a=>{let s=AFF_STAGES[0][1];for(const [v,n] of AFF_STAGES)if(a>=v)s=n;return s;};
const canWoo=n=>!!n&&n.alive&&!n.adv&&n.role!=="child"&&n.age>=18&&isWoman(n)&&canRomance(n)&&!(n.spouse>0);
// personality: how each choice lands (+ good, - bad), liked gifts, talk topics
const PERSONA={
 shy:{like:{compliment:1,life:2,joke:1,flirt:-1,gift:2},gifts:["flowers","berry","pie"],
   life:["I press flowers from the meadow in an old book. It's silly, I know.","I like the quiet hour before the market opens.","My mother taught me to embroider. I'm still slow at it.","Sometimes I sit by the river and just listen."],
   ok:["*blushes* Th-thank you...","Oh! That's... really kind.","You're easy to talk to."],no:["Um... that's a bit much...","*looks away* I don't know what to say..."]},
 bold:{like:{compliment:1,life:1,joke:2,flirt:2,gift:1},gifts:["meat","gem","amulet"],
   life:["I arm-wrestled the smith last week. Won, too.","I want to sail past the islands someday.","Nobody tells me what to do. Not twice.","I've climbed every rooftop in town. Don't tell the guards."],
   ok:["Ha! I like your nerve.","Now THAT'S more like it.","Keep talking, hero."],no:["Boring. Try harder.","That's all you've got?"]},
 bookish:{like:{compliment:1,life:2,joke:-1,flirt:0,gift:2},gifts:["trinket","herb","pearl"],
   life:["I'm reading an old history of the dragon wars.","Did you know the waystones predate the kingdom?","I catalog herbs for the healer in my spare time.","I'm trying to map the ruins from old notes."],
   ok:["Oh, you actually listened! That's rare.","Fascinating. Tell me more sometime.","*adjusts her glasses, smiling*"],no:["That... wasn't funny.","Hm. I'd rather talk about something real."]},
 tough:{like:{compliment:-1,life:1,joke:2,flirt:1,gift:1},gifts:["meat","potion","axe"],
   life:["I train with the guards at dawn. They hate it when I win.","Broke my arm twice as a kid. Still climbed the tower.","I chop my own firewood. Every log.","Bandits tried me once. Once."],
   ok:["Heh. You're alright.","Not bad. Not bad at all.","You've got guts, I'll give you that."],no:["Save the sweet talk.","Ugh, don't get soft on me."],
   okP:["Heh. You're alright, damn it.","Hell, not bad at all."],noP:["Save the damn sweet talk.","Ugh, cut the crap."]},
 cheerful:{like:{compliment:2,life:1,joke:2,flirt:1,gift:1},gifts:["pie","flowers","bread"],
   life:["I organize the festival games every season!","I'm teaching the kids a new dance.","I bake extra bread for the old folks on my street.","I try to learn one new song every week."],
   ok:["Hee! You're sweet!","Aww, you made my day!","*laughs* You're fun!"],no:["Oh... okay then.","Hm, that wasn't very nice."]},
 artsy:{like:{compliment:2,life:2,joke:0,flirt:1,gift:1},gifts:["gem","flowers","pearl"],
   life:["I'm painting the castle at sunset. The light keeps changing.","I carve little wooden birds for the market.","Colors feel louder in spring, don't you think?","I sketch travelers. Maybe I'll sketch you."],
   ok:["You have a poet's eye.","That's... beautiful, actually.","*smiles softly* I'll remember that."],no:["Hm. That felt hollow.","Not quite the right note."]}};
const PKEYS=Object.keys(PERSONA);
const personaOf=n=>n.persona||(n.persona=PKEYS[(n.id*5+n.look)%PKEYS.length]);
const LINES={compliment:["You look lovely today.","Your smile brightens the whole street.","I like the way you think.","You have kind eyes."],
 joke:["Why did the slime cross the road? To get to the other slime.","I tried to fight a goblin with a joke. It didn't land.","My sword's sharper than my wit. Barely."],
 flirt:["Is it hot out here, or is it just you?","I'd brave a dragon for a walk with you.","Save me a dance at the next festival?"]};
function affBar(n){const a=Math.round(n.aff||0),f=Math.round(a/10);return`${"♥".repeat(f)}${"♡".repeat(10-f)}  ${a}/100 · ${affStage(a)}`;}
function heartPop(good){try{const m=document.getElementById("menu");const d=document.createElement("div");d.className="heartpop"+(good?"":" bad");d.textContent=good?"♥":"💔";m.appendChild(d);setTimeout(()=>d.remove(),900);}catch(_){}}
{const st=document.createElement("style");st.textContent=`.heartpop{position:absolute;right:28px;top:56px;font-size:34px;color:#ff5a8a;pointer-events:none;animation:hp .9s ease-out forwards;text-shadow:0 0 8px #ff9ac0}.heartpop.bad{color:#88a}@keyframes hp{0%{transform:scale(.4);opacity:0}30%{transform:scale(1.3);opacity:1}100%{transform:translateY(-40px) scale(1);opacity:0}}.affbar{color:#ff8ab0}`;document.head.appendChild(st);}
// returns {delta, reply}
function romanceChoose(n,ch,gift){const p=PERSONA[personaOf(n)];n.mem=n.mem||{life:0,said:{},topics:[]};n.aff=n.aff||0;const prev=affStage(n.aff);
  let base=p.like[ch]||0,reply;if(ch==="gift"){if(!(P.inv[gift]>0))return{delta:0,reply:"(You don't have that.)"};P.inv[gift]--;base=p.gifts.includes(gift)?3:1;}
  const said=n.mem.said[ch]=(n.mem.said[ch]||0)+1;const today=n.mem.day===world.day;if(!today){n.mem.day=world.day;n.mem.n=0;}n.mem.n++;
  let delta=base>0?base*4:base*5;if(base>0&&n.mem.n>6)delta=Math.max(1,delta>>1); // tiring if you overdo it in one day
  if(ch==="flirt"&&n.aff<20&&base<2)delta=-4; // too forward with a stranger
  if(ch==="life"){const L=p.life;const i=n.mem.life%L.length;n.mem.life++;reply=`"${L[i]}"`+(n.mem.topics.length?` She remembers last time: "You told me about ${n.mem.topics[n.mem.topics.length-1]}."`:"");n.mem.topics.push(pick(["your travels","the guild","that dragon","your sword"]));if(n.mem.topics.length>4)n.mem.topics.shift();}
  else{const pool=delta>0?(prof()&&p.okP?p.okP.concat(p.ok):p.ok):(prof()&&p.noP?p.noP.concat(p.no):p.no);reply=`"${pool[(said+n.id)%pool.length]}"`;}
  n.aff=Math.max(0,Math.min(100,n.aff+delta));n.friend=Math.min(100,Math.max(n.friend,Math.round(n.aff*0.9)));
  floatText(n.x+8,n.y-10,delta>0?"♥+"+delta:"💔"+delta,delta>0?"#ff7aa8":"#9aa");heartPop(delta>0);
  const now=affStage(n.aff);let confess=false;if(now==="In Love"&&prev!=="In Love"&&!n.confessed){n.confessed=true;confess=true;if(!P.dating.includes(n.id))P.dating.push(n.id);n.friend=Math.max(n.friend,90);addNews(n.s,`Rumor says ${n.name} has fallen for the wanderer.`);}
  return{delta,reply,confess,stage:now};}
function romanceTalk(n,msg){if(!canWoo(n))return talk0(n);personaOf(n);n.mem=n.mem||{life:0,said:{},topics:[]};
  const all=[{k:"compliment",l:"💬 Compliment her"},{k:"life",l:"🗨️ Ask about her life"},{k:"joke",l:"😄 Tell a joke"},{k:"flirt",l:"😉 Flirt"},{k:"gift",l:"🎁 Give a gift"}];
  const rot=(n.mem.n||0)+world.day;const opts=[];for(let i=0;i<all.length&&opts.length<3;i++)opts.push(all[(i+rot)%all.length]);
  const btns=opts.map(o=>({l:o.l+(o.k==="flirt"?"":""),f:()=>o.k==="gift"?giftPick(n):after(n,romanceChoose(n,o.k,null),o.k)}));
  if(n.aff>=60)btns.push({l:"🌙 Ask her out",f:()=>dateMenu(n)});
  if(n.confessed&&P.dating.includes(n.id)&&!P.spouse)btns.push({l:"💍 Propose",f:()=>showMenu(n.name,propose(n),[{l:"OK"}])});
  btns.push({l:"More…",f:()=>talk0(n)},{l:"Goodbye"});
  const line=msg||`${n.name} (${personaOf(n)}) looks at you. "${pick(["Oh, hello again.","Hi there!","Hey, you."])}"`;
  showMenu(n.name+" ❤",`${line}\n\nAffection: ${affBar(n)}`,btns);}
function after(n,r,k){let msg=`${LINES[k]?`You: "${pick(LINES[k])}"\n`:""}${n.name}: ${r.reply}`;
  if(r.confess)msg+=`\n\n💗 ${n.name} takes your hand. "I... I think I've fallen for you. Do you feel the same?"\n(She is now dating you. Bring a ring to propose.)`;romanceTalk(n,msg);}
function giftPick(n){const ks=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]&&!ITEMS[k].part&&k!=="ring");
  showMenu("Gift for "+n.name,ks.length?"Pick a gift.":"You have nothing to give.",ks.slice(0,10).map(k=>({l:`${ITEMS[k].ic||"•"} ${ITEMS[k].n} (${P.inv[k]})`,f:()=>after(n,romanceChoose(n,"gift",k),"gift")})).concat([{l:"Back",f:()=>romanceTalk(n)}]));}
const DATES={tavern:["You share a table by the fire at the tavern. She laughs at your stories until the bard starts a slow song.","Over warm cider she tells you about her childhood. The tavern hums around you."],
 river:["You walk along the river at dusk. She skips a stone five times and gloats about it all the way back.","You sit on the bridge, feet over the water, and watch the fireflies come out."],
 market:["You wander the market stalls. She haggles a merchant down to half price and buys you a candied apple.","She drags you to every stall, trying on silly hats until you both can't stop laughing."]};
function dateMenu(n){showMenu("A date with "+n.name,`Where would you like to go?\n\nAffection: ${affBar(n)}`,["tavern","river","market"].map(w=>({l:{tavern:"🍺 The tavern",river:"🌊 The river",market:"🧺 The market"}[w],f:()=>{
    const sc=pick(DATES[w]);const bonus=PERSONA[personaOf(n)].like.life>1&&w==="river"||PERSONA[personaOf(n)].like.joke>1&&w==="tavern"?6:4;n.aff=Math.min(100,(n.aff||0)+bonus);if(!P.dating.includes(n.id)&&n.aff>=60)P.dating.push(n.id);
    fadeBlack("",()=>{advanceMinutes(150);const close=n.aff>=80?"\n\nAt her door she leans in close... and the night fades to black.":"\n\nShe walks you back, smiling the whole way.";
      if(n.aff>=80)fadeBlack("…",()=>romanceTalk(n,sc+close));else romanceTalk(n,sc+close);});}})).concat([{l:"Back",f:()=>romanceTalk(n)}]));}
const talk0=talk;talk=function(n){if(canWoo(n))return romanceTalk(n);return talk0(n);};
