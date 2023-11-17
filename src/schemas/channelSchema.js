const mongoose = require('mongoose');
const validator = require('validator');
const { CHANNEL_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');
const User = require('../models/userModel');

exports.channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    description: "This field describes the channel name",
    required: [true, CHANNEL_SCHEMA_VALIDATION_ERRORS.URL],
    unique: true
  },
  channelTopic: {
    type: String,
    description: 'Let people know what #channelName is focused on right now (ex. a project milestone). Topics are always visible in the header.'
  },
  channelDescription: {
    type: String,
    description: 'Let people know what this channel is for.'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, CHANNEL_SCHEMA_VALIDATION_ERRORS.CREATED_BY],
    descripton: "Specifies the User who has created the channel"
  },
  isPublic: {
    type: Boolean,
    default: true,
    description: 'The channel can be public or private. Private channels are specfic to the workspace. This attribute specifies if the channel is public or private'
  },
  // UploadedFiles: [] TODO:
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
    description: 'Specifies all the users that are part of this channel'
  }],
  workspaces: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Workspace',
    required: function () {
      return !this.isPublic; // Make workspace required only if the channel is not public
    },
    message: CHANNEL_SCHEMA_VALIDATION_ERRORS.WORKSPACE_NEEDED,
    description: 'Specifies all the workspaces that own this channel. Public channels are visible to all workspaces. Private channels are specific to the workspace where it is created'
  }],
  messages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Message',
    description: 'Contains all the messages that are sent as part of this channel'
  }]
});