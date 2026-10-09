// Construye Afina: afina.html (artifact) y dist/ (web instalable para Cloudflare Pages)
const fs=require('fs');const path=require('path');
const SRC=['foods.js','engine.js','goals.js','exercises.js','gym.js','learn.js','app.js','gymui.js','shop.js','main.js'];
const js=SRC.map(f=>`/* ${f} */\n`+fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n');
const css=fs.readFileSync(path.join(__dirname,'style.css'),'utf8');
const fonts='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap">';
const body=`<div id="app"></div>\n<script>\n${js}\n</script>`;
fs.writeFileSync(path.join(__dirname,'afina.html'),`<title>Afina</title>\n${fonts}\n<style>\n${css}\n</style>\n${body}\n`);
const dist=path.join(__dirname,'dist');fs.mkdirSync(dist,{recursive:true});
const pwa=`<script>if("serviceWorker" in navigator&&location.protocol==="https:"){navigator.serviceWorker.register("sw.js").catch(()=>{});}</script>`;
fs.writeFileSync(path.join(dist,'index.html'),`<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Afina</title><meta name="description" content="Aprende a comer. Vive más y mejor.">
<meta name="theme-color" content="#121019"><meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Afina">
<link rel="manifest" href="manifest.json"><link rel="apple-touch-icon" href="icon-512.png"><link rel="icon" href="icon-192.png">
${fonts}
<style>html,body{margin:0}:root{padding-top:env(safe-area-inset-top,0px)}[hidden]{display:none!important}img{max-width:100%}
${css}</style></head><body>
${body}
${pwa}
</body></html>`);
fs.writeFileSync(path.join(dist,'manifest.json'),JSON.stringify({name:"Afina",short_name:"Afina",description:"Aprende a comer. Vive más y mejor.",start_url:"./",scope:"./",display:"standalone",background_color:"#121019",theme_color:"#121019",lang:"es",icons:[{src:"icon-192.png",sizes:"192x192",type:"image/png"},{src:"icon-512.png",sizes:"512x512",type:"image/png",purpose:"any maskable"}]},null,2));
const ver=Date.now();
fs.writeFileSync(path.join(dist,'sw.js'),`const C="afina-${ver}";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.json","icon-192.png","icon-512.png"])));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));});
`);
['icon-192.png','icon-512.png'].forEach(f=>{const s=path.join(__dirname,'assets',f);if(fs.existsSync(s))fs.copyFileSync(s,path.join(dist,f));});
console.log('ok',Math.round(js.length/1024)+'KB js');
