import { User } from '../entities/User'; 


export type UserResponse = Omit<User, 'contrasena'>;