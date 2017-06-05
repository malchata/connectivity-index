const cacheVersion = "v10";
const cacheWhitelist = ["v10"];
const cssHash = "50ff0221";
const jsHash = "e079f224";
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
		networkPreferredContentTypes = /(text\/html)/i;

	if(allowedAssets.test(event.request.url) === true && deniedAssets.test(event.request.url) === false){
		event.respondWith(
			caches.match(event.request).then((cachedResponse)=>{
				if(cachedResponse !== undefined && networkPreferredContentTypes.test(cachedResponse.headers.get("Content-Type")) === true){
					return fetch(event.request).then((fetchedResponse)=>{
						let response = fetchedResponse.clone();

						caches.open(cacheVersion).then((cache)=>{
							cache.put(event.request, response);
						});

						return fetchedResponse;
					}).catch(()=>{
						return cachedResponse;
					});
				}
				else{
					return cachedResponse || fetch(event.request).then((fetchedResponse)=>{
						let response = fetchedResponse.clone();

						caches.open(cacheVersion).then((cache)=>{
							cache.put(event.request, response);
						});

						return fetchedResponse;
					});
				}
			})
		);
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
