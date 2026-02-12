const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const path = require('path');
const connectDB = require('./config/db');
const { checkAuth } = require('./middleware/authMiddleware');

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads

app.set('view engine', 'ejs');

app.use(checkAuth);

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/blogRoutes'));
app.use(require('./routes/adminRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});