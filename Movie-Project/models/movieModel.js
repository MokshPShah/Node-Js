const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    language: {
        type: [String],
        require: true
    },
    image: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    genre: {
        type: [String],
        require: true
    },
    desc: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('BookMyShow', movieSchema)