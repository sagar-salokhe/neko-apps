import { chromium } from 'playwright';

async function launchChromeWithRemoteDebugging() {

  //Fetch the WebSocket URL from the proxy server
  //const response = await fetch('https://127.0.0.1:8080/json');
  //const data = await response.json();
  //let wsUrl = data.webSocketDebuggerUrl;

  //Set environment variable to ignore self-signed certificate errors
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const wsUrl = "wss://4.236.180.89:9223/devtools/browser/my-browser-id?token=YOUR_SECRET_TOKEN"; // Custom WebSocket path
  //const wsUrl = "ws://localhost:9224";

  console.log('WebSocket URL:', wsUrl);

  // Launch a new Playwright Chrome instance to connect to the WebSocket URL
  const proxyBrowser = await chromium.connect(wsUrl);
  console.log('WebSocket URL:', wsUrl);
  const proxyContext = await proxyBrowser.newContext();
  const proxyPage = await proxyContext.newPage();
  await proxyPage.goto('https://dev.zsec.io'); // Replace with the desired URL
  // console.log('Playwright Chrome instance connected to the proxy server on port 9223');

  return {};
}

launchChromeWithRemoteDebugging().catch(console.error);
