const V='djnc-v4';
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','install-guide.pdf'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);
 await Promise.all(FILES.map(async f=>{try{await c.add(f)}catch(_){}}));
 await Promise.all(CDN.map(async u=>{try{await c.put(u,await fetch(new Request(u,{mode:'no-cors'})))}catch(_){}}));
 self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 e.respondWith((async()=>{const c=await caches.open(V);
  const hit=(await c.match(r,{ignoreSearch:true}))||(r.mode==='navigate'?await c.match('index.html'):null);
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||new Response('You are offline and this page was not saved yet.',{status:503})})())});
