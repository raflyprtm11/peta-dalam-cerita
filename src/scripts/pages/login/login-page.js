import LoginPresenter from '../login/login-presenter.js';

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <section class="flex items-center justify-center">
  <div class="rounded-lg p-6 w-full max-w-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
    <form id="login-form" class="space-y-4 bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md">
      <div>
        <label for="email-input" class="block font-medium mb-1">Email</label>
        <input
          id="email-input"
          type="email"
          placeholder="Contoh: nama@email.com"
          required
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label for="password-input" class="block font-medium mb-1">Password</label>
        <input
          id="password-input"
          type="password"
          placeholder="Masukkan password anda"
          required
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div id="submit-button-container">
        <button
          type="submit"
          class="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
        >
          Masuk
        </button>
      </div>
      <p class="mt-4 text-center text-sm">
        Belum punya akun?
        <a href="#/register" class="text-green-500 hover:underline">Daftar</a>
      </p>
    </form>
  </div>
</section>
    `;
  }

  async afterRender() {
    document
      .getElementById('login-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value.trim();
        const password =
          document.getElementById('password-input').value.trim();
        await this.presenter.getLogin({ email, password });
      });
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="button" class="w-full py-2 bg-gray-500 text-white font-semibold rounded" disabled>
        Loading…
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">
        Masuk
      </button>
    `;
  }

  loginSuccessfully(message) {
    alert(message);
    window.location.hash = '#/';
  }

  loginFailed(message) {
    alert(message);
  }
}
