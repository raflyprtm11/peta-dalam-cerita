export default class SettingsView {
    render() {
        return `
      <section class="max-w-md mx-auto p-4 space-y-4">
        <h1 class="text-xl font-bold">Pengaturan Notifikasi</h1>
        <button id="btn-enable" class="px-4 py-2 bg-green-500 text-white rounded w-full">
          Aktifkan Notifikasi
        </button>
        <button id="btn-disable" class="px-4 py-2 bg-red-500 text-white rounded w-full">
          Nonaktifkan Notifikasi
        </button>
      </section>
    `;
    }

    async afterRender() {
    }

    onEnable(callback) {
        const btn = document.getElementById('btn-enable');
        if (btn) btn.addEventListener('click', callback);
    }

    onDisable(callback) {
        const btn = document.getElementById('btn-disable');
        if (btn) btn.addEventListener('click', callback);
    }

    showEnableSuccess() {
        alert('Notifikasi diaktifkan!');
    }

    showDisableSuccess() {
        alert('Notifikasi dinonaktifkan!');
    }

    showError(message) {
        alert(message);
    }
}