// ROUTER /api/hauls

const {
    getHauls,
    getHaulsByDriverId,
    getAllHaulsByDateRange,
    getHaulsByDriverIdAndDateRange,
    createHaul,
    updateHaul,
    deleteHaul,
} = require('../controllers/haulController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(protect, getHauls).post(protect, createHaul)
router.route('/:id').delete(protect, deleteHaul).put(protect, updateHaul)
router.get('/for/:driverId', protect, getHaulsByDriverId)
router.get(
    '/for/:driverId/:dateStart/:dateEnd',
    protect,
    getHaulsByDriverIdAndDateRange
)
router.get('/range/:dateStart/:dateEnd', protect, getAllHaulsByDateRange)

module.exports = router
