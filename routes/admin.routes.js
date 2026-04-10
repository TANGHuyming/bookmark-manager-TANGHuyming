const express = require('express');
const router = express.Router();
const {randomUUID} = require('node:crypto');
const {slugify} = require('../utils/slugify');
const logger = require('../middleware/logger');
const validateSlug = require('../middleware/validateSlug');
const autoRender = require('../middleware/autoRender');
const adminAuth = require('../middleware/adminAuth');

const {bookmarks} = require('../data/mock');
const {adminUsers} = require('../data/mock');

router.use(logger);
router.use((req, res, next) => {
    res.locals.isPublic = false;
    next();
});

router.get('/login', function (req, res, next) {
  // read error
  const isError = req.cookies.isError;
  const error = req.cookies.error;

  res.clearCookie('isError');
  res.clearCookie('error');

  const context = {
    demoUsers: adminUsers,
    isError,
    error,
  }

  // console.log(context);

  res.render('admin/login', context);
});

router.post('/login', function (req, res, next) {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  // console.log(username, password);

  if(!username || !password || username.length === 0 || password.length === 0) {
    res.cookie('isError', 'true');
    res.cookie('error', "Invalid credentials");
    return res.status(401).redirect('/login');
  }

  // validate user
  const user = adminUsers.find(a => a.username === username);

  if(!user) {
    res.cookie('isError', 'true');
    res.cookie('error', "User not found");
    return res.status(401).redirect('/login');
  }

  if(user.password !== password) {
    res.cookie('isError', 'true');
    res.cookie('error', "Invalid credentials");
    return res.status(401).redirect('/login');
  }

  res.cookie('admin_user', username)

  res.redirect('/');
});

router.use(adminAuth);

router.post('/logout', function (req, res, next) {
  res.clearCookie('admin_user');
  res.redirect('/login');
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

  res.render('admin/dashboard', context);
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
  // console.log('New bookmark: ', body)

  // check if title is empty
  if(!body.title || body.title.length === 0) {
    return res.status(403).send({
      message: 'Title must not be empty'
    })
  }

  // validate url protocol
  if(!body.url.startsWith('http') || !body.url.startsWith('https')) {
    return res.status(403).send({
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
    return res.status(403).send({
      message: 'Slugs must be unique'
    })
  }

  const tags = body.tags.trim().split(' ');
  
  const newBookmark = {
    id: randomUUID(),
    title: body.title,
    url: body.url,
    description: body.description,
    tags: tags,
    isArchived: false,
    createdAt: (new Date()).toISOString(),
    updatedAt: (new Date()).toISOString()
  };
  
  bookmarks.push(newBookmark);
  res.redirect('/')
})

router.get('/bookmarks/:slug/edit', validateSlug('slug'), function (req, res, next) {
  const slug = req.params.slug;
  const filteredBookmarks = bookmarks.filter(b => b.slug === slug);
  const tags = filteredBookmarks[0].tags.join(' ')

  const context = {
    slug,
    filteredBookmark: filteredBookmarks[0],
    tags,
  }

  res.render('admin/editBookmark', context);
})

router.post('/bookmarks/:slug/edit', validateSlug('slug'), function (req, res, next) {
  const slug = req.params.slug;
  const body = req.body;

  // remove old bookmark
  const indexOfOldBookmark = bookmarks.indexOf(bookmarks.find(b => b.slug === slug));
  bookmarks.splice(indexOfOldBookmark, 1);

  // check if title is empty
  if(!body.title || body.title.length === 0) {
    return res.status(403).send({
      message: 'Title must not be empty'
    })
  }

  // validate url protocol
  if(!body.url.startsWith('http') || !body.url.startsWith('https')) {
    return res.status(403).send({
      message: 'Url is invalid'
    })
  }
  
  // check if url is unique
  const matchedUrls = bookmarks.filter(b => b.url === body.url)
  if(matchedUrls.length !== 0) {
    return res.status(403).send({
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

  const tags = body.tags.trim().split(' ');
  
  const newBookmark = {
    id: randomUUID(),
    title: body.title,
    url: body.url,
    description: body.description,
    tags: tags,
    isArchived: false,
    createdAt: (new Date()).toISOString(),
    updatedAt: (new Date()).toISOString()
  };

  bookmarks.push(newBookmark);
  res.redirect('/');
})

router.post('/bookmarks/:slug/delete', validateSlug('slug'), function (req, res, next) {
  const slug = req.params.slug;

  // remove old bookmark
  const indexOfOldBookmark = bookmarks.indexOf(bookmarks.find(b => b.slug === slug));
  bookmarks.splice(indexOfOldBookmark, 1);

  res.redirect('/bookmarks');
})

router.post('/bookmarks/:slug/archive', validateSlug('slug'), function (req, res, next) {
  const slug = req.params.slug;

  // archive bookmark
  const indexOfOldBookmark = bookmarks.indexOf(bookmarks.find(b => b.slug === slug));
  bookmarks[indexOfOldBookmark].isArchived = true;

  res.redirect('/bookmarks');
})

router.post('/bookmarks/:slug/unarchive', validateSlug('slug'), function (req, res, next) {
  const slug = req.params.slug;

  // unarchive bookmark
  const indexOfOldBookmark = bookmarks.indexOf(bookmarks.find(b => b.slug === slug));
  bookmarks[indexOfOldBookmark].isArchived = false;

  res.redirect('/bookmarks');
})

module.exports = router;
