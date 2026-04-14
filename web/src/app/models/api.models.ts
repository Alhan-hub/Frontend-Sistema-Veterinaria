/** Contratos alineados con `src/api/*.py` del backend FastAPI. */

export interface Usuario {
  id_usuario: string;
  nombre: string;
  nombre_usuario: string;
  clave: string;
  email: string;
  fecha_creacion: string;
  fecha_edicion: string;
}

export interface Propietario {
  id_propietario: string;
  nombre: string;
  email?: string | null;
  telefono: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_creacion: string;
  id_usuario_edita?: string | null;
}

export interface Mascota {
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

export interface Cita {
  id_cita: string;
  id_mascota: string;
  id_usuario_agenda: string;
  fecha_hora: string;
  lugar?: string | null;
  motivo: string;
  costo: number;
  estado: string;
}

export interface Factura {
  id_factura: string;
  id_cita: string;
  id_propietario: string;
  id_usuario_genera: string;
  total: number;
  metodo_pago: string;
  fecha_pago: string;
}

export interface Vacuna {
  id_vacuna: string;
  nombre: string;
  costo: number;
  id_mascota: string;
  id_usuario_registra: string;
}