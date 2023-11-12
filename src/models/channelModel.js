const mongoose = require('mongoose');
const { channelSchema } = require('../schemas/channelSchema');

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;