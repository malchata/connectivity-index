const cacheVersion = "v9";
const cacheWhitelist = ["v9"];
const cssHash = "0ceab81a";
const jsHash = "754dc8b3";
const cachedAssets = [
	"/",
	"/css/styles.css?v=" + cssHash,
	"/js/scripts.min.js?v=" + jsHash
];

self.addEventListener("install", (event)=>{
	event.waitUntil(caches.open(cacheVersion).then((cache)=>{
		return cache.addAll(cachedAssets);
	}).then(()=>{
		return self.skipWaiting();
	}));
});

self.addEventListener("fetch", (event)=>{
	let allowedAssets = /(localhost|cindex\.co)/i,
		deniedAssets = /(google-analytics\.com)/i,
		networkPreferredAssets = /(sw\.js)$/i;

	if(allowedAssets.test(event.request.url) === true && deniedAssets.test(event.request.url) === false){
		if(networkPreferredAssets.test(event.request.url) === true){
			event.respondWith(
				fetch(event.request).then((fetchedResponse)=>{
					let response = fetchedResponse.clone();

					caches.open(cacheVersion).then((cache)=>{
						cache.put(event.request, response);
					});

					return fetchedResponse;
				}).catch(()=>{
					return caches.match(event.request);
				})
			);
		}
		else{
			event.respondWith(
				caches.match(event.request).then((cachedResponse)=>{
					return cachedResponse || fetch(event.request).then((fetchedResponse)=>{
						let response = fetchedResponse.clone();

						caches.open(cacheVersion).then((cache)=>{
							cache.put(event.request, response);
						});

						return fetchedResponse;
					});
				})
			);
		}
	}
});

self.addEventListener("activate", (event)=>{
	event.waitUntil(
		caches.keys().then((keyList)=>{
			return Promise.all([
				keyList.map((key)=>{
					if(cacheWhitelist.indexOf(key) === -1){
						return caches.delete(key);
					}
				}), self.clients.claim()
			]);
		})
	);
});
