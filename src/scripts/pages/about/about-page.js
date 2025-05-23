export default class AboutPage {
  async render() {
    return `
      <section class="max-w-prose mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">About</h1>
        <p>Website Peta Dalam Cerita dibuat menggunakan SPA, MVP, Tailwind, dan Leaflet.</p>
      </section>
    `;
  }

  async afterRender() { }
}