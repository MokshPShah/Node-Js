const { default: mongoose } = require('mongoose')
const momgoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log("DB Connected Successfuly")
    } catch(error) {
        console.log("DB Connection error: ", error)
    }
}
module.exports = connectDB;