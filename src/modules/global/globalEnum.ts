export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  NO_CONTENT = 204,
}

export enum HttpMessage {
  OK = 'Request succeeded.',
  CREATED = 'Resource successfully created.',
  BAD_REQUEST = 'Bad request. Please check the input data.',
  NOT_FOUND = 'Resource not found.',
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  BAD_GATEWAY = 'Bad gateway. Server error.',
  NO_CONTENT = 'Delete success, no user founded.',
}