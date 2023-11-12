const mongoose = require('mongoose');
const validator = require('validator');
const { USER_SCHEMA_VALIDATION_ERRORS, WORKSPACE_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.workspaceSchema = new mongoose.Schema({
  workspaceUrl: {
    type: String,
    description: "This url is required to login to the workspace",
    required: [true, WORKSPACE_SCHEMA_VALIDATION_ERRORS.URL],
    unique: true
  }
});