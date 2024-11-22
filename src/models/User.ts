import mongoose, { Document, Model } from "mongoose";
import { IUser } from "src/types/auth.types";
import bcrypt from "bcrypt";

let schema = mongoose.Schema;

export interface userDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface SignupPayload extends userDocument {}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface verifyResponse {
  code?: number;
  message?: string;
}

const userSchema = new schema<userDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  provider: {
    type: String,
    required: true,
    enum: ["google", "github", "local"],
  },
  providerId: String,
  avatar: String,
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password!, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<userDocument> = mongoose.model<userDocument>(
  "User",
  userSchema
);

export default User;
