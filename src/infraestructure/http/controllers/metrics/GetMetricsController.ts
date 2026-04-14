import { Request, Response } from "express";
import { GetMetricsUseCase, MetricsFilters } from "../../../../service/use-cases/Metrics/GetMetricsUseCase";

export class GetMetricsController {
  constructor(private getMetricsUseCase: GetMetricsUseCase) {}

  /**
   * GET /metrics - Obtener todas las métricas del dashboard
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log("[GetMetricsController] Solicitud de métricas recibida");

      const filters = this.parseFilters(req.query);
      const metrics = await this.getMetricsUseCase.execute(filters);

      res.status(200).json({
        success: true,
        data: metrics,
        filters: filters,
      });
    } catch (error) {
      console.error("[GetMetricsController] Error:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener métricas",
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /metrics/summary - Obtener solo el resumen (para tarjetas)
   */
  async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const filters = this.parseFilters(req.query);
      const summary = await this.getMetricsUseCase.getSummary(filters);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error("[GetMetricsController] Error en summary:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener resumen",
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /metrics/distribution - Obtener distribución (para gráfica de pastel)
   */
  async getDistribution(req: Request, res: Response): Promise<void> {
    try {
      const filters = this.parseFilters(req.query);
      const distribution = await this.getMetricsUseCase.getDistribution(filters);

      res.status(200).json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      console.error("[GetMetricsController] Error en distribution:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener distribución",
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /metrics/by-grade - Obtener asistencia por grado (para gráfica de barras)
   */
  async getByGrade(req: Request, res: Response): Promise<void> {
    try {
      const filters = this.parseFilters(req.query);
      const byGrade = await this.getMetricsUseCase.getByGrade(filters);

      res.status(200).json({
        success: true,
        data: byGrade,
      });
    } catch (error) {
      console.error("[GetMetricsController] Error en by-grade:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener métricas por grado",
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /metrics/by-group - Obtener asistencia por grupo
   */
  async getByGroup(req: Request, res: Response): Promise<void> {
    try {
      const filters = this.parseFilters(req.query);
      const byGroup = await this.getMetricsUseCase.getByGroup(filters);

      res.status(200).json({
        success: true,
        data: byGroup,
      });
    } catch (error) {
      console.error("[GetMetricsController] Error en by-group:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener métricas por grupo",
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /metrics/monthly - Obtener asistencia mensual (para gráfica de línea)
   */
  async getMonthly(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const monthly = await this.getMetricsUseCase.getMonthly(year);

      res.status(200).json({
        success: true,
        data: monthly,
        year: year || new Date().getFullYear(),
      });
    } catch (error) {
      console.error("[GetMetricsController] Error en monthly:", (error as Error).message);
      res.status(500).json({
        success: false,
        error: "Error al obtener métricas mensuales",
        message: (error as Error).message,
      });
    }
  }

  /**
   * Parsear filtros desde query params
   */
  private parseFilters(query: any): MetricsFilters {
    const filters: MetricsFilters = {};

    if (query.grade && query.grade !== "all") {
      filters.grade = parseInt(query.grade);
    }

    if (query.group && query.group !== "all") {
      filters.group = query.group;
    }

    if (query.startDate) {
      filters.startDate = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.endDate = new Date(query.endDate);
    }

    if (query.year) {
      filters.year = parseInt(query.year);
    }

    return filters;
  }
}

