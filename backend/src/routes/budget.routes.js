import { Router } from "express";
import { getBudget, setBudget } from "../controllers/budget.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getBudget);
router.post("/", setBudget);

export default router;
