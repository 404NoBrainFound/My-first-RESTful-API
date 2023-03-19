const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkAuth = require('../middleware/check-auth');
const User = require("../models/user");



router.post("/signup", (req, res, next) => {

  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });

        

      } else {
          // Salts password and adds callback
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          // Password could not be stored or unsuccsefuly hashed
            if (err) {
            return res.status(500).json({
              error: err
            });

           // Creates new user with hashed password
          } else {
        
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            
          
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



// Login and verifaction
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
       
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: err
          });
        }

        //JWT token
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
        
// Deletes user account
router.delete("/:userId", (req, res, next) => {
  // Behaves like remove(), but deletes at most one document regardless of the single option.
  // If this acts funny try deleteMany()
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

module.exports = router;