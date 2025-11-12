import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const authenticateUser = async (identifier: string, contrasena: string): Promise<User> => {
  const user = await userRepository.findOne({
    where: [{ usuario: identifier }, { email: identifier }]
  });

  if (!user) {
    throw new Error("Usuario o correo no encontrado");
  }

  const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  if (!isPasswordValid) {
    throw new Error("Contraseña incorrecta");
  }

  return user;
};
