import { Request, Response } from "express";
import { CreateEventUseCase } from "../../../../service/use-cases/Events/CreateEventUseCase"; 

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      console.log("[CreateEventController] Procesando solicitud de creación.", JSON.stringify(body));

      // Validaciones HTTP básicas
      if (!body.teacher_id || !body.name || !body.date) {
        res.status(400).json({ error: "Faltan campos obligatorios (teacher_id, name, date)." });
        return;
      }

      // Mapeo de request a DTO (convertir strings a fechas)
      const eventData = {
        name: body.name,
        description: body.description,
        date: new Date(body.date),
        category: body.category,
        location: body.location,
        start_time: new Date(body.start_time),
        end_time: new Date(body.end_time),
        teacherId: Number(body.teacher_id)
      };

      const result = await this.createEventUseCase.execute(eventData);

      console.log(`[CreateEventController] Evento creado con ID: ${result.id}`);
      res.status(201).json(result);

    } catch (error) {
      console.error(`[CreateEventController] Error: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}