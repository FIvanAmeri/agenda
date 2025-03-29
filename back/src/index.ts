import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import userRouter from './routes/userRouters';
import pacientesRouter from './routes/pacientes.router';
import AppDataSource from './data-source';
import pacientesMasivosRouter from './routes/pacientesMasivos.router';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


const upload = multer({ dest: 'uploads/' });


app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  })
);

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión con la base de datos establecida correctamente');

    app.use('/api/users', userRouter);
    app.use('/api', pacientesRouter);
    app.use('/api', pacientesMasivosRouter);

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos', error);
  });
