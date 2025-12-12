import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Attendance_record } from "../../../core/entities/Attendance_record";
import { AttendanceRecordSchema } from "../schemas/AttendanceRecordSchema";

export interface AttendanceMetrics {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalJustified: number;
  totalLate: number;
  attendancePercentage: number;
}

export interface AttendanceByGrade {
  grade: number;
  total: number;
  present: number;
  percentage: number;
}

export interface AttendanceByMonth {
  month: number;
  year: number;
  monthName: string;
  totalPresent: number;
  totalEvents: number;
}

export interface AttendanceByGroup {
  group: string;
  total: number;
  present: number;
  percentage: number;
}

export class AttendanceRecordRepository {
  private repository: Repository<Attendance_record>;

  constructor() {
    this.repository = AppDataSource.getRepository(AttendanceRecordSchema);
  }

  async create(record: Attendance_record): Promise<Attendance_record> {
    const savedRecord = await this.repository.save(record);
    return savedRecord;
  }

  async findById(id: number): Promise<Attendance_record | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByStudentId(studentId: number): Promise<Attendance_record[]> {
    return await this.repository.find({ where: { student_id: studentId } });
  }

  async findByEventId(eventId: number): Promise<Attendance_record[]> {
    return await this.repository.find({ where: { event_id: eventId } });
  }

  async findAll(): Promise<Attendance_record[]> {
    return await this.repository.find();
  }

  async update(id: number, data: Partial<Attendance_record>): Promise<Attendance_record | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  // ============================================
  // MÉTODOS PARA MÉTRICAS DEL DASHBOARD

