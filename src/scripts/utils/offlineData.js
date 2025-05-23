import { saveStory, getUnsyncedStories } from './indexedDB.js';

export async function addStory(story) {
    if (navigator.onLine) {
        try {
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(story),
            });

            if (!response.ok) throw new Error('Gagal kirim ke server');

            const savedStory = await response.json();

            savedStory.synced = true;
            await saveStory(savedStory);

        } catch (error) {
            console.error('Error kirim ke server:', error);
            story.synced = false;
            await saveStory(story);
        }
    } else {
        story.synced = false;
        await saveStory(story);
    }
}

export async function syncStories() {
    const unsynced = await getUnsyncedStories();
    for (const story of unsynced) {
        try {
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(story),
            });

            if (!response.ok) throw new Error('Gagal sinkron data ke server');

            const savedStory = await response.json();
            savedStory.synced = true;
            await saveStory(savedStory);
            console.log(`Sinkron berhasil untuk cerita id ${story.id}`);
        } catch (error) {
            console.error(`Sinkron gagal untuk cerita id ${story.id}:`, error);
        }
    }

    // Setelah sinkronisasi, ambil data terbaru dari server
    try {
        const res = await fetch('/api/stories');
        if (!res.ok) throw new Error('Gagal ambil data terbaru');
        const stories = await res.json();
        for (const story of stories) {
            story.synced = true;
            await saveStory(story);
        }
        // Trigger event agar UI refresh
        window.dispatchEvent(new Event('storiesUpdated'));
    } catch (err) {
        console.error('Gagal update data setelah sinkronisasi', err);
    }
}
