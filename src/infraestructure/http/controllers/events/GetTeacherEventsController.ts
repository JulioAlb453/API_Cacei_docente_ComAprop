import { Request, Response } from "express";
import { GetTeacherEventsUseCase } from "../../../../service/use-cases/Events/GetTeacherEventsUseCase"; 
import { IEventRepository } from "../../../../core/interfaces/Repositories/IEventRepository";

export class GetTeacherEventsController {
  constructor(
    private getTeacherEventsUseCase: GetTeacherEventsUseCase,
    private eventRepository?: IEventRepository
  ) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { teacherId } = req.params;
      console.log(`[GetTeacherEventsController] Solicitud para docente ID: ${teacherId}`);

      // Si el teacherId es un número válido, buscar por ese ID
      if (teacherId && !isNaN(Number(teacherId))) {
        const events = await this.getTeacherEventsUseCase.execute(Number(teacherId));
        res.status(200).json(events);
        return;
      }

      // Si es un UUID o cualquier otro string, devolver todos los eventos
      // Esto permite compatibilidad con el sistema de autenticación que usa UUIDs
      if (teacherId && this.eventRepository) {
        console.log(`[GetTeacherEventsController] ID no numérico (${teacherId}), obteniendo todos los eventos`);
        const allEvents = await this.eventRepository.getAll();
        res.status(200).json(allEvents);
        return;
      }

      // Fallback: devolver array vacío si no hay forma de obtener eventos
      console.log(`[GetTeacherEventsController] Sin eventos disponibles`);
      res.status(200).json([]);

    } catch (error) {
      console.error(`[GetTeacherEventsController] Error: ${(error as Error).message}`);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}