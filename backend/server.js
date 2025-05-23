const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')
const path = require('path')

connectDB()

// VARS
const PORT = process.env.PORT || 5000
const app = express()

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ROUTES
app.use('/api/awsKeys', require('./routes/awsKeys'))
app.use('/api/materials', require('./routes/materialRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/material-categories', require('./routes/materialCategoryRoutes'))
app.use('/api/drivers', require('./routes/driverRoutes'))
app.use('/api/vendors', require('./routes/vendorRoutes'))
app.use('/api/vendor-products', require('./routes/vendorProductRoutes'))
app.use('/api/vendor-locations', require('./routes/vendorLocationRoutes'))
app.use('/api/delivery-clients', require('./routes/deliveryClientRoutes'))
app.use('/api/deliveries', require('./routes/deliveryRoutes'))
app.use('/api/hauls', require('./routes/haulRoutes'))
app.use('/api/freight-routes', require('./routes/freightRouteRoutes'))
app.use('/api/workdays', require('./routes/workdayRoutes'))
app.use('/api/waitlist', require('./routes/waitListRoutes'))
app.use('/api/faq', require('./routes/faqRoutes'))
app.use('/api/faq-active', require('./routes/faqActiveRoutes'))
app.use('/api/settings/store', require('./routes/storeSettingsRoutes'))
app.use('/api/usermessages', require('./routes/userMessagesRoutes'))

// Service static
app.use(express.static(path.resolve(__dirname, '../frontend/build')))
app.get('*', function (request, response) {
    response.sendFile(
        path.resolve(__dirname, '../frontend/build', 'index.html')
    )
})

// OVERRIDE ERROR HANDLER
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
