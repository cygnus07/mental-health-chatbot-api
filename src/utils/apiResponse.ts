import { Response } from 'express';

/**
 * Standard API response interface
 */
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
  error?: {
    code?: number;
    details?: any;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Sends a success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Sends an error response
 */
export const sendError = (
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  errorDetails?: any
): void => {
  res.status(statusCode).json({
    status: 'error',
    message,
    error: {
      code: statusCode,
      details: errorDetails,
    },
  });
};

/**
 * Sends a paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  message: string = 'Success',
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};

/**
 * Sends a validation error response (400 Bad Request)
 */
export const sendValidationError = (
  res: Response,
  message: string = 'Validation Error',
  errors: any
): void => {
  sendError(res, message, 400, errors);
};

/**
 * Sends an unauthorized error response (401 Unauthorized)
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): void => {
  sendError(res, message, 401);
};

/**
 * Sends a forbidden error response (403 Forbidden)
 */
export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
): void => {
  sendError(res, message, 403);
};

/**
 * Sends a not found error response (404 Not Found)
 */
export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found'
): void => {
  sendError(res, message, 404);
};