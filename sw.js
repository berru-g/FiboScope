self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('fiboscope-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script2.js',
          '/superpose',
          '/alarm',
          '/wallet',
          // Ajoute ici les autres ressources à mettre en cache
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  