const express = require('express');
const router = express.Router();
const { triggerSOS, getSOSAlerts } = require('../controllers/sosController');

router.post('/', triggerSOS);
router.get('/getAll', getSOSAlerts);

module.exports = router;
