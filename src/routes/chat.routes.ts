import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { validateRequest } from '../utils/validators';
import { chatMessageSchema, sessionParamSchema } from '../types/chat.types';

const router = Router();

/**
 * @route   POST /api/v1/chat
 * @desc    Send a message to the chatbot and get a response
 * @access  Public
 */
router.post(
  '/',
  validateRequest(chatMessageSchema),
  chatController.sendMessage
);

/**
 * @route   GET /api/v1/chat/:sessionId
 * @desc    Get chat history for a specific session
 * @access  Public
 */
router.get(
  '/:sessionId',
  validateRequest(sessionParamSchema),
  chatController.getChatHistory
);

/**
 * @route   POST /api/v1/chat/session
 * @desc    Create a new chat session
 * @access  Public
 */
router.post(
  '/session',
  chatController.createNewSession
);

/**
 * @route   DELETE /api/v1/chat/:sessionId
 * @desc    Delete a chat session
 * @access  Public
 */
router.delete(
  '/:sessionId',
  validateRequest(sessionParamSchema),
  chatController.deleteSession
);

export default router;