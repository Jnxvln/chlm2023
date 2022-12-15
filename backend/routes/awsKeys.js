// ROUTER /api/awsKeys

// const {
//     getDrivers,
//     getDriverById,
//     createDriver,
//     updateDriver,
//     deleteDriver,
// } = require('../controllers/driverController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
// router.route('/').get(protect, getDrivers).post(protect, createDriver)
// router
//     .route('/:id')
//     .get(protect, getDriverById)
//     .delete(protect, deleteDriver)
//     .put(protect, updateDriver)

router.get('/', protect, (req, res) => {
    res.status(200).json({
        bucketName: process.env.AWS_BUCKET_NAME,
        accessKeyId: process.env.CH_AWS_ACCESS_KEY_ID,
        accessKey: process.env.CH_AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.CH_AWS_REGION,
    })
})

module.exports = router
