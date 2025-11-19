import express from 'express';
import { PacientesMasivosController } from '../controllers/pacientesMasivos.controller';

const pacientesMasivosRouter = express.Router();
const pacientesMasivosController = new PacientesMasivosController();


pacientesMasivosRouter.get('/pacientes-masivos', pacientesMasivosController.obtenerPacientesMasivos.bind(pacientesMasivosController));


pacientesMasivosRouter.post('/pacientes-masivos', pacientesMasivosController.crearPacientesMasivos.bind(pacientesMasivosController));

export default pacientesMasivosRouter;
