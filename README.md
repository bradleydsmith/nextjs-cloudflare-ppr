# NextJS Cloudflare PPR

This is a basic proof of concept for serving NextJS partial prerendering (PPR) on Cloudflare Workers while self-hosting the server on a VPS or other hosting. The Cloudflare Workers are able to respond to requests by streaming the prerendered shell and then stitching and streaming the response together with the response from the origin server, and will also serve static assets from Cloudflare as well. This roughly simulates how PPR works when a NextJS app is hosted on Vercel

It is not intended for production use or to be a project there will be support for using. PPR is still an experimental feature in NextJS canary and they may still change it in a way that this stops working. This repository contains a basic NextJS app that I used to test various aspects were working. Data fetches intentionally have delay added to test streaming responses. The Cloudflare worker code and build script resides in the cf-worker folder

# Instructions

 1. Run npm install and npm run build in the main directory
 2. Add your origin server URL to the cf-worker/src/index.js file
 3. cd cf-worker and run npm install
 4. cd into the cf-worker/src directory and run node build.js
 5. Run npx wrangler deploy in the cf-worker directory

Note: Wrangler does not seem to deal well with streaming responses so running npx wrangler dev will not properly show streaming responses
