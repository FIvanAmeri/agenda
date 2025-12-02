"use client";

import React, { useEffect, useState } from "react";
import { User } from "../interfaz/interfaz";

interface Cirugia {
  id: number;
  fecha: string;
  paciente: string;
  tipoCirugia: string;
  medicoOpero: string;
  medicoAyudo1: string | null;
  medicoAyudo2: string | null;
  honorarios: number | null;
  descripcion: string | null;
}

interface Props {
  user: User;
}

export default function VerCirugiasContent({ user }: Props) {
  const [cirugias, setCirugias] = useState<Cirugia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCirugias = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3001/api/cirugia", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setCirugias(data);
        } else if (data && Array.isArray(data.data)) {
          setCirugias(data.data);
        } else if (data && Array.isArray(data.cirugias)) {
          setCirugias(data.cirugias);
        } else {
          setCirugias([]);
        }
      } catch {
        setCirugias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCirugias();
  }, [user.id]);

  if (loading) {
    return (
      <div className="text-center text-xl py-10 text-white">
        Cargando cirugías...
      </div>
    );
  }

  if (cirugias.length === 0) {
    return (
      <div className="text-center text-xl py-10 text-red-300">
        No hay cirugías ingresadas.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Cirugías</h1>

      <table className="min-w-full bg-[#0F2A35] shadow-xl rounded-lg overflow-hidden border border-[#1f3b47]">
        <thead className="bg-[#0c4a34] text-white uppercase text-sm">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Fecha</th>
            <th className="py-3 px-4 text-left">Paciente</th>
            <th className="py-3 px-4 text-left">Tipo</th>
            <th className="py-3 px-4 text-left">Operó</th>
            <th className="py-3 px-4 text-left">Ayudó 1</th>
            <th className="py-3 px-4 text-left">Ayudó 2</th>
            <th className="py-3 px-4 text-left">Honorarios</th>
            <th className="py-3 px-4 text-left">Descripción</th>
          </tr>
        </thead>

        <tbody className="text-gray-200 text-sm">
          {cirugias.map((c, index) => (
            <tr
              key={c.id}
              className={`transition duration-150 ${
                index % 2 === 0 ? "bg-[#143845]" : "bg-[#1a4553]"
              } hover:bg-[#1f5666]`}
            >
              <td className="py-3 px-4">{c.id}</td>
              <td className="py-3 px-4">{c.fecha}</td>
              <td className="py-3 px-4">{c.paciente}</td>
              <td className="py-3 px-4">{c.tipoCirugia}</td>
              <td className="py-3 px-4">{c.medicoOpero}</td>
              <td className="py-3 px-4">{c.medicoAyudo1}</td>
              <td className="py-3 px-4">{c.medicoAyudo2}</td>
              <td className="py-3 px-4">${c.honorarios}</td>
              <td className="py-3 px-4">{c.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
