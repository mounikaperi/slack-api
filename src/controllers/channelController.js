const { isEmpty } = require('lodash');
const { response } = require('../../app');
const factoryHandler = require('../handlers/factoryHandler');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { CHANNEL_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.createChannel = factoryHandler.createOne(Channel);

exports.updateChannel = factoryHandler.updateOne(Channel);  

exports.getChannel = factoryHandler.getOne(Channel);

exports.getAllChannelsByWorkspace = factoryHandler.getAll(Channel);

exports.deleteChannel = factoryHandler.deleteOne(Channel);

exports.leaveChannel = (request, response, next) => {
  const { channelId, userId } = request.params || {};
  const channel = factoryHandler.getOne(Channel);
  const user = factoryHandler.getOne(User);
  // Remove ChannelId from User Object and UserId from Channel Object
  channel.usersPartOfChannel = channel.usersPartOfChannel.filter((currentUser) => currentUser._id !== userId)
  user.channelsUserBelongsTo = user.channelsUserBelongsTo.filter((currentChannel) => currentChannel._id !== channelId);
  factoryHandler.updateOne(channel);
  factoryHandler.updateOne(user);
};