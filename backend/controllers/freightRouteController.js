const asyncHandler = require('express-async-handler')
const FreightRoute = require('../models/freightRouteModel')

// @desc    Get freight routes
// @route   GET /api/freight-routes
// @access  Private
const getFreightRoutes = asyncHandler(async (req, res) => {
   const freightRoutes = await FreightRoute.find()

   res.status(200).send(freightRoutes)
})

// @desc    Get freight routes by vendor ID
// @route   GET /api/freight-routes/vendor/:vendorId
// @access  Private
const getFreightRoutesByVendorId = asyncHandler(async (req, res) => {
   const freightRoutes = await FreightRoute.find({
      vendorId: req.params.vendorId,
   })

   res.status(200).send(freightRoutes)
})

// @desc    Create freight route
// @route   POST /api/freight-routes
// @access  Private
const createFreightRoute = asyncHandler(async (req, res) => {
   if (!req.body.vendorId) {
      res.status(400)
      throw new Error('Vendor is required')
   }

   if (!req.body.vendorLocationId) {
      res.status(400)
      throw new Error('Vendor location is required')
   }

   if (!req.body.destination) {
      res.status(400)
      throw new Error('Destination is required')
   }

   // if (!req.body.freightCost || req.body.freightCost.toString().length <= 0) {
   //     res.status(400)
   //     throw new Error('Freight Cost is required')
   // }

   const freightRouteExists = await FreightRoute.findOne({
      vendorId: req.body.vendorId,
      vendorLocationId: req.body.vendorLocationId,
      destination: { $regex: req.body.destination, $options: 'i' },
   })

   if (freightRouteExists) {
      res.status(400)
      throw new Error('Route already exists')
   }

   // const freightRoute = await FreightRoute.create({
   //     createdBy: req.user.id,
   //     updatedBy: req.user.id,
   //     vendorId: req.body.vendorId,
   //     vendorLocationId: req.body.vendorLocationId,
   //     destination: req.body.destination,
   //     freightCost: req.body.freightCost,
   //     notes: req.body.notes,
   //     isActive: req.body.isActive,
   // })
   let _data = { ...req.body, createdBy: req.user.id, updatedBy: req.user.id }
   const freightRoute = await FreightRoute.create(_data)

   res.status(200).json(freightRoute)
})

// @desc    Update freight route
// @route   PUT /api/freight-routes/:id
// @access  Private
const updateFreightRoute = asyncHandler(async (req, res) => {
   const freightRoute = await FreightRoute.findById(req.params.id)

   if (!freightRoute) {
      res.status(400)
      throw new Error('Freight Route not found')
   }

   const updates = { ...req.body, updatedBy: req.user.id }

   console.log('[freightRouteController updateFreightRoute] updates: ')
   console.log(updates)

   const updatedFreightRoute = await FreightRoute.findByIdAndUpdate(
      req.params.id,
      updates,
      {
         new: true,
      }
   )

   res.status(200).json(updatedFreightRoute)
})

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private
const deleteFreightRoute = asyncHandler(async (req, res) => {
   const freightRoute = await FreightRoute.findById(req.params.id)

   if (!freightRoute) {
      res.status(400)
      throw new Error('Freight Route not found')
   }

   freightRoute.remove()

   res.status(200).json({ id: req.params.id })
})

module.exports = {
   getFreightRoutes,
   getFreightRoutesByVendorId,
   createFreightRoute,
   updateFreightRoute,
   deleteFreightRoute,
}
