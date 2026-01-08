import { NextResponse } from "next/server";
import { emailService } from "@/app/server/email/email.service";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email }: { email: string } = await req.json();

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return NextResponse.json({ error: "Email no registrado" }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + 3600000);
        
        await userRepository.save(user);

        const baseUrl = process.env.FRONTEND_URL || "https://agenda-ten-sable.vercel.app";
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
        
        await emailService.sendPasswordResetEmail(user.email, user.usuario, resetLink);

        return NextResponse.json({ message: "Email enviado" });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error en forgot-password:", errorMessage);
        return NextResponse.json({ 
            error: "Error en el servidor", 
            details: errorMessage 
        }, { status: 500 });
    }
}