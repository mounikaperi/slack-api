const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS, USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_TOKEN, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user, statusCode, response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'prod') {
    cookieOptions.secure = true;
  }
  response.cookie = ('jwt', token, cookieOptions);
  response.password = undefined; // Remove password from output
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    token,
    data: {
      user
    }
  });
};

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

exports.signUpWithEmailNPassword = catchAsync (async (request, response, next) => {
  // Password and confirmPassword should be validated at front end and should be sent as input while signingup
  const newUser = await User.create({
    fullName: request.body.fullName,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm
  })
  createSendToken(newUser, HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED, response);
});

exports.signInWithEmailNPassword = catchAsync(async (request, response, next) => {
  const { email, password } = request.body || {};
  if (!email && !password) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.EMAIL_PASSWORD_NOT_PROVIDED,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    ));
  }
  // Check if user still exists and is active and the entered password is correct
  const user = await User.findOne({ email }).select(+password);
  if (!user) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.USER_NOT_PRESENT,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    ));
  }
  const isPasswordValid = await user.comparePasswords(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.PASSWORD_MISMATCH,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    ));
  }
  createSendToken(user, HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK, response);
});