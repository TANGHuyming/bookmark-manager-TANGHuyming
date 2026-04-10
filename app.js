'use strict';

const express = require('express');
const vhost = require('vhost'); // vhost 
const path = require('path');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');

const config = require('./config/app.config');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');

require('dotenv').config();

const hbsHelpers = {
    currentYear: () => new Date().getFullYear(),
    formatDate: (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        }),
    // Truncates text to a given length and adds "…"
    excerpt: (text, len) =>
        typeof text === 'string' && text.length > len
            ? text.slice(0, len) + '…'
            : text,
    // Splits a plain-text string into an array of non-empty lines
    // Used in posts/detail.handlebars to render each paragraph as <p>
    splitLines: (text) =>
        typeof text === 'string'
            ? text.split('\n').filter(l => l.trim().length > 0)
            : [],
};

const staticFiles = express.static(path.join(__dirname, 'public'));

// ─── publicApp ───────────────────────────────────────────────────────────────
const publicApp = express();

publicApp.engine('handlebars', engine({
    defaultLayout: 'public',                             // views/layouts/public.handlebars
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: hbsHelpers,
}));
publicApp.set('view engine', 'handlebars');
publicApp.set('views', path.join(__dirname, 'views'));

publicApp.use(staticFiles);
publicApp.use(express.urlencoded({ extended: false }));
publicApp.use('/', publicRoutes);

// ─── adminApp ────────────────────────────────────────────────────────────────
const adminApp = express();

adminApp.engine('handlebars', engine({
    defaultLayout: 'admin',                              // views/layouts/admin.handlebars
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: hbsHelpers,
}));
adminApp.set('view engine', 'handlebars');
adminApp.set('views', path.join(__dirname, 'views'));

adminApp.use(staticFiles);
adminApp.use(express.urlencoded({ extended: false }));
adminApp.use(cookieParser());
adminApp.use('/', adminRoutes);

const app = express();

app.use(vhost('admin.' + config.DOMAIN, adminApp));   // admin subdomain first
app.use(publicApp);                                   // fallback → public app

app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).send('<h1>500 – Internal Server Error</h1><p>' + err.message + '</p>');
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(config.PORT, () => {
    console.log(`\nBookmark Manager server running:`);
    console.log(`  Public : http://${config.DOMAIN}:${config.PORT}`);
    console.log(`  Admin  : http://admin.${config.DOMAIN}:${config.PORT}`);
    console.log(`\nAdmin login (mock):`);
    console.log(`  username: admin   password: admin123`);
    console.log(`  username: editor  password: editor123`);
    if (config.NODE_ENV === 'development') {
        console.log(`\nLocal /etc/hosts entry required for admin subdomain:`);
        console.log(`  127.0.0.1  admin.localhost\n`);
    }
});

module.exports = app;
