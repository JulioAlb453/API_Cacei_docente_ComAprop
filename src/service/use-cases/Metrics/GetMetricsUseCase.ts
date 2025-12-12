import { 
  AttendanceRecordRepository, 
  AttendanceMetrics, 
  AttendanceByGrade, 
  AttendanceByMonth,
  AttendanceByGroup 
} from "../../../infraestructure/database/repositories/AttendanceRecordRepository";

export interface MetricsFilters {
  grade?: number;
  group?: string;
  startDate?: Date;
  endDate?: Date;
  year?: number;
}

export interface DashboardMetrics {
  summary: AttendanceMetrics;
  distribution: {
    present: number;
    absent: number;
    justified: number;
    late: number;
  };
  byGrade: AttendanceByGrade[];
  byGroup: AttendanceByGroup[];
  monthly: AttendanceByMonth[];
}

export class GetMetricsUseCase {
  constructor(private attendanceRepository: AttendanceRecordRepository) {}

  /* Obtener todas las métricas del dashboard */
  async execute(filters?: MetricsFilters): Promise<DashboardMetrics> {
    console.log("[GetMetricsUseCase] Obteniendo métricas con filtros:", filters);

    const [summary, distribution, byGrade, byGroup, monthly] = await Promise.all([
      this.attendanceRepository.getGlobalMetrics({
        grade: filters?.grade,
        group: filters?.group,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      }),
      this.attendanceRepository.getAttendanceDistribution({
        grade: filters?.grade,
        group: filters?.group,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      }),
      this.attendanceRepository.getAttendanceByGrade({
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      }),
      this.attendanceRepository.getAttendanceByGroup({
        grade: filters?.grade,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      }),
      this.attendanceRepository.getMonthlyAttendance(filters?.year),
    ]);

    console.log("[GetMetricsUseCase] Métricas obtenidas exitosamente");

    return {
      summary,
      distribution,
      byGrade,
      byGroup,
      monthly,
    };
  }

  /**
   * Obtener solo el resumen de métricas (para tarjetas)
   */
  async getSummary(filters?: MetricsFilters): Promise<AttendanceMetrics> {
    return await this.attendanceRepository.getGlobalMetrics({
      grade: filters?.grade,
      group: filters?.group,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
  }

  /**
   * Obtener distribución de asistencia (para gráfica de pastel)
   */
  async getDistribution(filters?: MetricsFilters) {
    return await this.attendanceRepository.getAttendanceDistribution({
      grade: filters?.grade,
      group: filters?.group,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
  }

  /**
   * Obtener asistencia por grado (para gráfica de barras)
   */
  async getByGrade(filters?: MetricsFilters): Promise<AttendanceByGrade[]> {
    return await this.attendanceRepository.getAttendanceByGrade({
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
  }

  /**
   * Obtener asistencia por grupo
   */
  async getByGroup(filters?: MetricsFilters): Promise<AttendanceByGroup[]> {
    return await this.attendanceRepository.getAttendanceByGroup({
      grade: filters?.grade,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });
  }

  /**
   * Obtener asistencia mensual (para gráfica de línea)
   */
  async getMonthly(year?: number): Promise<AttendanceByMonth[]> {
    return await this.attendanceRepository.getMonthlyAttendance(year);
  }
}

