const Admin = require("../models/Admin")
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

module.exports.dashboard = (req, res) => {
    try {
        res.render('dashboard', { title: 'Dashboard' })
    } catch (error) {
        console.log(error)
    }
}
module.exports.addAdmin = (req, res) => {
    try {
        res.render('add-admin', { title: 'Add-Admin' })
    } catch (error) {
        console.log(error)
    }
}

module.exports.viewAdmin = async (req, res) => {
    const admins = await Admin.find({});
    res.render('view-admin', {
        title: 'View Admin',
        admins
    });
};

module.exports.insertAdminData = async (req, res) => {
    try {
        const exisitingEmail = await Admin.findOne({ email: req.body.email })

        if (exisitingEmail) {
            return res.render('add-admin', {
                title: 'Add-Admin',
                error: 'Email already exists. Try another email to create a account'
            })
        }

        const { fname, lname, email, password, gender, desc, date } = req.body

        const imagePath = req.file ? Admin.adPath + req.file.filename : null;

        const hobbies = Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby]

        const hashPassword = await bcrypt.hash(password, 12)

        await Admin.create({
            name: fname + ' ' + lname,
            email: email,
            password: hashPassword,
            gender: gender,
            hobby: hobbies,
            desc: desc,
            avatar: imagePath,
            date: date
        });

        res.redirect('/add-admin')

    }
    catch (err) {
        console.log(err);
        res.send("Error Saving Data")
    }
}

module.exports.adminDetails = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        res.json(admin)
    }
    catch (err) {
        console.log(err)
        res.send('Error Fetching Admin Details')
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.query.deleteAdmin);
        res.redirect('/view-admin')
    }
    catch (err) {
        console.log(err)
        res.send('Error Fetching Admin Details')
    }
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.editAdmin);
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        const { fname, lname, email, password, gender, desc, date } = req.body

        const hobbies = Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby]

        const hashPassword = await bcrypt.hashSync(password, 12)

        const updateData = {
            name: fname + ' ' + lname,
            email: email,
            gender: gender,
            hobby: hobbies,
            desc: desc,
            avatar: imagePath,
        }

        if (req.body.date && req.body.date !== '') {
            updateData.date = req.body.date;
        }

        if (req.body.password && req.body.password.trim() !== '') {
            updateData.password = req.body.password;
        }

        if (req.file) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', admin.avatar);
            if (admin.avatar && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            updateData.avatar = req.file.filename;
        }

        await Admin.findByIdAndUpdate(req.params.id, updateData);

        res.redirect('/view-admin', { success: 'true' })
    }
    catch (err) {
        console.log(err)
        res.send('Error Fetching Admin Details')
    }
};