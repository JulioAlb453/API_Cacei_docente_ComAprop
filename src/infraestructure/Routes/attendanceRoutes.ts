import { Router } from "express";
import { CreateAttendanceController } from "../http/controllers/attendance/CreateAttendanceController";
import { SeedAttendanceController } from "../http/controllers/attendance/SeedAttendanceController";
import { AttendanceRecordRepository } from "../database/repositories/AttendanceRecordRepository";

const attendanceRouter = Router();

// Instanciar dependencias
const attendanceRepository = new AttendanceRecordRepository();
const attendanceController = new CreateAttendanceController(attendanceRepository);
const seedController = new SeedAttendanceController(attendanceRepository);

// Rutas de asistencia
attendanceRouter.post("/", (req, res) => attendanceController.create(req, res));
attendanceRouter.post("/bulk", (req, res) => attendanceController.bulkCreate(req, res));
attendanceRouter.put("/:studentId/:eventId", (req, res) => attendanceController.updateStatus(req, res));
attendanceRouter.get("/event/:eventId", (req, res) => attendanceController.getByEvent(req, res));

// Rutas de seed (datos de prueba)
attendanceRouter.post("/seed", (req, res) => seedController.seed(req, res));
attendanceRouter.delete("/seed", (req, res) => seedController.clearSeed(req, res));

export { attendanceRouter };

