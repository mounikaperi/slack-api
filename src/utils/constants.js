exports.HTTP_STATUS_CODES = {
  SUCCESSFUL_RESPONSE: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,
  },
  CLIENT_ERROR_RESPONSE: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
  },
  SERVER_ERROR_RESPONSE: {
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
  },
};

exports.HTTP_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
};

exports.HTTP_STATUS_MESSAGES = {
  [this.HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR]:
    'This route is not yet defined',
};

exports.COMMON_MODEL_ERRORS = {
  NO_DOCUMENT_FOUND: 'No document found with that ID',
};

exports.USER_SCHEMA_VALIDATION_ERRORS = {
  VALID_EMAIL: 'The email address specified is not valid. Email cannot contain spaces and must have an @ and domain',
  EMAIL: 'Email address is required',
  FIRST_NAME: 'First name is mandatory',
  LAST_NAME: 'Last name is mandatory',
  INVALID_PRONOUN: 'Invalid pronoun choosen',
  INVALID_ID: '_id doesnt match type of ObjectId. Please input proper _id'
}