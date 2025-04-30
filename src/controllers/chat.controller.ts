import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service.js';
import { sendSuccess, sendNotFound } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/error.middleware.js';
import { ChatMessageRequest, SessionParamRequest } from '../types/chat.types.js';

/**
 * Chat controller for handling chat-related requests
 */
export class ChatController {
  /**
   * Send a message to the chatbot and get a response
   */
  public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, sessionId } = req.body as ChatMessageRequest;
      
      // Handle session ID - create new one if not provided or invalid
      let currentSessionId = sessionId;
      
      // If sessionId was provided, verify it exists
      if (currentSessionId) {
        const history = await chatService.getChatHistory(currentSessionId);
        if (!history) {
          // Invalid sessionId provided, create a new one
          currentSessionId = await chatService.createNewSession();
        }
      } else {
        // No sessionId provided, create new session
        currentSessionId = await chatService.createNewSession();
      }
      
      // Now we're sure currentSessionId is a valid string
      const botResponse = await chatService.processMessage(currentSessionId, message);
      
      // Send successful response
      sendSuccess(res, {
        sessionId: currentSessionId,
        message,
        response: botResponse,
        timestamp: new Date(),
      }, 'Message processed successfully');
      
    } catch (error) {
      logger.error('Error in sendMessage controller:', error);
      next(error);
    }
}

  /**
   * Get chat history for a specific session
   */
  public async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as SessionParamRequest;
      
      // Get chat history
      const chatHistory = await chatService.getChatHistory(sessionId);
      
      if (!chatHistory) {
        return sendNotFound(res, `Chat session with ID ${sessionId} not found`);
      }
      
      // Send successful response
      sendSuccess(res, chatHistory, 'Chat history retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getChatHistory controller:', error);
      next(error);
    }
  }

  /**
   * Create a new chat session
   */
  public async createNewSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Create new session
      const sessionId = await chatService.createNewSession();
      
      // Send successful response
      sendSuccess(res, { sessionId }, 'New chat session created successfully', 201);
      
    } catch (error) {
      logger.error('Error in createNewSession controller:', error);
      next(error);
    }
  }

  /**
   * Delete a chat session
   */
  public async deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params as SessionParamRequest;
      
      // Delete session
      const deleted = await chatService.deleteSession(sessionId);
      
      if (!deleted) {
        return sendNotFound(res, `Chat session with ID ${sessionId} not found`);
      }
      
      // Send successful response
      sendSuccess(res, { sessionId, deleted }, 'Chat session deleted successfully');
      
    } catch (error) {
      logger.error('Error in deleteSession controller:', error);
      next(error);
    }
  }
}

// Export a singleton instance
export const chatController = new ChatController();