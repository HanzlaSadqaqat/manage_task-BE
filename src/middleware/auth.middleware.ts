import { Request, Response, NextFunction } from "express";
import { userDocument } from "src/models/User";

declare global {
  namespace Express {
    interface Request {
      user?: userDocument;
      isAuthenticated(): boolean; // Add this line
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  return next();
};

export const isVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.verified) {
    return res.status(403).json({
      success: false,
      message: "Email not verified",
    });
  }
  return next();
};
