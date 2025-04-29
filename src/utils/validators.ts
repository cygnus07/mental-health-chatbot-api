import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendValidationError } from './apiResponse';

/**
 * Middleware for validating request data against a Zod schema
 * @param schema Zod schema for validation
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // If validation passes, continue
      return next();
    } catch (error) {
      // If validation fails, send formatted error response
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        return sendValidationError(res, 'Validation failed', formattedErrors);
      }
      
      // For other errors, pass to next error handler
      return next(error);
    }
  };
};

/**
 * Common validation schemas
 */
export const commonValidators = {
  // Common validation patterns
  patterns: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  
  // Common error messages
  messages: {
    email: 'Please provide a valid email address',
    passwordStrength: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
    required: (field: string) => `${field} is required`,
    minLength: (field: string, length: number) => `${field} should be at least ${length} characters`,
    maxLength: (field: string, length: number) => `${field} should not exceed ${length} characters`,
  },
};