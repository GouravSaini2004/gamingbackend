const mongoose = require('mongoose');

// Define the Participant schema
const participantSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    gameId: {
        type: String,
        required: true,
        trim: true,
    },
    gameTitle: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now, // Set default value to current date and time
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    status: {
        type: String,
        enum : ['Pending', 'Verified', 'Rejected'],
        default: 'Pending',
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Create the Participant model
const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
