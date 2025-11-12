import { IEvent_report } from "../interfaces/ievent_report";

export class Event_report implements IEvent_report {
  constructor(
    public id: number,
    public event_id: number,
    public student_id: number,
    public teacher_id: number,
    public name: string,
    public start_period: Date,
    public end_period: Date,
    public date: Date,
    public format: string,
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
    public content: string = "",
    public status: "draft" | "submitted" | "approved" | "rejected" = "draft",
    public attachments: string[] = [],
    public metrics: {
      total_students?: number;
      present_students?: number;
      attendance_rate?: number;
      total_duration?: number;
      topics_covered?: string[];
      student_performances?: Array<{
        student_id: number;
        performance: number;
        comments?: string;
        evaluated_at: Date;
      }>;
    } = {}
  ) {}

  //  Gestión de Contenido
  updateContent(newContent: string): void {
    if (this.status === "approved") {
      throw new Error("No se puede modificar un reporte aprobado");
    }
    this.content = newContent;
    this.updated_at = new Date();
  }

  addSection(sectionTitle: string, sectionContent: string): void {
    this.content += `\n\n## ${sectionTitle}\n${sectionContent}`;
    this.updated_at = new Date();
  }

  //  Gestión de Métricas
  calculateAttendanceRate(
    totalStudents: number,
    presentStudents: number
  ): void {
    if (totalStudents <= 0) {
      throw new Error("El total de estudiantes debe ser mayor a 0");
    }
    if (presentStudents > totalStudents) {
      throw new Error("No puede haber más presentes que estudiantes totales");
    }

    this.metrics.total_students = totalStudents;
    this.metrics.present_students = presentStudents;
    this.metrics.attendance_rate = Number(
      ((presentStudents / totalStudents) * 100).toFixed(2)
    );
    this.updated_at = new Date();
  }

  addStudentPerformance(
    studentId: number,
    performance: number,
    comments?: string
  ): void {
    if (performance < 0 || performance > 10) {
      throw new Error("El desempeño debe estar entre 0 y 10");
    }

    if (!this.metrics.student_performances) {
      this.metrics.student_performances = [];
    }

    // Actualizar si ya existe, o agregar nuevo
    const existingIndex = this.metrics.student_performances.findIndex(
      (perf) => perf.student_id === studentId
    );

    if (existingIndex >= 0) {
      this.metrics.student_performances[existingIndex] = {
        student_id: studentId,
        performance,
        comments,
        evaluated_at: new Date(),
      };
    } else {
      this.metrics.student_performances.push({
        student_id: studentId,
        performance,
        comments,
        evaluated_at: new Date(),
      });
    }
    this.updated_at = new Date();
  }

  //  Gestión de Archivos Adjuntos
  addAttachment(fileUrl: string): void {
    if (!this.attachments.includes(fileUrl)) {
      this.attachments.push(fileUrl);
      this.updated_at = new Date();
    }
  }

  removeAttachment(fileUrl: string): void {
    this.attachments = this.attachments.filter(
      (attachment) => attachment !== fileUrl
    );
    this.updated_at = new Date();
  }

  //  Gestión de Estados
  submit(): void {
    if (this.status !== "draft") {
      throw new Error("Solo reportes en borrador pueden enviarse");
    }
    if (this.content.length === 0) {
      throw new Error("El reporte no puede estar vacío");
    }
    this.status = "submitted";
    this.updated_at = new Date();
  }

  approve(): void {
    if (this.status !== "submitted") {
      throw new Error("Solo reportes enviados pueden aprobarse");
    }
    this.status = "approved";
    this.updated_at = new Date();
  }

  reject(reason?: string): void {
    if (this.status !== "submitted") {
      throw new Error("Solo reportes enviados pueden rechazarse");
    }
    this.status = "rejected";
    if (reason) {
      this.content += `\n\n**Razón de rechazo:** ${reason}`;
    }
    this.updated_at = new Date();
  }

  returnToDraft(): void {
    if (this.status !== "submitted") {
      throw new Error("Solo reportes enviados pueden volver a borrador");
    }
    this.status = "draft";
    this.updated_at = new Date();
  }

  //  Generación de Reportes
  generateSummary(): string {
    return `
RESUMEN DEL REPORTE:
-------------------
Evento: ${this.name}
Período: ${this.start_period.toLocaleDateString()} - ${this.end_period.toLocaleDateString()}
Fecha de reporte: ${this.date.toLocaleDateString()}
Estado: ${this.status}

MÉTRICAS:
- Total estudiantes: ${this.metrics.total_students || 0}
- Estudiantes presentes: ${this.metrics.present_students || 0}
- Tasa de asistencia: ${this.metrics.attendance_rate?.toFixed(2) || 0}%
- Archivos adjuntos: ${this.attachments.length}
    `.trim();
  }

  //  Actualización de Reporte
  update(updates: Partial<Event_report>): Event_report {
    return new Event_report(
      this.id,
      updates.event_id || this.event_id,
      updates.student_id || this.student_id,
      updates.teacher_id || this.teacher_id,
      updates.name || this.name,
      updates.start_period || this.start_period,
      updates.end_period || this.end_period,
      updates.date || this.date,
      updates.format || this.format,
      this.created_at,
      new Date(),
      updates.content || this.content,
      updates.status || this.status,
      updates.attachments || this.attachments,
      updates.metrics || this.metrics
    );
  }

  //  Validaciones
  isValidForSubmission(): boolean {
    return (
      this.content.length > 0 && this.name.length > 0 && this.status === "draft"
    );
  }

  isApproved(): boolean {
    return this.status === "approved";
  }

  isPending(): boolean {
    return this.status === "submitted";
  }

  //  Exportación
  exportToJSON(): any {
    return {
      id: this.id,
      event_id: this.event_id,
      teacher_id: this.teacher_id,
      name: this.name,
      period: {
        start: this.start_period,
        end: this.end_period,
      },
      report_date: this.date,
      content: this.content,
      status: this.status,
      metrics: this.metrics,
      attachments: this.attachments,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  //  Métricas Adicionales
  getStudentPerformance(studentId: number): number | undefined {
    return this.metrics.student_performances?.find(
      (perf) => perf.student_id === studentId
    )?.performance;
  }

  getAveragePerformance(): number {
    const performances = this.metrics.student_performances || [];
    if (performances.length === 0) return 0;

    const total = performances.reduce((sum, perf) => sum + perf.performance, 0);
    return Number((total / performances.length).toFixed(2));
  }

  //  Utilidades de Tiempo
  isWithinPeriod(checkDate: Date): boolean {
    return checkDate >= this.start_period && checkDate <= this.end_period;
  }

  getPeriodDuration(): number {
    const diffTime = Math.abs(
      this.end_period.getTime() - this.start_period.getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Días
  }
}
