const dayjs = require('dayjs')
const asyncHandler = require('express-async-handler')
const Workday = require('../models/workdayModel')

// @desc    Get absolutely all workdays
// @route   GET /api/workdays
// @access  Private
const getAllWorkdays = asyncHandler(async (req, res) => {
    const workdays = await Workday.find()

    res.status(200).send(workdays)
})

// @desc    Get workdays by driver id
// @route   GET /api/workdays/for/:driverId
// @access  Private
const getWorkdaysByDriverId = asyncHandler(async (req, res) => {
    const driverWorkdays = await Workday.find({ driverId: req.params.driverId })

    res.status(200).send(driverWorkdays)
})

// @desc    Get all workdays within a date range (dateStart, dateEnd)
// @route   GET /api/workdays/range/:dateStart/:dateEnd
// @access  Private
const getAllWorkdaysByDateRange = asyncHandler(async (req, res) => {
    if (!req.params.dateStart) {
        res.status(400)
        throw new Error('Date start is required')
    }

    if (!req.params.dateEnd) {
        res.status(400)
        throw new Error('Date end is required')
    }

    const gte = new Date(
        dayjs(req.params.dateStart).format('MM/DD/YYYY')
    ).setHours(00, 00, 00)

    const lte = new Date(
        new Date(dayjs(req.params.dateEnd).format('MM/DD/YYYY')).setHours(
            23,
            59,
            59
        )
    )

    const workdaysRange = await Workday.find({
        date: {
            $gte: gte,
            $lte: lte,
        },
    })

    res.status(200).send(workdaysRange)
})

// @desc    Get workdays by driver id and date range
// @route   GET /api/workdays/for/:driverId/:dateStart/:dateEnd
// @access  Private
const getWorkdaysByDriverIdAndDateRange = asyncHandler(async (req, res) => {
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
        dayjs(req.params.dateStart).format('MM/DD/YYYY')
    ).setHours(00, 00, 00)

    const lte = new Date(
        new Date(dayjs(req.params.dateEnd).format('MM/DD/YYYY')).setHours(
            23,
            59,
            59
        )
    )

    const driverWorkdaysRange = await Workday.find({
        driverId: req.params.driverId,
        date: {
            $gte: gte,
            $lte: lte,
        },
    })

    res.status(200).send(driverWorkdaysRange)
})

// @desc    Create workday
// @route   POST /api/workdays
// @access  Private
const createWorkday = asyncHandler(async (req, res) => {
    if (!req.body.date) {
        res.status(400)
        throw new Error('Workday date is required')
    }

    if (!req.body.driverId) {
        res.status(400)
        throw new Error('A driver ID is required')
    }

    const gte = new Date(
        new Date(dayjs(req.body.date).format('MM/DD/YYYY')).setHours(00, 00, 00)
    )
    const lte = new Date(
        new Date(dayjs(req.body.date).format('MM/DD/YYYY')).setHours(23, 59, 59)
    )

    const workdayExists = await Workday.findOne({
        driverId: req.body.driverId,
        date: {
            $gte: gte,
            $lte: lte,
        },
    })

    if (workdayExists) {
        res.status(400)
        throw new Error(
            `A workday already exists for this driver on ${dayjs(
                req.body.date
            ).format('MM/DD/YYYY')}`
        )
    }

    const workday = await Workday.create({
        createdBy: req.user.id,
        updatedBy: req.user.id,
        date: req.body.date,
        driverId: req.body.driverId,
        haulIds: req.body.haulIds,
        chhours: req.body.chhours,
        nchours: req.body.nchours,
        ncReasons: req.body.ncReasons,
        notes: req.body.notes,
    })

    res.status(200).json(workday)
})

// @desc    Update workday
// @route   PUT /api/workdays/:id
// @access  Private
const updateWorkday = asyncHandler(async (req, res) => {
    const workday = await Workday.findById(req.params.id)

    if (!workday) {
        res.status(400)
        throw new Error('Workday not found')
    }

    let updates = { ...req.body, updatedBy: req.user.id }

    const updatedWorkday = await Workday.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    )

    res.status(200).json(updatedWorkday)
})

// @desc    Delete workday
// @route   DELETE /api/workdays/:id
// @access  Private
const deleteWorkday = asyncHandler(async (req, res) => {
    const workday = await Workday.findById(req.params.id)

    if (!workday) {
        res.status(400)
        throw new Error('Workday not found')
    }

    workday.remove()

    res.status(200).json(workday)
})

module.exports = {
    getAllWorkdays,
    getWorkdaysByDriverId,
    getAllWorkdaysByDateRange,
    getWorkdaysByDriverIdAndDateRange,
    createWorkday,
    updateWorkday,
    deleteWorkday,
}
