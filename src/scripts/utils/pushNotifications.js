import { getToken } from './auth.js';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

async function getRegistration() {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Browser tidak mendukung Service Worker');
    }
    return navigator.serviceWorker.ready;
}

export async function enablePushNotifications() {
    const token = getToken();
    if (!token) {
        throw new Error('Silakan login terlebih dahulu sebelum mengaktifkan notifikasi.');
    }

    const registration = await getRegistration();

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Izin notifikasi tidak diberikan.');
    }

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const body = {
        endpoint: subscription.endpoint,
        keys: {
            p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh') || []))),
            auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth') || []))),
        },
    };

    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.message);

    return true;
}

export async function disablePushNotifications() {
    const token = getToken();
    if (!token) {
        throw new Error('Silakan login terlebih dahulu sebelum menonaktifkan notifikasi.');
    }

    const registration = await getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        throw new Error('Belum berlangganan notifikasi.');
    }

    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.message);

    await subscription.unsubscribe();
    return true;
}
