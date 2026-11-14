import { REFUSED } from "node:dns";
import { prisma } from "../config/prisma.js";
import { getDoctors } from "../controllers/doctor.controller.js";
import type {
    CreateAppointmentInput
} from "../middlewares/validate-appointment.js";

export const AppointmentModel = {
    async create(data: CreateAppointmentInput) {
        return await prisma.cita.create({
            data
        });
    },

    async getDoctorAgenda(
        medicoId: number, 
        from?: Date,
        to?: Date
    ) {
        return await prisma.cita.findMany({
            where: {
                medico_id: medicoId,
                ...(from && to 
                    ? {
                        fecha_hora: {
                            gte: from,
                            lte: to
                        }
                    }
                : {})
            },
            include: {
                paciente: true
            },
            orderBy: {
                fecha_hora: "asc"
            }
        });
    },

    async updateStatus(
    id: number,
    estado: "COMPLETADA" | "CANCELADA"
    ) {
        return await prisma.cita.update({
            where: { id },
            data: { estado }
        });
    }
};

