import { createServer } from 'http';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';
import { config } from './config/index.js';

const startServer = async () => {
  try {
    // 1. Validate essential configuration
    if (!config.PORT || !config.MONGODB_URI) {
      throw new Error('Missing required configuration (PORT or MONGODB_URI)');
    }

    // 2. Create app (which handles DB connection)
    const app = await createApp();
    const server = createServer(app);

    // 3. Start server
    server.listen(config.PORT, "0.0.0.0", () => {
      logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      console.log(`Server ready: http://localhost:${config.PORT}`);
    });

    // 4. Server error handling
    server.on('error', (err: NodeJS.ErrnoException) => {
      logger.error('Server error:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });

      // Handle specific errors
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${config.PORT} is already in use`);
      }
      process.exit(1);
    });

    // 5. Graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('Fatal startup error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
};

// 6. Global error handlers
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION:', {
    message: err.message,
    stack: err.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error('UNHANDLED REJECTION:', {
    reason,
    promise
  });
  process.exit(1);
});

// 7. Start the application
startServer();