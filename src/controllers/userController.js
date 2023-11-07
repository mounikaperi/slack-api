const factoryHandler = require('../handlers/factoryHandler');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS } = require('../utils/constants');

exports.getUser = () => factoryHandler.getOne(User);

exports.createUser = catchAsync (async (request, response, next) => {
  const newUser = await User.create({
    title: request.body.title,
    fullName: request.body.fullName,
    displayName: request.body.displayName,
    statusText: request.body.statusText,
    statusEmoji: request.body.statusEmoji,
    statusExpiration: request.body.statusExpiration || 0,
    profilePicture: request.body.profilePicture,
    startDate: request.body.startDate,
    email: request.body.email,
    pronouns: request.body.pronouns
  })
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      profile: newUser
    }
  });

});