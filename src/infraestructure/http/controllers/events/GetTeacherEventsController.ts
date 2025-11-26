import { Request, Response } from "express";
import { GetTeacherEventsUseCase } from "../../../../service/use-cases/Events/GetTeacherEventsUseCase"; 

export class GetTeacherEventsController {
  constructor(private getTeacherEventsUseCase: GetTeacherEventsUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { teacherId } = req.params;
      console.log(`[GetTeacherEventsController] Solicitud para docente ID: ${teacherId}`);

      if (!teacherId || isNaN(Number(teacherId))) {
        res.status(400).json({ error: "ID de docente inválido." });
        return;
      }

      const events = await this.getTeacherEventsUseCase.execute(Number(teacherId));

      res.status(200).json(events);

    } catch (error) {
      console.error(`[GetTeacherEventsController] Error: ${(error as Error).message}`);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}