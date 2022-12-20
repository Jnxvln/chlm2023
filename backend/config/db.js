const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        if (error.code === 'ECONNREFUSED' && error.syscall === 'querySrv') {
            console.log('')
            console.error(
                'Check your internet connection and try again!'.cyan.underline
            )
            console.log('')
        } else {
            console.log(error)
        }
        process.exit(1)
    }
}

module.exports = connectDB
