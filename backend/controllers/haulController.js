const dayjs = require('dayjs')
const asyncHandler = require('express-async-handler')
const Haul = require('../models/haulModel')

// @desc    Get hauls
// @route   GET /api/hauls
// @access  Private
const getHauls = asyncHandler(async (req, res) => {
    const hauls = await Haul.find()

    res.status(200).send(hauls)
})

// @desc    Get hauls by driverId
// @route   GET /api/hauls/for/:driverId
// @access  Private
const getHaulsByDriverId = asyncHandler(async (req, res) => {
    console.log('Checking for hauls on driverId: ' + req.params.driverId)
    const hauls = await Haul.find({ driver: req.params.driverId })

    res.status(200).send(hauls)
})

// @desc    Get hauls by driverId and date range
// @route   GET /api/hauls/for/:driverId/:dateStart/:dateEnd
// @access  Private
const getHaulsByDriverIdAndDateRange = asyncHandler(async (req, res) => {
    // #region ERROR CHECKS
    if (!req.params.driverId) {
        res.status(400)
        throw new Error('Driver ID is required')
    }

    if (!req.params.dateStart) {
        res.status(400)
        throw new Error('A starting date is required')
    }

    if (!req.params.dateEnd) {
        res.status(400)
        throw new Error('An ending date is required')
    }
    // #endregion

    const gte = new Date(
        new Date(dayjs(req.params.dateStart).format('MM/DD/YYYY')).setHours(
            00,
            00,
            00
        )
    )
    const lte = new Date(
        new Date(dayjs(req.params.dateEnd).format('MM/DD/YYYY')).setHours(
            23,
            59,
            59
        )
    )
    // console.log('Date Start: ' + gte)
    // console.log('Date End: ' + lte)

    // 2. Return hauls within this date range
    const hauls = await Haul.find({
        driver: req.params.driverId,
        dateHaul: {
            $gte: gte,
            $lte: lte,
        },
    })

    // 3. Return this list
    res.status(200).send(hauls)
})

// @desc    Create haul
// @route   POST /api/hauls
// @access  Private
const createHaul = asyncHandler(async (req, res) => {
    // #region ERROR CHECKS
    if (!req.body.driver) {
        res.status(400)
        throw new Error('The `driver` field is required')
    }
    if (!req.body.dateHaul) {
        res.status(400)
        throw new Error('The `date haul` field is required')
    }
    if (!req.body.loadType) {
        res.status(400)
        throw new Error('The `load type` field is required')
    }
    if (!req.body.invoice) {
        res.status(400)
        throw new Error('The `invoice` field is required')
    }
    if (!req.body.from) {
        res.status(400)
        throw new Error('The `from` field required')
    }
    if (!req.body.vendorLocation && req.body.loadType === 'enddump') {
        res.status(400)
        throw new Error('The `vendor location` field required')
    }
    if (!req.body.to) {
        res.status(400)
        throw new Error('The `to` field is required')
    }
    if (!req.body.product) {
        res.status(400)
        throw new Error('The `product` field is required')
    }
    // #endregion

    const invoiceExists = await Haul.findOne({
        invoice: { $regex: req.body.invoice, $options: 'i' },
    })

    if (invoiceExists) {
        res.status(400)
        throw new Error(`Invoice ${req.body.invoice} already exists`)
    }

    // Next, clear extraneous fields depending on loadType
    let overrides = {
        chInvoice: null,
        rate: null,
        miles: null,
        payRate: null,
        driverPay: null,
    }

    if (req.body.loadType === 'enddump') {
        overrides.rate = req.body.rate
    }

    if (req.body.loadType === 'flatbedperc') {
        overrides.chInvoice = req.body.chInvoice
        overrides.payRate = req.body.payRate
        overrides.driverPay = req.body.driverPay
    }

    if (req.body.loadType === 'flatbedmi') {
        overrides.chInvoice = req.body.chInvoice
        overrides.rate = req.body.rate
        overrides.miles = req.body.miles
    }

    let haulData = {
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id,
    }

    // Remove the _id field (bundled with formData) [only used for updateHaul]
    let { _id, ...dataWithoutId } = haulData

    const haul = await Haul.create(dataWithoutId)

    res.status(200).json(haul)
})

// @desc    Update haul
// @route   PUT /api/hauls/:id
// @access  Private
const updateHaul = asyncHandler(async (req, res) => {
    const haul = await Haul.findById(req.params.id)

    if (!haul) {
        res.status(400)
        throw new Error('Haul not found')
    }

    // Next, clear extraneous fields depending on loadType
    let overrides = {
        chInvoice: null,
        rate: null,
        miles: null,
        payRate: null,
        driverPay: null,
    }

    if (req.body.loadType === 'enddump') {
        overrides.rate = req.body.rate
    }

    if (req.body.loadType === 'flatbedperc') {
        overrides.chInvoice = req.body.chInvoice
        overrides.payRate = req.body.payRate
        overrides.driverPay = req.body.driverPay
    }

    if (req.body.loadType === 'flatbedmi') {
        overrides.chInvoice = req.body.chInvoice
        overrides.rate = req.body.rate
        overrides.miles = req.body.miles
    }

    const updates = {
        ...req.body,
        timeHaul: req.body.dateHaul,
        updatedBy: req.user.id,
    }

    const updatedHaul = await Haul.findByIdAndUpdate(req.params.id, updates, {
        new: true,
    })

    res.status(200).json(updatedHaul)
})

// @desc    Delete haul
// @route   DELETE /api/hauls/:id
// @access  Private
const deleteHaul = asyncHandler(async (req, res) => {
    const haul = await Haul.findById(req.params.id)

    if (!haul) {
        res.status(400)
        throw new Error('Haul not found')
    }

    haul.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getHauls,
    getHaulsByDriverId,
    getHaulsByDriverIdAndDateRange,
    createHaul,
    updateHaul,
    deleteHaul,
}
