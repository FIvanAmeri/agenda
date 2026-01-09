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
    logging: process.env.NODE_ENV !== "production",
    entities: [Paciente, User, Cirugia],
    subscribers: [],
    migrations: [],
    ssl: process.env.NODE_ENV === "production" 
        ? { rejectUnauthorized: false } 
        : false,
});

let initializationPromise: Promise<DataSource> | null = null;

export const initializeDatabase = async (): Promise<DataSource> => {
    if (AppDataSource.isInitialized) {
        return AppDataSource;
    }

    if (!initializationPromise) {
        initializationPromise = AppDataSource.initialize()
            .then((ds) => {
                console.log("Data Source inicializado correctamente");
                return ds;
            })
            .catch((error) => {
                initializationPromise = null;
                console.error("Error inicializando la base de datos:", error);
                throw error;
            });
    }

    return initializationPromise;
};