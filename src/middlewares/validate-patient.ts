import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const patientSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio"),
    apellido: z
        .string()
        .trim()
        .min(1, "El apellido es obligatorio"),
    correo: z   
        .string()
        .trim()
        .pipe(z.email("El correo no es válido")),
    carnet_identidad: z
        .string()
        .trim()
        .min(1)
        .optional(),
    telefono: z
        .string()
        .trim()
        .min(1)
        .optional(),
    fecha_nacimiento: z
        .iso.date() //Exige una fecha válida con formato YYYY-MM-DD
        .transform((valor) => new Date(valor))
        .refine(
            (fecha) => fecha <= new Date(), //Convierte ese texto a un objeto Date, que utilizaremos al crear el paciente con Prisma.
            "La fecha de nacimiento no puede ser futura"
        )
});

export function validatePatient(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = patientSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos del paciente inválidos",
            detalles: result.error.issues
        });
        return;
    }

    req.body = result.data;
    next();
}

export type CreatePatientInput = z.infer<typeof patientSchema>;