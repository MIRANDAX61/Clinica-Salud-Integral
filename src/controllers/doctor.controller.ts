import type { Request, Response } from "express";
import { DoctorModel } from "../models/doctor.model.js";
import { spec } from "node:test/reporters";

export async function getDoctors(req: Request, res: Response) {
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