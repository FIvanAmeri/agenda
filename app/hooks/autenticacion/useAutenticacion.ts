import { useEffect, useState } from "react";

export interface AuthUser {
    id: number;
    email: string;
    nombre: string;
}

export const useUser = (): AuthUser | null | undefined => {
    const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");
        if (!token) {
            setUser(null); 
            return;
        }

        const fetchUser = async (): Promise<void> => {
            try {
                const res: Response = await fetch("/api/auth/me", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data: { user: AuthUser } = await res.json();
                setUser(data.user);
            } catch (err: unknown) {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return user;
};