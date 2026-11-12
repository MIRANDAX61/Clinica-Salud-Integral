import { prisma } from "../config/prisma";
import type { CreatePatientInput } from "../middlewares/validate-patient";

export const PatientModel = {
        async findAll() {
        return await prisma.paciente.findMany({
            orderBy: {id: "asc"}
        });
    },

    async findById(id: number) {
        return await prisma.paciente.findUnique({
            where: { id },
            include: {
            citas: {
                include: {
                    medico: {
                        include: {
                        especialidad: true
                        }
                    }
                },
                orderBy: {
                fecha_hora: "desc"
                }
            }
            }
        });
    },

    async create(data: CreatePatientInput) {
        return await prisma.paciente.create({
            data
        });
    },

};
