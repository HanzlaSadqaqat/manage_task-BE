import mongoose, { Document, Model } from "mongoose";

const schema = mongoose.Schema;
export interface taskDocument extends Document {
  title: string;
  description: string;
  email: string;
}

export interface taskUpdate {
  title: string;
  description: string;
  id: string;
}
export interface verifyResponse {
  code: number;
  message: string;
}
// export interface sendData {
//   title: string;
//   description: string;
//   email: string;
//   id: string;
// }
export interface getDetailResponse {
  code: number;
  data: taskDocument[] | null;
}

export interface errorResponse extends verifyResponse {}
const TaskSchema = new schema<taskDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
});

const Task: Model<taskDocument> = mongoose.model<taskDocument>(
  "Task",
  TaskSchema
);
export default Task;
