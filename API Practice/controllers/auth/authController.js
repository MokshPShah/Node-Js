const User = require('../../models/users')
const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/jwt')

module.exports.register = async (req, res) => {

    try {
        const { username, email, password } = req.body;

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
        await User.create({ ...req.body, password: hashPassword })

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.log("Error", error);
        res.status(500).send("Server Error")
    }
}

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }
        console.log(req.body)

        let user = await User.findOne({ username })
        if (!user) {
            return res.status(400).send({ message: "username or password is incorrect" });
        }

        let verifyPass = await bcrypt.compare(password, user.password);
        if (!verifyPass) {
            return res.status(400).send({ message: "username or password is incorrect" })
        }

        let token = generateToken({ id: user.id, role: user.role })

        return res.status(200).send({ message: "Login Successfully", token })
    } catch (error) {
        console.log("Error", error);
        res.status(500).send("Server Error")
    }
}