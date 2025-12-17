import { Request, Response } from "express";
import { EstadisticasService } from "../services/estadisticas.service";

interface RequestConUsuario extends Request {
    user?: {
        userId: number;
    };
}

export class EstadisticasController {
    private estadisticasService = new EstadisticasService();

    obtenerEstadisticas = async (req: RequestConUsuario, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: "Usuario no identificado" });
                return;
            }

            const anioQuery = req.query.anio as string;
            const anio = anioQuery ? parseInt(anioQuery) : new Date().getFullYear();

            const stats = await this.estadisticasService.obtenerEstadisticasGenerales(userId, anio);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener estadísticas", error: String(error) });
        }
    };
}