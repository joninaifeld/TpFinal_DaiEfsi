import { Router } from "express";
import authRouter from "../controllers/authController.js";

const router = Router();

router.use("/auth", authRouter);

export default router;