import HomeView from '../home/home-view.js';
import { fetchStoriesWithCache } from '../../utils/offlineData.js';

export default class HomePresenter {
    constructor({ view = new HomeView() } = {}) {
        this.view = view;
    }

    async init() {
        this.view.show();
        await this.view.afterRender();
        await this.afterRender();
    }

    async afterRender() {
        try {
            const stories = await fetchStoriesWithCache();
            this.view.showStories(stories);
        } catch {
            this.view.showError('Gagal memuat cerita');
        }
    }
}
