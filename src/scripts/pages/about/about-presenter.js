import AboutView from '../about/about-view.js';
export default class AboutPresenter {
  constructor({ view = new AboutView() } = {}) {
    this.view = view;
  }
  async init() {
    document.getElementById('main-content').innerHTML = this.view.render();
    await this.view.afterRender();
  }
}