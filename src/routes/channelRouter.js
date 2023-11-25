const express = require('express');
const channelController = require('../controllers/channelController.js');

const router = express.Router();

router
  .route('/')
  .get(channelController.getAllChannelsByWorkspace)
  .post(channelController.createChannel);

router
  .route('/:id')
  .get(channelController.getChannel)
  .patch(channelController.updateChannel)
  .delete(channelController.deleteChannel);

router
  .route('/leaveChannel/:channelId/user/:userId')
  .patch(channelController.leaveChannel);

module.exports = router;