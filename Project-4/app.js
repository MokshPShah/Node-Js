const express = require('express')
const mongoose = require('mongoose')
const Book = require("./model/bookModel")
const PORT = 9000;

const app = express();
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static("Public"));

mongoose.connect('mongodb://localhost:27017/Book_Store')
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log("Error connecting Server", err))

app.get('/', (req, res) => {
    res.redirect("/add");
})
app.get('/add', (req, res) => {
    res.render("add");
})

app.post('/add', async (req, res) => {
    const { title, author, isbn, price, language, desc } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            isbn,
            price,
            language,
            desc
        })

        await newBook.save();
        res.redirect('/view')
    } catch (error) {
        console.error(err);
        res.status(500).send('Error saving the book');
    }
})

app.get('/view', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('view', { books });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching books');
    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Error")
    }
    console.log(`Server running on http://localhost:${PORT}`);
})