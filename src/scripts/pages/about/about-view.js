export default class AboutView {
  render() {
    return `
      <section class="max-w-prose mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">About</h1>
        <p>Aplikasi ini dibangun menggunakan SPA, MVP, dan Leaflet.js.</p>
      </section>
    `;
  }
  afterRender() {}
}