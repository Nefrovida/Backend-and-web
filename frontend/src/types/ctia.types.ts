export interface CitaDetallada {
  id: string;
  fecha: string;
  horario: string;
  motivo: string;
  consultorio: number;
  paciente: PacienteInfo;
}

export interface PacienteInfo {
  nombre: string;
  edad: number;
  sexo: string;
  diagnostico: string;
  ultimoAnalisisUrl: string; 
}