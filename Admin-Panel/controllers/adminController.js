const Admin = require("../models/Admin")
const fs = require('fs');
const path = require('path');

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
        const existingEmail = await Admin.findOne({ email: req.body.email })

        if (existingEmail) {
            return res.render('add-admin', {
                title: 'Add-Admin',
                error: 'Email already exists. Please use a different email.'
            })
        }

        const hobbies = Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby];

        await Admin.create({
            name: req.body.fname + ' ' + req.body.lname,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            hobby: hobbies,
            desc: req.body.desc,
            avatar: req.file.filename,
            date: req.body.date
        })

        res.redirect('/view-admin')
    }
    catch (err) {
        console.log(err);
        res.send("Error Saving Data")
    }
}

module.exports.deleteAdmin = async (req, res) => {
    await Admin.findByIdAndDelete(req.params.id);
    res.redirect('/view-admin');
};

module.exports.adminDetails = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    res.json(admin);
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        const updateData = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            desc: req.body.desc,
            hobby: Array.isArray(req.body.hobby)
                ? req.body.hobby
                : [req.body.hobby]
        };

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
        return res.json({ success: true });

    } catch (err) {
        console.error(err);
        return res.json({
            success: false,
            message: 'Error updating admin'
        });
    }
};

