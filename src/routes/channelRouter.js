const express = require('express');
const channelController = require('../controllers/channelController.js');

const router = express.Router();

router.post('/', channelController.createChannel);

module.exports = router;