import express from 'express';
import { PacientesController } from '../controllers/pacientes.controller';

const pacientesRouter = express.Router();
const pacientesController = new PacientesController();

pacientesRouter.get('/paciente', pacientesController.obtenerPacientes.bind(pacientesController));

pacientesRouter.post('/paciente', pacientesController.crearPaciente.bind(pacientesController));

export default pacientesRouter;
