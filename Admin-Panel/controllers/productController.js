const SubCategory = require("../models/SubCategory");
const Product = require("../models/products");

module.exports.addProduct = async (req, res) => {
    try {
        let subCategories = await SubCategory.find({ status: 1 });
        res.render('product/addProduct', { title: 'Add Product', admin: req.user, subCategories })
    } catch (error) {
        console.log(error)
        return res.redirect('/product/addProduct');
    }
}

module.exports.insertProduct = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file) {
            imagePath = Product.productPath + '' + req.file.filename;
        }

        await Product.create({
            product_name: req.body.product_name,
            price: req.body.price,
            desc: req.body.desc,
            categoryId: req.body.categoryId,
            product_image: imagePath,
            status: req.body.status
        });

        req.flash('success', 'Product added successfully!')
        res.redirect('/product/viewProduct')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Error adding Product!')
        res.redirect('/product/addProduct')
    }
}

module.exports.viewProduct = async (req, res) => {
    try {
        let products = await Product.find().populate('categoryId')
        res.render('product/viewProduct', { title: 'View Products', admin: req.user, products })
    } catch (error) {
        console.log(error)
        res.render('/product/viewProduct', { admin: [] });
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.query.id;
        const status = req.query.status;

        await Product.findByIdAndUpdate(id, { status: status })
        req.flash('success', 'Status changed successfully!')
        res.redirect('/product/viewProduct')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/product/viewProduct')
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const Product = await Product.findById(req.params.id)
        const categories = await Category.find()
        res.render('category/product/sub_edit_Category', { title: 'Edit Product', admin: req.user, Product, categories })
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/product/viewProduct')
    }
}

module.exports.editProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/product/viewProduct')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/product/viewProduct')
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.redirect('/product/viewProduct')
    } catch (error) {
        req.flash('error', 'Error updating status!')
        res.redirect('/product/viewProduct')
    }
}
