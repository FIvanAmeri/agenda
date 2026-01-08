import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";
import bcrypt from "bcryptjs";

export async function authenticateUser(
  identifier: string,
  contrasena: string
): Promise<User> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({
    where: [
      { usuario: identifier },
      { email: identifier }
    ]
  });

  if (!user) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const isValid = await bcrypt.compare(contrasena, user.contrasena);

  if (!isValid) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return user;
}