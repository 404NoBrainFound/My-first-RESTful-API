// app.js

require('dotenv').config({ path: 'sec.env' });
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products"); //1
const userRoutes = require('./api/routes/user');
const app = express();

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads')); //1
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





// Connect to MongoDB using the mongoURI from the .env file
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Test statment
//app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));


// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });


// Routes which should handle requests
app.use("/user", userRoutes);
app.use("/products", productRoutes); //1

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});





module.exports = app;


// To fix all deprecation warnings, follow the below steps:

// Replace update() with updateOne(), updateMany(), or replaceOne()
// Replace remove() with deleteOne() or deleteMany().
// Replace count() with countDocuments(), unless you want to count how many documents are in the whole collection (no filter). In the latter case, use estimatedDocumentCount().

