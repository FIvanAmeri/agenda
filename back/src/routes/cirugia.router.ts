import express from "express";
import { CirugiaController } from "../controllers/cirugia.controller";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();
const controller = new CirugiaController();

router.post("/cirugia", authenticateJWT, controller.crear);
router.get("/cirugia", authenticateJWT, controller.listar);
router.get("/cirugia/medicos", authenticateJWT, controller.obtenerMedicos);
router.get("/cirugia/tipos", authenticateJWT, controller.obtenerTiposCirugia);

router.get("/cirugia/:id", authenticateJWT, controller.obtenerPorId);
router.put("/cirugia/:id", authenticateJWT, controller.actualizar);
router.delete("/cirugia/:id", authenticateJWT, controller.eliminar);

export default router;