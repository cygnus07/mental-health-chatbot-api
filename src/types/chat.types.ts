import { z } from 'zod';

/**
 * Validation schema for chat message requests
 */
export const chatMessageSchema = z.object({
  body: z.object({
    message: z.string()
      .min(1, 'Message cannot be empty')
      .max(1000, 'Message is too long (max 1000 characters)'),
    sessionId: z.string().uuid().optional(),
  }),
});

/**
 * Type for chat message request
 */
export type ChatMessageRequest = z.infer<typeof chatMessageSchema>['body'];

/**
 * Validation schema for session ID in route params
 */
export const sessionParamSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid('Invalid session ID format'),
  }),
});

/**
 * Type for session param request
 */
export type SessionParamRequest = z.infer<typeof sessionParamSchema>['params'];

/**
 * Chat message response type
 */
export interface ChatMessageResponse {
  sessionId: string;
  message: string;
  response: string;
  timestamp: Date;
}

/**
 * Chat history entry type
 */
export interface ChatHistoryEntry {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}