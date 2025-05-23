import storyApi from '../../api/storyApi.js';
import { setActiveStream, stopActiveStream } from '../../camera.js';

export default class AddStory {
  async render() {
    return `
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
    `;
  }

  async afterRender() {
    let stream = null;
    let photoBlob = null;

    document.getElementById('file-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        photoBlob = file;
        stopActiveStream();
        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById('canvas-preview');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          canvas.classList.remove('hidden');
          document.getElementById('video-stream').classList.add('hidden');
        };
        img.src = URL.createObjectURL(file);
      }
    });

    const video = document.getElementById('video-stream');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setActiveStream(stream);
      video.srcObject = stream;
      await video.play();
    } catch {
      video.classList.add('hidden');
      document.getElementById('capture-btn').classList.add('hidden');
    }

    document.getElementById('capture-btn').addEventListener('click', () => {
      if (!stream) return;
      const canvas = document.getElementById('canvas-preview');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        photoBlob = blob;
        canvas.classList.remove('hidden');
        video.classList.add('hidden');
      }, 'image/png');
      stopActiveStream();
    });

    const map = L.map('map-add').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let marker;
    map.on('click', e => {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map);
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
      document.getElementById('coord-display').textContent =
        `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`;
    });

    document.getElementById('add-story-form').addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('name-input').value.trim();
      const description = document.getElementById('description').value.trim();
      const lat = parseFloat(document.getElementById('lat').value);
      const lon = parseFloat(document.getElementById('lon').value);

      if (!name || !description || !photoBlob || isNaN(lat) || isNaN(lon)) {
        alert('Mohon lengkapi semua field.');
        return;
      }

      const btn = document.querySelector('#submit-button-container button');
      btn.disabled = true;
      btn.textContent = 'Loading…';

      try {
        const res = await storyApi.createStoryAsGuest({
          name, description, photoBlob, lat, lon
        });
        if (!res.error) window.location.hash = '#/';
        else throw new Error(res.message);
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Simpan Cerita';
      }
    });
  }
}
