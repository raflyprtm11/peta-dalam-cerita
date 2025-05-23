export default class HomeView {
  render() {
    return `
      <section aria-label="Daftar Cerita">
        <div id="map" class="w-full h-64 mb-4"></div>
        <div id="story-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </section>
    `;
  }

  async afterRender() {
    this.map = L.map('map').setView([-0.7893, 113.9213], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  showStories(stories) {
    const container = document.getElementById('story-container');
    container.innerHTML = '';
    stories.forEach(s => {
      const card = document.createElement('article');
      card.className = 'bg-white rounded-lg shadow overflow-hidden';
      card.innerHTML = `
        <img src="${s.photoUrl}" alt="Foto oleh ${s.name}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-semibold">${s.name}</h2>
          <p class="text-gray-700 mb-2">${s.description}</p>
          <p class="text-gray-500 text-xs">${new Date(s.createdAt).toLocaleDateString()}</p>
        </div>
      `;
      container.appendChild(card);

      const marker = L.marker([s.lat, s.lon]).addTo(this.map);
      marker.bindPopup(`<strong>${s.name}</strong><p>${s.description}</p>`);
    });
  }

  showError(message) {
    alert(message);
  }
}