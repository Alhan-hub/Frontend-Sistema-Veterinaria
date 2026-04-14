/** Contratos alineados con `src/api/*.py` del backend FastAPI. */
export interface UsuarioCreate {
  nombre: string;
  nombre_usuario: string;
  clave: string;
  email: string;
}
export interface UsuarioUpdate {
  nombre?: string | null;
  nombre_usuario?: string | null;
  clave?: string | null;
  email?: string | null;
}
export interface UsuarioRead {
  id_usuario: string;
  nombre: string;
  nombre_usuario: string;
  email: string;
}
export interface PropietarioCreate {
  nombre: string;
  telefono: string;
  email?: string | null;
  id_usuario_creacion: string;
}
export interface PropietarioUpdate {
  nombre?: string | null;
  telefono?: string | null;
  email?: string | null;
  id_usuario_edita: string;
}
export interface PropietarioRead {
  id_propietario: string;
  nombre: string;
  telefono: string;
  email?: string | null;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_creacion: string;
  id_usuario_edita?: string | null;
}
export interface MascotaCreate {
  nombre: string;
  id_propietario: string;
  id_usuario_creacion: string;
  edad: number;
  tipo_mascota: string;
  raza?: string | null;
}
export interface MascotaUpdate {
  nombre?: string | null;
  id_propietario?: string | null;
  edad?: number | null;
  tipo_mascota?: string | null;
  raza?: string | null;
  id_usuario_edita: string;
}
export interface MascotaRead {
  id_mascota: string;
  id_propietario: string;
  nombre: string;
  edad: number;
  tipo_mascota: string;
  raza?: string | null;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_creacion: string;
  id_usuario_edita?: string | null;
}
export interface CitaCreate {
  id_mascota: string;
  id_usuario_agenda: string;
  motivo: string;
  costo: number;
  lugar?: string | null;
  estado?: string;
}

export interface CitaUpdate {
  motivo?: string;
  costo?: number;
  lugar?: string | null;
  estado?: string;
}

export interface CitaRead {
  id_cita: string;
  id_mascota: string;
  id_usuario_agenda: string;
  fecha_hora: string;
  lugar?: string | null;
  motivo: string;
  costo: number;
  estado: string;
}

export interface FacturaCreate {
  id_cita: string;
  id_propietario: string;
  id_usuario_genera: string;
  total: number;
  metodo_pago: string;
}
export interface FacturaUpdate {
  total?: number | null;
  metodo_pago?: string | null;
}
export interface FacturaRead {
  id_factura: string;
  id_cita: string;
  id_propietario: string;
  id_usuario_genera: string;
  total: number;
  metodo_pago: string;
  fecha_pago: string;
}
export interface VacunaCreate {
  nombre: string;
  costo: number;
  id_mascota: string;
  id_usuario_registra: string;
}
export interface VacunaUpdate {
  nombre?: string | null;
  costo?: number | null;
}
export interface VacunaRead {
  id_vacuna: string;
  nombre: string;
  costo: number;
  id_mascota: string;
  id_usuario_registra: string;
}