import { env } from './env.config';
import { openai, CHAT_MODEL_PARAMS } from './openai.config';
import { connectDB, disconnectDB } from './db.config';

// Export all configuration from one place
export const config = {
  // Server config
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  
  // Database config
  MONGODB_URI: env.MONGODB_URI,
  MONGODB_URI_TEST: env.MONGODB_URI_TEST,
  
  // JWT config
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
  
  // OpenAI config
  OPENAI_API_KEY: env.OPENAI_API_KEY,
  
  // Logging config
  LOG_LEVEL: env.LOG_LEVEL,
  
  // Rate limiting config
  RATE_LIMIT_WINDOW_MS: env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: env.RATE_LIMIT_MAX,
};

export {
  connectDB,
  disconnectDB,
  openai,
  CHAT_MODEL_PARAMS,
};