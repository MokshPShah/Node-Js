const express = require("express");
const path = require("path");
const movieRoute = require('./routes/movieRoute');
const connectDB = require("./config/db");
const PORT = 9000;

const app = express();
connectDB();

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.urlencoded());

app.use("/movies", movieRoute);

app.get('/movies', (req, res) => {
    res.render('index');
})

app.get('/', (req, res) => {
    res.redirect('/movies');
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("internal server error");
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})