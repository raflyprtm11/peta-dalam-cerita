import storyApi from '../../api/storyApi.js';
import { getAllStories, saveStory, deleteStory } from '../../utils/indexedDB.js';

export default class HomePage {
  render = async () => {
    return `
      <section aria-label="Daftar Cerita">
        <div id="map" class="w-full h-64 rounded shadow mb-6"></div>
        <div id="judul"><h1>Cerita Manusia</h1></div>
        <div id="story-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </section>
    `;
  };

  afterRender = async () => {
    // Inisialisasi peta
    if (!this.map) {
      this.map = L.map('map').setView([0, 0], 2);
      const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      const satellite = L.tileLayer(`
        https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=0ZttLfXyTTfQ4Mp5XAsw
      `);
      const countries = L.tileLayer(`
        https://api.maptiler.com/tiles/countries/{z}/{x}/{y}.pbf?key=0ZttLfXyTTfQ4Mp5XAsw
      `);
      L.control.layers({ OpenStreetMap: base, Satellite: satellite, Countries: countries }).addTo(this.map);
    }

    let stories;
    if (navigator.onLine) {
      stories = await storyApi.getStories();
      for (const story of stories) {
        story.synced = true;
        await saveStory(story);
      }
    } else {
      stories = await getAllStories();
    }

    this.renderStories(stories);
  };

  renderStories = (stories) => {
    const list = document.getElementById('story-list');
    list.innerHTML = '';
    const bounds = [];

    if (!stories || stories.length === 0) {
      list.innerHTML = '<p class="col-span-full text-center text-gray-500">Tidak ada cerita tersimpan.</p>';
      if (this.map) this.map.setView([0, 0], 2);
      return;
    }

    stories.forEach(story => {
      const card = document.createElement('article');
      card.className = 'bg-white rounded-lg shadow overflow-hidden relative';
      card.dataset.id = story.id; // buat referensi hapus cepat
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-semibold">${story.name}</h2>
          <p class="text-gray-700 mb-2">${story.description}</p>
          <p class="text-gray-500 text-sm">${new Date(story.createdAt).toLocaleDateString()}</p>
          <button class="delete-btn absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700" data-id="${story.id}">Hapus</button>
        </div>
      `;
      list.appendChild(card);

      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`);
        bounds.push([story.lat, story.lon]);
      }
    });

    if (bounds.length) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      this.map.setView([0, 0], 2);
    }

    // Pasang event listener hapus
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
          await deleteStory(id);

          // Hapus card langsung supaya UI responsif
          const card = e.target.closest('article');
          if (card) card.remove();

          // Update peta dengan data tersisa
          const remainingStories = await getAllStories();
          this.updateMapMarkers(remainingStories);

          if (remainingStories.length === 0) {
            list.innerHTML = '<p class="col-span-full text-center text-gray-500">Tidak ada cerita tersimpan.</p>';
          }
        } catch (err) {
          console.error('Gagal hapus cerita:', err);
        }
      });
    });
  };

  updateMapMarkers = (stories) => {
    if (!this.map) return;

    // Hapus semua marker yang ada dulu
    if (this._markers) {
      this._markers.forEach(marker => this.map.removeLayer(marker));
    }
    this._markers = [];

    const bounds = [];
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`);
        this._markers.push(marker);
        bounds.push([story.lat, story.lon]);
      }
    });

    if (bounds.length) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      this.map.setView([0, 0], 2);
    }
  };
}