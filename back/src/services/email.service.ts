import * as nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT as string),
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });
  }

  async sendPasswordResetEmail(to: string, userName: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: `Agenda <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Recuperación de Contraseña para Agenda',
      html: `
        <p>Hola ${userName},</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Cambiar contraseña
          </a>
        </p>
        <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending password reset email to ${to}:`, error);
      throw new Error('Failed to communicate with email provider.');
    }
  }
}

export const emailService = new EmailService();
