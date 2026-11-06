import { Router } from "express";
import collectionController from "../controllers/collectionController.js";

const router = Router();
router.use("/colecciones", collectionController);

export default router;