  /**
   * Obtener métricas globales de asistencia
   */
  async getGlobalMetrics(filters?: {
    grade?: number;
    group?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AttendanceMetrics> {
    let queryBuilder = this.repository.createQueryBuilder("ar");

    if (filters?.grade || filters?.group) {
      queryBuilder = queryBuilder
        .innerJoin("students", "s", "ar.student_id = s.id");
      
      if (filters.grade) {
        queryBuilder = queryBuilder.andWhere("s.grade = :grade", { grade: filters.grade });
      }
      if (filters.group) {
        queryBuilder = queryBuilder.andWhere("s.group = :group", { group: filters.group });
      }
    }

    if (filters?.startDate) {
      queryBuilder = queryBuilder.andWhere("ar.date >= :startDate", { startDate: filters.startDate });
    }
    if (filters?.endDate) {
      queryBuilder = queryBuilder.andWhere("ar.date <= :endDate", { endDate: filters.endDate });
    }

    const records = await queryBuilder.getMany();

    const totalStudents = records.length;
    const totalPresent = records.filter(r => r.status === "present").length;
    const totalAbsent = records.filter(r => r.status === "absent").length;
    const totalJustified = records.filter(r => r.status === "justified").length;
    const totalLate = records.filter(r => r.status === "late").length;
    const attendancePercentage = totalStudents > 0 
      ? Math.round(((totalPresent + totalLate) / totalStudents) * 100) 
      : 0;

    return {
      totalStudents,
      totalPresent,
      totalAbsent,
      totalJustified,
      totalLate,
      attendancePercentage,
    };
  }

  /**
   * Obtener asistencia agrupada por grado (cuatrimestre)
   */
  async getAttendanceByGrade(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<AttendanceByGrade[]> {
    let query = `
      SELECT 
        s.grade,
        COUNT(*) as total,
        SUM(CASE WHEN ar.status IN ('present', 'late') THEN 1 ELSE 0 END) as present
      FROM attendance_records ar
      INNER JOIN students s ON ar.student_id = s.id
    `;

    const params: any[] = [];

    if (filters?.startDate || filters?.endDate) {
      const conditions: string[] = [];
      if (filters.startDate) {
        conditions.push("ar.date >= ?");
        params.push(filters.startDate);
      }
      if (filters.endDate) {
        conditions.push("ar.date <= ?");
        params.push(filters.endDate);
      }
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY s.grade ORDER BY s.grade";

    const results = await this.repository.query(query, params);

    return results.map((row: any) => ({
      grade: parseInt(row.grade),
      total: parseInt(row.total),
      present: parseInt(row.present),
      percentage: row.total > 0 ? Math.round((row.present / row.total) * 100) : 0,
    }));
  }

  /**
   * Obtener asistencia agrupada por grupo
   */
  async getAttendanceByGroup(filters?: {
    grade?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AttendanceByGroup[]> {
    let query = `
      SELECT 
        s.\`group\` as grp,
        COUNT(*) as total,
        SUM(CASE WHEN ar.status IN ('present', 'late') THEN 1 ELSE 0 END) as present
      FROM attendance_records ar
      INNER JOIN students s ON ar.student_id = s.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.grade) {
      conditions.push("s.grade = ?");
      params.push(filters.grade);
    }
    if (filters?.startDate) {
      conditions.push("ar.date >= ?");
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      conditions.push("ar.date <= ?");
      params.push(filters.endDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY s.`group` ORDER BY s.`group`";

    const results = await this.repository.query(query, params);

    return results.map((row: any) => ({
      group: row.grp,
      total: parseInt(row.total),
      present: parseInt(row.present),
      percentage: row.total > 0 ? Math.round((row.present / row.total) * 100) : 0,
    }));
  }

  /**
   * Obtener asistencia mensual (para gráfica de línea)
   */
  async getMonthlyAttendance(year?: number): Promise<AttendanceByMonth[]> {
    const targetYear = year || new Date().getFullYear();

    const query = `
      SELECT 
        MONTH(ar.date) as month,
        YEAR(ar.date) as year,
        SUM(CASE WHEN ar.status IN ('present', 'late') THEN 1 ELSE 0 END) as total_present,
        COUNT(DISTINCT ar.event_id) as total_events
      FROM attendance_records ar
      WHERE YEAR(ar.date) = ?
      GROUP BY YEAR(ar.date), MONTH(ar.date)
      ORDER BY MONTH(ar.date)
    `;

    const results = await this.repository.query(query, [targetYear]);

    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const monthlyData: AttendanceByMonth[] = [];
    for (let i = 1; i <= 12; i++) {
      const found = results.find((r: any) => parseInt(r.month) === i);
      monthlyData.push({
        month: i,
        year: targetYear,
        monthName: monthNames[i - 1],
        totalPresent: found ? parseInt(found.total_present) : 0,
        totalEvents: found ? parseInt(found.total_events) : 0,
      });
    }

    return monthlyData;
  }

  /**
   * Obtener distribución global de asistencia (para gráfica de pastel)
   * Participación por Categoría = Σ Asistentes_categoría / Total Eventos
   */
  async getAttendanceDistribution(filters?: {
    grade?: number;
    group?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ 
    present: number; 
    absent: number; 
    justified: number; 
    late: number;
    totalEvents: number;
    totalStudents: number;
    presentPerEvent: number;
    absentPerEvent: number;
    justifiedPerEvent: number;
    latePerEvent: number;
  }> {
    let query = `
      SELECT 
        SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN ar.status = 'justified' THEN 1 ELSE 0 END) as justified,
        SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END) as late,
        COUNT(DISTINCT ar.event_id) as total_events,
        COUNT(DISTINCT ar.student_id) as total_students
      FROM attendance_records ar
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.grade || filters?.group) {
      query = query.replace("FROM attendance_records ar", 
        "FROM attendance_records ar INNER JOIN students s ON ar.student_id = s.id");
      
      if (filters.grade) {
        conditions.push("s.grade = ?");
        params.push(filters.grade);
      }
      if (filters.group) {
        conditions.push("s.`group` = ?");
        params.push(filters.group);
      }
    }

    if (filters?.startDate) {
      conditions.push("ar.date >= ?");
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      conditions.push("ar.date <= ?");
      params.push(filters.endDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const results = await this.repository.query(query, params);
    const row = results[0] || { present: 0, absent: 0, justified: 0, late: 0, total_events: 0, total_students: 0 };

    const present = parseInt(row.present) || 0;
    const absent = parseInt(row.absent) || 0;
    const justified = parseInt(row.justified) || 0;
    const late = parseInt(row.late) || 0;
    const totalEvents = parseInt(row.total_events) || 1; 
    const totalStudents = parseInt(row.total_students) || 0;

    return {
      present,
      absent,
      justified,
      late,
      totalEvents,
      totalStudents,
      // Participación por Categoría = Σ Asistentes_c / Total Eventos
      presentPerEvent: Math.round((present / totalEvents) * 100) / 100,
      absentPerEvent: Math.round((absent / totalEvents) * 100) / 100,
      justifiedPerEvent: Math.round((justified / totalEvents) * 100) / 100,
      latePerEvent: Math.round((late / totalEvents) * 100) / 100,
    };
  }

  /**
   * Crear registro de asistencia en lote (bulk)
   */
  async bulkCreate(records: Partial<Attendance_record>[]): Promise<Attendance_record[]> {
    const savedRecords = await this.repository.save(records);
    return savedRecords;
  }

  /**
   * Actualizar estado de asistencia
   */
  async updateStatus(
    studentId: number, 
    eventId: number, 
    status: "present" | "absent" | "justified" | "late"
  ): Promise<Attendance_record | null> {
    const record = await this.repository.findOne({
      where: { student_id: studentId, event_id: eventId }
    });

    if (record) {
      record.status = status;
      record.updated_at = new Date();
      return await this.repository.save(record);
    }

    return null;
  }
}

