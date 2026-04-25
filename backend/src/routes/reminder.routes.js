import { Router } from "express";
import { createReminder, getReminders } from "../controllers/reminder.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getReminders);
router.post("/", createReminder);

export default router;
