const CACHE_NAME = 'careermap-cache-v1';

// ─── INSTALL EVENT ───
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
      ]);
    })
  );
  self.skipWaiting();
});

// ─── ACTIVATE EVENT ───
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// ─── FETCH EVENT ───
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// ─── PUSH EVENT ───
// ─── PUSH EVENT ───
self.addEventListener('push', (event) => {
  console.log('Push received!', event);
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'CareerMap',
      body: event.data ? event.data.text() : 'You have a new notification'
    };
  }

  const title = data.title || 'CareerMap';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ─── NOTIFICATION CLICK ───
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://localhost:5173')
  );
});