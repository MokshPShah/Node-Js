const Admin = require("../models/Admin")
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

module.exports.login = (req, res) => {
    try {
        if (req.cookies.authToken) {
            return res.redirect('/');
        }
        res.render('login', { title: 'Login' })
    } catch (error) {
        console.log(error)
    }
}

module.exports.verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            console.log("Admin not found");
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            res.cookie("authToken", admin._id.toString(), {
                httpOnly: true,
                signed: true,
                maxAge: 1000 * 10 * 10
            });
            res.cookie('authToken', admin._id, { signed: true, httpOnly: true });
            res.redirect('/');
        } else {
            console.log("Invalid Password");
            res.redirect('/login');
        }

    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }
};

module.exports.dashboard = async (req, res) => {
    try {
        const admin = req.user
        const admins = await Admin.find();
        res.render('dashboard', { title: 'Dashboard', admin, admins })
    } catch (error) {
        console.log(error)
    }
}

module.exports.addAdmin = (req, res) => {
    try {
        const admin = req.user
        res.render('add-admin', { title: 'Add-Admin', admin })
    } catch (error) {
        console.log(error)
    }
}

module.exports.viewAdmin = async (req, res) => {
    const admin = req.user
    const admins = await Admin.find({});
    res.render('view-admin', {
        title: 'View Admin',
        admins,
        admin
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
        const admin = await Admin.findById(req.query.deleteAdmin);

        const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', path.basename(admin.avatar));
        fs.unlinkSync(oldImagePath)

        await Admin.findByIdAndDelete(admin)

        res.redirect('/view-admin')
    }
    catch (err) {
        console.log(err)
        res.send('Error Fetching Admin Details')
    }
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        const hobbies = Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby]

        let password = admin.password;
        if (req.body.password && req.body.password.trim() !== '') {
            password = await bcrypt.hash(req.body.password, 12);
        }

        const updateData = {
            name: req.body.fname + ' ' + req.body.lname,
            email: req.body.email,
            gender: req.body.gender,
            hobby: hobbies,
            desc: req.body.desc,
            date: req.body.date,
            password: password,
            avatar: admin.avatar
        }

        if (req.body.date && req.body.date !== '') {
            updateData.date = req.body.date;
        }

        if (req.file) {
            const newImageString = Admin.adPath + req.file.filename;

            const oldImagePath = path.join(__dirname, '..', 'uploads', 'adminImages', path.basename(admin.avatar));

            if (admin.avatar && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            updateData.avatar = newImageString;
        }
        await Admin.findByIdAndUpdate(req.params.id, updateData);

        res.json({ success: true, message: 'Admin updated successfully' });
    }
    catch (err) {
        console.log(err)
        res.send('Error Fetching Admin Details')
    }
};