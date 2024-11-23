import express, { Request, Response } from "express";
import { AuthController } from "./../controllers/auth.controller";
import { verifyResponse } from "../../models/User";
import { loginValidation, signUpValidation } from "../../utils/authValidation";
import passport from "passport";

const authRouter = express.Router();
const controller = new AuthController();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    // const { error, value: body } = signUpValidation(req.body);
    // if (error) return res.status(403).send(error.details[0].message);

    const response: verifyResponse = await controller.signup(req);

    res
      .status(response?.code || 200)
      .json({ message: response.message, success: true });
  } catch (err) {
    res
      .status(err.code || 403)
      .json({ error: err.error, message: err.message, success: false });
  }
});
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    let { error, value: body } = loginValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);
    let response: verifyResponse = await controller.login(body);
    // console.log("response", response);

    res
      .status(response?.code || 403)
      .json({ sucess: true, message: response.message });
  } catch (err) {
    // console.log("error", err);
    res.status(err.code || 403).send(err.message);
  }
});
// authRouter.post("/google/callback", async (req: Request, res: Response) => {
//   try {
//     let response: verifyResponse = await controller.login(req.body);
//     return res.status(response?.code || 403).send(response.message);
//   } catch (err) {
//     return res.status(err.code || 403).send(err.message);
//   }
// });
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    let response: verifyResponse = await controller.forgotPassword(req);
    res.status(response?.code || 403).send(response.message);
  } catch (err) {
    res.status(err.code || 403).send(err.message);
  }
});
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    let response: verifyResponse = await controller.resetPassword(req);
    res.status(response?.code || 403).send(response.message);
  } catch (err) {
    res.status(err.code || 403).send(err.message);
  }
});
authRouter.post("/verify-email/:token", async (req: Request, res: Response) => {
  try {
    let response: verifyResponse = await controller.verifyEmail(req);
    res.status(response?.code || 403).send(response.message);
  } catch (err) {
    res.status(err.code || 403).send(err.message);
  }
});

// Google auth routes
authRouter.get("/auth/google", passport.authenticate("google"));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect:
      `${process.env.FRONTEND_URL}` || "http://localhost:3000/api",
    scope: ["profile", "email"],
    failureRedirect: "/login",
  }),
  controller.oauthCallback
);

// GitHub auth routes
authRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect:
      `${process.env.FRONTEND_URL}` || "http://localhost:3000/api",
    failureRedirect: "/login",
  }),
  controller.oauthCallback
);

export default authRouter;
