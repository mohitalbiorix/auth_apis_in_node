const mongoose = require('mongoose');

// database connection
const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: "user_data"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('Connected Successfully...')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB