const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

connectDB();

// VARS
const PORT = process.env.PORT || 5000;
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use("/api/materials", require("./routes/materialRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/material-categories", require("./routes/materialCategoryRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/vendor-products", require("./routes/vendorProductRoutes"));
app.use("/api/vendor-locations", require("./routes/vendorLocationRoutes"));
app.use("/api/delivery-clients", require("./routes/deliveryClientRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/hauls", require("./routes/haulRoutes"));
app.use("/api/freight-routes", require("./routes/freightRouteRoutes"));

// OVERRIDE ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
