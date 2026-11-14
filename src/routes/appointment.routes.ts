import { Router } from "express";
import { createAppointment, getDoctorAgenda, updateAppointmentStatus } from "../controllers/appointment.controller";
import { validateAppointment, validateAppointmentStatus } from "../middlewares/validate-appointment";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

router.post(
    "/appointments",
    verifyToken,
    authorize("RECEPCIONISTA"),
    validateAppointment, createAppointment
);

router.get(
    "/doctors/:id/appointments",
    verifyToken,
    authorize("MEDICO"),
    getDoctorAgenda
);

router.patch(
    "/appointments/:id/status",
    verifyToken,
    authorize("MEDICO"),
    validateAppointmentStatus,
    updateAppointmentStatus
);

export default router;