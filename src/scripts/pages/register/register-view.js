export default class RegisterView {
  render() {
    return `
      <section class="max-w-md mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Daftar</h1>
        <form id="register-form" class="space-y-4">
          <div>
            <label for="name-input">Nama</label>
            <input id="name-input" type="text" required />
          </div>
          <div>
            <label for="email-input">Email</label>
            <input id="email-input" type="email" required />
          </div>
          <div>
            <label for="password-input">Password</label>
            <input id="password-input" type="password" required />
          </div>
          <div id="register-submit"></div>
        </form>
      </section>
    `;
  }

  async afterRender() { }

  initForm(callback) {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('name-input').value;
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
      callback({ name, email, password });
    });
  }

  showLoading() {
    document.getElementById('register-submit').innerHTML = '<button disabled>Loading…</button>';
  }

  showSuccess(res) {
    alert('Registrasi berhasil');
  }

  showError(msg) {
    alert(msg);
  }
}
