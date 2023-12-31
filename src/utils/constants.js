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
  INVALID_ID: '_id doessnt match type of ObjectId. Please input proper _id'
};

exports.USER_SCHEMA_VALIDATION_ERRORS = {
  VALID_EMAIL: 'The email address specified is not valid. Email cannot contain spaces and must have an @ and domain',
  VALID_PASSWORD: 'The password specified is not valid. Password should contain minimum of 8 chars, atleast 1 lowercase, 1 uppercase, 1 number and 1 symbol',
  EMAIL: 'Email address is required',
  FULL_NAME: 'Full name is mandatory',
  INVALID_PRONOUN: 'Invalid pronoun choosen',
  EMAIL_NOT_SENT: 'There was an error sending the email. Try again later!',
  EMAIL_NOT_PRESENT: 'Please provide user email address to signup',
  EXPIRED_CONFIRMATION_CODE: 'Confirmation Code is invalid or has expired',
  EXPIRED_RESET_TOKEN: 'Reset Token is invalid or has expired',
  EMAIL_PASSWORD_NOT_PROVIDED: 'Email or password cannot be blank. Please provide valid email and password',
  PASSWORD_NOT_PROVIDED: 'Please provide password',
  PASSWORD_CONFIRMATION_REQUIRED: 'Please confirm your password',
  PASSWORD_MISMATCH: 'Entered password and confirmPassword aren\'t same',
  LOGIN_PASSWORD_MISMATCH: 'Entered password is invalid. Please enter valid password',
  USER_NOT_PRESENT: 'The entered user email address isn\'t present in the records. Please signup',
  NOT_LOGGED_IN: 'You are not logged in! Please log in to get access',
  USER_WITH_TOKEN_NOT_PRESENT: 'The user belonging to this token does no longer exist.',
  PASSWORD_CHANGED_RECENTLY: 'User recently changed password! Please log in again.',
  UNAUTHORIZED: 'You are unauthorized to perform this action',
  PERMISSION_NOT_ALLOWED: 'User is not having permissions to perform this operation'
};

exports.WORKSPACE_SCHEMA_VALIDATION_ERRORS = {
  URL: 'Workspace Url cannot be empty',
  NAME: 'Workspace Name cannot be empty',
  CREATED_BY: 'Workspace is createdBy username is mandatory',
  WORKSPACE_NOT_FOUND: 'The workspace doesnt exists. Please create one'
};

exports.CHANNEL_SCHEMA_VALIDATION_ERRORS = {
  NAME: 'Channel Name cannot be empty',
  CREATED_BY: 'CreatedBy is required for the channel creation',
  WORKSPACE_NEEDED: 'Workspace is required for non-public channels',
  CHANNEL_NOT_EXISTS: 'The Channel is deleted or not created in the workspace.',
  CHANNEL_TYPE_NEEDED: 'Specify if Channel is public or private'
};
