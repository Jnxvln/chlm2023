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

// @desc    Get all hauls within a date range (dateStart, dateEnd)
// @route   GET /api/hauls/range/:dateStart/:dateEnd
// @access  Private
const getAllHaulsByDateRange = asyncHandler(async (req, res) => {
    console.log('Running getAllHaulsByDateRange...')

    if (!req.params.dateStart) {
        res.status(400)
        throw new Error('Date start is required')
    }

    if (!req.params.dateEnd) {
        res.status(400)
        throw new Error('Date end is required')
    }

    console.log('PARAM dateStart: ' + req.params.dateStart)
    console.log('PARAM dateEnd: ' + req.params.dateEnd)

    const haulsFrom = new Date(req.params.dateStart).setHours(0, 0, 0, 0)
    const haulsTo = new Date(req.params.dateEnd).setHours(23, 59, 59)

    console.log('FROM: ')
    console.log(dayjs(haulsFrom).format('MM/DD/YYYY HH:mm:ss'))
    console.log('TO: ')
    console.log(dayjs(haulsTo).format('MM/DD/YYYY HH:mm:ss'))

    const haulsRange = await Haul.find({
        dateHaul: {
            $gte: haulsFrom,
            $lte: haulsTo,
        },
    })

    res.status(200).send(haulsRange)
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

    const dateStart = dayjs(req.params.dateStart)
    const dateEnd = dayjs(req.params.dateEnd)
    const diff = Math.abs(dateStart.diff(dateEnd, 'day')) + 1

    let dates = []

    for (let i = 0; i < diff; i++) {
        dates.push(dayjs(dateStart).add(i, 'day').format('YYYY-MM-DD'))
    }

    let startDateFormat = dayjs(req.params.dateStart).format('YYYY-MM-DD')
    let endDateFormat = dayjs(req.params.dateEnd).format('YYYY-MM-DD')

    // Return hauls within this date range

    const hauls = await Haul.find({
        driver: req.params.driverId,
        dateHaul: {
            $gte: startDateFormat,
            $lte: endDateFormat,
        },
    })

    // console.log(hauls)

    res.status(200).json(hauls)
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
    if (
        !req.body.vendorLocation &&
        req.body.from.toLowerCase() !== 'off duty'
    ) {
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

    if (invoiceExists && !invoiceExists.invoice === '-') {
        res.status(400)
        throw new Error(`Invoice ${req.body.invoice} already exists`)
    }

    // Next, clear extraneous fields depending on loadType
    let overrides = {
        chInvoice: null,
        rate: null,
        miles: null,
        payRate: null,
    }

    if (req.body.loadType === 'enddump') {
        overrides.rate = req.body.rate
    }

    if (req.body.loadType === 'flatbedperc') {
        overrides.chInvoice = req.body.chInvoice
        overrides.payRate = req.body.payRate
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
    }

    if (req.body.loadType === 'enddump') {
        overrides.rate = req.body.rate
    }

    if (req.body.loadType === 'flatbedperc') {
        overrides.chInvoice = req.body.chInvoice
        overrides.payRate = req.body.payRate
    }

    if (req.body.loadType === 'flatbedmi') {
        overrides.chInvoice = req.body.chInvoice
        overrides.rate = req.body.rate
        overrides.miles = req.body.miles
    }

    const updates = {
        ...req.body,
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
    getAllHaulsByDateRange,
    getHaulsByDriverIdAndDateRange,
    createHaul,
    updateHaul,
    deleteHaul,
}
