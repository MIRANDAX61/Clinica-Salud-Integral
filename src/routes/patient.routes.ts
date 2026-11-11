import { Router } from "express";
import { createPatient, getPatientById, getPatients } from "../controllers/patient.controller";
import { validatePatient } from "../middlewares/validate-patient";

const router : Router = Router();

router.get("/patients", getPatients);
router.get("/patients/:id", getPatientById);
router.post("/patients", validatePatient, createPatient);

export default router;