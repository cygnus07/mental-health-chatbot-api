import { Router } from 'express';
import chatRoutes from './chat.routes.js'

const router = Router();

// API documentation endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Mental Health Chatbot API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/v1/chat',
    },
  });
});

// Mount route modules
router.use('/chat', chatRoutes);

export { router as default };
