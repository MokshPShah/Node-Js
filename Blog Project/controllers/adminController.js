const User = require('../models/userModel');
const Article = require('../models/articleModel');

exports.getDashboard = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } });
        res.render('adminDashboard', { users });
    } catch (err) {
        res.status(500).send("Error loading dashboard");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        await Article.deleteMany({ author: userId });
        
        await User.findByIdAndDelete(userId);
        
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Error deleting user");
    }
};