// Configure in .env as EXPO_PUBLIC_GROQ_API_KEY=your_key
export const GROQ_API_KEY =
  (process.env.EXPO_PUBLIC_GROQ_API_KEY ?? "").trim();

export const GROQ_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";
