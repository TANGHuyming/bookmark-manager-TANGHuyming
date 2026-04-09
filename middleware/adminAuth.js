// FILE: middleware/adminAuth.js
// PURPOSE: Block unauthenticated access to all admin routes.
//
// TEACHING NOTE:
//   This is a mock authentication middleware. Real apps would verify a
//   session cookie (server-side store) or a signed JWT. Here we trust a
//   simple cookie that stores the logged-in username after form login.
//
//   Applied at the ROUTER level (router.use(adminAuth)) so every route in
//   the admin router is automatically protected – no per-route repetition.
//
//   Common mistake: applying auth middleware AFTER the routes it should guard.
//   Always register protective middleware before the routes it protects.

'use strict';

const { adminUsers } = require('../data/mock');

function adminAuth(req, res, next) {
  const username = req.cookies?.admin_user;
  const user = adminUsers.find(u => u.username === username);

  if (!user) {
    // Browser requests should be sent to the login screen.
    if (req.accepts('html')) {
      return res.redirect('/login');
    }

    return res.status(401).json({
      error: 'Unauthorised',
      message: 'Admin access requires a valid login session.',
    });
  }

  req.adminUser = user;
  res.locals.adminUser = user;

  next();
}

module.exports = adminAuth;
