const User = require("../../models/users");
const bcrypt = require("bcrypt")

module.exports.teacherDashboard = (req, res) => {
    try {
        return res.status(200).send({ message: "Welcome to teacher api" });
    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
}

module.exports.addTeacher = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log("Body: ", req.body)

        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send({ message: "username already exists" });
        }

        let emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 12)
        await User.create({ ...req.body, password: hashPassword, role: 'Teacher' })

        res.status(201).send({ message: "Teacher account created successfully" });
    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
}

module.exports.viewAllTeacher = async (req, res) => {
    try {
        let allUser = await User.find({ role: 'Teacher', isDeleted: false }).select('-password');
        console.log(allUser);
        return res.status(200).send({ message: allUser })
    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
}

module.exports.profile = async (req, res) => {
    try {
        const { id } = req.params;

        let user = await User.findById(id).select('-password');

        if (user.isDeleted == true) {
            res.status(404).send({ message: "your account is deactivate! please contact to admin " })
        }

        if (!user) {
            res.status(404).send({ message: "User not exists" })
        }

        return res.status(200).send({ message: user })

    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
}

module.exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        console.log("Body: ", req.body)

        if (!username || !email) {
            return res.status(400).send({ message: "All fields are required" });
        }

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send({ message: "username already exists" });
        }

        let emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(404).json({ message: "email already exists" });
        }

        await User.findByIdAndUpdate(id, { ...req.body })

        res.status(200).send({ message: "Teacher account updated successfully" });
    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "User ID is required" })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send("user not found")
        }

        user.isDeleted = true;
        await user.save()
        res.status(200).send({ message: "User deleted successfully" });

    } catch (error) {
        return res.status(500).send({ message: "Server Error" });
    }
}