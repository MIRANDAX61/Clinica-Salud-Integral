import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const dailyCutoffQuerySchema = z.object({
    date: z.iso.date()
});

export function validateDailyCutoff(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = dailyCutoffQuerySchema.safeParse(req.query);

    if (!result.success) {
        res.status(400).json({
            error: "Debes enviar date con una fecha válida YYYY-MM-DD",
            detalles: result.error.issues
        });
        return;
    }
    
    res.locals.reportDate = result.data.date;
    next();
}