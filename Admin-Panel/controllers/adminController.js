const Admin = require("../models/Admin")
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

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
                maxAge: 1000 * 60 * 60 * 24
            });
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

module.exports.logout = (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login')
}

module.exports.dashboard = async (req, res) => {
    try {
        if (!req.cookies.authToken) return res.redirect('/login');

        const admin = await Admin.findById(req.cookies.authToken);
        const admins = await Admin.find();

        if (admin) {
            res.render('dashboard', {
                title: 'Dashboard',
                admin,
                admins
            })
        } else {
            res.redirect('/login')
        }

    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.profile = async (req, res) => {
    try {
        if (!req.cookies.authToken) return res.redirect('/login');

        const admin = await Admin.findById(req.cookies.authToken)

        if (admin) {
            res.render('profile', {
                title: 'My Profile',
                admin
            });
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const adminId = req.cookies.authToken
        if (!adminId) return res.redirect('/login');

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.redirect('/login');
        }

        const hobbies = req.body.hobby || [];
        if (!Array.isArray(hobbies)) {
            hobbies = [hobbies]
        }

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
        await Admin.findByIdAndUpdate(adminId, updateData);

        res.redirect('/profile');
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.settings = async (req, res) => {
    try {
        const adminId = req.cookies.authToken;
        if (!adminId) return res.redirect('/login')

        const admin = await Admin.findById(adminId);
        res.render('settings', { title: "My Profile", admin })
    } catch (error) {

    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const adminId = req.cookies.authToken
        if (!adminId) return res.redirect('/login')

        const admin = await Admin.findById(adminId)
        if (!admin) return res.redirect('/login')

        let isMatch = await bcrypt.compare(req.body.current_password, admin.password);
        if (isMatch) {
            if (req.body.new_password === req.body.confirm_password) {
                const hashPassword = await bcrypt.hash(req.body.new_password, 12);

                await Admin.findByIdAndUpdate(adminId, { password: hashPassword });
                return res.redirect('/settings');
            } else {
                console.log("New Password and Confirm Password should be same")
                return res.redirect('/settings')
            }
        } else {
            console.log("password not match with current password")
            return res.redirect('/settings')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/login')
    }
}

module.exports.checkEmail = async (req, res) => {
    try {
        res.render('forgetPassword/check-email');
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.sendOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const admin = await Admin.findOne({ email: email })

        if (!admin) {
            console.log("Email not found");
            return res.redirect('/login');
        }

        const OTP = Math.floor(Math.random() * 999999)
        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shahmoksh90651@gmail.com',
                pass: 'siwsljxehjjrpfdz'
            }
        })

        const mailOptions = {
            from: 'Nexus Admin <shahmoksh90651@gmail.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: '',
            html: `Your OTP for password reset is: <b> ${OTP} </b>`
        }

        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.redirect('/forgetPassword/check-email');
            } else {
                console.log('Email sent: ' + info.response)

                res.cookie('otp', OTP, { maxAge: 300000, httpOnly: true });
                res.cookie('resetEmail', email, { maxAge: 300000, httpOnly: true });

                return res.redirect('/forgetPassword/otp');
            }
        })

    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/check-email')
    }
}

module.exports.otp = async (req, res) => {
    try {
        res.render('forgetPassword/otp');
    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/check-email')
    }
}

module.exports.verifyOtp = async (req, res) => {
    try {
        const userOtp = req.body.otp;
        const cookieOTP = req.cookies.otp;

        if (userOtp === cookieOTP) {
            res.redirect('/forgetPassword/set-password');
        } else {
            console.log("Invalid OTP");
            res.redirect('forgetPassword/otp');
        }
    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/otp')
    }
}

module.exports.setPassword = async (req, res) => {
    try {
        res.render('forgetPassword/set-password')

    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/set-password')
    }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const { new_password, confirm_password } = req.body;
        const email = req.cookies.resetEmail;

        if (!email) return res.redirect('/forgetPassword/check-email')

        if (new_password === confirm_password) {
            const hashPassword = await bcrypt.hash(new_password, 12);

            await Admin.findOneAndUpdate({ email: email }, { password: hashPassword });

            res.clearCookie('otp');
            res.clearCookie('resetEmail');

            console.log("Password reset successfully");
            res.redirect('/login');
        } else {
            console.log("Passwords do not match");
            res.redirect('/forgetPassword/set-password');
        }
    } catch (error) {
        console.log(error)
        res.redirect('/forgetPassword/set-password');
    }
}

module.exports.addAdmin = async (req, res) => {
    try {
        if (!req.cookies.authToken) return res.redirect('/login');

        const admin = await Admin.findById(req.cookies.authToken)
        res.render('add-admin', { title: 'Add-Admin', admin })
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}

module.exports.viewAdmin = async (req, res) => {
    try {
        if (!req.cookies.authToken) return res.redirect('/login');

        const admin = await Admin.findById(req.cookies.authToken)
        const admins = await Admin.find({});
        res.render('view-admin', {
            title: 'View Admin',
            admins,
            admin
        });
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
};

module.exports.insertAdminData = async (req, res) => {
    try {
        const currentAdmin = await Admin.findById(req.cookies.authToken)

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