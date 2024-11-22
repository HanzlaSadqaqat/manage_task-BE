declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      SMTP_FROM: string;
      SMTP_PORT: string;
      SMTP_SECURE: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SESSION_SECRET: string;
      FRONTEND_URL: string;
      SECRET: string;
      CLIENT_SECRET;
      MONGO_URI: string;
      PORT: string;
    }
  }
}
export {};
