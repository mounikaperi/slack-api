const mongoose = require('mongoose');

exports.messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    description: 'The user who has sent/recieved the message directly one to one'
  },
  message: {
    type: String,
    description: 'The actual message sent/received by the user'
  },
  createdDate: {
    type: Date,
    description: 'The DateTime when message was sent/received'
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    descripton: 'Message that is been posted in the channel'
  }
});