const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameImage: {
        type: String,
        required: true,
    },
    gameTitle: {
        type: String,
        required: true,
        trim: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    maxPlayers: {
        type: Number,
        required: true,
    },
    teamSize: {
        type: Number,
        required: true,
    },
    gameDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Number,
        enum: [0, 1], // Only allows 0 or 1
        default: 1, // Default value is 1
    },
}, {
    timestamps: true, // This will add createdAt and updatedAt timestamps
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
