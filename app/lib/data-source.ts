import "reflect-metadata";
import { DataSource } from "typeorm";
import { Paciente } from "../entities/paciente.entity";
import { User } from "../entities/User.entity";
import { Cirugia } from "../entities/Cirugia.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Paciente, User, Cirugia],
    subscribers: [],
    migrations: [],
});

export const initializeDatabase = async (): Promise<DataSource> => {
    if (!AppDataSource.isInitialized) {
        return await AppDataSource.initialize();
    }
    return AppDataSource;
};