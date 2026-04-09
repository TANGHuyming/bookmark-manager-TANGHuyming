// FILE: middleware/autoRender.js
// PURPOSE: Automatically render a Handlebars view whose filename matches the
//          request path, without needing an explicit route for every page.
//
// TEACHING NOTE:
//   Problem: if you have 10 simple pages (about, contact, privacy, terms, …),
//   defining 10 identical routes (router.get('/about', (req,res) => res.render('about'))
//   is boilerplate. autoRender handles them all in one middleware.
//
//   How it works:
//     GET /about   → look for views/about.handlebars → if found, render it
//     GET /contact → look for views/contact.handlebars → if found, render it
//     GET /unknown → view not found → call next() → falls through to 404
//
//   Security – path traversal prevention:
//     A malicious URL like /../../etc/passwd would resolve outside the views
//     directory. We guard against this with three checks:
//       1. Reject any path containing '..' or null bytes
//       2. Restrict to TOP-LEVEL views only (no subdirectory paths – those
//          are served by explicit routes like /posts/:slug)
//       3. Resolve the full path and verify it starts with viewsDir
//
//   Tradeoffs vs explicit routes:
//     ✓ Less boilerplate for static-like pages
//     ✓ Adding a new page requires only a new .handlebars file, not a code change
//     ✗ Less visible – new developers may not realise a route "exists"
//     ✗ Any .handlebars file in views/ root becomes a public URL automatically
//
// Usage in routes/public.routes.js:
//   const autoRender = require('../middleware/autoRender');
//   router.use(autoRender(path.join(__dirname, '../views')));

'use strict';

const path = require('path');
const fs   = require('fs');

function autoRender(viewsDir) {
  return function (req, res, next) {
    // Strip leading slash; treat '/' as 'index'
    const rawPath = req.path.replace(/^\//, '') || 'index';

    // ── Security check 1: reject traversal sequences ──────────────────────
    if (rawPath.includes('..') || rawPath.includes('\0')) {
      return next();
    }

    // ── Security check 2: only serve top-level views ──────────────────────
    // Paths with '/' would address subdirectories (views/posts/, views/admin/).
    // Those views are controlled by explicit routes only.
    if (rawPath.includes('/')) {
      return next();
    }

    // ── Resolve and verify the view file is inside viewsDir ───────────────
    const viewFile    = path.resolve(viewsDir, rawPath + '.handlebars');
    const resolvedDir = path.resolve(viewsDir);

    if (!viewFile.startsWith(resolvedDir + path.sep)) {
      return next();  // outside views directory – never render
    }

    // ── Only render if the file actually exists ────────────────────────────
    if (!fs.existsSync(viewFile)) {
      return next();  // no matching view → let explicit routes or 404 handle it
    }

    // Capitalise first letter of the path segment as a default page title
    const pageTitle = rawPath.charAt(0).toUpperCase() + rawPath.slice(1);

    return res.render(rawPath, { pageTitle });
  };
}

module.exports = autoRender;
