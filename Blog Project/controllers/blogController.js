const Article = require('../models/articleModel');
const User = require('../models/userModel');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'username');
        res.render('articleList', { articles });
    } catch (err) {
        res.status(500).send("Error fetching articles");
    }
};

exports.getMyArticles = async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user.id });
        res.render('myArticles', { articles });
    } catch (err) {
        res.status(500).send("Error fetching your articles");
    }
};

exports.getCreateForm = (req, res) => {
    res.render('articleForm');
};

exports.createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newArticle = await Article.create({
            title,
            content,
            author: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { articles: newArticle._id }
        });

        res.redirect('/my-articles');
    } catch (err) {
        res.status(500).send("Error creating article");
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (req.user.role === 'admin' || article.author == req.user.id) {

            await Article.findByIdAndDelete(req.params.id);

            await User.updateOne(
                { _id: article.author },
                { $pull: { articles: req.params.id } }
            );

            return res.redirect('/');
        } else {
            return res.status(403).send("Unauthorized");
        }
    } catch (err) {
        res.status(500).send("Error deleting article");
    }
};