const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    res.locals.user = null;

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        next();
    }
};

exports.requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
};

exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send("Access Denied: Admins Only");
    }
    next();
};