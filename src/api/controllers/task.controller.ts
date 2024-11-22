import Task, {
  getDetailResponse,
  taskDocument,
  verifyResponse,
} from "../../models/TaskModel";
import { Types } from "mongoose";

export class taskController {
  // create task
  async taskDetail(body: taskDocument): Promise<verifyResponse> {
    const { title, description, email } = body;
    const checkTask = await Task.findOne({ title, email });
    if (checkTask) {
      throw {
        code: 403,
        message: "task is already exist",
      };
    }
    console.log("task");

    const newTask: taskDocument = new Task({
      title,
      description,
      email,
    });

    await newTask.save();
    return {
      code: 200,
      message: "Task save successfully",
    };
  }

  // get task detail
  async getTaskDetail(): Promise<getDetailResponse> {
    const result = await Task.find();

    return {
      code: 200,
      data: result,
    };
  }

  // edit task details
  async editTaskDetails(body): Promise<verifyResponse> {
    const { title, description, id } = body;
    if (!id) {
      throw {
        code: 403,
        message: "id not found",
      };
    }

    await Task.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          title,
          description,
        },
      }
    );
    return {
      code: 200,
      message: "Data updated successfully",
    };
  }

  // delete task
  async deleteTask(id) {
    if (!id)
      throw {
        code: 403,
        message: "id not found",
      };
    await Task.findOneAndDelete({ _id: new Types.ObjectId(id) });

    return {
      code: 200,
      message: "Task deleted successfully",
    };
  }
}
