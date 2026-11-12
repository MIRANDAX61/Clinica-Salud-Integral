import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthModel } from "../models/auth.model.js";
import { Prisma } from "../../generated/prisma/client.js";

export async function register(req: Request, res: Response) {
// #swagger.tags = ['Autenticación']
// #swagger.summary = 'Registrar una cuenta'
// #swagger.security = []

/* #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["email", "password", "role"],
        properties: {
          email: {
            type: "string",
            format: "email"
          },
          password: {
            type: "string",
            format: "password"
          },
          role: {
            type: "string",
            enum: ["RECEPCIONISTA", "MEDICO", "GERENCIA"]
          }
        }
      },
      example: {
        email: "recepcion.demo@clinica.com",
        password: "123456",
        role: "RECEPCIONISTA"
      }
    }
  }
} */

/* #swagger.responses[201] = {
  description: 'Cuenta creada. Devuelve id, email y role, sin contraseña.'
} */

/* #swagger.responses[500] = {
  description: 'Error al registrar la cuenta.'
} */

  /* #swagger.responses[400] = {
  description: 'Datos de registro inválidos.'
} */

/* #swagger.responses[409] = {
  description: 'El correo ya está registrado.'
} */
  try {
    const { email, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await AuthModel.create({
    email,
    password: hashedPassword,
    role
    });

    res.status(201).json(user)

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            res.status(409).json({
            message: "El correo ya está registrado"
            });
            return;
        }

        console.error("Error al registrar usuario:", error);

        res.status(500).json({
            message: "Error al registrar el usuario"
        });
    }
}

export async function login(req: Request, res: Response) {
// #swagger.tags = ['Autenticación']
// #swagger.summary = 'Iniciar sesión y obtener un token'
// #swagger.security = []

/* #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email"
          },
          password: {
            type: "string",
            format: "password"
          }
        }
      },
      example: {
        email: "recepcion.demo@clinica.com",
        password: "123456"
      }
    }
  }
} */

/* #swagger.responses[200] = {
  description: 'Credenciales válidas. Devuelve un token JWT.'
} */

/* #swagger.responses[401] = {
  description: 'Credenciales inválidas.'
} */

/* #swagger.responses[500] = {
  description: 'Error al iniciar sesión.'
} */

  /* #swagger.responses[400] = {
  description: 'Datos de acceso inválidos.'
} */
  try {
    const { email, password } = req.body
    const user = await AuthModel.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    res.json({ token })
  } catch {
    res.status(500).json({ message: 'Error al iniciar sesión' })
  }
}