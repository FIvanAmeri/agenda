import { NextResponse } from "next/server";
import { AppDataSource } from "@/app/lib/data-source";
import { User } from "@/app/entities/User.entity";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, newContrasena } = await req.json();

        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { resetToken: token }
        });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
        }

        user.contrasena = await bcrypt.hash(newContrasena, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        
        await userRepository.save(user);

        return NextResponse.json({ message: "Contraseña actualizada" });
    } catch (error) {
        return NextResponse.json({ error: "Error al resetear" }, { status: 500 });
    }
}