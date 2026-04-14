import { Request, Response } from "express";
import { UpdateEventUseCase } from "../../../../service/use-cases/Events/UpdateEventUseCase"; 

export class UpdateEventController {
  constructor(private updateEventUseCase: UpdateEventUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body;
      console.log(`[UpdateEventController] Solicitud de actualización para ID: ${id}`);

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "ID de evento inválido." });
        return;
      }

      const updates: any = { ...body };
      if (body.date) updates.date = new Date(body.date);
      if (body.start_time) updates.start_time = new Date(body.start_time);
      if (body.end_time) updates.end_time = new Date(body.end_time);

      const updatedEvent = await this.updateEventUseCase.execute(Number(id), updates);

      res.status(200).json(updatedEvent);

    } catch (error) {
      console.error(`[UpdateEventController] Error: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}