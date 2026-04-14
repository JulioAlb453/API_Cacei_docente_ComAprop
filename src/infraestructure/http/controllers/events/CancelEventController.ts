import { Request, Response } from "express";
import { CancelEventUseCase } from "../../../../service/use-cases/Events/CancelEventUseCase"; 

export class CancelEventController {
  constructor(private cancelEventUseCase: CancelEventUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`[CancelEventController] Solicitud de cancelación para ID: ${id}`);

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "ID de evento inválido." });
        return;
      }

      await this.cancelEventUseCase.execute(Number(id));

      res.status(200).json({ message: "Evento cancelado correctamente." });

    } catch (error) {
      console.error(`[CancelEventController] Error: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}