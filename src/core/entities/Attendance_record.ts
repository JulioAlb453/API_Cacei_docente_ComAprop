import { IAttendance_record } from "../interfaces/iattendance_record";

export class Attendance_record implements IAttendance_record {
  constructor(
    public id: number,
    public student_id: number,
    public event_id: number,
    public date: Date,
    public status: 'present' | 'absent' | 'justified' | 'late' = 'absent',
    public observations: string = '',
    public register_by: string,
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
    public arrival_time: Date | null = null,
    public departure_time: Date | null = null,
    public justification_type: string = '',
    public evidence_urls: string[] = []
  ) {}

  // Gestion de Estado de Asistencia
  markAsPresent(arrivalTime?: Date): void {
    this.status = 'present';
    this.arrival_time = arrivalTime || new Date();
    this.observations = this.observations.replace(/Ausente|Justificado|Tardío/g, 'Presente').trim();
    this.updated_at = new Date();
  }

  markAsAbsent(reason?: string): void {
    this.status = 'absent';
    this.arrival_time = null;
    this.departure_time = null;
    if (reason) {
      this.observations = reason;
    }
    this.updated_at = new Date();
  }

  markAsJustified(justificationType: string, reason: string, evidenceUrls?: string[]): void {
    this.status = 'justified';
    this.justification_type = justificationType;
    this.observations = reason;
    if (evidenceUrls) {
      this.evidence_urls = evidenceUrls;
    }
    this.updated_at = new Date();
  }

  markAsLate(arrivalTime: Date, reason?: string): void {
    this.status = 'late';
    this.arrival_time = arrivalTime;
    if (reason) {
      this.observations = reason;
    }
    this.updated_at = new Date();
  }

  // Validaciones de Estado
  isPresent(): boolean {
    return this.status === 'present';
  }

  isAbsent(): boolean {
    return this.status === 'absent';
  }

  isJustified(): boolean {
    return this.status === 'justified';
  }

  isLate(): boolean {
    return this.status === 'late';
  }

  // Gestion de Tiempos
  recordDeparture(departureTime?: Date): void {
    if (!this.isPresent() && !this.isLate()) {
      throw new Error('Solo se puede registrar salida para asistencias presentes o tardías');
    }
    this.departure_time = departureTime || new Date();
    this.updated_at = new Date();
  }

  calculateDuration(): number | null {
    if (!this.arrival_time || !this.departure_time) {
      return null;
    }
    const durationMs = this.departure_time.getTime() - this.arrival_time.getTime();
    return Math.floor(durationMs / (1000 * 60)); // Duración en minutos
  }

  // Gestion de Evidencias
  addEvidence(url: string): void {
    if (!this.evidence_urls.includes(url)) {
      this.evidence_urls.push(url);
      this.updated_at = new Date();
    }
  }

  removeEvidence(url: string): void {
    this.evidence_urls = this.evidence_urls.filter(evidenceUrl => evidenceUrl !== url);
    this.updated_at = new Date();
  }

  // Gestion de Observaciones
  updateObservations(observations: string): void {
    this.observations = observations;
    this.updated_at = new Date();
  }

  appendObservation(additionalObservation: string): void {
    if (this.observations) {
      this.observations += `; ${additionalObservation}`;
    } else {
      this.observations = additionalObservation;
    }
    this.updated_at = new Date();
  }

  // Validaciones de Negocio
  isValidForSubmission(): boolean {
    if (this.isJustified() && !this.justification_type) {
      return false;
    }
    if (this.isLate() && !this.arrival_time) {
      return false;
    }
    return true;
  }

  canBeModified(): boolean {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.created_at > twentyFourHoursAgo;
  }

  // Metodos de Reporte
  getAttendanceSummary(): string {
    let summary = `Asistencia: ${this.status.toUpperCase()}`;
    
    if (this.arrival_time) {
      summary += ` | Hora de llegada: ${this.arrival_time.toLocaleTimeString()}`;
    }
    
    if (this.departure_time) {
      summary += ` | Hora de salida: ${this.departure_time.toLocaleTimeString()}`;
    }
    
    if (this.justification_type) {
      summary += ` | Justificación: ${this.justification_type}`;
    }
    
    if (this.observations) {
      summary += ` | Observaciones: ${this.observations}`;
    }
    
    return summary;
  }

  // Metodos de Transformacion
  toJSON(): any {
    return {
      id: this.id,
      student_id: this.student_id,
      event_id: this.event_id,
      date: this.date,
      status: this.status,
      observations: this.observations,
      register_by: this.register_by,
      arrival_time: this.arrival_time,
      departure_time: this.departure_time,
      justification_type: this.justification_type,
      evidence_urls: this.evidence_urls,
      duration_minutes: this.calculateDuration(),
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Metodos de Actualizacion
  update(updates: Partial<Attendance_record>): Attendance_record {
    return new Attendance_record(
      this.id,
      updates.student_id || this.student_id,
      updates.event_id || this.event_id,
      updates.date || this.date,
      updates.status || this.status,
      updates.observations || this.observations,
      updates.register_by || this.register_by,
      this.created_at,
      new Date(),
      updates.arrival_time !== undefined ? updates.arrival_time : this.arrival_time,
      updates.departure_time !== undefined ? updates.departure_time : this.departure_time,
      updates.justification_type || this.justification_type,
      updates.evidence_urls || this.evidence_urls
    );
  }

  // Metodos de Utilidad
  isSameEvent(otherRecord: Attendance_record): boolean {
    return this.event_id === otherRecord.event_id;
  }

  isSameStudent(otherRecord: Attendance_record): boolean {
    return this.student_id === otherRecord.student_id;
  }

  // Metodos de Calculo
  getAttendanceValue(): number {
    switch (this.status) {
      case 'present': return 1;
      case 'late': return 0.5;
      case 'justified': return 0.5;
      case 'absent': return 0;
      default: return 0;
    }
  }
}