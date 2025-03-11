import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { User } from './entities/User';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Paciente, User],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;