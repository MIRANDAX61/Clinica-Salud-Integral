import { prisma } from "../config/prisma.js"

export const DoctorModel = {
    async findAll(specialty?: string) {
        return await prisma.medico.findMany({
            where: specialty
                ? {
                    especialidad: {
                        nombre: {
                            equals: specialty,
                            mode: "insensitive"
                        }
                    }
                }
        : {},
       include: {
        especialidad: true
       },
       orderBy: {
         id: "asc"
       }
    });
   },

   async findById(id: number) {
    return await prisma.medico.findUnique({
        where: { id }
    });
   },
};