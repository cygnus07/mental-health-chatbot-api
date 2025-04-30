import OpenAI from 'openai';
import { env } from './env.config.js';

// Initialize OpenAI client with API key from environment
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Common parameters for mental health chat model
export const CHAT_MODEL_PARAMS = {
  model: 'gpt-4-turbo', // Default model (can be changed to another model if needed)
  temperature: 0.7, // Controls randomness: 0 is deterministic, 1 is creative
  max_tokens: 1000, // Maximum tokens to generate
  top_p: 0.95, // Controls diversity via nucleus sampling
  frequency_penalty: 0.5, // Reduces verbatim repetition
  presence_penalty: 0.5, // Encourages talking about new topics
  // Safety system message can be appended to the system message in chat.service.ts
  system_message: `You are a supportive mental health assistant. 
    Provide empathetic, helpful responses to users seeking emotional support or advice.
    Never claim to be a licensed therapist or medical professional.
    Encourage users to seek professional help for serious mental health issues.
    Focus on active listening, validation, and positive coping strategies.
    Maintain privacy and confidentiality in all conversations.
    If a user expresses thoughts of self-harm or harm to others, provide crisis resources.`
};