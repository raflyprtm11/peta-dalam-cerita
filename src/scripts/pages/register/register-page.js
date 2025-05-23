import storyApi from '../../api/storyApi.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="flex items-center justify-center">
      <div class="rounded-lg p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">Daftar Akun</h1>
        <form id="register-form" class="space-y-4 bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md">
          <div>
            <label for="name" class="block">Nama</label>
            <input type="text" id="name" placeholder="Masukkan nama Anda" required class="w-full p-2 border rounded" />
          </div>
          <div>
            <label for="email" class="block">Email</label>
            <input type="email" id="email" placeholder="Contoh: nama@email.com" required class="w-full p-2 border rounded" />
          </div>
          <div>
            <label for="password" class="block">Password</label>
            <input type="password" id="password" placeholder="Masukkan password Anda" required minlength="8"
                   class="w-full p-2 border rounded" />
          </div>
          <button type="submit" class="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition">
            Daftar
          </button>
          <p class="mt-4 text-center text-sm">
        Sudah punya akun?
        <a href="#/login" class="text-green-500 hover:underline">Masuk</a>
      </p>
        </form>
      </div>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById('register-form')
      .addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const { error, message } = await storyApi.register({ name, email, password });
        if (error) {
          alert(message || 'Register gagal');
        } else {
          alert(message);
          window.location.hash = '#/login';
        }
      });
  }
}
