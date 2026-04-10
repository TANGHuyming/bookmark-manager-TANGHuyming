const express = require('express');
const router = express.Router();
const path = require('path');

const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');

const {
  getHome,
  getBookmarks,
  getBookmarkBySlug,
  getBookmarksByTag,
  searchBookmarks,
  searchByTag
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

router.post('/tag', 
  searchByTag
)

router.get('/tag/:tagSlug',
  validateSlug('tagSlug'),
  getBookmarksByTag
);

router.get('/search', 
  searchBookmarks
);

router.use(autoRender(path.join(__dirname, '../views')));

router.use((req, res, next) => {
    const context = {} // empty context = no message
    res.status(404).render('404', context);
});

module.exports = router;
