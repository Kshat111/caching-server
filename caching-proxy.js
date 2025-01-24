const http = require('http');
const url = require('url');
const fs = require('fs');
const yargs = require('yargs');

const CACHE_FILE = 'cache.json';
let cache = {};

// Load cache from file
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      cache = JSON.parse(data);
      console.log('Cache loaded from file.');
    } catch (error) {
      console.error('Error loading cache from file:', error.message);
    }
  }
}

// Save cache to file
function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
    console.log('Cache saved to file.');
  } catch (error) {
    console.error('Error saving cache to file:', error.message);
  }
}

// Clear the cache and delete the file
function clearCache() {
  cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
    console.log('Cache file deleted.');
  }
  console.log('Cache cleared.');
}

const argv = yargs
  .command('start', 'Start the caching proxy server', {
    port: { description: 'Port for the server', alias: 'p', type: 'number' },
    origin: { description: 'Origin server URL', alias: 'o', type: 'string' },
  })
  .command('clear-cache', 'Clear the cache', {})
  .help()
  .argv;

if (argv._[0] === 'clear-cache') {
  clearCache();
  process.exit(0);
}

if (argv._[0] === 'start') {
  const port = argv.port || 3000;
  const origin = argv.origin;

  if (!origin) {
    console.error('Error: --origin is required.');
    process.exit(1);
  }

  loadCache(); // Load cache when the server starts

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const cacheKey = `${req.method}:${parsedUrl.path}`;

    if (cache[cacheKey]) {
      console.log('Cache HIT:', cacheKey);
      const cachedResponse = cache[cacheKey];
      res.writeHead(200, {
        ...cachedResponse.headers,
        'X-Cache': 'HIT',
      });
      res.end(cachedResponse.body);
    } else {
      console.log('Cache MISS:', cacheKey);
      const options = {
        hostname: new URL(origin).hostname,
        port: new URL(origin).port || 80,
        path: parsedUrl.path,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq = http.request(options, (proxyRes) => {
        let body = '';
        proxyRes.on('data', (chunk) => {
          body += chunk;
        });

        proxyRes.on('end', () => {
          cache[cacheKey] = {
            headers: proxyRes.headers,
            body,
          };
          saveCache(); // Save the updated cache to the file
          res.writeHead(proxyRes.statusCode || 200, {
            ...proxyRes.headers,
            'X-Cache': 'MISS',
          });
          res.end(body);
        });
      });

      proxyReq.on('error', (err) => {
        console.error('Error forwarding request:', err.message);
        res.writeHead(500);
        res.end('Internal Server Error');
      });

      req.pipe(proxyReq);
    }
  });

  server.listen(port, () => {
    console.log(`Caching proxy server is running on port ${port}`);
  });
}
