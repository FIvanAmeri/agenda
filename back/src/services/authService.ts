import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import  AppDataSource  from '../data-source';

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const authenticateUser = async (usuario: string, contrasena: string) => {
 
  const user = await userRepository.findOneBy({ usuario });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }


  const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  return user;
};
