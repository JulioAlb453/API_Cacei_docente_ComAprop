import { Request, Response } from "express";
import { AttendanceRecordRepository } from "../../../database/repositories/AttendanceRecordRepository";
import { AppDataSource } from "../../../database/data-source";
import { StudentSchema } from "../../../database/schemas/StudentSchema";
import { EventSchema } from "../../../database/schemas/EventSchema";
import { AttendanceRecordSchema } from "../../../database/schemas/AttendanceRecordSchema";

export class SeedAttendanceController {
  constructor(private attendanceRepository: AttendanceRecordRepository) {}

  /** POST /attendance/seed - Generar datos de prueba para las gráficas*/
  async seed(req: Request, res: Response): Promise<void> {
    try {
      console.log("[SeedAttendanceController] Generando datos de prueba...");

      const studentRepository = AppDataSource.getRepository(StudentSchema);
      let students = await studentRepository.find();

      if (students.length === 0) {
        console.log("[SeedAttendanceController] Creando estudiantes de prueba...");
        
        const testStudents = [];
        const groups = ["A", "B", "C", "D"];
        
        for (let grade = 1; grade <= 10; grade++) {
          for (let i = 0; i < 5; i++) {
            testStudents.push({
              name: `Estudiante ${grade}-${i + 1}`,
              email: `estudiante${grade}${i}@test.edu.mx`,
              password: "test123",
              tuition: 20240000 + (grade * 100) + i,
              grade: grade,
              group: groups[i % 4],
              status: "active",
            });
          }
        }

        await studentRepository.save(testStudents);
        console.log(`[SeedAttendanceController] ${testStudents.length} estudiantes creados`);
        students = await studentRepository.find();
      }

      console.log(`[SeedAttendanceController] Total estudiantes: ${students.length}`);

      const eventRepository = AppDataSource.getRepository(EventSchema);
      let events = await eventRepository.find();

      if (events.length === 0) {
        console.log("[SeedAttendanceController] Creando eventos de prueba...");
        
        const testEvents = [
          {
            name: "Tutoría de Diversidad e Inclusión - Enero",
            description: "Evento de tutoría enfocado en diversidad",
            date: new Date(2025, 0, 15),
            category: "Diversidad",
            location: "Aula 101",
            status: "completed",
            start_time: new Date(2025, 0, 15, 10, 0),
            end_time: new Date(2025, 0, 15, 12, 0),
            teacher_id: 1,
          },
          {
            name: "Tutoría de Equidad de Género - Febrero",
            description: "Evento de tutoría enfocado en equidad de género",
            date: new Date(2025, 1, 20),
            category: "Equidad de Género",
            location: "Aula 102",
            status: "completed",
            start_time: new Date(2025, 1, 20, 14, 0),
            end_time: new Date(2025, 1, 20, 16, 0),
            teacher_id: 1,
          },
          {
            name: "Tutoría de Inclusión - Marzo",
            description: "Evento de tutoría enfocado en inclusión",
            date: new Date(2025, 2, 10),
            category: "Inclusión",
            location: "Aula 103",
            status: "completed",
            start_time: new Date(2025, 2, 10, 9, 0),
            end_time: new Date(2025, 2, 10, 11, 0),
            teacher_id: 1,
          },
          {
            name: "Tutoría de Diversidad - Abril",
            description: "Segundo evento de diversidad",
            date: new Date(2025, 3, 5),
            category: "Diversidad",
            location: "Aula 104",
            status: "completed",
            start_time: new Date(2025, 3, 5, 10, 0),
            end_time: new Date(2025, 3, 5, 12, 0),
            teacher_id: 1,
          },
          {
            name: "Tutoría de Equidad - Mayo",
            description: "Evento de mayo",
            date: new Date(2025, 4, 15),
            category: "Equidad de Género",
            location: "Aula 105",
            status: "scheduled",
            start_time: new Date(2025, 4, 15, 14, 0),
            end_time: new Date(2025, 4, 15, 16, 0),
            teacher_id: 1,
          },
        ];

        await eventRepository.save(testEvents);
        console.log(`[SeedAttendanceController] ${testEvents.length} eventos creados`);
        events = await eventRepository.find();
      }

      console.log("[SeedAttendanceController] Generando registros de asistencia...");
      
      const attendanceRecords: any[] = [];
      const statuses: ("present" | "absent" | "justified" | "late")[] = ["present", "absent", "justified", "late"];
      
      const statusWeights = [0.7, 0.15, 0.1, 0.05];

      for (const event of events) {
        const numStudents = Math.floor(students.length * (0.7 + Math.random() * 0.2));
        const shuffledStudents = [...students].sort(() => Math.random() - 0.5).slice(0, numStudents);

        for (const student of shuffledStudents) {
          const random = Math.random();
          let status: "present" | "absent" | "justified" | "late" = "present";
          let cumulative = 0;
          
          for (let i = 0; i < statuses.length; i++) {
            cumulative += statusWeights[i];
            if (random <= cumulative) {
              status = statuses[i];
              break;
            }
          }

          attendanceRecords.push({
            student_id: (student as any).id,
            event_id: (event as any).id,
            date: (event as any).date,
            status: status,
            observations: status === "absent" ? "Sin justificación" : 
                         status === "justified" ? "Justificación médica" : null,
            register_by: "Sistema de prueba",
            arrival_time: status === "present" || status === "late" ? (event as any).start_time : null,
            departure_time: status === "present" ? (event as any).end_time : null,
            justification_type: status === "justified" ? "Médica" : null,
            evidence_urls: null,
          });
        }
      }

      if (attendanceRecords.length > 0) {
        await this.attendanceRepository.bulkCreate(attendanceRecords);
        console.log(`[SeedAttendanceController] ${attendanceRecords.length} registros de asistencia creados`);
      }

      const metrics = await this.attendanceRepository.getGlobalMetrics();

      res.status(201).json({
        success: true,
        message: "Datos de prueba generados exitosamente",
        data: {
          studentsCreated: students.length,
          eventsCreated: events.length,
          attendanceRecordsCreated: attendanceRecords.length,
          metrics: metrics,
        },
      });

    } catch (error) {
      console.error("[SeedAttendanceController] Error:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al generar datos de prueba",
        message: (error as Error).message,
      });
    }
  }

  /**
   * DELETE /attendance/seed - Limpiar datos de prueba
   */
  async clearSeed(req: Request, res: Response): Promise<void> {
    try {
      console.log("[SeedAttendanceController] Limpiando datos de prueba...");

      const attendanceRepo = AppDataSource.getRepository(AttendanceRecordSchema);
      const deletedAttendance = await attendanceRepo.delete({});

      res.status(200).json({
        success: true,
        message: "Datos de prueba eliminados",
        data: {
          attendanceRecordsDeleted: deletedAttendance.affected || 0,
        },
      });

    } catch (error) {
      console.error("[SeedAttendanceController] Error:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al limpiar datos de prueba",
        message: (error as Error).message,
      });
    }
  }
}

