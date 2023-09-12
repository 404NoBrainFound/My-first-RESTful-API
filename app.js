// app.js
// Pay attention to the "//1" these are custome routes and may be diffrent in your project
// Load environment variables from the 'sec.env' file
require('dotenv').config({ path: 'sec.env' });

// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require("mongoose");

// Importing custom route handlers
const productRoutes = require("./api/routes/products"); //1 
const userRoutes = require('./api/routes/user');

// Initialize the Express application
const app = express();

// Middleware setup
app.use(morgan("dev")); // Logging middleware for debugging

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads')); //1

// Body-parser middleware for JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Connect using environment variables and new parser settings to avoid deprecation warnings
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with a failure code
  }
};

connectDB();

// Configure port, defaulting to 8082
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));

// CORS setup to allow requests from different origins
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") { // Pre-flight request
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

// Route registration
app.use("/user", userRoutes);
app.use("/products", productRoutes); //1

// Middleware to handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Global error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
