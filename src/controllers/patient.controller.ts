import type { Response, Request } from "express";
import { prisma } from "../config/prisma.js";
import { PatientModel } from "../models/patient.model"

export async function getPatients(req: Request, res: Response) {
    // #swagger.tags = ['Pacientes']
    // #swagger.summary = 'Consultar todos los pacientes'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.responses[200] = {
    description: 'Lista de pacientes dentro de data.'
    } */
    /* #swagger.responses[401] = {
    description: 'Token ausente, inválido o expirado.'
    } */

    /* #swagger.responses[403] = {
    description: 'Se requiere el rol RECEPCIONISTA.'
    } */

    /* #swagger.responses[500] = {
    description: 'Error interno del servidor.'
    } */
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
    /* #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    description: 'ID del paciente.',
    schema: { type: 'integer', minimum: 1 }
    } */

    /* #swagger.responses[200] = {
    description: 'Paciente con sus citas, médicos y especialidades.'
    } */

    /* #swagger.responses[400] = {
    description: 'ID inválido.'
    } */

    /* #swagger.responses[404] = {
    description: 'Paciente no encontrado.'
    } */
    /* #swagger.responses[401] = {
    description: 'Token ausente, inválido o expirado.'
    } */

    /* #swagger.responses[403] = {
    description: 'Se requiere el rol RECEPCIONISTA.'
    } */

    /* #swagger.responses[500] = {
    description: 'Error interno del servidor.'
    } */
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
    /* #swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
        schema: {
            type: "object",
            required: ["nombre", "apellido", "correo", "fecha_nacimiento"],
            properties: {
            nombre: { type: "string", minLength: 1 },
            apellido: { type: "string", minLength: 1 },
            correo: { type: "string", format: "email" },
            carnet_identidad: { type: "string", minLength: 1 },
            telefono: { type: "string", minLength: 1 },
            fecha_nacimiento: { type: "string", format: "date" }
            }
        },
        example: {
            nombre: "Lucía",
            apellido: "Mendoza",
            correo: "lucia@ejemplo.com",
            fecha_nacimiento: "2000-05-20"
        }
        }
    }
    } */

    /* #swagger.responses[201] = {
    description: 'Paciente registrado.'
    } */

    /* #swagger.responses[400] = {
    description: 'Datos inválidos o fecha de nacimiento futura.'
    } */
    /* #swagger.responses[401] = {
    description: 'Token ausente, inválido o expirado.'
    } */

    /* #swagger.responses[403] = {
    description: 'Se requiere el rol RECEPCIONISTA.'
    } */

    /* #swagger.responses[500] = {
    description: 'Error interno del servidor.'
    } */
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