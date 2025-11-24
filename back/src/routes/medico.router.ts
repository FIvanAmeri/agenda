import { Router } from "express";
import { MedicoController } from "../controllers/medico.controller";

const router = Router();
const controller = new MedicoController();

router.post("/", (req, res) => controller.crearMedico(req, res));
router.get("/", (req, res) => controller.listarMedicos(req, res));

export default router;
