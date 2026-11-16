import type { Request, Response } from "express";
import { AppointmentModel } from "../models/appointment.model";
import { PatientModel } from "../models/patient.model";
import { DoctorModel } from "../models/doctor.model";
import { agendaQuerySchema } from "../middlewares/validate-appointment";
import { Prisma } from "../../generated/prisma/client.js";

export async function createAppointment(req:Request, res: Response) {
// #swagger.tags = ['Citas']
// #swagger.summary = 'Agendar una cita — RECEPCIONISTA'
// #swagger.security = [{ "bearerAuth": [] }]

/* #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["paciente_id", "medico_id", "fecha_hora"],
        properties: {
          paciente_id: { type: "integer", minimum: 1 },
          medico_id: { type: "integer", minimum: 1 },
          fecha_hora: { type: "string", format: "date-time" }
        }
      },
      example: {
        paciente_id: 1,
        medico_id: 2,
        fecha_hora: "2026-12-01T10:00:00-04:00"
      }
    }
  }
} */

/* #swagger.responses[201] = {
  description: 'Cita creada con estado PROGRAMADA.'
} */

/* #swagger.responses[400] = {
  description: 'Datos inválidos o fecha que no es futura.'
} */

/* #swagger.responses[404] = {
  description: 'Paciente o médico inexistente.'
} */

/* #swagger.responses[401] = {
  description: 'Token ausente, inválido o expirado.'
} */

/* #swagger.responses[403] = {
  description: 'El rol no tiene permiso.'
} */

/* #swagger.responses[500] = {
  description: 'Error interno del servidor.'
} */
    const { paciente_id, medico_id } = req.body;
    
    try {
        const paciente = await PatientModel.findById(paciente_id);
        if (!paciente) {
        res.status(404).json({
            error: "El ID de este paciente no existe"
        });
        return;
        }

        const doctor = await DoctorModel.findById(medico_id);
        if (!doctor) {
        res.status(404).json({
            error: "El ID de este doctor no existe"
        });
        return;
        }

        const cita = await AppointmentModel.create(req.body);

        res.status(201).json({
            data: cita,
        });
    } catch (error) {
        console.error("Error al crear la cita:", error);
        res
            .status(500)
            .json({ error: "error al crear la cita"});
    }
}

export async function getDoctorAgenda(req: Request, res: Response) {
// #swagger.tags = ['Citas']
// #swagger.summary = 'Consultar agenda del médico — MEDICO'
// #swagger.security = [{ "bearerAuth": [] }]

/* #swagger.parameters['id'] = {
  in: 'path',
  required: true,
  description: 'ID del médico.',
  '@schema': { type: 'integer', minimum: 1 }
} */

/* #swagger.parameters['from'] = {
  in: 'query',
  required: false,
  description: 'Día inicial. Enviar junto con to.',
  '@schema': { type: 'string', format: 'date' }
} */

/* #swagger.parameters['to'] = {
  in: 'query',
  required: false,
  description: 'Día final incluido, en horario de Bolivia.',
  '@schema': { type: 'string', format: 'date' }
} */

/* #swagger.responses[200] = {
  description: 'Agenda con los datos de los pacientes.'
} */

/* #swagger.responses[400] = {
  description: 'ID o rango de fechas inválido.'
} */

/* #swagger.responses[404] = {
  description: 'Médico inexistente.'
} */

/* #swagger.responses[401] = {
  description: 'Token ausente, inválido o expirado.'
} */

/* #swagger.responses[403] = {
  description: 'El rol no tiene permiso.'
} */

/* #swagger.responses[500] = {
  description: 'Error interno del servidor.'
} */
    const medicoId = Number(req.params.id);

    if (!Number.isSafeInteger(medicoId) || medicoId <= 0) {
        res.status(400).json({
            error: "El ID del médico debe ser un entero positivo"
        });
        return;
    }

    const result = agendaQuerySchema.safeParse(req.query);

    if (!result.success) {
        res.status(400).json({
            error: "Rango de fechas inválido",
            detalles: result.error.issues
        });
        return;
    }

    const { from, to } = result.data;

    const desde = from
        ? new Date(`${from}T00:00-04:00`)
        : undefined;
    
    const hasta = to
        ? new Date(`${to}T23:59:59.999-04:00`)
        : undefined;

  try {
    const medico = await DoctorModel.findById(medicoId);

    if (!medico) {
      res.status(404).json({
        error: "El médico indicado no existe"
      });
      return;
    }

    const citas = await AppointmentModel.getDoctorAgenda(
      medicoId,
      desde,
      hasta
    );

    res.status(200).json({
      data: citas
    });
  } catch (error) {
    console.error("Error al consultar agenda:", error);

    res.status(500).json({
      error: "Error al obtener la agenda del médico"
    });
  }
}

export async function updateAppointmentStatus(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({
            error: "El ID de la cita debe ser un entero positivo"
        });
        return;
    }
// #swagger.tags = ['Citas']
// #swagger.summary = 'Actualizar estado de una cita — MEDICO'
// #swagger.security = [{ "bearerAuth": [] }]

/* #swagger.parameters['id'] = {
  in: 'path',
  required: true,
  description: 'ID de la cita.',
  '@schema': { type: 'integer', minimum: 1 }
} */

/* #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["estado"],
        properties: {
          estado: {
            type: "string",
            enum: ["COMPLETADA", "CANCELADA"]
          }
        }
      },
      example: { estado: "COMPLETADA" }
    }
  }
} */

/* #swagger.responses[200] = {
  description: 'Cita actualizada.'
} */

/* #swagger.responses[400] = {
  description: 'ID o estado inválido.'
} */

/* #swagger.responses[404] = {
  description: 'Cita inexistente.'
} */

/* #swagger.responses[401] = {
  description: 'Token ausente, inválido o expirado.'
} */

/* #swagger.responses[403] = {
  description: 'El rol no tiene permiso.'
} */

/* #swagger.responses[500] = {
  description: 'Error interno del servidor.'
} */
    try {
        const cita = await AppointmentModel.updateStatus(
            id,
            req.body.estado
        );

        res.status(200).json({
            data: cita
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError && 
            error.code === "P2025"
        ) {
            res.status(404).json({
                error: "La cita no existe"
            });
            return;
        }

        console.error("Error al actualizar estado:", error);

        res.status(500).json({
            error: "Error al actualizar el estado de la cita"
        });
    }
}