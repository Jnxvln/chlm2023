const express = require("express");
const dotenv = require("dotenv").config();
const colors = require('colors')
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorMiddleware");

connectDB()

// VARS
const PORT = process.env.PORT || 5000;
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use("/api/materials", require("./routes/materialRoutes"));

// OVERRIDE ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));