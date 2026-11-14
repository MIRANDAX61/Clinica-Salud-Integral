import { Router } from "express";
import {
  getAppointmentsBySpecialty,
  getDailyCutoff
} from "../controllers/report.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validateDailyCutoff } from "../middlewares/validate-report.js";

const router : Router = Router();

router.get(
  "/reports/appointments-by-specialty",
  verifyToken,
  authorize("GERENCIA"),
  getAppointmentsBySpecialty
);

router.get("/reports/daily-cutoff",
    verifyToken, authorize("GERENCIA"),
    validateDailyCutoff,
    getDailyCutoff
);

export default router;