
const AddView = {
  render() {
    return \`
      <section class="p-4">
        <h2 class="text-xl font-bold mb-4">Tambah Cerita Baru</h2>
        <form id="add-form" class="space-y-4">
          <!-- Nanti akan diisi elemen form -->
          <p class="text-gray-500">Formulir akan ditambahkan nanti.</p>
        </form>
      </section>
    \`;
  },

  afterRender() {
    // Event listener form nanti ditambahkan di sini
  }
};

export default AddView;
