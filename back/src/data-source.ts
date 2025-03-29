import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { User } from './entities/User';
import { PacienteMasivo } from './entities/pacienteMasivo.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Paciente, User, PacienteMasivo],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;