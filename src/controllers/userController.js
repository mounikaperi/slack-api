const factoryHandler = require('../handlers/factoryHandler');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS } = require('../utils/constants');

exports.getUser = () => factoryHandler.getOne(User);

exports.getAllUsers = () => factoryHandler.getAll(User);

exports.updateUser = () => factoryHandler.updateOne(User);

exports.deleteUser = () => factoryHandler.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.ERROR,
    message: 'This route is not defined! Please use /signup instead'
  });
};

