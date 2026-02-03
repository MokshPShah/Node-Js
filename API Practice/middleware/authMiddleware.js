const { verifyToken } = require('../utils/jwt')

const auth = (req, res, next) => {
    console.log(req.headers.authorization)

    try {
        let token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(400).send({ message: "Token required" })
        }

        let isVerified = verifyToken(token)
        if (isVerified == 'invalid signature') {
            return res.status(400).send({ message: "Token Invalid" })
        }

        req.user = isVerified;
        next();

    } catch (error) {
        return res.status(500).send({ message: "Server Error" })
    }
}

const authorized = (roles) => {
    try {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                res.status(400).send({ message: "You're not allowed to access this page" })
            }

            next();
        }
    } catch (error) {
        return res.status(500).send({message: "Server Error"})
    }
}

module.exports = { auth, authorized }