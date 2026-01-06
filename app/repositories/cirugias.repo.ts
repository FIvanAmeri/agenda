import api from "@/app/services/api"
import { Cirugia } from "@/app/components/interfaz/interfaz"

export const listarCirugias = (params?: Record<string, string>) =>
  api.get<{ data: Cirugia[] }>("/cirugias", { params })

export const crearCirugia = (payload: Omit<Cirugia, "id">) =>
  api.post("/cirugias", payload)

export const obtenerCirugia = (id: number) =>
  api.get(`/cirugias/${id}`)

export const actualizarCirugia = (id: number, payload: Partial<Cirugia>) =>
  api.put(`/cirugias/${id}`, payload)

export const eliminarCirugia = (id: number) =>
  api.delete(`/cirugias/${id}`)

export const obtenerMedicos = () =>
  api.get<{ medicos: string[] }>("/cirugias/medicos")

export const obtenerTiposCirugia = () =>
  api.get<{ tiposCirugia: string[] }>("/cirugias/tipos")
