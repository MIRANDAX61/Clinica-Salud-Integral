import type { Request, Response } from "express";
import { DoctorModel } from "../models/doctor.model.js";

export async function getDoctors(req: Request, res: Response) {
    // #swagger.tags = ['Médicos']
    // #swagger.summary = 'Consultar médicos por especialidad — RECEPCIONISTA'
    // #swagger.security = [{ "bearerAuth": [] }]

    /* #swagger.parameters['specialty'] = {
    in: 'query',
    required: false,
    description: 'Nombre completo de la especialidad, sin distinguir mayúsculas.',
    '@schema': {
        type: 'string',
        example: 'Pediatría'
    }
    } */

    /* #swagger.responses[200] = {
    description: 'Lista de médicos con los datos de su especialidad.'
    } */

    /* #swagger.responses[400] = {
    description: 'Filtro de especialidad inválido.'
    } */

    /* #swagger.responses[401] = {
    description: 'Token ausente, inválido o expirado.'
    } */

    /* #swagger.responses[403] = {
    description: 'Se requiere el rol RECEPCIONISTA.'
    } */

    /* #swagger.responses[500] = {
    description: 'Error al consultar médicos.'
    } */
    const specialty = req.query.specialty;

    if (specialty !== undefined && typeof specialty !== "string") {
       res.status(400).json({
        error: "La especialidad debe ser un texto"
       });
       return; 
    }

    try {
        const doctors = await DoctorModel.findAll(specialty);

        res.status(200).json({
            data: doctors
        });
    } catch (error) {
        console.error("Error al consultar médicos", error);

        res.status(500).json({
            error: "Error al obtener los médicos"
        });
    }
}