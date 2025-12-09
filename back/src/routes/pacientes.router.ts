import express from "express";
import { PacientesController } from "../controllers/pacientes.controller";
import { authenticateJWT } from "../middleware/auth";

const pacientesRouter = express.Router();
const pacientesController = new PacientesController();

pacientesRouter.get(
  "/paciente",
  authenticateJWT,
  pacientesController.obtenerPacientes.bind(pacientesController)
);

pacientesRouter.post(
  "/paciente",
  authenticateJWT,
  pacientesController.crearPaciente.bind(pacientesController)
);

pacientesRouter.put(
  "/paciente/:id",
  authenticateJWT,
  pacientesController.actualizarPaciente.bind(pacientesController)
);

pacientesRouter.put(
  "/paciente/pago/:id",
  authenticateJWT,
  pacientesController.actualizarEstadoDePago.bind(pacientesController)
);

pacientesRouter.delete(
  "/paciente/:id",
  authenticateJWT,
  pacientesController.eliminarPaciente.bind(pacientesController)
);

export default pacientesRouter;