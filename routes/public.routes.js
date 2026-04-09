const express = require('express');
const router = express.Router();

const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');

const bookmarks = require('../data/mock')

router.use(logger);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/bookmarks', function (req, res, next) {
  const context = {
    bookmarks
  }
  res.render('bookmarks', context);
});

router.get('/bookmarks/:slug', function (req, res, next) {
  const slug = req.params.slug;
  const filteredBookmark = bookmarks.filter(b => b.slug == slug);
  const context = filteredBookmark[0];
  context.url = 
  res.render('bookmarkDetails', context);
});

router.get('/tag/:tagSlug', function (req, res, next) {
  const tagSlug = req.params.tagSlug;
  res.render('tag', context)
});

router.get('/search', function (req, res, next) {
  const { q } = req.query;
  res.render('bookmarks', context)
});

module.exports = router;
