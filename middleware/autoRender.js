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
