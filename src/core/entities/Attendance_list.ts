import { IAttendance_list } from "../interfaces/iattendance_list";
import { FileEvidence } from "../interfaces/file_evidence";
import { StudentAttendance } from "../interfaces/StudentAttendance";
import { AttendanceStatus } from "../interfaces/StudentAttendance";

export class Attendance_list implements IAttendance_list {
  private attendanceMap: Map<number, StudentAttendance> = new Map();
  
  constructor(
    public id: number,
    public student_id: number[],
    public teacher_id: number,
    public event_id: number,
    public date: Date,
    public status: string,
    public observations: string,
    public register_by: string,
    public evidences: string[] = [], 
    public created_at: Date = new Date(),
    public updated_at: Date = new Date()
  ) {
    student_id.forEach(studentId => {
      this.attendanceMap.set(studentId, {
        studentId,
        status: 'pending',
        markedAt: new Date()
      });
    });
  }

  update(updates: Partial<Attendance_list>): Attendance_list {
    return new Attendance_list(
      this.id,
      updates.student_id || this.student_id,
      updates.teacher_id || this.teacher_id,
      updates.event_id || this.event_id,
      updates.date || this.date,
      updates.status || this.status,
      updates.observations || this.observations,
      updates.register_by || this.register_by,
      updates.evidences || this.evidences,
      this.created_at,
      new Date()
    );
  }

  cancel(): void {
    this.status = 'cancelled';
    this.updated_at = new Date();
  }

  complete(): void {
    this.status = 'completed';
    this.updated_at = new Date();
  }

  addStudent(studentId: number): void {
    if (!this.student_id.includes(studentId)) {
      this.student_id.push(studentId);
      this.attendanceMap.set(studentId, {
        studentId,
        status: 'pending',
        markedAt: new Date()
      });
      this.updated_at = new Date();
    }
  }

  removeStudent(studentId: number): void {
    this.student_id = this.student_id.filter(id => id !== studentId);
    this.attendanceMap.delete(studentId);
    this.updated_at = new Date();
  }

  bulkAddStudents(studentIds: number[]): void {
    studentIds.forEach(studentId => {
      if (!this.student_id.includes(studentId)) {
        this.student_id.push(studentId);
        this.attendanceMap.set(studentId, {
          studentId,
          status: 'pending',
          markedAt: new Date()
        });
      }
    });
    this.updated_at = new Date();
  }

  markAttendance(studentId: number, status: AttendanceStatus, justification?: string): void {
    if (!this.student_id.includes(studentId)) {
      throw new Error('Estudiante no está en la lista');
    }

    const attendance: StudentAttendance = {
      studentId,
      status,
      markedAt: new Date(),
      justification
    };
    
    this.attendanceMap.set(studentId, attendance);
    this.updated_at = new Date();
  }

  bulkMarkAttendance(attendances: { studentId: number; status: AttendanceStatus; justification?: string }[]): void {
    attendances.forEach(att => {
      this.markAttendance(att.studentId, att.status, att.justification);
    });
  }

  getStudentAttendance(studentId: number): StudentAttendance | undefined {
    return this.attendanceMap.get(studentId);
  }

  addEvidence(fileUrl: string): void {
    this.evidences.push(fileUrl);
    this.updated_at = new Date();
  }

  removeEvidence(fileUrl: string): void {
    this.evidences = this.evidences.filter(evidence => evidence !== fileUrl);
    this.updated_at = new Date();
  }

  addFileEvidence(fileInfo: FileEvidence): void {
    this.evidences.push(fileInfo.url);
    this.updated_at = new Date();
  }

  getEvidencesAsStructured(): FileEvidence[] {
    return this.evidences.map(url => ({
      id: this.generateIdFromUrl(url),
      filename: this.extractFilenameFromUrl(url),
      url: url,
      uploadedAt: new Date()
    }));
  }

  generateReport(): string {
    const present = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'present').length;
    const absent = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'absent').length;
    const justified = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'justified').length;
    const pending = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'pending').length;

    return `Reporte de Asistencia: 
    - Presentes: ${present}
    - Ausentes: ${absent} 
    - Justificados: ${justified}
    - Pendientes: ${pending}
    - Total estudiantes: ${this.student_id.length}
    - Evidencias: ${this.evidences.length}`;
  }

  getAttendanceSummary(): { present: number; absent: number; justified: number; pending: number } {
    const present = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'present').length;
    const absent = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'absent').length;
    const justified = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'justified').length;
    const pending = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'pending').length;

    return { present, absent, justified, pending };
  }

  exportToExcelFormat(): any {
    const attendanceData = this.student_id.map(studentId => {
      const attendance = this.attendanceMap.get(studentId);
      return {
        studentId,
        attendance: attendance?.status || 'pending',
        justification: attendance?.justification || '',
        markedAt: attendance?.markedAt || null
      };
    });

    return {
      listId: this.id,
      eventId: this.event_id,
      date: this.date,
      teacherId: this.teacher_id,
      status: this.status,
      students: attendanceData,
      evidences: this.evidences,
      generatedAt: new Date()
    };
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  getPendingStudents(): number[] {
    return Array.from(this.attendanceMap.entries())
      .filter(([_, attendance]) => attendance.status === 'pending')
      .map(([studentId, _]) => studentId);
  }

  getAttendanceRate(): number {
    const total = this.student_id.length;
    if (total === 0) return 0;
    
    const presentCount = Array.from(this.attendanceMap.values())
      .filter(att => att.status === 'present').length;
    
    return (presentCount / total) * 100;
  }

  private generateIdFromUrl(url: string): string {
    return `evid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractFilenameFromUrl(url: string): string {
    return url.split('/').pop() || 'archivo';
  }
}