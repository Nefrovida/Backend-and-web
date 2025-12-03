/**
 * Custom error class for unauthorized access (401)
 */
export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

/**
 * Custom error class for forbidden access (403)
 */
export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string = 'Forbidden: Insufficient privileges') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

/**
 * Custom error class for bad requests (400)
 */
export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

/**
 * Custom error class for not found (404)
 */
export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Custom error class for conflict (409)
 */
export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string = 'Resource already exists') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}
