import { Router } from "express";
import { GetMetricsController } from "../http/controllers/metrics/GetMetricsController";
import { GetMetricsUseCase } from "../../service/use-cases/Metrics/GetMetricsUseCase";
import { AttendanceRecordRepository } from "../database/repositories/AttendanceRecordRepository";

const metricsRouter = Router();

// Instanciar dependencias
const attendanceRepository = new AttendanceRecordRepository();
const getMetricsUseCase = new GetMetricsUseCase(attendanceRepository);
const metricsController = new GetMetricsController(getMetricsUseCase);

// Rutas de métricas
metricsRouter.get("/", (req, res) => metricsController.getAll(req, res));
metricsRouter.get("/summary", (req, res) => metricsController.getSummary(req, res));
metricsRouter.get("/distribution", (req, res) => metricsController.getDistribution(req, res));
metricsRouter.get("/by-grade", (req, res) => metricsController.getByGrade(req, res));
metricsRouter.get("/by-group", (req, res) => metricsController.getByGroup(req, res));
metricsRouter.get("/monthly", (req, res) => metricsController.getMonthly(req, res));

export { metricsRouter };

