const { bookmarks } = require('../data/mock');

// GET /
const getHome = (req, res) => {
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

    res.render('home', {
        totalBookmarks,
        totalActiveBookmarks,
        totalArchivedBookmarks,
        recentBookmarks
    });
};

// GET /bookmarks
const getBookmarks = (req, res) => {
    res.render('bookmarks', { bookmarks });
};

// GET /bookmarks/:slug
const getBookmarkBySlug = (req, res) => {
    const { slug } = req.params;
    const bookmark = bookmarks.find(b => b.slug === slug);

    res.render('bookmarkDetails', bookmark);
};

// GET /tag/:tagSlug
const getBookmarksByTag = (req, res) => {
    const { tagSlug } = req.params;

    const filteredBookmarks = bookmarks.filter(b =>
        b.tags.includes(tagSlug)
    );

    res.render('tag', {
        tagSlug: tagSlug,
        filteredBookmarks
    });
};

// GET /search?q=
const searchByTag = (req, res) => {
    const body = req.body;

    res.redirect(`/tag/${body.tag}`)
};

// GET /search?q=
const searchBookmarks = (req, res) => {
    const { q } = req.query;

    const filteredBookmarks = bookmarks.filter(b =>
        b.title.toLowerCase().includes(q.toLowerCase())
    );

    res.render('searchResult', {
        q,
        filteredBookmarks
    });
};

module.exports = {
    getHome,
    getBookmarks,
    getBookmarkBySlug,
    getBookmarksByTag,
    searchByTag,
    searchBookmarks
};