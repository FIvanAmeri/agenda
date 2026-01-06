import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: number;
}

export function verifyAuthHeader(authHeader: string | null): AuthPayload {
  if (!authHeader) {
    throw new Error("Token no provisto");
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new Error("Formato de token inválido");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no configurado");
  }

  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded)
  ) {
    throw new Error("Token inválido");
  }

  return decoded as AuthPayload;
}