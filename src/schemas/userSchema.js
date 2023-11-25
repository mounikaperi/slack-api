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
  title: {
    type: String,
    description: "The user's title."
  },
  signUpConfirmationToken: {
    type: String,
    description: "This is the confirmationCode sent to email while signing up"
  },
  signUpCodeExpiresIn: {
    type: Date,
    description: "This specifies the time by which the confirmationCode will expire in"
  },
  passwordResetToken: {
    type: String,
    description: "This is the resetToken sent while resetting the password"
  },
  passwordResetExpires: {
    type: Date,
    description: "This is the time by which the resetToken sent for resetting the password will expire"
  },
  password: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.PASSWORD_NOT_PROVIDED],
    minLength: 8,
    select: false,
    validate: [validator.isStrongPassword, USER_SCHEMA_VALIDATION_ERRORS.VALID_PASSWORD],
    description: "The password of the user that will be used to login"
  },
  passwordConfirm: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.PASSWORD_CONFIRMATION_REQUIRED],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: USER_SCHEMA_VALIDATION_ERRORS.PASSWORD_MISMATCH
    },
    description: "password and passwordConfirm should always be the same"
  },
  passwordChangedAt: {
    type: Date,
    description: 'The date and time when password was changed'
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
    description: "The user is valid and isnt't deleted from the database"
  },
  workspaces: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Workspace',
    description: "The ID of the workspace user belongs to. User can be part of multiple workspaces"
  }],
  channelsUserBelongsTo: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    description: "The channels where the user is part of and the permissions of the user in the channel. For Eg: can only read messages from channel or can read and post messages as well"
  }],
  messagesToOneself: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Message',
    description: 'This is an array of all the messages that are sent to a specific channel'
  }],
  messagesToOtherUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
});