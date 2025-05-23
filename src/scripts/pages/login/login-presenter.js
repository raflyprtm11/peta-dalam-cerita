import storyApi from '../../api/storyApi.js';
import { setToken } from '../../utils/auth.js';

export default class LoginPresenter {
    constructor(view) {
        this.view = view;
    }

    async getLogin({ email, password }) {
        try {
            this.view.showSubmitLoadingButton();

            const response = await storyApi.login({ email, password });

            this.view.hideSubmitLoadingButton();

            if (response.error) {
                return this.view.loginFailed(response.message || 'Login gagal');
            }

            setToken(response.loginResult.token);

            this.view.loginSuccessfully(response.message || 'Login berhasil');
        } catch (err) {
            this.view.hideSubmitLoadingButton();
            this.view.loginFailed(err.message || 'Terjadi kesalahan');
        }
    }
}
