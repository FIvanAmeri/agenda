import { Cirugia } from "../entities/Cirugia.entity";

export interface CirugiaConEdad extends Cirugia {
    edadPaciente: number | null;
}