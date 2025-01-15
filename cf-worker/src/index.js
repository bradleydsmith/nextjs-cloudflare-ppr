const BASE_ORIGIN = 'http://origin.yourserverhere.com';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		
		try {
			const routesText = await import('./prerender/routes.json');
			const routes = JSON.parse(routesText.default);
			// Check if the pathname matches any route in routes.json
			const route = routes.find(r => 
				(!r.dynamic && r.route === url.pathname) || 
				(r.dynamic && new RegExp(r.routeRegex).test(url.pathname))
			);

      		const isRSC = request.headers.get('rsc') === '1';
      		const isNextStateTree = request.headers.get('next-router-state-tree') != null ? true : false;
			const isNextRouterPrefetch = request.headers.get('next-router-prefetch') === '1' ? true : false;

			if (request.method === 'GET' && (isNextRouterPrefetch || !isNextStateTree) && route) {
        		if (isRSC) {
          			return await handleRSCPath(request, route.jsonPath);
        		} else {
          			return await handleHtmlPath(request, route.jsonPath);
        		}
      		} else if (request.method === 'GET' && isNextStateTree) {
      			return await handleNextStateTree(request);
      		} else {
				return await handleProxyRequest(request);
			}
		} catch (error) {
			console.error('Error handling request:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};

async function handleHtmlPath(req, jsonPath) {
	const routeDataText = await import(jsonPath);
	const routeData = JSON.parse(routeDataText.default);
	const htmlContent = routeData.html;

	const headers = new Headers(req.headers);
	headers.delete('host');

	const url = new URL(req.url);
	const proxyUrl = `${BASE_ORIGIN}${url.pathname}${url.search}`;

	return new Response(
		new ReadableStream({
			async start(controller) {
				try {
					controller.enqueue(new TextEncoder().encode(htmlContent));
					
					if (routeData.postponed) {
						const restOfResponse = await fetch(proxyUrl, {
			              headers
			            });
						const reader = restOfResponse.body.getReader();
						let bytesRead = 0;
						const htmlLength = new TextEncoder().encode(htmlContent).length;

						while (true) {
							const {done, value} = await reader.read();
							if (done) break;

							if (bytesRead + value.length <= htmlLength) {
								// Skip this chunk entirely
								bytesRead += value.length;
							} else if (bytesRead < htmlLength) {
								// Partial chunk needs to be skipped
								const remainingToSkip = htmlLength - bytesRead;
								controller.enqueue(value.slice(remainingToSkip));
								bytesRead = htmlLength;
							} else {
								// Past the HTML content, enqueue everything
								controller.enqueue(value);
							}
						}
					}
				} catch (error) {
					console.error(error);
				} finally {
					controller.close();
				}
			}
		}),
		{
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Transfer-Encoding': 'chunked',
				'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
        		'Vary': 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Accept-Encoding'
			},
		}
	);
}

async function handleRSCPath(req, jsonPath) {
	const routeDataText = await import(jsonPath);
	const routeData = JSON.parse(routeDataText.default);
	const rscContent = routeData.rsc;

	// Get the last two lines of rscContent
	const lines = rscContent.split('\n');
	const lastTwoLines = lines.slice(-2).join('\n');

	const headers = new Headers(req.headers);
	headers.delete('host');

	const url = new URL(req.url);
	const proxyUrl = `${BASE_ORIGIN}${url.pathname}${url.search}`;

	return new Response(
		new ReadableStream({
			async start(controller) {
				try {
					controller.enqueue(new TextEncoder().encode(rscContent));

					const nextRouterPrefetch = req.headers.get('next-router-prefetch') ? true : false;
					
					if (routeData.postponed && !nextRouterPrefetch) {
						const restOfResponse = await fetch(proxyUrl, { headers });
						const reader = restOfResponse.body.getReader();
						
						let buffer = '';
						const decoder = new TextDecoder();

						while (true) {
							const {done, value} = await reader.read();
							if (done) break;
							
							buffer += decoder.decode(value, {stream: true});
							
							// Look for the marker (last two lines) in the buffer
							const markerIndex = buffer.indexOf(lastTwoLines);
							if (markerIndex !== -1) {
								// Found the marker, skip everything before it (including the marker)
								buffer = buffer.slice(markerIndex + lastTwoLines.length);
								// Start enqueueing from this point forward
								if (buffer.length > 0) {
									controller.enqueue(new TextEncoder().encode(buffer));
								}
								// Direct streaming for remaining chunks
								while (true) {
									const {done, value} = await reader.read();
									if (done) break;
									controller.enqueue(value);
								}
								break;
							}
						}
					}
				} catch (error) {
					console.error(error);
				} finally {
					controller.close();
				}
			}
		}),
		{
			headers: {
				'Content-Type': 'text/x-component',
				'Transfer-Encoding': 'chunked',
				'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
				'Vary': 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Accept-Encoding',
				'X-Nextjs-Postponed': routeData.postponed ? '1' : undefined,
				'X-Nextjs-Prerender': 1
			},
		}
	);
}

async function handleProxyRequest(req) {
	const url = new URL(req.url);
	const proxyUrl = `${BASE_ORIGIN}${url.pathname}${url.search}`;

	const headers = new Headers(req.headers);
	headers.delete('host');

	return fetch(proxyUrl, {
		method: req.method,
		headers,
		body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
		cf: { // Cloudflare-specific options
			cacheTtl: 0,
			cacheEverything: false,
		},
	});
}

async function handleNextStateTree(req) {
    const headers = new Headers(req.headers);
    headers.delete('host');

    const url = new URL(req.url);
    const proxyUrl = `${BASE_ORIGIN}${url.pathname}${url.search}`;

    const response = await fetch(proxyUrl, { headers });
    return new Response(response.body, {
        headers: {
            'Content-Type': 'text/x-component',
            'Transfer-Encoding': 'chunked', 
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
            'Vary': 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Accept-Encoding'
        }
    });
}
