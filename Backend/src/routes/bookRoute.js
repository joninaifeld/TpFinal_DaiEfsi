import { Router } from "express";
import bookController from "../controllers/bookController.js";

const router = Router();
router.use("/books", bookController);

export default router;