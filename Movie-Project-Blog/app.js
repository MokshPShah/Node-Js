const express = require("express");
const path = require("path");
const movieRoute = require('./routes/movieRoute');
const connectDB = require("./config/db");
const PORT = 9000;
const cookieParser = require('cookie-parser')

const app = express();
connectDB();
app.use(cookieParser())

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.urlencoded());

function isAuthenticated(req, res, next) {
    const user = req.cookies.username;
    if (!user) {
        return res.redirect('/login')
    }
    next();
}

app.use("/movies", isAuthenticated, movieRoute);

app.get('/movies', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error)
    }
})

app.post('/checkLogin', (req, res) => {
    try {
        res.cookie("username", req.body.username, {
            maxAge: 1000 * 60 * 10,
            httpOnly: true
        })
        res.redirect('/');
    } catch (error) {
        console.log(error)
    }
})


app.get('/', (req, res) => {
    const user = req.cookies.username;
    if (!user) {
        return res.redirect('/login')
    } else {
        res.redirect('/movies');
    }
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("internal server error");
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})