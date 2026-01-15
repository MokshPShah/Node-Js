const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    sname: {
        type: String,
        required: true
    } 
}, {
    timestamps: true
})

const SubCategory = mongoose.model("SubCategories", subcategorySchema)

module.exports = SubCategory
