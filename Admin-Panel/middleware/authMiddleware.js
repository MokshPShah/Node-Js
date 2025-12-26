const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
    try {
        if (!req.signedCookies.authToken) {
            return res.redirect('/login');
        }
        const admin = await Admin.findById(req.signedCookies.authToken);
        if (!admin) {
            return res.redirect('/login');
        }
        req.user = admin;
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};
