import type { Request, Response } from "express";

export const getWelcomeMessage = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Buzzapp Backend API",
    version: "1.0.0",
    status: "Healthy",
  });
};
