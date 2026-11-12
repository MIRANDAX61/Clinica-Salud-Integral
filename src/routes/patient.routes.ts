import { Router } from "express";
import { createPatient, getPatientById, getPatients } from "../controllers/patient.controller";
import { validatePatient } from "../middlewares/validate-patient";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router : Router = Router();

router.get(
    "/patients",
    verifyToken,
    authorize("RECEPCIONISTA"),
     getPatients
);

router.get(
    "/patients/:id",
    verifyToken,
    authorize("RECEPCIONISTA"),
     getPatientById
);

router.post(
    "/patients",
    verifyToken,
    authorize("RECEPCIONISTA"),
     validatePatient,
      createPatient
);

export default router;