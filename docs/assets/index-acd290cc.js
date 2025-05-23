var T=Object.defineProperty;var A=(o,e,t)=>e in o?T(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var p=(o,e,t)=>(A(o,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();function j(o){localStorage.setItem("authToken",o)}function l(){return localStorage.getItem("authToken")}const C=()=>localStorage.removeItem("authToken"),M="PetaDalamCeritaDB",N=2,c="stories";function y(){return new Promise((o,e)=>{const t=indexedDB.open(M,N);t.onupgradeneeded=n=>{const a=n.target.result;a.objectStoreNames.contains(c)||a.createObjectStore(c,{keyPath:"id"}).createIndex("synced","synced",{unique:!1})},t.onsuccess=n=>o(n.target.result),t.onerror=n=>e(n.target.error)})}async function b(o){const e=await y();return new Promise((t,n)=>{const r=e.transaction(c,"readwrite").objectStore(c).put(o);r.onsuccess=()=>t(!0),r.onerror=s=>n(s.target.error)})}async function v(){const o=await y();return new Promise((e,t)=>{const i=o.transaction(c,"readonly").objectStore(c).getAll();i.onsuccess=r=>e(r.target.result),i.onerror=r=>t(r.target.error)})}async function D(){const o=await y();return new Promise((e,t)=>{const r=o.transaction(c,"readonly").objectStore(c).index("synced").getAll(!1);r.onsuccess=s=>e(s.target.result),r.onerror=s=>t(s.target.error)})}async function $(o){const e=await y();return new Promise((t,n)=>{const r=e.transaction(c,"readwrite").objectStore(c).delete(o);r.onsuccess=()=>t(!0),r.onerror=s=>n(s.target.error)})}async function O(){const o=await D();for(const e of o)try{const t=await fetch("/api/stories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error("Gagal sinkron data ke server");const n=await t.json();n.synced=!0,await b(n),console.log(`Sinkron berhasil untuk cerita id ${e.id}`)}catch(t){console.error(`Sinkron gagal untuk cerita id ${e.id}:`,t)}try{const e=await fetch("/api/stories");if(!e.ok)throw new Error("Gagal ambil data terbaru");const t=await e.json();for(const n of t)n.synced=!0,await b(n);window.dispatchEvent(new Event("storiesUpdated"))}catch(e){console.error("Gagal update data setelah sinkronisasi",e)}}const u="/api",w={async register({name:o,email:e,password:t}){return(await fetch(`${u}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:e,password:t})})).json()},async login({email:o,password:e}){return(await fetch(`${u}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:e})})).json()},async getStories({page:o=1,size:e=10,location:t=0}={}){const n=new URL(`${u}/stories`,window.location.origin);n.searchParams.set("page",o),n.searchParams.set("size",e),n.searchParams.set("location",t);const a=l(),i=a?{Authorization:`Bearer ${a}`}:{};try{const r=await fetch(n,{headers:i});if(r.status===401)return window.location.hash="#/login",[];const{listStory:s}=await r.json();for(const d of s)await b(d);return s}catch(r){return console.warn("Fetch stories gagal, fallback ke IndexedDB:",r),await v()}},async createStory({description:o,photoBlob:e,lat:t,lon:n}){const a=l(),i=new FormData;return i.append("description",o),i.append("photo",e,"story.png"),t!=null&&i.append("lat",t),n!=null&&i.append("lon",n),(await fetch(`${u}/stories`,{method:"POST",headers:{Authorization:`Bearer ${a}`},body:i})).json()},async createStoryAsGuest({description:o,photoBlob:e,lat:t,lon:n}){const a=new FormData;return a.append("description",o),a.append("photo",e,"story.png"),t!=null&&a.append("lat",t),n!=null&&a.append("lon",n),(await fetch(`${u}/stories/guest`,{method:"POST",body:a})).json()},async getStoryById(o){const e=await fetch(`${u}/stories/${o}`),{story:t}=await e.json();return t},async subscribePush({endpoint:o,p256dh:e,auth:t}){const n=l();return(await fetch(`${u}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({endpoint:o,keys:{p256dh:e,auth:t}})})).json()},async unsubscribePush({endpoint:o}){const e=l();return(await fetch(`${u}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({endpoint:o})})).json()}};class F{async render(){return`
      <section class="flex items-center justify-center">
      <div class="rounded-lg p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">Daftar Akun</h1>
        <form id="register-form" class="space-y-4 bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md">
          <div>
            <label for="name" class="block">Nama</label>
            <input type="text" id="name" placeholder="Masukkan nama Anda" required class="w-full p-2 border rounded" />
          </div>
          <div>
            <label for="email" class="block">Email</label>
            <input type="email" id="email" placeholder="Contoh: nama@email.com" required class="w-full p-2 border rounded" />
          </div>
          <div>
            <label for="password" class="block">Password</label>
            <input type="password" id="password" placeholder="Masukkan password Anda" required minlength="8"
                   class="w-full p-2 border rounded" />
          </div>
          <button type="submit" class="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition">
            Daftar
          </button>
          <p class="mt-4 text-center text-sm">
        Sudah punya akun?
        <a href="#/login" class="text-green-500 hover:underline">Masuk</a>
      </p>
        </form>
      </div>
      </section>
    `}async afterRender(){document.getElementById("register-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("name").value.trim(),n=document.getElementById("email").value.trim(),a=document.getElementById("password").value.trim(),{error:i,message:r}=await w.register({name:t,email:n,password:a});i?alert(r||"Register gagal"):(alert(r),window.location.hash="#/login")})}}class q{constructor(e){this.view=e}async getLogin({email:e,password:t}){try{this.view.showSubmitLoadingButton();const n=await w.login({email:e,password:t});if(this.view.hideSubmitLoadingButton(),n.error)return this.view.loginFailed(n.message||"Login gagal");j(n.loginResult.token),this.view.loginSuccessfully(n.message||"Login berhasil")}catch(n){this.view.hideSubmitLoadingButton(),this.view.loginFailed(n.message||"Terjadi kesalahan")}}}class R{constructor(){this.presenter=new q(this)}async render(){return`
      <section class="flex items-center justify-center">
  <div class="rounded-lg p-6 w-full max-w-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
    <form id="login-form" class="space-y-4 bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md">
      <div>
        <label for="email-input" class="block font-medium mb-1">Email</label>
        <input
          id="email-input"
          type="email"
          placeholder="Contoh: nama@email.com"
          required
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label for="password-input" class="block font-medium mb-1">Password</label>
        <input
          id="password-input"
          type="password"
          placeholder="Masukkan password anda"
          required
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div id="submit-button-container">
        <button
          type="submit"
          class="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
        >
          Masuk
        </button>
      </div>
      <p class="mt-4 text-center text-sm">
        Belum punya akun?
        <a href="#/register" class="text-green-500 hover:underline">Daftar</a>
      </p>
    </form>
  </div>
</section>
    `}async afterRender(){document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("email-input").value.trim(),n=document.getElementById("password-input").value.trim();await this.presenter.getLogin({email:t,password:n})})}showSubmitLoadingButton(){document.getElementById("submit-button-container").innerHTML=`
      <button type="button" class="w-full py-2 bg-gray-500 text-white font-semibold rounded" disabled>
        Loading…
      </button>
    `}hideSubmitLoadingButton(){document.getElementById("submit-button-container").innerHTML=`
      <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">
        Masuk
      </button>
    `}loginSuccessfully(e){alert(e),window.location.hash="#/"}loginFailed(e){alert(e)}}class _{constructor(){p(this,"render",async()=>`
      <section aria-label="Daftar Cerita">
        <div id="map" class="w-full h-64 rounded shadow mb-6"></div>
        <div id="judul"><h1>Cerita Manusia</h1></div>
        <div id="story-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </section>
    `);p(this,"afterRender",async()=>{if(!this.map){this.map=L.map("map").setView([0,0],2);const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map),n=L.tileLayer(`
        https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=0ZttLfXyTTfQ4Mp5XAsw
      `),a=L.tileLayer(`
        https://api.maptiler.com/tiles/countries/{z}/{x}/{y}.pbf?key=0ZttLfXyTTfQ4Mp5XAsw
      `);L.control.layers({OpenStreetMap:t,Satellite:n,Countries:a}).addTo(this.map)}let e;if(navigator.onLine){e=await w.getStories();for(const t of e)t.synced=!0,await b(t)}else e=await v();this.renderStories(e)});p(this,"renderStories",e=>{const t=document.getElementById("story-list");t.innerHTML="";const n=[];if(!e||e.length===0){t.innerHTML='<p class="col-span-full text-center text-gray-500">Tidak ada cerita tersimpan.</p>',this.map&&this.map.setView([0,0],2);return}e.forEach(a=>{const i=document.createElement("article");i.className="bg-white rounded-lg shadow overflow-hidden relative",i.dataset.id=a.id,i.innerHTML=`
        <img src="${a.photoUrl}" alt="Foto oleh ${a.name}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-semibold">${a.name}</h2>
          <p class="text-gray-700 mb-2">${a.description}</p>
          <p class="text-gray-500 text-sm">${new Date(a.createdAt).toLocaleDateString()}</p>
          <button class="delete-btn absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700" data-id="${a.id}">Hapus</button>
        </div>
      `,t.appendChild(i),a.lat&&a.lon&&(L.marker([a.lat,a.lon]).addTo(this.map).bindPopup(`<strong>${a.name}</strong><br/>${a.description}`),n.push([a.lat,a.lon]))}),n.length?this.map.fitBounds(n,{padding:[50,50]}):this.map.setView([0,0],2),t.querySelectorAll(".delete-btn").forEach(a=>{a.addEventListener("click",async i=>{const r=i.target.getAttribute("data-id");try{await $(r);const s=i.target.closest("article");s&&s.remove();const d=await v();this.updateMapMarkers(d),d.length===0&&(t.innerHTML='<p class="col-span-full text-center text-gray-500">Tidak ada cerita tersimpan.</p>')}catch(s){console.error("Gagal hapus cerita:",s)}})})});p(this,"updateMapMarkers",e=>{if(!this.map)return;this._markers&&this._markers.forEach(n=>this.map.removeLayer(n)),this._markers=[];const t=[];e.forEach(n=>{if(n.lat&&n.lon){const a=L.marker([n.lat,n.lon]).addTo(this.map);a.bindPopup(`<strong>${n.name}</strong><br/>${n.description}`),this._markers.push(a),t.push([n.lat,n.lon])}}),t.length?this.map.fitBounds(t,{padding:[50,50]}):this.map.setView([0,0],2)})}}let g=null;function z(o){g&&g.getTracks().forEach(e=>e.stop()),g=o}function k(){g&&(g.getTracks().forEach(o=>o.stop()),g=null)}class U{async render(){return`
      <section role="region" aria-labelledby="add-title">
        <h1 id="add-title" class="sr-only">Tambah Cerita</h1>
        <form id="add-story-form" class="space-y-4 max-w-lg mx-auto">
          <!-- Nama Pengirim -->
          <div>
            <label for="name" class="block font-medium mb-1">Nama Pengirim</label>
            <input
              id="name-input" name="name" type="text"
              placeholder="Masukkan nama Anda" required
              class="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <!-- Deskripsi -->
          <div>
            <label for="description" class="block font-medium mb-1">Deskripsi</label>
            <textarea
              id="description" name="description" placeholder="Ceritakan pengalaman Anda..."
              required class="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          <!-- Pilih Foto dari File Komputer -->
          <div>
            <label for="file-input" class="block font-medium mb-1">Pilih Foto</label>
            <input
              id="file-input" name="photo" type="file" accept="image/*"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <!-- Ambil Foto via Kamera -->
          <div>
            <label for="video-stream" class="block font-medium mb-1">Ambil Foto</label>
            <video
              id="video-stream" class="w-full h-48 bg-gray-200 rounded"
              aria-label="Pratinjau kamera" muted playsinline
            ></video>
            <button
              type="button" id="capture-btn"
              class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >Ambil Foto</button>
            <canvas
              id="canvas-preview"
              class="hidden w-full h-48 mt-2 rounded mb-2"
              aria-label="Pratinjau foto"
            ></canvas>
          </div>
          <!-- Pilih Lokasi -->
          <div>
            <label for="map-add" class="block font-medium mb-1">Lokasi</label>
            <div
              id="map-add" class="w-full h-64 rounded shadow mb-2"
              role="region" aria-label="Peta memilih lokasi"
            ></div>
            <input id="lat" name="lat" type="hidden" />
            <input id="lon" name="lon" type="hidden" />
            <p id="coord-display" class="text-sm text-gray-600"></p>
          </div>
          <!-- Submit -->
          <div id="submit-button-container">
            <button
              type="submit"
              class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >Simpan Cerita</button>
          </div>
        </form>
      </section>
    `}async afterRender(){let e=null,t=null;document.getElementById("file-input").addEventListener("change",r=>{const s=r.target.files[0];if(s){t=s,k();const d=new Image;d.onload=()=>{const m=document.getElementById("canvas-preview");m.width=d.width,m.height=d.height,m.getContext("2d").drawImage(d,0,0),m.classList.remove("hidden"),document.getElementById("video-stream").classList.add("hidden")},d.src=URL.createObjectURL(s)}});const n=document.getElementById("video-stream");try{e=await navigator.mediaDevices.getUserMedia({video:!0}),z(e),n.srcObject=e,await n.play()}catch{n.classList.add("hidden"),document.getElementById("capture-btn").classList.add("hidden")}document.getElementById("capture-btn").addEventListener("click",()=>{if(!e)return;const r=document.getElementById("canvas-preview");r.width=n.videoWidth,r.height=n.videoHeight,r.getContext("2d").drawImage(n,0,0),r.toBlob(s=>{t=s,r.classList.remove("hidden"),n.classList.add("hidden")},"image/png"),k()});const a=L.map("map-add").setView([0,0],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(a);let i;a.on("click",r=>{const{lat:s,lng:d}=r.latlng;i&&i.remove(),i=L.marker([s,d]).addTo(a),document.getElementById("lat").value=s,document.getElementById("lon").value=d,document.getElementById("coord-display").textContent=`Lat: ${s.toFixed(5)}, Lon: ${d.toFixed(5)}`}),document.getElementById("add-story-form").addEventListener("submit",async r=>{r.preventDefault();const s=document.getElementById("name-input").value.trim(),d=document.getElementById("description").value.trim(),m=parseFloat(document.getElementById("lat").value),x=parseFloat(document.getElementById("lon").value);if(!s||!d||!t||isNaN(m)||isNaN(x)){alert("Mohon lengkapi semua field.");return}const h=document.querySelector("#submit-button-container button");h.disabled=!0,h.textContent="Loading…";try{const f=await w.createStoryAsGuest({name:s,description:d,photoBlob:t,lat:m,lon:x});if(!f.error)window.location.hash="#/";else throw new Error(f.message)}catch(f){alert(f.message)}finally{h.disabled=!1,h.textContent="Simpan Cerita"}})}}const H="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";function V(o){const e="=".repeat((4-o.length%4)%4),t=(o+e).replace(/-/g,"+").replace(/_/g,"/"),n=window.atob(t);return new Uint8Array([...n].map(a=>a.charCodeAt(0)))}async function I(){if(!("serviceWorker"in navigator))throw new Error("Browser tidak mendukung Service Worker");return navigator.serviceWorker.ready}async function G(){const o=l();if(!o)throw new Error("Silakan login terlebih dahulu sebelum mengaktifkan notifikasi.");const e=await I();if(await Notification.requestPermission()!=="granted")throw new Error("Izin notifikasi tidak diberikan.");const n=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:V(H)}),a={endpoint:n.endpoint,keys:{p256dh:btoa(String.fromCharCode(...new Uint8Array(n.getKey("p256dh")||[]))),auth:btoa(String.fromCharCode(...new Uint8Array(n.getKey("auth")||[])))}},r=await(await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(a)})).json();if(r.error)throw new Error(r.message);return!0}async function J(){const o=l();if(!o)throw new Error("Silakan login terlebih dahulu sebelum menonaktifkan notifikasi.");const t=await(await I()).pushManager.getSubscription();if(!t)throw new Error("Belum berlangganan notifikasi.");const a=await(await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({endpoint:t.endpoint})})).json();if(a.error)throw new Error(a.message);return await t.unsubscribe(),!0}class K{async render(){return`
      <section class="max-w-md mx-auto p-4 space-y-4">
        <h1 class="text-xl font-bold">Pengaturan Notifikasi</h1>
        <button id="btn-enable" class="px-4 py-2 bg-green-500 text-white rounded w-full">
          Aktifkan Notifikasi
        </button>
        <button id="btn-disable" class="px-4 py-2 bg-red-500 text-white rounded w-full">
          Nonaktifkan Notifikasi
        </button>
      </section>
    `}async afterRender(){document.getElementById("btn-enable").addEventListener("click",async()=>{try{await G(),alert("Notifikasi diaktifkan!")}catch(e){alert("Gagal mengaktifkan: "+e.message)}}),document.getElementById("btn-disable").addEventListener("click",async()=>{try{await J(),alert("Notifikasi dinonaktifkan!")}catch(e){alert("Gagal menonaktifkan: "+e.message)}})}}const S={"#/register":F,"#/login":R,"#/":_,"#/addStory":U,"#/settings":K},P=async()=>{k();const o=window.location.hash||"#/";if(console.log("🔄 router hit with hash =",o," token=",l()),!l()&&o!=="#/register"&&o!=="#/login"){console.warn("⛔ no token, redirect to login"),window.location.hash="#/login";return}if(l()&&(o==="#/register"||o==="#/login")){console.warn("✅ have token, redirect to home"),window.location.hash="#/";return}const e=S[o]||S["#/"],t=new e;if(document.startViewTransition)document.startViewTransition(async()=>{const n=await t.render();document.getElementById("main-content").innerHTML=n,await t.afterRender()});else{const n=await t.render();document.getElementById("main-content").innerHTML=n,await t.afterRender()}console.log("🚀 afterRender done")};window.addEventListener("hashchange",P);window.addEventListener("DOMContentLoaded",P);function E(){const o=window.location.hash||"#/",e=!!l(),t=o==="#/login"||o==="#/register";document.getElementById("nav-login").style.display=t?"block":"none",document.getElementById("nav-register").style.display=t?"block":"none",t?(document.getElementById("nav-home").style.display="none",document.getElementById("nav-add").style.display="none",document.getElementById("nav-settings").style.display="none",document.getElementById("nav-logout").style.display="none"):(document.getElementById("nav-home").style.display=e?"block":"none",document.getElementById("nav-add").style.display=e?"block":"none",document.getElementById("nav-settings").style.display=e?"block":"none",document.getElementById("nav-logout").style.display=e?"block":"none")}E();const B=document.getElementById("logout-btn");B&&B.addEventListener("click",()=>{C(),window.location.hash="#/login",E()});"serviceWorker"in navigator&&window.addEventListener("load",async()=>{try{const o=await navigator.serviceWorker.register("/sw.js");console.log("SW registered with scope:",o.scope)}catch(o){console.error("SW registration failed:",o)}});window.addEventListener("hashchange",E);window.addEventListener("online",()=>{console.log("Koneksi online, mulai sinkronisasi data..."),O()});
