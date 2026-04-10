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

  next();
}

module.exports = adminAuth;
