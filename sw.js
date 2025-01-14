const CACHE_NAME = "pwa-cache";
const CACHE_TIME = 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .addAll([
          "https://codingwithenjoy.github.io/Dastyar-App/",
          "https://codingwithenjoy.github.io/Dastyar-App/index.html",
          "https://codingwithenjoy.github.io/Dastyar-App/style.css",
          "https://codingwithenjoy.github.io/Dastyar-App/script.js",
          "https://codingwithenjoy.github.io/Dastyar-App/assets/logo1.jpg",
          "https://codingwithenjoy.github.io/Dastyar-App/assets/logo2.jpg",
          "https://codingwithenjoy.github.io/Dastyar-App/icon/done.svg",
          "https://codingwithenjoy.github.io/Dastyar-App/icon/trash.svg",
          "https://codingwithenjoy.github.io/Dastyar-App/icon/x.svg",
          "https://codingwithenjoy.github.io/Dastyar-App/logo/bale.png",
          "https://codingwithenjoy.github.io/Dastyar-App/logo/chatgpt.png",
          "https://codingwithenjoy.github.io/Dastyar-App/logo/digikala.png",
          "https://codingwithenjoy.github.io/Dastyar-App/logo/soundcloud.png",
          "https://codingwithenjoy.github.io/Dastyar-App/logo/youtube.png",
        ])
        .then(() => {
          return cache.put("cache-time", new Response(Date.now().toString()));
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!response) {
        return fetch(event.request);
      }

      return caches.match("cache-time").then((timestampResponse) => {
        if (!timestampResponse) {
          return response;
        }

        return timestampResponse.text().then((timestamp) => {
          const cacheTime = parseInt(timestamp, 10);
          const currentTime = Date.now();

          if (currentTime - cacheTime > CACHE_TIME) {
            return fetch(event.request).then((newResponse) => {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, newResponse);
                cache.put("cache-time", new Response(Date.now().toString()));
              });
              return newResponse;
            });
          }

          return response;
        });
      });
    })
  );
});
