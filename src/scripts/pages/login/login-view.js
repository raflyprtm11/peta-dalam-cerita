export default class LoginView {
    render() {
        return `
      <section class="max-w-md mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <form id="login-form" class="space-y-4">
          <!-- email & password inputs -->
          <div id="login-submit"></div>
        </form>
      </section>
    `;
    }
    afterRender() { }
    showError(msg) { alert(msg); }
    showLoading() {
        document.getElementById('login-submit').innerHTML = '<button disabled>Loading…</button>';
    }
    showButton() {
        document.getElementById('login-submit').innerHTML = '<button type="submit">Masuk</button>';
    }
}