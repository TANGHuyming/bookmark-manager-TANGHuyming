const express = require('express');
const router = express.Router();

const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');
const adminAuth = require('../middleware/adminAuth');

const {
  getLogin,
  postLogin,
  postLogout,
  getDashboard,
  getBookmarks,
  getNewBookmark,
  postNewBookmark,
  getEditBookmark,
  postEditBookmark,
  deleteBookmark,
  archiveBookmark,
  unarchiveBookmark
} = require('../controllers/admin.controller');

router.use(logger);
router.use((req, res, next) => {
    res.locals.isPublic = false;
    next();
});

router.get('/login', 
  getLogin
);

router.post('/login', 
  postLogin
);

router.use(adminAuth);

router.post('/logout', 
  postLogout
);

/* GET users listing. */
router.get('/', 
  getDashboard
);

router.get('/bookmarks', 
  getBookmarks
)

router.get('/bookmarks/new', 
  getNewBookmark
)

router.post('/bookmarks/new', 
  postNewBookmark
)

router.get('/bookmarks/:slug/edit', 
  validateSlug('slug'),
  getEditBookmark 
)

router.post('/bookmarks/:slug/edit', 
  validateSlug('slug'), 
  postEditBookmark
)

router.post('/bookmarks/:slug/delete', 
  validateSlug('slug'), 
  deleteBookmark  
)

router.post('/bookmarks/:slug/archive', 
  validateSlug('slug'), 
  archiveBookmark
)

router.post('/bookmarks/:slug/unarchive', 
  validateSlug('slug'), 
  unarchiveBookmark
)

router.use((req, res, next) => {
    const context = {} // empty context = no message
    res.status(404).render('404', context);
});

module.exports = router;
