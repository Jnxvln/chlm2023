const mongoose = require('mongoose')

const connectDB = async () => {
    console.log(
        '\n\nPROCESS.ENV.MONGODB_URI_DEV: ' + process.env.MONGODB_URI_DEV
    )

    try {
        let conn

        if (process.env.NODE_ENV === 'production') {
            conn = await mongoose.connect(process.env.MONGODB_URI_23, {
                useNewUrlParser: true,
            })
        } else {
            conn = await mongoose.connect(process.env.MONGODB_URI_DEV, {
                useNewUrlParser: true,
            })
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
