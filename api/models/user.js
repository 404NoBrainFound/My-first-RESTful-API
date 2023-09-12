// Import mongoose library
const mongoose = require('mongoose');

// Create a new schema for User
const userSchema = mongoose.Schema({
    // Unique Identifier for the document
    _id: mongoose.Schema.Types.ObjectId,

    // User email configuration
    email: { 
        type: String, // Expected data type
        required: true, // This field cannot be empty
        unique: true, // Email must be unique across all documents
        // Regex pattern to validate email
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    // User password configuration
    password: { 
        type: String, // Expected data type
        required: true // This field cannot be empty
    }
});

// Export the model, usable in other parts of your application
module.exports = mongoose.model('User', userSchema);

/**
 * Schema Extensibility:
 * ---------------------
 * The schema is easily extendable.
 * You can add new fields such as username, profileImage, etc., as per your application requirements.
 * 
 * Regular Expression:
 * -------------------
 * The regex pattern used for email validation matches most email formats.
 * Update this pattern if your application needs a more specific or relaxed email validation.
 */

