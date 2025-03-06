import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';

const pacientesRouter = Router();


pacientesRouter.get('/pacientes', async (req, res) => {
  try {
    const pacienteRepository = getRepository(Paciente);
    const pacientes = await pacienteRepository.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pacientes' });
  }
});


pacientesRouter.post('/pacientes', async (req, res) => {
  try {
    const { dia, paciente, practicas, obraSocial } = req.body;
    const pacienteRepository = getRepository(Paciente);

    const nuevoPaciente = pacienteRepository.create({
      dia,
      paciente,
      practicas,
      obraSocial,
    });

    await pacienteRepository.save(nuevoPaciente);
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar paciente' });
  }
});

export default pacientesRouter;
