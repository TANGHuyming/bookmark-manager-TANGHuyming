// FILE: middleware/validateSlug.js
// PURPOSE: Validate that a URL parameter contains only slug-safe characters
//          before it reaches the controller.
//
// TEACHING NOTE – Middleware Factory Pattern:
//   Instead of a plain function, this exports a FACTORY that accepts a param
//   name and returns a configured middleware. This makes it reusable for any
//   param (slug, categorySlug, tagSlug…) with a single line per route:
//
//     router.get('/posts/:slug', validateSlug('slug'), controller.showPost);
//     router.get('/category/:categorySlug', validateSlug('categorySlug'), ...);
//
//   Benefits:
//   • Central validation logic – one bug fix covers all slug routes
//   • Controllers stay clean – no validation code inside handlers
//   • Explicit at the route definition – everyone can see what is validated
//
//   Common mistake: putting validation inside every controller instead of
//   extracting it into reusable middleware.

'use strict';

// Valid slug: lowercase letters, digits, hyphens only (no leading/trailing hyphens).
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateSlug(paramName) {
  return function (req, res, next) {
    const slug = req.params[paramName];

    if (!slug || !SLUG_PATTERN.test(slug)) {
      return res.status(400).render('404', {
        pageTitle: 'Invalid URL',
        message: `"${slug}" is not a valid URL segment. Slugs may only contain lowercase letters, digits, and hyphens.`,
      });
    }

    next();
  };
}

module.exports = validateSlug;
