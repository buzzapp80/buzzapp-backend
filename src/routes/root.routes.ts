import { Router } from "express";
import { getWelcomeMessage } from "../controllers/root.controller.js";

const router = Router();

router.get("/", getWelcomeMessage);

export { router as rootRouter };
