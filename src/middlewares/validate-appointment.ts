import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const appointmentSchema = z.object({
    paciente_id: z
        .number()
        .int()
        .positive(),
    medico_id: z
        .number()
        .int()
        .positive(),
    fecha_hora: z
        .iso.datetime({ offset: true }) //exige un texto con fecha, hora y zona horaria
        .transform((valor)=> new Date(valor)) //lo convierte en un objeto Date
        .refine( //comprueba que sea un momento futuro
            (fecha) => fecha > new Date(),
            "No puedes agendar una cita en una fecha que ya pasó"
        )
});

export type CreateAppointmentInput = 
    z.infer<typeof appointmentSchema>;

export const agendaQuerySchema = z.object({
    from: z
        .iso.date()
        .optional(),
    to: z
        .iso.date()
        .optional()
})
.refine(
    (datos) =>
    (datos.from === undefined) === (datos.to === undefined),
    {
        message: "Debes enviar from y to juntos",
        path: ["to"]
    }
)
.refine(
    (datos) =>
        !datos.from || !datos.to || datos.from <= datos.to,
    {
        message: "La fecha final no puede ser anterior a la inicial",
        path: ["to"]
    }
);

export function validateAppointment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = appointmentSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos de la cita inválidos",
            detalles: result.error.issues
        });
        return;
    }

    req.body = result.data;
    next();
}

export const appointmentStatusSchema = z.object({
    estado: z
        .enum(["COMPLETADA","CANCELADA"])
});

export function validateAppointmentStatus(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = appointmentStatusSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Estado de cita inválido",
            datalles: result.error.issues
        });
        return;
    }

    req.body = result.data;
    next();
}
