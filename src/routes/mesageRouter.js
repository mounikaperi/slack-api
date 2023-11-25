const express = require('express');
const messageController = require('../controllers/messageController.js');

const router = express.Router();

router
  .route('/user/:id')
  .get(messageController.getAllMessagesSentForUser)
  .post(messageController.postMessageToUser)
  .patch(messageController.updateMessageSentToUser)
  .delete(messageController.deleteMessageSentToUser);

router
  .route('/channel/:id')
  .get(messageController.getAllMessagesSentInChannel)
  .post(messageController.postMessageInChannel)
  .patch(messageController.updateMessageSentInChannel)
  .delete(messageController.deleteMessageSentInChannel);


