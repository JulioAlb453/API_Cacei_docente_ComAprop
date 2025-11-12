import { ITeacher } from "../interfaces/iteacher";
import { Event } from "./Event";

export class Teacher implements ITeacher {
  constructor(
    public id: number,
    public name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public status: "active" | "inactive" = "active",
    public created_at: Date = new Date(),
    public updated_at: Date = new Date()
  ) {}

  //  Método para crear eventos
  createEvent(
    name: string,
    description: string,
    date: Date,
    category: string,
    location: string,
    start_time: Date,
    end_time: Date
  ): Event {
    // Validaciones antes de crear el evento
    if (!this.canCreateEvents()) {
      throw new Error("El tutor no está autorizado para crear eventos");
    }

    if (start_time >= end_time) {
      throw new Error("La hora de inicio debe ser anterior a la hora de fin");
    }

    if (date < new Date()) {
      throw new Error("No se pueden crear eventos en fechas pasadas");
    }

    // Crear y retornar el nuevo evento
    return new Event(
      0,
      name,
      description,
      date,
      category,
      location,
      "scheduled",
      start_time,
      end_time,
      this.id,
      new Date(),
      new Date(),
      []
    );
  }

  //  Validar si el tutor puede crear eventos (sin departamento)
  canCreateEvents(): boolean {
    return this.isActive() && this.validateEmail();
  }

  // Gestion de Perfil
  updateProfile(updates: Partial<Teacher>): Teacher {
    return new Teacher(
      this.id,
      updates.name || this.name,
      updates.last_name || this.last_name,
      updates.email || this.email,
      this.password,
      updates.status || this.status,
      this.created_at,
      new Date()
    );
  }

  changePassword(newPassword: string, currentPassword: string): void {
    if (this.password !== currentPassword) {
      throw new Error("La contraseña actual es incorrecta");
    }
    if (newPassword.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
    }
    this.password = newPassword;
    this.updated_at = new Date();
  }

  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  getFullName(): string {
    return `${this.name} ${this.last_name}`.trim();
  }

  // Gestion de Estado
  activate(): void {
    this.status = "active";
    this.updated_at = new Date();
  }

  deactivate(): void {
    this.status = "inactive";
    this.updated_at = new Date();
  }

  isActive(): boolean {
    return this.status === "active";
  }

  // Validaciones adicionales
  canManageAttendance(): boolean {
    return this.isActive();
  }

  // Metodos de Dominio
  generateTeacherCode(): string {
    const initials = (
      this.name.charAt(0) + this.last_name.charAt(0)
    ).toUpperCase();
    const idPart = this.id.toString().padStart(4, "0");
    return `TCH-${initials}-${idPart}`;
  }

  // Seguridad
  maskSensitiveData(): Partial<Teacher> {
    return {
      id: this.id,
      name: this.name,
      last_name: this.last_name,
      email: this.email,
      status: this.status,
      created_at: this.created_at,
    };
  }

  // Metodos de Reporte
  getTeacherSummary(): string {
    return `
Resumen del Profesor:
-------------------
Nombre: ${this.getFullName()}
Email: ${this.email}
Estado: ${this.status}
Codigo: ${this.generateTeacherCode()}
    `.trim();
  }

  // Metodos de Validacion
  isValidForRegistration(): boolean {
    return (
      this.name.length > 0 &&
      this.last_name.length > 0 &&
      this.validateEmail() &&
      this.password.length >= 6
    );
  }

  // Metodos de Transformacion
  toJSON(): any {
    return this.maskSensitiveData();
  }

  // Metodos de Comparacion
  equals(other: Teacher): boolean {
    return this.id === other.id && this.email === other.email;
  }

  // Metodos de Actualizacion
  bulkUpdate(updates: Partial<Teacher>): void {
    if (updates.name) this.name = updates.name;
    if (updates.last_name) this.last_name = updates.last_name;
    if (updates.email) this.email = updates.email;
    if (updates.status) this.status = updates.status;

    this.updated_at = new Date();
  }
}
