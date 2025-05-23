import RegisterView from '../register/register-view.js';
import storyApi from '../../api/storyApi.js';

export default class RegisterPresenter {
    constructor({ view = new RegisterView() } = {}) {
        this.view = view;
    }

    async init() {
        this.view.show();
        await this.view.afterRender();
        this.view.initForm(async data => {
            this.view.showLoading();
            try {
                const res = await storyApi.register(data);
                this.view.showSuccess(res);
            } catch {
                this.view.showError('Registrasi gagal');
            }
        });
    }
}