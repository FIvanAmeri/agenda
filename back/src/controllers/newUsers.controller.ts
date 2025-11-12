import { Request, Response } from 'express';
import { newUserService } from '../services/newUsers.service';
import { UserCreationRequest } from '../interfaces/UserCreationRequest.interface'; 
import { ForgotPasswordRequest } from '../interfaces/ForgotPasswordRequest.interface'; 
import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest.interface'; 
import { UserResponse } from '../interfaces/UserResponse.interface';

class NewUsersController {
  
  constructor(private userService: typeof newUserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserCreationRequest = req.body as UserCreationRequest; 
      
      const newUser: UserResponse = await this.userService.createNewUser(userData);
      
      res.status(201).json({ 
        message: 'Usuario creado exitosamente. Ya puede iniciar sesión.', 
        user: newUser 
      });
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear usuario.';
      res.status(400).json({ message: errorMessage });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email }: ForgotPasswordRequest = req.body as ForgotPasswordRequest;
      
      await this.userService.requestPasswordReset(email);
      

      res.status(200).json({ 
        message: 'Si el correo está registrado, se ha enviado un enlace para restablecer la contraseña.' 
      });
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : 'Error interno al procesar la solicitud.';
      res.status(500).json({ message: 'Error en el servicio de correo. ' + errorMessage });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newContrasena }: ResetPasswordRequest = req.body as ResetPasswordRequest;
      
      await this.userService.resetUserPassword(token, newContrasena); 
      
      res.status(200).json({ 
        message: 'Contraseña restablecida exitosamente.' 
      });
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : 'Token inválido o expirado.';
      res.status(400).json({ message: errorMessage });
    }
  }
}

export const newUsersController = new NewUsersController(newUserService);