import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma.js"
import patientRouter from "./routes/patient.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import { authorize } from "./middlewares/authorize.middleware.js";
import { verifyToken } from "./middlewares/auth.middleware.js";
import authRouter from "./routes/auth.routes.js";
import swaggerRouter from "./routes/swagger.routes.js"

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

app.get(
    "/api/specialties",
    verifyToken,
    authorize("RECEPCIONISTA"),
    async (req: Request, res: Response) => {
    // #swagger.security = [{ "bearerAuth": [] }]
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
app.use("/api/auth", authRouter);
app.use("/api/docs", swaggerRouter)


app.listen(PORT, () => {
    console.log(`servidor corriendo en: http://localhost:${PORT}`);
});  