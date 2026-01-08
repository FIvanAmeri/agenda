import * as nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ''),
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendPasswordResetEmail(to: string, userName: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: `"Agenda" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Recuperación de Contraseña para Agenda',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hola ${userName},</p>
          <p>Has solicitado restablecer tu contraseña. Este enlace es válido por 1 hora y se puede usar una sola vez.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Error al enviar el correo de recuperación.');
    }
  }
}

export const emailService = new EmailService();