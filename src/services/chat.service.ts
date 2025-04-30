import { openai, CHAT_MODEL_PARAMS } from '../config/openai.config.js';
import { ChatSession, IMessage } from '../models/chat.model.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/error.middleware.js';
import { randomUUID } from 'crypto';
import { ChatCompletionMessageParam } from 'openai/resources';

/**
 * Service for handling chat interactions with OpenAI
 */
export class ChatService {
  /**
   * Process a user message and get response from OpenAI
   * @param sessionId Chat session ID (will be created if new)
   * @param message User's message
   * @returns AI assistant's response
   */
  public async processMessage(sessionId: string, message: string): Promise<string> {
    try {
      // Create a new session ID if not provided
      if (!sessionId) {
        sessionId = randomUUID();
      }

      // Retrieve or create chat session
      let chatSession = await ChatSession.findOne({ sessionId });
      
      if (!chatSession) {
        chatSession = new ChatSession({
          sessionId,
          messages: [],
        });
      }

      // Add user message to chat history
      const userMessage: IMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      
      chatSession.messages.push(userMessage);

      // Prepare conversation history for OpenAI
      const conversationHistory = this.prepareConversationHistory(chatSession.messages);
      
      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: CHAT_MODEL_PARAMS.model,
        messages: conversationHistory,
        temperature: CHAT_MODEL_PARAMS.temperature,
        max_tokens: CHAT_MODEL_PARAMS.max_tokens,
        top_p: CHAT_MODEL_PARAMS.top_p,
        frequency_penalty: CHAT_MODEL_PARAMS.frequency_penalty,
        presence_penalty: CHAT_MODEL_PARAMS.presence_penalty,
      });

      // Extract assistant response
      const assistantResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
      
      // Add assistant response to chat history
      const assistantMessage: IMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };
      
      chatSession.messages.push(assistantMessage);
      
      // Save updated chat session
      await chatSession.save();
      
      // Return assistant's response
      return assistantResponse;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error processing message: ${err.message}`, err);
      throw new AppError('Failed to process message', 500);
    }
  }

  /**
   * Get chat history for a session
   * @param sessionId Chat session ID
   * @returns Array of messages or null if session not found
   */
  public async getChatHistory(sessionId: string): Promise<IMessage[] | null> {
    try {
      const chatSession = await ChatSession.findOne({ sessionId });
      return chatSession?.messages || null;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error retrieving chat history: ${err.message}`, err);
      throw new AppError('Failed to retrieve chat history', 500);
    }
  }

  /**
   * Prepare conversation history for OpenAI API
   * @param messages Array of chat messages
   * @returns Formatted conversation history for OpenAI
   */
  private prepareConversationHistory(messages: IMessage[]): ChatCompletionMessageParam[] {
    // Add system message at the beginning
    const formattedMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: CHAT_MODEL_PARAMS.system_message,
      },
    ];
  
    // Add conversation history (limit to last 10 messages to save tokens)
    const recentMessages = messages.slice(-10);
    
    recentMessages.forEach((msg) => {
      formattedMessages.push({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      });
    });
  
    return formattedMessages;
  }

  /**
   * Create a new chat session
   * @returns New session ID
   */
  public async createNewSession(): Promise<string> {
    try {
      const sessionId = randomUUID();
      
      const chatSession = new ChatSession({
        sessionId,
        messages: [],
      });
      
      await chatSession.save();
      return sessionId;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating new session: ${err.message}`, err);
      throw new AppError('Failed to create new chat session', 500);
    }
  }

  /**
   * Delete a chat session
   * @param sessionId Chat session ID to delete
   * @returns Boolean indicating success
   */
  public async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const result = await ChatSession.deleteOne({ sessionId });
      return result.deletedCount > 0;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting session: ${err.message}`, err);
      throw new AppError('Failed to delete chat session', 500);
    }
  }
}

// Export a singleton instance
export const chatService = new ChatService();