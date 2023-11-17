const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS, USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
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
  const user = await User.findOne({ email }).select('+password');
  if (!user.email && !user.password) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.USER_NOT_PRESENT,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    ));
  }
  const isPasswordValid = await user.comparePasswords(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.LOGIN_PASSWORD_MISMATCH,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    ));
  }
  createSendToken(user, HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK, response);
});

exports.forgotPassword = catchAsync(async (request, response, next) => {
  const user = await User.findOne({email: request.body.email});
  if (!user) {
    return next(
      new AppError(USER_SCHEMA_VALIDATION_ERRORS.USER_NOT_PRESENT),
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    );
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${request.protocol}://${request.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message
    });
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      token: resetToken,
      message: 'Token sent to email'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return next(
      new AppError(USER_SCHEMA_VALIDATION_ERRORS.EMAIL_NOT_SENT),
      HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
    );
  }
});

exports.resetPassword = catchAsync(async (request, response, next) => {
  const hashedToken = crypto.createHash('sha256').update(request.params.resetToken).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // If the token hasn't expired and user is present in db set the new password
  if (!user) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.EXPIRED_RESET_TOKEN,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST
    ));
  }
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  // Log the user in and send JWT
  createSendToken(user, HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK, response);
});

exports.logout = (request, response) => {
  response.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS
  });
};

exports.protect = catchAsync(async(request, response, next) => {
  // Get the token and check if it is there and valid
  let token;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.cookies.jwt) {
    token = request.cookies.jwt;
  }
  if (!token) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.NOT_LOGGED_IN,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED
    ))
  }
  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.USER_WITH_TOKEN_NOT_PRESENT,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED
    ))
  }
  // Check if the user changed password after the token has been issued
  if (currentUser.hasPasswordChangedAfterTokenIssued(decoded.iat)) {
    return next(new AppError(
      USER_SCHEMA_VALIDATION_ERRORS.PASSWORD_CHANGED_RECENTLY,
      HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED
    ))
  }
  request.user = currentUser;
  response.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (request, response, next) => {
  if (request.cookies.jwt) {
    try {
      const decodedToken = await promisify(jwt.verify)(request.cookies.jwt, process.env.JWT_SECRET);
      // Check if user still exists
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return next();
      }
      // Check if user changed password after the token was issued
      if (currentUser.hasPasswordChangedAfterTokenIssued(decoded.iat)) {
        return next();
      }
      // there is a logged in user
      response.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
}