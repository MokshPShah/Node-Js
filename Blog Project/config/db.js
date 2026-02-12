const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.log("DB Error : ", error);
    }
}

module.exports = connectDB;