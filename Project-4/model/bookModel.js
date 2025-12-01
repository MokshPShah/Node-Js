const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        isbn: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
    }
)

module.exports = mongoose.model('Book Store', bookSchema)