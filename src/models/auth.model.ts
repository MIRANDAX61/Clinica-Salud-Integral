import { prisma } from "../config/prisma.js";
import type { Role } from "../../generated/prisma/enums.js";

export const AuthModel = {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  async create(data: {
    email: string;
    password: string;
    role: Role;
  }) {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        role: true
      }
    });
  }
};