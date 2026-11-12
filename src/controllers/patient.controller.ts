import type { Response, Request } from "express";
import { prisma } from "../config/prisma";
import { PatientModel } from "../models/patient.model"

export async function getPatients(req: Request, res: Response) {
    // #swagger.tags = ['Pacientes']
    // #swagger.summary = 'Consultar todos los pacientes'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
        const patients = await PatientModel.findAll();
        res.status(200).json({
            data: patients
        });
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        res
            .status(500)
            .json({ error: "error al obtener los pacientes"});
    }
}

export async function getPatientById(req: Request, res: Response) {
    // #swagger.tags = ['Pacientes']
    // #swagger.summary = 'Consultar un paciente por su ID'
    // #swagger.security = [{ "bearerAuth": [] }]
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id<=0) {
        res.status(400).json({
            error: "El ID debe ser un entero positivo"
        });
        return;
    }

    try {
        const patient = await PatientModel.findById(id);

        if (!patient) {
            res.status(404).json({
                error: "Paciente no encontrado"
            });
            return;
        }

        res.status(200).json({ 
            data: patient
        });
    } catch (error) {
        console.error("Error al consultar paciente", error);

        res.status(500).json({
            error: "Error al obtener al paciente"
        });
    }
}

export async function createPatient(req: Request, res: Response) {
    // #swagger.tags = ['Pacientes']
    // #swagger.summary = 'Crear un Paciente'
    // #swagger.security = [{ "bearerAuth": [] }]
    try { 
        const newPatient = await PatientModel.create(req.body);

        res.status(201).json({
            data: newPatient,
        });
    } catch (error) {
        console.error("Error al crear paciente:", error);
        res 
            .status(500)
            .json({ error: "error al crear paciente"});
    }
}