const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
    userId: {
        type: String, // Placeholder for now, will link to User model later
        required: false
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    message: {
        type: String,
        default: 'SOS! I need help!'
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'cancelled'],
        default: 'active'
    },
    contactsNotified: [{
        type: String // Phone numbers or emails
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
