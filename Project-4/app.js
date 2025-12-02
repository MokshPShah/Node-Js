const express = require('express')
const mongoose = require('mongoose')
const Book = require("./model/bookModel");
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

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        res.render('edit', { book });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching book for editing');
    }
})

app.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, price, language, desc } = req.body;

    try {

        const updateBook = await Book.findByIdAndUpdate(id, {
            title,
            author,
            isbn,
            price,
            language,
            desc
        })

        if (!updateBook) {
            return res.status(404).send('Book not found');
        }

        res.redirect('/view');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error while updating the book');
    }
})

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBook = await Book.findByIdAndDelete(id);

        if (!deleteBook) {
            return res.status(404).send('Book not found');
        }
        res.redirect('/view')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while deleting the book');
    }

})

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Error")
    }
    console.log(`Server running on http://localhost:${PORT}`);
})