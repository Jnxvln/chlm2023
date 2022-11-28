// ROUTER /api/workdays

const {
    getAllWorkdays,
    getWorkdaysByDriverId,
    getAllWorkdaysByDateRange,
    getWorkdaysByDriverIdAndDateRange,
    createWorkday,
    updateWorkday,
    deleteWorkday,
} = require('../controllers/workdayController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(protect, getAllWorkdays).post(protect, createWorkday)
router.route('/:id').delete(protect, deleteWorkday).put(protect, updateWorkday)
router.get('/for/:driverId', protect, getWorkdaysByDriverId)
router.get(
    '/for/:driverId/:dateStart/:dateEnd',
    protect,
    getWorkdaysByDriverIdAndDateRange
)
router.get('/range/:dateStart/:dateEnd', protect, getAllWorkdaysByDateRange)

module.exports = router
