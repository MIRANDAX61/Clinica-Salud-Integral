import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().pipe(
    z.email("El correo no es válido")
  ),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

const registerSchema = loginSchema.extend({
  role: z.enum(["RECEPCIONISTA", "MEDICO", "GERENCIA"])
});

function validateAuth(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Datos de autenticación inválidos",
        errors: result.error.issues
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

export const validateRegister = validateAuth(registerSchema);
export const validateLogin = validateAuth(loginSchema);