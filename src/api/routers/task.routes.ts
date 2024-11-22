import express, { Response, Request, Router } from "express";
import { taskValidation, updateValidation } from "../../utils/taskValidation";
import { getDetailResponse, verifyResponse } from "../../models/TaskModel";
import { taskController } from "../controllers/task.controller";
const taskRouter = express.Router();
const controller = new taskController();

taskRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { error, value: body } = taskValidation(req.body);
    if (error) res.status(403).send(error.details[0].message);
    const response: verifyResponse = await controller.taskDetail(body);
    res.status(response.code).send(response.message);
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.message);
  }
});
taskRouter.get("/detail", async (_req: Request, res: Response) => {
  try {
    const response: getDetailResponse | null = await controller.getTaskDetail();

    res.status(response.code).send(response.data);
  } catch (error) {
    res.status(error.code || 403).send(error.message);
  }
});
taskRouter.patch("/update", async (req: Request, res: Response) => {
  try {
    const { error, value: body } = updateValidation(req.body);
    if (error) res.status(403).send(error.details[0].message);

    const response: verifyResponse = await controller.editTaskDetails(body);
    res.status(response.code).send(response.message);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});
taskRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: verifyResponse = await controller.deleteTask(id);
    res.status(response.code).send(response.message);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});
export default taskRouter;
