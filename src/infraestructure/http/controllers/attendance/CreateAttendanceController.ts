import { Request, Response } from "express";
import { AttendanceRecordRepository } from "../../../database/repositories/AttendanceRecordRepository";
import { Attendance_record } from "../../../../core/entities/Attendance_record";

export class CreateAttendanceController {
  constructor(private attendanceRepository: AttendanceRecordRepository) {}

  /**
   * POST /attendance - Crear un registro de asistencia individual
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { student_id, event_id, status, observations, register_by } = req.body;

      console.log("[CreateAttendanceController] Creando registro de asistencia:", req.body);

      if (!student_id || !event_id || !register_by) {
        res.status(400).json({
          success: false,
          error: "Faltan campos obligatorios (student_id, event_id, register_by)",
        });
        return;
      }

      const record = new Attendance_record(
        0,
        student_id,
        event_id,
        new Date(),
        status || "absent",
        observations || "",
        register_by
      );

      const savedRecord = await this.attendanceRepository.create(record);

      console.log("[CreateAttendanceController] Registro creado con ID:", savedRecord.id);

      res.status(201).json({
        success: true,
        data: savedRecord,
      });
    } catch (error) {
      console.error("[CreateAttendanceController] Error:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al crear registro de asistencia",
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /attendance/bulk - Crear múltiples registros de asistencia
   */
  async bulkCreate(req: Request, res: Response): Promise<void> {
    try {
      const { records, event_id, register_by } = req.body;

      console.log("[CreateAttendanceController] Creando registros en lote:", records?.length);

      if (!records || !Array.isArray(records) || records.length === 0) {
        res.status(400).json({
          success: false,
          error: "Se requiere un array de registros",
        });
        return;
      }

      if (!event_id || !register_by) {
        res.status(400).json({
          success: false,
          error: "Faltan campos obligatorios (event_id, register_by)",
        });
        return;
      }

      const attendanceRecords = records.map((record: any) => ({
        student_id: record.student_id,
        event_id: event_id,
        date: new Date(),
        status: record.status || "absent",
        observations: record.observations || "",
        register_by: register_by,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const savedRecords = await this.attendanceRepository.bulkCreate(attendanceRecords);

      console.log("[CreateAttendanceController] Registros creados:", savedRecords.length);

      res.status(201).json({
        success: true,
        data: savedRecords,
        count: savedRecords.length,
      });
    } catch (error) {
      console.error("[CreateAttendanceController] Error en bulk:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al crear registros de asistencia",
        message: (error as Error).message,
      });
    }
  }

  /**
   * PUT /attendance/:studentId/:eventId - Actualizar estado de asistencia
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { studentId, eventId } = req.params;
      const { status } = req.body;

      console.log(`[CreateAttendanceController] Actualizando asistencia: student=${studentId}, event=${eventId}, status=${status}`);

      if (!["present", "absent", "justified", "late"].includes(status)) {
        res.status(400).json({
          success: false,
          error: "Estado inválido. Debe ser: present, absent, justified, late",
        });
        return;
      }

      const updatedRecord = await this.attendanceRepository.updateStatus(
        parseInt(studentId),
        parseInt(eventId),
        status
      );

      if (!updatedRecord) {
        res.status(404).json({
          success: false,
          error: "Registro de asistencia no encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedRecord,
      });
    } catch (error) {
      console.error("[CreateAttendanceController] Error en update:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al actualizar asistencia",
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /attendance/event/:eventId - Obtener asistencias de un evento
   */
  async getByEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const records = await this.attendanceRepository.findByEventId(parseInt(eventId));

      res.status(200).json({
        success: true,
        data: records,
        count: records.length,
      });
    } catch (error) {
      console.error("[CreateAttendanceController] Error en getByEvent:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener asistencias del evento",
        message: (error as Error).message,
      });
    }
  }
}

