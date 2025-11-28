const SOSAlert = require('../models/SOSAlert');

// @desc    Trigger SOS Alert
// @route   POST /api/sos
// @access  Public (for now)
const triggerSOS = async (req, res) => {
    try {
        const { location, message, contactIds } = req.body;

        if (!location || !location.lat || !location.lng) {
            return res.status(400).json({ success: false, message: 'Location is required' });
        }

        // Create Alert in DB
        const alert = await SOSAlert.create({
            location,
            message,
            contactsNotified: contactIds || []
        });

        // Mock Sending Notifications
        console.log(`🚨 SOS TRIGGERED! Location: ${location.lat}, ${location.lng}`);
        console.log(`Message: ${message}`);
        console.log(`Notifying contacts: ${contactIds}`);

        res.status(201).json({
            success: true,
            data: alert,
            message: 'SOS Alert sent successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all SOS Alerts
// @route   GET /api/sos
// @access  Private (Admin/Support) - currently Public
const getSOSAlerts = async (req, res) => {
    try {
        const alerts = await SOSAlert.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    triggerSOS,
    getSOSAlerts
};
