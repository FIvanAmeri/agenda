import { User } from '../entities/User';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import AppDataSource from '../data-source';


const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const createUser = async (usuario: string, contrasena: string) => {

  const existingUser = await userRepository.findOneBy({ usuario });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }


  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const user = new User();
  user.usuario = usuario;
  user.contrasena = hashedPassword;

  return await userRepository.save(user);
};
