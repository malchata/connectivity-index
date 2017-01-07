const cacheVersion = "v2";
const cacheWhitelist = ["v2"];
const cssHash = "bacd3d8c";
const jsHash = "94531c7c";
const cachedAssets = [
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
		networkPreferredAssets = /(sw\.js|\/$)/i;

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