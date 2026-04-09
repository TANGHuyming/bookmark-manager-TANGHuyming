const express = require('express');
const router = express.Router();

const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');

const bookmarks = require('../data/mock');

router.use(logger);

/* GET home page. */
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

  res.render('bookmarks', context);
});

router.get('/bookmarks/:slug', function (req, res, next) {
  const slug = req.params.slug;
  const filteredBookmark = bookmarks.filter(b => b.slug == slug);
  const context = filteredBookmark[0];
  res.render('bookmarkDetails', context);
});

router.get('/tag/:tagSlug', function (req, res, next) {
  const tagSlug = req.params.tagSlug;
  const filteredBookmarks = bookmarks.filter(b => b.tags.includes(tagSlug));

  // console.log("Filtered by tags: ", filteredBookmarks);

  const context = {
    tag: tagSlug,
    filteredBookmarks
  };

  res.render('tag', context);
});

router.get('/search', function (req, res, next) {
  const { q } = req.query;
  const filteredBookmarks = bookmarks.filter(b => b.title.toLowerCase().includes(q.toLowerCase()));

  console.log("Filtered by query: ", filteredBookmarks)

  const context = {
    q: q,
    filteredBookmarks
  }

  res.render('searchResult', context)
});

module.exports = router;
