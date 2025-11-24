import express from "express";
import { CirugiaController } from "../controllers/cirugia.controller";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();
const controller = new CirugiaController();

router.post("/cirugia", authenticateJWT, controller.crear);
router.get("/cirugia", authenticateJWT, controller.listar);

export default router;
