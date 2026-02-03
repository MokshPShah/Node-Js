const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config();
const bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()

app.use('/api/v1', require('./routes/index'))

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server is running on port: ${process.env.PORT}`)
})