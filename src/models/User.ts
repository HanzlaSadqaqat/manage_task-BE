import mongoose, { Document, Model } from "mongoose";

let schema = mongoose.Schema;

export interface userDocument extends Document {
  name: string;
  email: string;
  password: string;
  changePassword: string;
}
export interface SignupPayload extends userDocument {}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface verifyResponse {
  code: number;
  message: string;
}

const userSchema = new schema<userDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User: Model<userDocument> = mongoose.model<userDocument>(
  "User",
  userSchema
);

export default User;
