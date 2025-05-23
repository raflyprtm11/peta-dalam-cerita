import { setActiveStream, stopActiveStream } from '../../camera.js';

export default class AddView {
  render() {
    return `
      <section aria-label="Tambah Cerita">
        <form id="add-story-form" class="space-y-4 max-w-lg mx-auto">
          <!-- Nama, Deskripsi, Foto, Koordinat -->
          <div>
            <label for="name-input">Nama Pengirim</label>
            <input id="name-input" type="text" required />
          </div>
          <div>
            <label for="description-input">Deskripsi</label>
            <textarea id="description-input" required></textarea>
          </div>
          <div class="flex space-x-2">
            <button id="choose-camera-btn" type="button">Kamera</button>
            <button id="choose-file-btn" type="button">Upload File</button>
            <input id="file-input" type="file" accept="image/*" hidden />
          </div>
          <video id="video-stream" class="hidden"></video>
          <canvas id="canvas-preview" class="hidden"></canvas>
          <div id="map" class="w-full h-64 mb-4"></div>
          <input id="lat" type="hidden" />
          <input id="lon" type="hidden" />
          <p id="coord-display"></p>
          <button type="submit">Simpan Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._initCamera();
    this._initMap();
  }

  initForm(callback) {
    const form = document.getElementById('add-story-form');
    const nameInput = document.getElementById('name-input');
    const descInput = document.getElementById('description-input');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const coordDisplay = document.getElementById('coord-display');
    const video = document.getElementById('video-stream');
    const canvas = document.getElementById('canvas-preview');
    const chooseCamBtn = document.getElementById('choose-camera-btn');
    const chooseFileBtn = document.getElementById('choose-file-btn');
    const fileInput = document.getElementById('file-input');
    let photoBlob = null;

    chooseCamBtn.addEventListener('click', async () => {
      try {
        const stream = await setActiveStream(video);
        video.classList.remove('hidden');
        canvas.classList.add('hidden');
      } catch (e) {
        alert('Kamera tidak tersedia');
      }
    });

    chooseFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        photoBlob = file;
        canvas.classList.remove('hidden');
        video.classList.add('hidden');
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => (photoBlob = blob));
        };
        img.src = URL.createObjectURL(file);
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      callback({
        name: nameInput.value,
        description: descInput.value,
        photoBlob,
        lat: parseFloat(latInput.value),
        lon: parseFloat(lonInput.value)
      });
      stopActiveStream();
    });
  }

  _initCamera() {
  }

  _initMap() {
    this.map = L.map('map').setView([-0.7893, 113.9213], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.on('click', e => {
      if (this.marker) this.marker.remove();
      this.marker = L.marker(e.latlng).addTo(this.map);
      document.getElementById('lat').value = e.latlng.lat;
      document.getElementById('lon').value = e.latlng.lng;
      document.getElementById('coord-display').textContent =
        `Lat: ${e.latlng.lat.toFixed(5)}, Lon: ${e.latlng.lng.toFixed(5)}`;
    });
  }
}