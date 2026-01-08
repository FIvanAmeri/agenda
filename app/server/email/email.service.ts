import * as nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ''),
      },
    });
  }

  async sendPasswordResetEmail(to: string, userName: string, resetLink: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Agenda" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Recuperación de Contraseña para Agenda',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1f2937;">Hola ${userName},</h2>
          <p style="color: #4b5563; line-height: 1.5;">Has solicitado restablecer tu contraseña. Este enlace es válido por 1 hora y se puede usar una sola vez.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Si no solicitaste este cambio, podés ignorar este correo de forma segura.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      console.error("Nodemailer Error:", msg);
      throw new Error(`Error al enviar el correo: ${msg}`);
    }
  }
}

export const emailService = new EmailService();