import { Router } from "express";
import { exportExcel, exportPdf } from "../controllers/export.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/pdf", exportPdf);
router.get("/excel", exportExcel);

export default router;
