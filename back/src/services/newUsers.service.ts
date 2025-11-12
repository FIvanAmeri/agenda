import AppDataSource from '../data-source'
import { User } from '../entities/User'
import { UserCreationRequest } from '../interfaces/UserCreationRequest.interface'
import { JwtPayload } from '../interfaces/JwtPayload.interface'
import { UserResponse } from '../interfaces/UserResponse.interface'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { emailService } from './email.service'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_must_be_strong'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

class NewUserService {
  private userRepository = AppDataSource.getRepository(User)

  async createNewUser(userData: UserCreationRequest): Promise<UserResponse> {
    const { usuario, email, contrasena } = userData

    const existingUser = await this.userRepository.findOne({
      where: [{ usuario }, { email }],
    })

    if (existingUser) {
      throw new Error('El nombre de usuario o el correo electrónico ya está en uso.')
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10)

    const newUser = this.userRepository.create({
      usuario,
      email,
      contrasena: hashedPassword,
    })

    const savedUser = await this.userRepository.save(newUser)
    const { contrasena: _omit, ...userSafeData } = savedUser
    return userSafeData
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) return

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      type: 'passwordReset',
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`

    await emailService.sendPasswordResetEmail(user.email, user.usuario, resetLink)
  }

  async resetUserPassword(token: string, newContrasena: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

      if (decoded.type !== 'passwordReset') {
        throw new Error('Tipo de token inválido.')
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
      })

      if (!user) {
        throw new Error('Usuario no encontrado o token inválido.')
      }

      const hashedPassword = await bcrypt.hash(newContrasena, 10)
      user.contrasena = hashedPassword
      await this.userRepository.save(user)
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('El token de restablecimiento de contraseña ha expirado (más de 1 hora).')
      }
      throw new Error('Token de restablecimiento inválido.')
    }
  }
}

export const newUserService = new NewUserService()
