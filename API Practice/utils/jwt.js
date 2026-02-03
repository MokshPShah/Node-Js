const jwt = require('jsonwebtoken')

module.exports.generateToken = (payload) => {
    try {
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        console.log(token)
        return token
    } catch (error) {
        console.log("Error: ", error);
        return error.message;
    }
}

module.exports.verifyToken = (token) => {
    try {

        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decode>>>", decoded);
        return decoded;

    } catch (error) {
        console.log("Error: ", error);
        return error.message;
    }
}