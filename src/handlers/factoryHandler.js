const catchAsync = require('../utils/commonUtils');
const { COMMON_MODEL_ERRORS, HTTP_STATUS_CODES, HTTP_STATUS } = require('../utils/constants');

exports.getOne = (Model, options) => {
  catchAsync(async (request, response, next) => {
    let query = Model.findbyId(request.params.id);
    if (options) query = query.populate(options);
    const returnedDocument = await query;
    if (!returnedDocument) {
      return next(new AppError(
        COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND
      ))
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.NO_CONTENT).json({
      status: HTTP_STATUS.SUCCESS,
      data: null
    })
  })
};
