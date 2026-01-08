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

        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOneBy({ resetToken: token });

        if (!user) {
            return NextResponse.json({ error: "Token inválido" }, { status: 400 });
        }

        const ahora = new Date();
        if (!user.resetTokenExpires || user.resetTokenExpires < ahora) {
            return NextResponse.json({ error: "Token expirado" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(newContrasena, 12);

        await repo.update(user.id, {
            contrasena: hashed,
            resetToken: null,
            resetTokenExpires: null
        });

        return NextResponse.json({ message: "Contraseña actualizada" }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error interno";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}