import { useEffect, useState } from "react";

export interface AuthUser {
    id: number;
    email: string;
    nombre: string;
}

export const useUser = () => {
    const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null); 
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3001/auth/me", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return user;
};
