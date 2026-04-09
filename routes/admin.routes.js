const express = require('express');
const router = express.Router();
const slugify = require('../utils/slugify');
const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');
const bookmarks = require('../data/mock');

router.use(logger);

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  res.send('login successful');
});

router.post('/logout', function (req, res, next) {
  res.send('logout successful');
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  const totalBookmarks = bookmarks.length;
  const totalActiveBookmarks = bookmarks.filter(b => !b.isArchived).length;
  const totalArchivedBookmarks = totalBookmarks - totalActiveBookmarks;

  const currentDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const recentBookmarks = bookmarks.filter(b =>
    new Date(b.createdAt) < currentDate &&
    new Date(b.createdAt) > yesterdayDate
  );

  // console.log("Recent bookmarks: ", recentBookmarks)

  const context = {
    totalBookmarks,
    totalActiveBookmarks,
    totalArchivedBookmarks,
    recentBookmarks
  };

  res.render('home', context);
});

router.get('/bookmarks', function (req, res, next) {
  const context = {
    bookmarks
  };

  res.render('bookmarks', context)
})

router.get('/bookmarks/new', function (req, res, next) {
  res.render('admin/newBookmark');
})

router.post('/bookmarks/new', function (req, res, next) {
  const body = req.body;
  // check if title is empty
  if(!body.title || body.title.length === 0) {
    return res.status(403).res.send({
      message: 'Title must not be empty'
    })
  }

  // validate url protocol
  if(!body.url.startswith('http') || !body.url.startswith('https')) {
    return res.status(403).res.send({
      message: 'Url is invalid'
    })
  }
  
  // check if url is unique
  const matchedUrls = bookmarks.filter(b => b.url === body.url)
  if(matchedUrls.length !== 0) {
    return res.status(403).res.send({
      message: 'Url must be not be duplicated'
    })
  }

  // check if slug is unique
  const slugifiedTitle = slugify(body.title);
  const matchedSlug = bookmarks.filter(b => b.slug === slugifiedTitle);
  if(matchedSlug.length !== 0) {
    return res.status(403).res.send({
      message: 'Slugs must be unique'
    })
  }
  
  res.redirect('/')
})

router.get('/bookmarks/:slug/edit', function (req, res, next) {
  
})

router.post('/bookmarks/:slug/edit', function (req, res, next) {

})

router.post('/bookmarks/:slug/delete', function (req, res, next) {

})

router.post('/bookmarks/:slug/archive', function (req, res, next) {

})

router.post('/bookmarks/:slug/unarchive', function (req, res, next) {

})

module.exports = router;
