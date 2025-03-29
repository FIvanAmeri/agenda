import { Request, Response } from 'express';
import { PacientesMasivosService } from '../services/pacientesMasivos.service';
import multer from 'multer';
import xlsx from 'xlsx';
import { PacienteMasivo } from '../entities/pacienteMasivo.entity';

interface PacienteMasivoExcel {
  nombre: string;
  concepto: string;
  fecha: string;
  obra_social: string;
  institucion: string;
}

export class PacientesMasivosController {
  private pacientesMasivosService = new PacientesMasivosService();
  private upload = multer({ dest: 'uploads/' });

  async crearPacientesMasivos(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido un archivo' });
      }

      const file = req.file;
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json<PacienteMasivoExcel>(sheet);

      const pacientes: PacienteMasivo[] = data.map((paciente) => {
        const nuevoPaciente = new PacienteMasivo();
        nuevoPaciente.paciente = paciente.nombre || paciente.concepto;
        nuevoPaciente.practicas = paciente.concepto;
        nuevoPaciente.obraSocial = paciente.obra_social;
        nuevoPaciente.dia = paciente.fecha;
        nuevoPaciente.institucion = paciente.institucion;

        return nuevoPaciente;
      });

      const nuevosPacientes = await this.pacientesMasivosService.crearPacientesMasivos(pacientes);
      res.status(201).json({ mensaje: 'Pacientes masivos creados con éxito', pacientes: nuevosPacientes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al crear los pacientes masivos' });
    }
  }


  async obtenerPacientesMasivos(req: Request, res: Response) {
    try {
      const pacientes = await this.pacientesMasivosService.obtenerPacientesMasivos();
      res.status(200).json(pacientes);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error al obtener los pacientes masivos' });
    }
  }
}
