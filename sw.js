/* TimlulAI service worker */
const VERSION = 'timlulai-v41';
const CORE = ['./', './index.html', './manifest.json', './privacy_policy.html', './terms_of_use.html',
              './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{if(res.ok)caches.open(VERSION).then(c=>c.put('./index.html',res.clone()));return res;})
      .catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(e.request).then(hit=>{
    const fresh=fetch(e.request).then(res=>{if(res.ok)caches.open(VERSION).then(c=>c.put(e.request,res.clone()));return res;});
    return hit||fresh;
  }));
});
