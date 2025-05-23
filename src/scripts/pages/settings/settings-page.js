import { enablePushNotifications, disablePushNotifications } from '../../utils/pushNotifications.js';

export default class SettingsPage {
    async render() {
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
        document.getElementById('btn-enable').addEventListener('click', async () => {
            try {
                await enablePushNotifications();
                alert('Notifikasi diaktifkan!');
            } catch (err) {
                alert('Gagal mengaktifkan: ' + err.message);
            }
        });
        document.getElementById('btn-disable').addEventListener('click', async () => {
            try {
                await disablePushNotifications();
                alert('Notifikasi dinonaktifkan!');
            } catch (err) {
                alert('Gagal menonaktifkan: ' + err.message);
            }
        });
    }
}
