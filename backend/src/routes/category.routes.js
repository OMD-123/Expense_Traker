import { Router } from "express";
import { createCategory, getCategories } from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getCategories);
router.post("/", createCategory);

export default router;
