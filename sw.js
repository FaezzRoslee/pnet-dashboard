const CACHE_NAME = 'pnet-dashboard-v20'; // Anda boleh ubah ke v19, v20 untuk kemas kini seterusnya

// Senarai fail yang akan disimpan di dalam telefon pengguna (Cache)
const assets = [
  './',
  './index.html',
  './manifest.json',
  './uprlogo.png',
  './jatanegara.png',
  './1560128.jpg' // gambar footer
];

// Install Service Worker & Simpan Cache
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Menyimpan fail cache...');
      return cache.addAll(assets);
    })
  );
});

// Aktifkan Service Worker & Buang Cache Lama (jika ada update)
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Data (Guna Cache jika tiada internet + Tangani ralat gagal fetch)
self.addEventListener('fetch', evt => {
  // Hanya proses request jenis http/https (abaikan chrome-extension:// dll)
  if (!(evt.request.url.indexOf('http') === 0)) return;

  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // Return dari cache JIKA ada. Kalau tak ada, cuba fetch dari server.
      return cacheRes || fetch(evt.request).catch(err => {
          console.warn('Gagal fetch sumber luar talian:', evt.request.url);
          // Anda boleh return custom fallback page/image di sini jika mahu
      });
    })
  );
});

// Menerima arahan dari butang "Kemaskini" di index.html
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});