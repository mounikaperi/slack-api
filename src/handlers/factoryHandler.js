const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/APIFeatures');
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

exports.getAll = (Model) => {
  catchAsync (async(request, response, next) => {
    let filter = {};
    if (request.params.workspaceId) {
      filter = {
        workspace: request.params.workspaceId
      };
    }
    const features = new APIFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      results: document.length,
      data: {
        data: document
      }
    })
  });
};

exports.createOne = (Model) => {
  catchAsync(async (request, response, next) => {
    const document = await Model.create(request.body);
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        data: document
      }
    });
  });
};

exports.updateOne = (Model) => {
  catchAsync (async(request, response, next) => {
    const document = await Model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    });
    if (!document) {
      return next(new AppError(
        COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND
      ));
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        data: document
      }
    });
  });
};

exports.deleteOne = (Model) => {
  catchAsync (async(request, response, next) => {
    const document = await Model.findByIdAndDelete(request.params.id);
    if (!document) {
      return next(new AppError(
        COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND
      ));
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.NO_CONTENT).json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        data: document
      }
    });
  });
}