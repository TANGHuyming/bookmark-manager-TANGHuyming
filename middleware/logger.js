'use strict';

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method    = req.method.padEnd(7);            // "GET    ", "POST   " …
  const url       = req.originalUrl || req.url;

  console.log(`[${timestamp}] ${method} ${url}`);

  next();  // ← MUST call next() or the request chain stops here
}

module.exports = logger;
