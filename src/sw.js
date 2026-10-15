const CACHE="blade-realm-__V__";
const FILES=["./","index.html","game.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting();});
// network-first for the page and game code (so updates land immediately when online), cache-first for the rest
const fresh=u=>u.mode==="navigate"||/version\.json/.test(u.url)||/\/(index\.html|game\.js)?(\?.*)?$/.test(new URL(u.url).pathname+new URL(u.url).search)||/game\.js/.test(u.url);
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  if(fresh(r)){e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c));return res;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match("index.html"))));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(x=>x||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c));return res;}).catch(()=>caches.match("index.html"))));});
