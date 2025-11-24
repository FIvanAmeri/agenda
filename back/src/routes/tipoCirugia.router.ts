import { Router } from "express";
import { TipoCirugiaController } from "../controllers/tipoCirugia.controller";

const router = Router();
const controller = new TipoCirugiaController();

router.post("/", (req, res) => controller.crearTipo(req, res));
router.get("/", (req, res) => controller.listarTipos(req, res));

export default router;
