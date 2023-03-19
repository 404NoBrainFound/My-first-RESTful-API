// Stateless authentication for protected resources
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: 'sec.env' });


module.exports = (req, res, next) => {
    try {
    const token =req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
 } catch (error) {
    return res.status(401).json({
        message: "Auth failed"
    })
 }
 
    next();

};


// Add this to the top of your routes/yourfilename.js
//const checkAuth = require('../middleware/check-auth');

// Example of where should add your checkAuth in right after route but before anything else
// router.post("/login", checkAuth, (req, res, next) =>