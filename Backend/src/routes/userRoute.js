import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();
router.use("/usuarios", userController);

export default router;