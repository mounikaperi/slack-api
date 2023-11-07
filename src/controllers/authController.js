const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS, USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

// This route allows user to sign up to create a new workspace. 
// A passcode will be sent to email
// User has to read the code from email enter then he will be allowed to create a workspace
exports.signUpWithMagicalCode = catchAsync(async (request, response, next) => {
  // First Create a user object with entered email
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
  // Create reset token valid for 10 mins
  const confirmationCode = newUser.createSignUpConfirmationCode();
  await newUser.save({ validateBeforeSave: false });
  // send it to user's email
  const message = `
  Your confirmation code is below- enter it in your open browser window and we'll help you get signed in.
  ${confirmationCode}
  If you didn't request this email, there's nothing to worry about - you can safely ignore it.
  `;
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
