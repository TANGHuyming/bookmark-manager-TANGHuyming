const express = require('express');
const router = express.Router();

const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');

const {
  getHome,
  getBookmarks,
  getBookmarkBySlug,
  getBookmarksByTag,
  searchBookmarks
} = require('../controllers/public.controller');

router.use(logger);

router.use((req, res, next) => {
    res.locals.isPublic = true;
    next();
})

/* GET home page. */
router.get('/', 
  getHome
);

router.get('/bookmarks', 
  getBookmarks
);

router.get('/bookmarks/:slug', 
  validateSlug('slug'),
  getBookmarkBySlug
);

router.get('/tag/:tagSlug',
  validateSlug('slug'),
  getBookmarksByTag
);

router.get('/search', 
  searchBookmarks
);

module.exports = router;
