/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const proxy = require('express-http-proxy');
const logger = require('./logger');

const argv = require('./argv');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

// get the intended host and port number, use localhost and port 8888 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

const frontendHost = customHost || 'localhost';
const frontendPort = process.env.PORT || 3000;

const backendHost = process.env.API_HOST || frontendHost;
const backendPort = process.env.API_PORT || 5000;
const backendDev = `http://${backendHost}:${backendPort}`;
const backendProd = '<YOUR PROD SERVER HERE>'; // example: https://api.reactflaskbase.xyz
const backend = isDev ? backendDev : backendProd;

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use(
  /^\/api|auth\//,
  proxy(backend, {
    proxyReqPathResolver: req => req.baseUrl + req.url,
  }),
);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(frontendPort, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(frontendPort);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(frontendHost, frontendPort, backend, url);
  } else {
    logger.appStarted(frontendHost, frontendPort, backend);
  }
});
