const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')
const path = require('path')
const _ = require('lodash')

const testHauls = require('./hauls.json')

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

function fixHauls(hauls) {
    // Change MMM's "J&K-MAGNOLIA, AR" vendorLocation to "Eagletown"
    hauls.map((haul) => {
        if (
            haul.from.toLowerCase() === 'martin marietta' &&
            haul.to.toLowerCase() === 'j&k-magnolia, ar'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
    })

    // Change vendorLocation to 'Eagletown' for hauls with product 'landscape cobbles' or '0515 reg base'
    hauls.map((haul) => {
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === 'landscape cobbles'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === 'ls cobbles'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietrta' &&
            haul.product?.toLowerCase() === 'landscp cobbles'
        ) {
            haul.from = 'MARTIN MARIETTA'
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === 'landscape cobbles - eagletown'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === 'lscp cobbles'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === 'landscp cobbles'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === '0515 reg base'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === '0515 reg base - eagletown'
        ) {
            haul.vendorLocation = 'Eagletown'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === '5/8 chip'
        ) {
            haul.vendorLocation = 'Hatton'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === '5/8" blue chip'
        ) {
            haul.vendorLocation = 'Hatton'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === '1347  1 3/4 flex'
        ) {
            haul.vendorLocation = 'Hatton'
        }
        if (
            haul.from?.toLowerCase() === 'martin marietta' &&
            haul.product?.toLowerCase() === '1 3/4" FLEX BASE'
        ) {
            haul.vendorLocation = 'Hatton'
        }
    })

    // Fix hauls missing the `vendorLocation` property
    hauls.map((haul) => {
        if (!haul.hasOwnProperty('vendorLocation')) {
            if (haul.from.toLowerCase() === 'martin marietta') {
                if (
                    (haul.product &&
                        haul.product.toLowerCase() === 'fine scgs') ||
                    (haul.product &&
                        haul.product.toLowerCase() === 'blue fines') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '0966 fine scgs') ||
                    (haul.product &&
                        haul.product.toLowerCase() === 'fine scgs 0966') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '1 3/4" FLEX BASE') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '1347  1 3/4 FLEX')
                ) {
                    haul.vendorLocation = 'Hatton'
                }

                if (
                    (haul.product &&
                        haul.product.toLowerCase() === 'blue sb2') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '2808 blue sb2') ||
                    (haul.product && haul.product.toLowerCase() === '2808-sb2')
                ) {
                    haul.vendorLocation = 'Hatton'
                }

                if (
                    (haul.product &&
                        haul.product.toLowerCase() === '5/8 blue chips') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '5/8 blue chip') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '5/8 chip') ||
                    (haul.product &&
                        haul.product.toLowerCase() === '5/8 chips') ||
                    (haul.product &&
                        haul.product.toLowerCase() === 'blue chips')
                ) {
                    haul.vendorLocation = 'Hatton'
                }
            } else {
                haul.vendorLocation = 'Main'
            }
        }
    })

    return hauls
}

function haulsWithoutVendorLocation(hauls) {
    let _hauls = hauls.filter((haul) => !haul.hasOwnProperty('vendorLocation'))
    return _hauls
}

function haulsWithoutProduct(hauls) {
    let _hauls = hauls.filter((haul) => !haul.hasOwnProperty('product'))
    return _hauls
}

app.get('/test/hauls', (req, res) => {
    // let returnHauls = fixHauls(testHauls)
    console.log('LENGTH: ' + testHauls.length)

    // let hauls = fixHauls(testHauls)

    let brokenHauls = haulsWithoutProduct(testHauls)
    // let brokenHauls = haulsWithoutVendorLocation(testHauls)

    res.status(200).json(brokenHauls)
})

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
