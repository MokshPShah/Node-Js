const express = require('express');
const PORT = 8000;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const checkIsRegister = (req, res, next) => {
    if (req.query.isRegister === 'true') {
        next();
    }
    res.redirect('/');
}

app.get('/', (req, res) => {
    if (req.query.isRegister === 'true') {
        res.render("index");
    } else {
        res.render("index");
    }
});
app.get('/settings', checkIsRegister, (req, res) => {
    if (req.query.isRegister === 'true') {
        res.render("settings");
    } else {
        res.render("index");
    }
})
app.get('/kanban', checkIsRegister, (req, res) => {
    res.render("kanban")
})
app.get('/file-manager', checkIsRegister, (req, res) => {
    res.render("file-manager")
})
app.get('/signin', (req, res) => {
    res.render("signin")
})
app.get('/signup', (req, res) => {
    res.render("signup")
})
app.get('/alerts', (req, res) => {
    res.render("alerts")
})
app.get('/cards', (req, res) => {
    res.render("cards")
})
app.get('/icons', (req, res) => {
    res.render("icons")
})
app.get('/mdi-icons', (req, res) => {
    res.render("mdi-icons")
})
app.get('/form-elements', (req, res) => {
    res.render("form-elements")
})
app.get('/tables', (req, res) => {
    res.render("tables")
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not started due to Problem...")
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})