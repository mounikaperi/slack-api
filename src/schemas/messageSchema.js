const mongoose = require('mongoose');

exports.messageSchema = new mongoose.Schema({
  userWhoSentTheMessage: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    description: 'The user who has sent/recieved the message'
  },
  message: {
    type: String,
    description: 'The actual message sent/received by the user'
  },
  filesUploadedInMessage: [], // Revisit
  createdDate: {
    type: Date,
    description: 'The DateTime when message was sent/received'
  },
  updatedDate: {
    type: Date,
    description: 'The DateTime when message was lastModified'
  }
});