import SettingsView from '../settings/settings-view.js';
import { enablePushNotifications, disablePushNotifications } from '../../utils/pushNotifications.js';

export default class SettingsPresenter {
    constructor({ view = new SettingsView() } = {}) {
        this.view = view;
    }

    async init() {
        this.view.show();
        await this.view.afterRender();
        this._bindEvents();
    }

    _bindEvents() {
        this.view.onEnable(async () => {
            try {
                await enablePushNotifications();
                this.view.showEnableSuccess();
            } catch (err) {
                this.view.showError('Gagal mengaktifkan notifikasi.');
            }
        });

        this.view.onDisable(async () => {
            try {
                await disablePushNotifications();
                this.view.showDisableSuccess();
            } catch (err) {
                this.view.showError('Gagal menonaktifkan notifikasi.');
            }
        });
    }
}