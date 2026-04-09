'use strict';

/**
 * Converts a string to a URL-safe slug.
 * @param {string} str - The input string (e.g. a post title)
 * @returns {string} - Lowercase hyphenated slug
 */
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')   // remove characters that are not letters, digits, spaces, or hyphens
        .replace(/\s+/g, '-')            // replace one or more spaces with a single hyphen
        .replace(/-+/g, '-')             // collapse multiple consecutive hyphens into one
        .replace(/^-|-$/g, '');          // strip any leading or trailing hyphens
}

module.exports = { slugify };
