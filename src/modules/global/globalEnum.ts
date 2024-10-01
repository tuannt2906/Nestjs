export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  NO_CONTENT = 204,
  FORBIDDEN = 403,
  UNAUTHORIZED = 401,
}

export enum HttpMessage {
  OK = 'Request succeeded.',
  CREATED = 'Resource successfully created.',
  BAD_REQUEST = 'Bad request. Please check the input data.',
  NOT_FOUND = 'Resource not found.',
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  BAD_GATEWAY = 'Bad gateway. Server error.',
  NO_CONTENT = 'Request succeeded, no content.',
  FORBIDDEN = 'Access denied. You do not have permission to access this resource.',
  UNAUTHORIZED = 'Authentication required. Please log in.',
}
