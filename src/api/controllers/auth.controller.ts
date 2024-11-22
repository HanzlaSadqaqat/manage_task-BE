import { EmailService } from "../../services/emailService";
import { Request, Response } from "express";
import User, { userDocument } from "../../models/User";
// import bcrypt from "bcrypt";
import crypto from "crypto";
import { LoginDTO, RegisterDTO, ResetPasswordDTO } from "src/types/auth.types";
import { env } from "../../config/env";

const emailService = new EmailService();
export class AuthController {
  async signup(req: Request<{}, {}, RegisterDTO>) {
    try {
      const { email, password, name } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: "Email already registered",
        };
      }

      // Create verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create user
      const user = await User.create({
        email,
        password,
        name,
        provider: "local",
        verificationToken,
      });

      // Send verification email
      // await emailService.sendVerificationEmail(email, verificationToken);

      return {
        code: 200,
        success: true,
        data: user,
        message: "Registration successfull. Please verify your email.",
      };
    } catch (error) {
      console.log(error);
      throw {
        code: 500,
        success: false,
        error: error,
        message: "Registration failed",
      };
    }
  }

  async verifyEmail(req: Request) {
    try {
      const { token } = req.params;

      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return {
          success: false,
          message: "Invalid verification token",
        };
      }

      user.verified = true;
      user.verificationToken = undefined;
      await user.save();

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      return {
        code: 401,
        success: false,
        message: "Email verification failed",
      };
    }
  }

  async login(
    body: LoginDTO
    // & {
    //   login: (user: any, callback: (err: any) => void) => void;
    // }
  ) {
    try {
      const { email, password } = body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return {
          code: 401,
          success: false,
          message: "Invalid credentials",
        };
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return {
          code: 401,
          success: false,
          message: "Invalid credentials",
        };
      }

      // Check if email is verified
      // if (!user.verified) {
      //   return {
      //     code: 401,
      //     success: false,
      //     message: "Please verify your email first",
      //   };
      // }

      const userResponse = {
        success: false,
        code: 200,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          verified: user.verified,
          createdAt: user.createdAt,
        },
      };

      return {
        code: 200,
        success: true,
        message: "Login successful",
        user: userResponse,
      };
    } catch (error) {
      console.log(error);
      throw {
        code: 500,
        success: false,
        message: "Login failed",
        error: error,
      };
    }
  }

  async forgotPassword(req: Request) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email, provider: "local" });
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken);

      return {
        success: true,
        message: "Password reset email sent",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send reset email",
      };
    }
  }

  async resetPassword(req: Request<{}, {}, ResetPasswordDTO>) {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid or expired reset token",
        };
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return {
        success: true,
        message: "Password reset successful",
      };
    } catch (error) {
      return {
        success: false,
        message: "Password reset failed",
      };
    }
  }

  async oauthCallback(req: Request, res: Response) {
    try {
      // User will be attached to req by passport after successful OAuth
      if (!req.user) {
        return res.redirect(
          `${env.FRONTEND_URL}/login?error=Authentication failed`
        );
      }

      // Redirect to frontend with success
      res.redirect(`${env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect(`${env.FRONTEND_URL}/login?error=Authentication failed`);
    }
  }
}
