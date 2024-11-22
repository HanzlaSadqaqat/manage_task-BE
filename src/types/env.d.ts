declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      SESSION_SECRET: string;
      FRONTEND_URL: string;
      SECRET: string;
      MONGO_URI: string;
      PORT: string;
    }
  }
}
export {};
