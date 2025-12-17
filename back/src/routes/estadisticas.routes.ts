import { Router, Request, Response } from "express";
import { EstadisticasController } from "../controllers/estadisticas.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();
const controller = new EstadisticasController();

router.get("/estadisticas", authenticateJWT, (req: Request, res: Response) => {
    controller.obtenerEstadisticas(req, res);
});

export default router;