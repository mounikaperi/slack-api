const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS, USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.createSignInMagicalCode = catchAsync(async (request, response, next) => {
  // Step-1 First Create a user object with entered email
  if (!request.body.email && !request.body.fullName) {
    return next(
      new AppError(USER_SCHEMA_VALIDATION_ERRORS.EMAIL_NOT_PRESENT),
      HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
    );
  }
  const newUser = await User.create({
    fullName: request.body.fullName,
    email: request.body.email
  });
  // Step-2 Create confirmationCode valid for 10 mins
  const confirmationCode = newUser.createSignUpConfirmationCode();
  await newUser.save({ validateBeforeSave: false });
  const message = `
  Your confirmation code is below- enter it in your open browser window and we'll help you get signed in.
  ${confirmationCode}
  If you didn't request this email, there's nothing to worry about - you can safely ignore it.
  `;
  // Step-3 Send the confirmationCode to email
  try {
    await sendEmail({
      email: newUser.email,
      subject: `Slack Confirmation Code`,
      message
    });
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      data: { confirmationCode },
      message: 'Confirmation code sent to email!'
    });
  } catch (error) {
    newUser.signUpConfirmationToken = undefined;
    newUser.signUpCodeExpiresIn = undefined;
    await newUser.save({ validateBeforeSave: false });
    return next(
      new AppError(USER_SCHEMA_VALIDATION_ERRORS.EMAIL_NOT_SENT),
      HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
    );
  }
});

exports.signInWithMagicalCode = catchAsync(async (request, response, next) => {
  // Get user based on confirmationCode
  const user = await User.findOne({
    signUpConfirmationToken: request.params.code,
    signUpCodeExpiresIn: { $gt: Date.now() }
  });
  // If the code hasn't expired and the user is present, allow to welcome screen of slack-web
  if (!user) {
    return next(
      new AppError(USER_SCHEMA_VALIDATION_ERRORS.EXPIRED_CONFIRMATION_CODE),
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    );
  }
  user.signUpConfirmationToken = undefined;
  user.signUpCodeExpiresIn = undefined;
  await user.save();
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    message: 'You are now signed up to Slack'
  });
});