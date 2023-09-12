// Importing the JSON Web Token library for stateless authentication
const jwt = require("jsonwebtoken");

// Load environment variables from 'sec.env'
require('dotenv').config({ path: 'sec.env' });

// Middleware function to check for valid JWT in incoming requests
module.exports = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization.split(" ")[1];
        
        // Log token for debugging (consider removing this in production)
        console.log(token);

        // Decode and verify the token using secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        // Store decoded user data in request object
        req.userData = decoded;

        // Move to next middleware or route handler
        next();
    } catch (error) {
        // Return 401 Unauthorized status code if auth fails
        return res.status(401).json({
            message: "Auth failed"
        });
    }

    // Remove this next() if you have it in your actual code, as it would allow requests to pass even if the try-catch block fails.
     next();
};

// Add this middleware to your route files to protect endpoints.
// const checkAuth = require('../middleware/check-auth');
//
// Example usage of checkAuth middleware in routes
// router.post("/login", checkAuth, (req, res, next) => { /* your logic here */ });


/**
 * Token Format:
 * -------------
 * The expected format for the token is 'Bearer YOUR_TOKEN_HERE' in the Authorization header.
 * 
 * Error Messages:
 * ---------------
 * The message "Auth failed" is intentionally generic.
 * You might want to keep it that way for security purposes or tailor it to be more or less descriptive.
 */

