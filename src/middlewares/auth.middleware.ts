import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface AuthPayload {
  id: string;
  role: string;
  is_verified: boolean;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    // Attach user info to the request for use in controllers
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};

// Role-based helper
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      res.status(403);
      return next(
        new Error("You do not have permission to perform this action"),
      );
    }
    next();
  };
};

// Verified account checker
export const isVerified = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user || !user.is_verified) {
    res.status(403);
    return next(
      new Error("Access restricted. Please verify your account first."),
    );
  }

  next();
};
