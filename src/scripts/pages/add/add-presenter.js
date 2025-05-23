import AddView from '../add/add-view.js';
import storyApi from '../../api/storyApi.js';

export default class AddPresenter {
  constructor({ view = new AddView() } = {}) {
    this.view = view;
  }

  async init() {
    this.view.show();
    await this.view.afterRender();
    this.view.initForm(data => this._submitStory(data));
  }

  async _submitStory({ name, description, photoBlob, lat, lon }) {
    if (!name || !description || !photoBlob || isNaN(lat) || isNaN(lon)) {
      this.view.showError('Mohon lengkapi semua field.');
      return;
    }
    try {
      await storyApi.addStory({ name, description, photoBlob, lat, lon });
      this.view.showSuccess();
    } catch (err) {
      this.view.showError('Gagal menambahkan cerita');
    }
  }
}