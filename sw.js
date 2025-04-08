// CampusCraze Service Worker for PWA functionality
const CACHE_NAME = 'campuscraze-v1';
const ASSETS = [
  '/PWA-CAMPUS-CRAZE/',
  '/PWA-CAMPUS-CRAZE/index.html',
  '/PWA-CAMPUS-CRAZE/styles.css',
  '/PWA-CAMPUS-CRAZE/main.js',
  '/PWA-CAMPUS-CRAZE/manifest.json',
  '/PWA-CAMPUS-CRAZE/images/logo.svg',
  '/PWA-CAMPUS-CRAZE/images/college-vibes.webp',
  '/PWA-CAMPUS-CRAZE/images/stationery.webp',
  '/PWA-CAMPUS-CRAZE/images/decor.webp',
  '/PWA-CAMPUS-CRAZE/images/fashion.webp',
  '/PWA-CAMPUS-CRAZE/images/tech.webp',
  '/PWA-CAMPUS-CRAZE/images/study-bundle.webp',
  '/PWA-CAMPUS-CRAZE/images/decor-bundle.webp',
  '/PWA-CAMPUS-CRAZE/images/app-mockup.webp',
  '/PWA-CAMPUS-CRAZE/images/google-play.svg',
  '/PWA-CAMPUS-CRAZE/images/app-store.svg',
  '/PWA-CAMPUS-CRAZE/images/avatar-simran.webp',
  '/PWA-CAMPUS-CRAZE/images/avatar-rishi.webp',
  '/PWA-CAMPUS-CRAZE/images/avatar-priya.webp',
  '/PWA-CAMPUS-CRAZE/images/instagram.svg',
  '/PWA-CAMPUS-CRAZE/images/youtube.svg',
  '/PWA-CAMPUS-CRAZE/images/twitter.svg',
  '/PWA-CAMPUS-CRAZE/icons/icon-192x192.png',
  '/PWA-CAMPUS-CRAZE/icons/icon-512x512.png',
  '/PWA-CAMPUS-CRAZE/offline.html',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap'
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching files");
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Enhanced Fetch Event
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch", event.request.url);
  const requestURL = new URL(event.request.url);

  // If request is same-origin, use Cache First
  if (requestURL.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return ( cachedResponse ||
          fetch(event.request).catch(() => caches.match("offline.html"))
        );
      })
    );
  } else {
    // Else, use Network First
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((res) => {
            return res || caches.match("offline.html");
          })
        )
    );
  }
});

// Sync Event (simulation)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(
      (async () => {
        console.log("Sync event triggered: 'sync-data'");
        // Here you can sync data with server when online
      })()
    );
  }
});

// Push Event
self.addEventListener("push", function (event) {
  if (event && event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        method: "pushMessage",
        message: event.data.text(),
      };
    }

    if (data.method === "pushMessage") {
      console.log("Push notification sent");
      event.waitUntil(
        self.registration.showNotification("CampusCraze - Cool Stuff for College Life", {
          body: data.message,
        })
      );
    }
  }
});
