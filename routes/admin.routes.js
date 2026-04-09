const express = require('express');
const router = express.Router();
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
  const context = {};
  res.render('admin/newBookmark', context);
})

router.post('/bookmarks/new', function (req, res, next) {

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
