const factoryHandler = require('../handlers/factoryHandler');
const catchAsync = require('../utils/catchAsync');
const { HTTP_STATUS_CODES, HTTP_STATUS, WORKSPACE_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');
const Workspace = require('../models/workspaceModel');
const AppError = require('../utils/AppError');

exports.getWorkspace = async (request, response, next) => {
  const workspace = await Workspace.find({workspaceUrl: request.params.workspaceUrl});
  if (!workspace) {
    return next(
      new AppError(
        WORKSPACE_SCHEMA_VALIDATION_ERRORS.WORKSPACE_NOT_FOUND,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
      ),
    );
  }
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      workspace
    }
  });
};

exports.createChannel = catchAsync (async (request, response, next) => {
  const newWorkspace = await Workspace.create({
    workspaceUrl: request.body.workspaceUrl
  })
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      workspace: newWorkspace
    }
  });
});

exports.leaveChannel = {};