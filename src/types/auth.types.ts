// src/types/auth.ts
export interface IUser {
  email: string;
  name: string;
  password?: string;
  provider: "local" | "google" | "github";
  changePassword: string;
  providerId?: string;
  avatar?: string;
  verified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<IUser, "password" | "verificationToken" | "resetPasswordToken">;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}
