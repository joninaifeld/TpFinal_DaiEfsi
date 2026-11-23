import { Router } from "express";
import reviewController from "../controllers/reviewController.js";

const router = Router();
router.use("/books", reviewController);

export default router;
