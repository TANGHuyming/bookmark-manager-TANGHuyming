const { randomUUID } = require('node:crypto');
const { slugify } = require('../utils/slugify');
const { bookmarks, adminUsers } = require('../data/mock');

// ================= AUTH =================

// GET /login
const getLogin = (req, res) => {
    const isError = req.cookies.isError;
    const error = req.cookies.error;

    res.clearCookie('isError');
    res.clearCookie('error');

    res.render('admin/login', {
        demoUsers: adminUsers,
        isError,
        error
    });
};

// POST /login
const postLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.cookie('isError', 'true');
        res.cookie('error', 'Invalid credentials');
        return res.redirect('/login');
    }

    const user = adminUsers.find(a => a.username === username);

    if (!user) {
        res.cookie('isError', 'true');
        res.cookie('error', 'User not found');
        return res.redirect('/login');
    }

    if (user.password !== password) {
        res.cookie('isError', 'true');
        res.cookie('error', 'Invalid credentials');
        return res.redirect('/login');
    }

    res.cookie('admin_user', username, {
        maxAge: 1000 * 60 * 10 // 10 minutes max hehe
    });
    
    res.redirect('/');
};

// POST /logout
const postLogout = (req, res) => {
    res.clearCookie('admin_user');
    res.redirect('/login');
};

// ================= DASHBOARD =================

const getDashboard = (req, res) => {
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

    res.render('admin/dashboard', {
        totalBookmarks,
        totalActiveBookmarks,
        totalArchivedBookmarks,
        recentBookmarks
    });
};

// ================= BOOKMARKS =================

const getBookmarks = (req, res) => {
    res.render('bookmarks', { bookmarks });
};

const getNewBookmark = (req, res) => {
    res.render('admin/newBookmark');
};

const postNewBookmark = (req, res) => {
    const { title, url, description, tags } = req.body;

    if (!title) {
        return res.status(403).send({ message: 'Title must not be empty' });
    }

    // ❗ FIXED LOGIC (was always failing before)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(403).send({ message: 'Url is invalid' });
    }

    if (bookmarks.some(b => b.url === url)) {
        return res.status(403).send({ message: 'Url must not be duplicated' });
    }

    const slug = slugify(title);

    if (bookmarks.some(b => b.slug === slug)) {
        return res.status(403).send({ message: 'Slugs must be unique' });
    }

    const newBookmark = {
        id: randomUUID(),
        title,
        url,
        description,
        slug,
        tags: tags.trim().split(' '),
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    bookmarks.push(newBookmark);
    res.redirect('/');
};

const getEditBookmark = (req, res) => {
    const { slug } = req.params;

    const bookmark = bookmarks.find(b => b.slug === slug);
    if (!bookmark) return res.status(404).render('404');

    res.render('admin/editBookmark', {
        slug,
        filteredBookmark: bookmark,
        tags: bookmark.tags.join(' ')
    });
};

const postEditBookmark = (req, res) => {
    const { slug } = req.params;
    const { title, url, description, tags } = req.body;

    const index = bookmarks.findIndex(b => b.slug === slug);
    if (index === -1) return res.status(404).render('404');

    if (!title) {
        return res.status(403).send({ message: 'Title must not be empty' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(403).send({ message: 'Url is invalid' });
    }

    // remove old
    bookmarks.splice(index, 1);

    const newSlug = slugify(title);

    const updatedBookmark = {
        id: randomUUID(),
        title,
        url,
        description,
        slug: newSlug,
        tags: tags.trim().split(' '),
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    bookmarks.push(updatedBookmark);
    res.redirect('/');
};

const deleteBookmark = (req, res) => {
    const { slug } = req.params;

    const index = bookmarks.findIndex(b => b.slug === slug);
    if (index !== -1) bookmarks.splice(index, 1);

    res.redirect('/bookmarks');
};

const archiveBookmark = (req, res) => {
    const { slug } = req.params;

    const bookmark = bookmarks.find(b => b.slug === slug);
    if (bookmark) bookmark.isArchived = true;

    res.redirect('/bookmarks');
};

const unarchiveBookmark = (req, res) => {
    const { slug } = req.params;

    const bookmark = bookmarks.find(b => b.slug === slug);
    if (bookmark) bookmark.isArchived = false;

    res.redirect('/bookmarks');
};

module.exports = {
    getLogin,
    postLogin,
    postLogout,
    getDashboard,
    getBookmarks,
    getNewBookmark,
    postNewBookmark,
    getEditBookmark,
    postEditBookmark,
    deleteBookmark,
    archiveBookmark,
    unarchiveBookmark
};