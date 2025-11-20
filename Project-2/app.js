const express = require('express');
const path = require('path')
const PORT = 8020;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let todos = [
    {
        title: "Learn Express",
        desc: "Complete the Express.js tutorial and build a simple app."
    },
    {
        title: "Buy Groceries",
        desc: "Pick up some groceries from the store, including milk, and bread."
    },
    {
        title: "Read a Book",
        desc: "Finish reading 'The Catcher in the Rye' for the book club meeting."
    }
]

app.get("/", (req, res) => {
    res.render('index', { todos });
})

app.post("/add", (req, res) => {
    todos.push({
        title: req.body.title,
        desc: req.body.desc
    });
    res.redirect("/");
})
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const todo = todos[id];
    if (todo) {
        res.render('edit', { todo: todo, id: id })
    } else {
        res.redirect('/')
    }
})

app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    todos[id].title = req.body.title;
    todos[id].desc = req.body.desc;
    res.redirect('/')
})

app.post('/delete', (req, res) => {
    const idx = req.body.idx;
    todos.splice(idx, 1);
    res.redirect('/');
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("Problem in Server");
    }
    console.log(`Server is running on http://localhost:${PORT}`)
})