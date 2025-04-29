import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle different types of errors
 */
const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

const handleZodError = (err: ZodError) => {
  const errors = err.errors.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
  
  const message = `Validation error. ${errors.map(e => `${e.path}: ${e.message}`).join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Send error response based on environment
 */
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Only send operational, trusted errors to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log programming or unknown errors
    logger.error('ERROR 💥', err);

    // Send generic message to client
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

/**
 * Global error handling middleware
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err } as AppError;
  error.message = err.message;
  error.stack = err.stack;

  if (!error.statusCode) error.statusCode = 500;
  if (!error.status) error.status = 'error';

  // Mongoose errors handling
  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
  if ((err as any).code === 11000) error = handleDuplicateFieldsDB(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
  // Zod validation errors
  if (err instanceof ZodError) error = handleZodError(err);

  // Send appropriate error response based on environment
  if (config.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};