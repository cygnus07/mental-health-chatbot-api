import { Router } from 'express';
import chatRoutes from './chat.routes';
// import userRoutes from './user.routes';

const router = Router();

// API documentation endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Mental Health Chatbot API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/v1/chat',
      users: '/api/v1/users',
    },
  });
});

// Mount route modules
router.use('/chat', chatRoutes);
// router.use('/users', userRoutes);

export default router;