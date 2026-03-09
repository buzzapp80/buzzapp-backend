import { Router } from "express";
import { rootRouter } from "./root.routes.js";
import { authRouter } from "./auth.route.js";
import { profileRouter } from "./profile.route.js";

const router = Router();

router.use("/", rootRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);

export { router };
