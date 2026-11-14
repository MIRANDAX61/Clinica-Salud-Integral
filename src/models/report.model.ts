import { prisma } from "../config/prisma.js";

type appointmentsBySpecialty = { 
    especialidad: string;
    total_citas: number;
};

export const ReportModel = {
    async getAppointmentsBySpecialty() {
        return await prisma.$queryRaw<appointmentsBySpecialty[]>`
            SELECT
                e.nombre AS especialidad,
                COUNT(c.id)::int AS total_citas
            FROM put.citas c
            INNER JOIN put.medicos m
                ON m.id = c.medico_id
            INNER JOIN put.especialidades e
                ON e.id = m.especialidad_id
            GROUP BY e.id, e.nombre
            ORDER BY total_citas DESC
        `;
    },

    async getDailyCutoff(date: string) {
        const inicio = new Date(`${date}T00:00:00-04:00`);
        const siguienteDia = new Date(inicio);

        siguienteDia.setUTCDate(siguienteDia.getUTCDate() + 1);

        return await prisma.cita.groupBy({
            by: ["estado"], 
            where: {
                fecha_hora: {
                    gte: inicio,
                    lt: siguienteDia
                },
                estado: {
                    in: ["COMPLETADA", "CANCELADA"]
                }
            },
            _count: {
                id: true
            }
        });
    },
}