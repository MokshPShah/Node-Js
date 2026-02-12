const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getLogin = (req, res) => res.render('login', { error: null });
exports.getRegister = (req, res) => res.render('register', { error: null });

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) return res.redirect('/register')

        const usernameExists = await User.findOne({ username })
        if (usernameExists) return res.redirect('/register')

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ username, password: hashedPassword, role: role || 'user' });

        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'Username already exists' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (err) {
        res.render('login', { error: 'Something went wrong' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};