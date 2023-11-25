const factoryHandler = require('../handlers/factoryHandler');
const Message = require('../models/messageModel');

exports.getAllMessagesSentForUser = factoryHandler.getAll(Message);

exports.getAllMessagesSentInChannel = factoryHandler.getAll(Message);

exports.postMessageToUser = factoryHandler.createOne(Message);

exports.postMessageInChannel = factoryHandler.createOne(Message);

exports.deleteMessageSentToUser = factoryHandler.deleteOne(Message);

exports.deleteMessageSentInChannel = factoryHandler.deleteOne(Message);

exports.updateMessageSentToUser = factoryHandler.updateOne(Message);

exports.updateMessageSentInChannel = factoryHandler.updateOne(Message);