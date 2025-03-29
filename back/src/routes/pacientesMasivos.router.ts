import express from 'express';
import { PacientesMasivosController } from '../controllers/pacientesMasivos.controller';

const pacientesMasivosRouter = express.Router();
const pacientesMasivosController = new PacientesMasivosController();

// Ruta para obtener los pacientes masivos
pacientesMasivosRouter.get('/pacientes-masivos', pacientesMasivosController.obtenerPacientesMasivos.bind(pacientesMasivosController));

// Ruta para crear pacientes masivos mediante carga de archivo
pacientesMasivosRouter.post('/pacientes-masivos', pacientesMasivosController.crearPacientesMasivos.bind(pacientesMasivosController));

export default pacientesMasivosRouter;
