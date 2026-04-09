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
