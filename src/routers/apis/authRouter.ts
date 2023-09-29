import express, { Request, Response } from "express";
import { AuthController } from "../../controllers/auth";
import { verifyResponse } from "../../models/User";
import { loginValidation, signUpValidation } from "../../utils/authValidation";

const authRouter = express.Router();
const controller = new AuthController();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { error, value: body } = signUpValidation(req.body);
    if (error) return res.status(403).send(error.details[0].message);

    const response: verifyResponse = await controller.signup(body);

    return res.status(response.code).send(response.message);
  } catch (err) {
    return res.status(err.code || 403).send(err.message);
  }
});
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    let { error, value: body } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let response: verifyResponse = await controller.login(body);
    return res.status(response.code).send(response.message);
  } catch (err) {
    return res.status(err.code || 403).send(err.message);
  }
});

export default authRouter;
