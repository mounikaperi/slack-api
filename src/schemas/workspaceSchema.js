const mongoose = require('mongoose');
const { WORKSPACE_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');
const Channel = require('../models/channelModel');

exports.workspaceSchema = new mongoose.Schema({
  workspaceUrl: {
    type: String,
    description: "This url is required to login to the workspace",
    required: [true, WORKSPACE_SCHEMA_VALIDATION_ERRORS.URL],
    unique: true
  },
  workspaceName: {
    type: String,
    description: "This field gives the name of the workspace",
    required: [true, WORKSPACE_SCHEMA_VALIDATION_ERRORS.NAME],
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: [true, WORKSPACE_SCHEMA_VALIDATION_ERRORS.CREATED_BY]
  },
  channels: {
    type: [mongoose.Schema.ObjectId],
    ref: Channel
  }
});