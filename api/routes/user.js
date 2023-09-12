// Import necessary modules and middleware
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import middleware for user authentication
const checkAuth = require('../middleware/check-auth');

// Import User model
const User = require("../models/user");

// User Signup Route
router.post("/signup", (req, res, next) => {
  // Check if email is already registered
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        // Email exists, return conflict status code
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        // Hash the password before saving it
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            // Error during hashing
            return res.status(500).json({
              error: err
            });
          } else {
            // Create new User instance
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            // Save user to database
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

// User Login Route
router.post("/login", (req, res, next) => {
  // Find user by email
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        // User not found, return unauthorized status
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      // Compare hashed passwords
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: err
          });
        }

        // Generate JWT if passwords match
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        } else {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Delete User Route
router.delete("/:userId", (req, res, next) => {
  // Delete user by ID
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Export router for use in other modules
module.exports = router;

/**
 * Email Validation:
 * -----------------
 * This route uses the email validation provided in the database schema.
 * Make sure any additional server-side validation is consistent with this.
 * 
 * Password Security:
 * ------------------
 * The password is hashed using bcrypt with 10 salt rounds.
 * This can be modified to fit specific security requirements.
 * 
 * JWT Expiration:
 * ---------------
 * The JWT token generated upon login is set to expire in 1 hour.
 * Change this as needed or implement a refresh token mechanism.
 * 
 * Response Status Codes:
 * ----------------------
 * 409 - Email already exists
 * 201 - User created successfully
 * 500 - Internal server error
 * 401 - Authorization failed
 * 
 * Middleware Integration:
 * -----------------------
 * The checkAuth middleware can be easily integrated into other routes.
 * Simply require it at the top and use it in your route definitions like so: router.post("/yourRoute", checkAuth, yourController);
 */

