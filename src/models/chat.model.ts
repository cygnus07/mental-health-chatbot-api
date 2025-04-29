import mongoose, { Document, Schema } from 'mongoose';

// Message role type definition
export type MessageRole = 'user' | 'assistant' | 'system';

// Interface for a chat message
export interface IMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Interface for a chat session
export interface IChatSession extends Document {
  sessionId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for individual messages
const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Schema for chat sessions
const ChatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ChatSessionSchema.index({ createdAt: 1 });
ChatSessionSchema.index({ updatedAt: 1 });

// Export the ChatSession model
export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);