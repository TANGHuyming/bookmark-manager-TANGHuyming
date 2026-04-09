// FILE: middleware/logger.js
// PURPOSE: Log every incoming request to the console.
//
// TEACHING NOTE:
//   This is a custom alternative to the popular 'morgan' package.
//   Writing your own logger is a great way to understand how middleware works:
//   it receives (req, res, next), does something, then calls next() to pass
//   control to the NEXT middleware or route handler.
//
//   Common mistake: forgetting to call next() — the request would hang forever.

'use strict';

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method    = req.method.padEnd(7);            // "GET    ", "POST   " …
  const url       = req.originalUrl || req.url;

  console.log(`[${timestamp}] ${method} ${url}`);

  next();  // ← MUST call next() or the request chain stops here
}

module.exports = logger;
