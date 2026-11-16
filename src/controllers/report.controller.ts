import type { Request, Response } from "express";
import { ReportModel } from "../models/report.model.js";

export async function getAppointmentsBySpecialty(
  req: Request,
  res: Response
) {
  // #swagger.tags = ['Reportes']
  // #swagger.summary = 'Total de citas por especialidad — GERENCIA'
  // #swagger.security = [{ "bearerAuth": [] }]

  /* #swagger.responses[200] = {
    description: 'Cantidad de citas agrupadas por especialidad.'
  } */

  /* #swagger.responses[401] = {
    description: 'Token ausente, inválido o expirado.'
  } */

  /* #swagger.responses[403] = {
    description: 'Se requiere el rol GERENCIA.'
  } */

  /* #swagger.responses[500] = {
    description: 'Error al generar el reporte.'
  } */

  try {
    const reporte = await ReportModel.getAppointmentsBySpecialty();

    res.status(200).json({
      data: reporte
    });
  } catch (error) {
    console.error("Error al consultar citas por especialidad:", error);

    res.status(500).json({
      error: "Error al generar el reporte por especialidad"
    });
  }
}

export async function getDailyCutoff(req: Request, res: Response) {
// #swagger.tags = ['Reportes']
// #swagger.summary = 'Corte diario de citas — GERENCIA'
// #swagger.security = [{ "bearerAuth": [] }]

/* #swagger.parameters['date'] = {
  in: 'query',
  required: true,
  description: 'Día de las citas en horario de Bolivia.',
  '@schema': {
    type: 'string',
    format: 'date'
  }
} */

/* #swagger.responses[200] = {
  description: 'Cantidad de citas completadas y canceladas del día.'
} */

/* #swagger.responses[400] = {
  description: 'Fecha ausente o inválida.'
} */

/* #swagger.responses[401] = {
  description: 'Token ausente, inválido o expirado.'
} */

/* #swagger.responses[403] = {
  description: 'Se requiere el rol GERENCIA.'
} */

/* #swagger.responses[500] = {
  description: 'Error al generar el corte diario.'
} */
    try { 
        const date: string = res.locals.reportDate;
        const grupos = await ReportModel.getDailyCutoff(date);

        const completadas = grupos.find(
            (grupo) => grupo.estado === "COMPLETADA"
        )?._count.id ?? 0;

        const canceladas = grupos.find(
            (grupo) => grupo.estado === "CANCELADA"
        )?._count.id ?? 0;

        res.status(200).json({
            data: {
                fecha: date,
                completadas,
                canceladas
            }
        });
    } catch (error) {
        console.error("Error al generar corte diario:", error);

        res.status(500).json({
            error: "Error al generar el corte diaro"
        });
    }
}