
const ListView = {
  render() {
    return \`
      <section class="p-4">
        <h2 class="text-xl font-bold mb-4">Daftar Cerita</h2>
        <div id="story-list" class="grid gap-4"></div>
      </section>
    \`;
  },

  afterRender() {
    // Akan diisi nanti oleh presenter
  }
};

export default ListView;
