const mongoose = require('mongoose');
const validator = require('validator');
const { CHANNEL_SCHEMA_VALIDATION_ERRORS, CHANNEL_TYPES } = require('../utils/constants');
const User = require('../models/userModel');

exports.channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    description: "This field describes the channel name",
    required: [true, CHANNEL_SCHEMA_VALIDATION_ERRORS.URL],
    unique: true
  },
  channelType: {
    type: String,
    enum: [CHANNEL_TYPES.PUBLIC, CHANNEL_TYPES.PRIVATE],
    default: CHANNEL_TYPES.PUBLIC
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
    ref: User,
    required: [true, CHANNEL_SCHEMA_VALIDATION_ERRORS.CREATED_BY]
  },
  // UploadedFiles: [] TODO:
  members: {
    type: [mongoose.Schema.ObjectId],
    ref: User
  },
  workspaces: {
    type: mongoose.Schema.ObjectId,
    red: Workspace,
    required: [true, CHANNEL_SCHEMA_VALIDATION_ERRORS.WORKSPACE_NEEDED]
  }
});