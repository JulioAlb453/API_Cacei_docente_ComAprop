import { Request, Response } from "express";
import { Event } from "../../../../core/entities/Event";
import { IEventRepository } from "../../../../core/interfaces/Repositories/IEventRepository";

export class CreateEventController {
  constructor(private eventRepository: IEventRepository) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      console.log("[CreateEventController] Procesando solicitud de creación.", JSON.stringify(body));

      if (!body.name || !body.date) {
        res.status(400).json({ error: "Faltan campos obligatorios (name, date)." });
        return;
      }

      const organizer =
        body.organizer ||
        body.eventOrganizer ||
        body.tutor ||
        body.responsable ||
        "";

      // Crear el evento directamente
      const event = new Event(
        0, // id se genera automáticamente
        body.name,
        body.description || "",
        new Date(body.date),
        body.category || "general",
        body.location || "",
        "pending", // status por defecto
        body.start_time ? new Date(body.start_time) : new Date(),
        body.end_time ? new Date(body.end_time) : new Date(),
        body.teacher_id ? Number(body.teacher_id) : 1,
        organizer,
        new Date(),
        new Date()
      );

      const result = await this.eventRepository.create(event);

      console.log(`[CreateEventController] Evento creado con ID: ${result.id}`);
      res.status(201).json({
        success: true,
        id: result.id,
        data: result
      });

    } catch (error) {
      console.error(`[CreateEventController] Error: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}