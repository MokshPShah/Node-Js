const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

const imagePath = '/uploads/productImages/';

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    CategoryID: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategories',
        required: true
    },
    product_image: {
        type: String,
        required: true
    },
    Status: {
        type: Number,
        retuired: true
    }
})

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", imagePath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

productSchema.statics.uploadProductImage = multer({
    storage: productStorage
}).single('product_image')

productSchema.statics.productPath = imagePath;

const Product = mongoose.model("Product", productSchema)

module.exports = Product
