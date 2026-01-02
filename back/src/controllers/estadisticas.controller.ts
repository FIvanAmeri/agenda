import { Request, Response } from "express";
import { EstadisticasService } from "../services/estadisticas.service";

export class EstadisticasController {
    private estadisticasService = new EstadisticasService();

    obtenerEstadisticas = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user.userId;

            const anioQuery = req.query.anio as string;
            const anio = anioQuery ? parseInt(anioQuery) : new Date().getFullYear();

            const stats = await this.estadisticasService.obtenerEstadisticasGenerales(userId, anio);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener estadísticas", error: String(error) });
        }
    };
}