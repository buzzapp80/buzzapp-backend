import { Router } from "express";
import { rootRouter } from "./root.routes.js";
import { authRouter } from "./auth.route.js";

const router = Router();

router.use("/", rootRouter);
router.use("/auth", authRouter);

export { router };
