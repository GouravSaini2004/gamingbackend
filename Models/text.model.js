const mongoose = require('mongoose');

// Define the schema for storing two text fields
const textSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true, // Make this field required
  },
  url: {
    type: String,
    required: true, // Make this field required
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps
});

// Create the model
const Text = mongoose.model('Text', textSchema);

module.exports = Text;
