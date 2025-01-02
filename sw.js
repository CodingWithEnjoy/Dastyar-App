self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("pwa-cache").then((cache) => {
      return cache.addAll([
        "https://codingwithenjoy.github.io/Dastyar-App/",
        "https://codingwithenjoy.github.io/Dastyar-App/index.html",
        "https://codingwithenjoy.github.io/Dastyar-App/style.css",
        "https://codingwithenjoy.github.io/Dastyar-App/script.js",
        "https://codingwithenjoy.github.io/Dastyar-App/assets/logo1.jpg",
        "https://codingwithenjoy.github.io/Dastyar-App/assets/logo2.jpg",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
