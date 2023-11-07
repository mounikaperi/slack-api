const mongoose = require('mongoose');
const validator = require('validator');
const { USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    description: "The display name the user has choosen to identify themselves by in their workspace profile. Do not use this field as a unique identifier for a user, as it may change at any time. Instead, use id and team_id in concert."
  },
  email: {
    type: String,
    description: "A valid email address. It cannot have spaces, and it must have an @ and a domain. It cannot be in use by another member of the same team. Changing a user's email address will send an email to both the old and new addresses, and also post a slackbot message to the user informing them of the change. This field can only be changed by admins for users on paid teams.",
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.EMAIL],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, USER_SCHEMA_VALIDATION_ERRORS.VALID_EMAIL],
  },
  profilePicture: {
    type: String,
    description: "These various fields will contain https URLs that point to square ratio, web-viewable images (GIFs, JPEGs, or PNGs) that represent different sizes of a user's profile picture."
  },
  pronouns: {
    type: String,
    description: "The pronouns the user prefers to be addressed by.",
    enum: {
      values: ['she/her', 'he/him', 'they/them'],
      message: USER_SCHEMA_VALIDATION_ERRORS.INVALID_PRONOUN,
    },
  },
  fullName: {
    type: String,
    description: "The user's first and last name. Updating this field will update first_name and last_name. If only one name is provided, the value of last_name will be cleared.",
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.FULL_NAME]
  },
  startDate: {
    type: Date,
    description: "The date the person joined the organization."
  },
  statusEmoji: {
    type: String,
    description: "The displayed emoji that is enabled for the Slack team, such as :train:."
  },
  statusExpiration: {
    type: Number,
    description: "the Unix timestamp of when the status will expire. Providing 0 or omitting this field results in a custom status that will not expire.",
  },
  statusText: {
    type: String,
    description: "The displayed text of up to 100 characters. We strongly encourage brevity. See custom status for more info."
  },
  team: {
    type: String,
    description: "The ID of the workspace the user is in."
  },
  title: {
    type: String,
    description: "The user's title."
  },
  signUpConfirmationToken: {
    type: String
  },
  signUpCodeExpiresIn: {
    type: Date
  }
});