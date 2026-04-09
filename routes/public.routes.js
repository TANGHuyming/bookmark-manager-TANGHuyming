var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/bookmarks', function(req, res, next) {
  res.render('bookmarks', context);
});

router.get('/bookmarks/:slug', function(req, res, next) {
  const slug = req.params.slug;
  res.render('bookmarkDetails', context);
});

router.get('/tag/:tagSlug', function(req, res, next) {
  const tagSlug = req.params.tagSlug;
  res.render('tag', context)
});

router.get('/search', function(req, res, next) {
  const {q} = req.query;
  res.render('bookmarks', context)
});

module.exports = router;
