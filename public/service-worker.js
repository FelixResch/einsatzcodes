/**
 * Created by felix on 12/13/16.
 */

const cacheName = 'emergencyCodes-shell-1';
const filesToCache = [
    '/',
    '/scripts/app.js',
    '/styles/style.css',
    '/scripts/jquery/jquery.min.js',
    '/styles/fontawesome/css/font-awesome.min.css',
    '/styles/fontawesome/fonts/fontawesome-webfont.woff2?v=4.7.0'
];
const dataCacheName = 'emergencyCodes-data-1';

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell')
            return cache.addAll(filesToCache)
        })
    )
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if(key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key)
                }
            }))
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = '/codes/';
    if(e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request).then(function (response) {
                    let res = response.clone();
                    caches.open(dataCacheName).then(function (cache) {
                        cache.put(e.request.url, res);
                    });
                    return response;
                })
            })
        )
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request)
            })
        )
    }
});