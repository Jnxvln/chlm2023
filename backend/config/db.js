const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        let conn

        if (process.env.NODE_ENV === 'production') {
            conn = await mongoose.connect(process.env.MONGODB_URI_23)
        } else {
            conn = await mongoose.connect(process.env.MONGODB_URI_DEV)
        }

        console.log(
            `MongoDB ${
                process.env.NODE_ENV === 'production'
                    ? 'PRODUCTION'
                    : 'DEVELOPMENT'
            } Connected: ${conn?.connection?.host}`.cyan.underline
        )
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB
