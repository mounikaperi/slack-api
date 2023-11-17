const mongoose = require('mongoose');
const { WORKSPACE_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

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
    ref: 'User',
    required: [true, WORKSPACE_SCHEMA_VALIDATION_ERRORS.CREATED_BY],
    description: "The user/admin who created the workspace"
  },
  channels: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    description: "List of all the channels that are part of the Workspace"
  }],
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    description: "All the users that are part of the workspace"
  }]
});