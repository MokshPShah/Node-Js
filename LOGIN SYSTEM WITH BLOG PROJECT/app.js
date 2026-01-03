const express = require('express')
const path = require('path')
const connectDB = require('./config/db')

const PORT = 8001

const app = express();
connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));


app.use('/', require('./routes/adminRoutes.js'))
app.get('/', (req, res) => {
    res.redirect('/dashboard')
})

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is Running on port : http://localhost:${PORT}`);
})