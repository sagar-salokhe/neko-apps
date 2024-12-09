import { chromium } from 'playwright';
import httpProxy from 'http-proxy';
import https from 'https';
import url from 'url';
import fs from 'fs';

async function launchChromeServer() {
  console.log('Launching Chrome Server...');
  const browser = await chromium.launchServer({
    headless: false,
    port: 9222,
    wsPath: '/devtools/browser/my-browser-id', // Custom WebSocket path
  });
  console.log('Chrome browser launched as server');

  const wsEndpoint = browser.wsEndpoint();
  console.log("WebSocket Endpoint: ", wsEndpoint);



  // Token for authentication (you can replace this with a more secure mechanism, like JWT)
  const VALID_TOKEN = 'YOUR_SECRET_TOKEN';
  const CHROME_DEVTOOLS_SERVER = 'http://127.0.0.1:9222'; // Chrome DevTools server URL

  // Paths to your self-signed certificate and private key
  const options = {
    key: fs.readFileSync('/home/neko/server.key'), // Private key
    cert: fs.readFileSync('/home/neko/server.cert') // Self-signed certificate
  };

  // Create an HTTP proxy server
  const proxy = httpProxy.createProxyServer({ ws: true });

  // Function to validate token
  const validateToken = (token) => {
    return token === VALID_TOKEN;
  };

  // Create an HTTP server that will act as the proxy
  const server = https.createServer(options, (req, res) => {
    // Check if the request is an HTTP request that requires authentication (e.g., /json)
    const token = req.headers['authorization'] || (req.url ? url.parse(req.url, true).query.token : undefined);

    // Validate token before forwarding the HTTP request
    if (!validateToken(token)) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
      return;
    }

    console.log(`Proxying HTTP request ${req.url} to Chrome DevTools`);
    // remove the qyery token from the request
    proxy.web(req, res, { target: CHROME_DEVTOOLS_SERVER });
  });

  // Listen for the 'upgrade' event to handle WebSocket connections
  server.on('upgrade', (req, socket, head) => {
    const queryParams = req.url ? url.parse(req.url, true).query : {};

    // Extract token from query parameters for WebSocket
    const token = queryParams.token;

    //Validate token before upgrading WebSocket connection
    if (!validateToken(token)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      console.log('Unauthorized WebSocket connection attempt');
      return;
    }

    // Forward all WebSocket connections to the Chrome DevTools WebSocket server
    console.log(`Proxying WebSocket request ${req.url} to Chrome DevTools`);
    // remove the qyery token from the request
    if (req.url) {
      req.url = req.url.replace(`?token=${token}`, '');
      req.url = req.url.replace(`&token=${token}`, '');
    }
    proxy.ws(req, socket, head, { target: CHROME_DEVTOOLS_SERVER });
  });

  
  // Start the server
  server.listen(9223, async () => {
    console.log('Proxy server listening on https://127.0.0.1:9223');
  });

  return { browser };
}

launchChromeServer().catch(console.error);
