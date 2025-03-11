import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouters';
import pacientesRouter from './routes/pacientes.router';
import AppDataSource from './data-source';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión con la base de datos establecida correctamente');

    app.use('/api/users', userRouter);
    app.use('/api', pacientesRouter);

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos', error);
  });
