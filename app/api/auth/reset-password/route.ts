import { NextResponse } from "next/server";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, newContrasena } = await req.json();

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { resetToken: token }
        });

        if (!user) {
            return NextResponse.json({ error: "Token inválido" }, { status: 400 });
        }

        const ahora = new Date();
        if (!user.resetTokenExpires || user.resetTokenExpires < ahora) {
            return NextResponse.json({ error: "Token expirado" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(12);
        user.contrasena = await bcrypt.hash(newContrasena, salt);
        user.resetToken = null;
        user.resetTokenExpires = null;

        await userRepository.save(user);

        return NextResponse.json({ message: "Contraseña actualizada" }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        console.error("Reset Error:", message);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}