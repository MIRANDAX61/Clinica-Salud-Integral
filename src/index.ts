import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma.js"
import patientRouter from "./routes/patient.routes.js";
import doctorRouter from "./routes/doctor.routes.js";

const app: Application = express();
const PORT = process.env.PORT || 3000; 

//Agregar middlewares

app.use(cors());
app.use(express.json());

//Ruta de prueba
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        mensaje: "API Clínica Salud Integral funcionando"
    });
});

app.get("/api/specialties", async (req: Request, res: Response) => {
    try { 
        const especialidades = await prisma.especialidad.findMany({
            orderBy: { id: "asc" }
        });

        res.status(200).json({ data: especialidades });
    } catch (error) {
        console.error("Error al consultar especialidades", error);

        res.status(500).json({
            mensaje: "Error al obtener las especialidades"
        });
    }
});

app.use("/api", patientRouter);
app.use("/api",doctorRouter);


app.listen(PORT, () => {
    console.log(`servidor corriendo en: http://localhost:${PORT}`);
});  