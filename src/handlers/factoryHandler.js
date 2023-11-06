const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { COMMON_MODEL_ERRORS, HTTP_STATUS_CODES, HTTP_STATUS, USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.getOne = (Model, options) =>
  catchAsync(async (request, response, next) => {
    if( !mongoose.Types.ObjectId.isValid(request.params.id) ) {
      return next(
        new AppError(
          USER_SCHEMA_VALIDATION_ERRORS.INVALID_ID,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
        ),
      );
    }
    console.log('Entered getOne');
    let query = Model.findById(request.params.id);
    if (options) query = query.populate(options);
    const returnedDocument = await query;
    if (!returnedDocument) {
      return next(
        new AppError(
          COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND,
        ),
      );
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      data: returnedDocument,
    });
  });