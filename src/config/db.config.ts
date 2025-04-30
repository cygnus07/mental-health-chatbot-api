import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../utils/logger.js';

// MongoDB connection options
const mongooseOptions: mongoose.ConnectOptions = {
  // Connection retry options
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // How long the MongoDB driver will wait before timing out a socket operation
};

/**
 * Connects to MongoDB with provided configuration
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Select URI based on environment
    // const dbURI = env.NODE_ENV === 'test' && env.MONGODB_URI_TEST
    //   ? env.MONGODB_URI_TEST
    //   : env.MONGODB_URI;
    const dbURI = env.MONGODB_URI;

    // Connect to MongoDB
    const conn = await mongoose.connect(dbURI, mongooseOptions);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    const err = error as Error;
    logger.error(`Error disconnecting from MongoDB: ${err.message}`);
  }
};