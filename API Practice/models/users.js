const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Teacher', 'Student'],
        default: 'Student'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const User = new mongoose.model("users", userSchema);

module.exports = User;