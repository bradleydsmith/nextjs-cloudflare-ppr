const fs = require('fs');

const nextDirectory = `${__dirname}/../..`;

const prerenderManifest = JSON.parse(fs.readFileSync(`${nextDirectory}/.next/prerender-manifest.json`, 'utf8'));

let routes = Object.entries(prerenderManifest.routes).map(([route, data]) => ({
  route,
  ...data
}));

// Delete any routes that aren't PARTIALLY_STATIC with experimentalPPR
routes = routes.filter(route => 
  route.renderingMode === 'PARTIALLY_STATIC' && route.experimentalPPR === true
);

// Delete and recreate prerender directory
if (fs.existsSync(`${__dirname}/prerender`)) {
  fs.rmdirSync(`${__dirname}/prerender`, { recursive: true });
}
fs.mkdirSync(`${__dirname}/prerender`);

// Create an array to store route mappings
let routeMappings = [];

// For each route, use the key as the route path, create the directories needed for it
// Example /testa/testb => create /prerender/testa
// The last segment is the file name and it doesn't need a directory

for (const routeObj of routes) {
  // Split route into path segments and remove empty strings
  const segments = routeObj.route.split('/').filter(Boolean);
  
  // Don't create directory for the last segment since it will be a file
  const dirSegments = segments.slice(0, -1);
  
  // Build up the directory path
  let currentPath = `${__dirname}/prerender`;
  for (const segment of dirSegments) {
    currentPath = `${currentPath}/${segment}`;
    // Create directory if it doesn't exist
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }

  const routePath = routeObj.route === '/' ? 'index' : routeObj.route;
  
  const html = fs.readFileSync(`${nextDirectory}/.next/server/app/${routePath}.html`, 'utf8');
  const rsc = fs.readFileSync(`${nextDirectory}/.next/server/app/${routePath}.prefetch.rsc`, 'utf8');
  const meta = JSON.parse(fs.readFileSync(`${nextDirectory}/.next/server/app/${routePath}.meta`, 'utf8'));

  let postponed = false;
  if (meta.postponed) {
    postponed = true;
  }

  const data = {
    html,
    rsc,
    postponed
  };

  fs.writeFileSync(`${__dirname}/prerender/${routePath}.json`, JSON.stringify(data, null, 2));

  // Add mapping to the array
  routeMappings.push({
    route: routeObj.route,
    jsonPath: routeObj.route === '/' 
      ? './prerender/index.json'
      : `./prerender${routeObj.route}.json`
  });
}

// Write the routes.json file
fs.writeFileSync(
  `${__dirname}/prerender/routes.json`, 
  JSON.stringify(routeMappings, null, 2)
);

// Check if the ../public/_next directory exists, if so delete it and recreate it. Then copy
// all the static directory from within .next into ../public/_next

// Create public directory if it doesn't exist
if (!fs.existsSync(`${__dirname}/../public`)) {
  fs.mkdirSync(`${__dirname}/../public`);
}

// Remove and recreate _next directory
if (fs.existsSync(`${__dirname}/../public/_next`)) {
  fs.rmdirSync(`${__dirname}/../public/_next`, { recursive: true });
}
fs.mkdirSync(`${__dirname}/../public/_next`);
fs.cpSync(`${nextDirectory}/.next/static`, `${__dirname}/../public/_next/static`, { recursive: true });

console.log('JSON files and routes mapping created successfully!');
