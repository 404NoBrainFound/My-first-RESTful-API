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
