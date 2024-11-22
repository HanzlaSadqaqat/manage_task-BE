import express from "express";
import taskRouter from "./task.routes";
import authRouter from "./auth.routes";

const router = express.Router();

router.use("/task", taskRouter);
router.use("/auth", authRouter);
export default router;
