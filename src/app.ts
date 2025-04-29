import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { connectDB } from './config/db.config';
import router from './routes/index'

export const createApp = async (): Promise<Application> => {
  // 1. Initialize Express app
  const app: Application = express();

  // 2. Connect to Database
  try {
    logger.info('Connecting to database...');
    await connectDB();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // 3. Essential Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors());

  // 4. Rate Limiting
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        status: 'error',
        message: 'Too many requests'
      });
    }
  });
  app.use(limiter);

  // 5. Request Logging
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // // 6. Basic Routes (No imported routes)
  // app.get('/', (req: Request, res: Response) => {
  //   res.status(200).json({
  //     message: 'API Service',
  //     version: '1.0.0',
  //     dbStatus: 'Connected' // To verify DB connection
  //   });
  // });

  // app.get('/health', (req: Request, res: Response) => {
  //   res.status(200).json({
  //     status: 'ok',
  //     timestamp: new Date().toISOString(),
  //     environment: config.NODE_ENV,
  //     dbStatus: 'Connected'
  //   });
  // });

  app.use('/api/v1', router);

  // 7. 404 Handler
  app.use((req: Request, res: Response) => {
    logger.warn(`404 - Not Found: ${req.originalUrl}`);
    res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  });

  // 8. Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
    
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      ...(config.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    });
  });

  return app;
};