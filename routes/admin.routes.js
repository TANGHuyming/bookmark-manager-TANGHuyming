const express = require('express');
const router = express.Router();

const logger           = require('../middleware/logger');
const validateSlug     = require('../middleware/validateSlug');
const autoRender       = require('../middleware/autoRender');

router.use(logger);

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  res.send('login successful');
});

router.post('/logout', function(req, res, next) {
  res.send('logout successful');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/bookmarks', function(req, res, next) {
  res.render('bookmarks', context)
})

router.get('/bookmarks/new', function(req, res, next) {

})

router.post('/bookmarks/new', function(req, res, next) {

})

router.get('/bookmarks/:slug/edit', function(req, res, next) {

})

router.post('/bookmarks/:slug/edit', function(req, res, next) {

})

router.post('/bookmarks/:slug/delete', function(req, res, next) {

})

router.post('/bookmarks/:slug/archive', function(req, res, next) {
  
})

router.post('/bookmarks/:slug/unarchive', function(req, res, next) {
  
})

module.exports = router;
