import { Request, Response } from "express";
import { GetAllStudentsUseCase } from "../../../../service/use-cases/Student/GetAllStudentsUseCase";

export class GetAllStudentsController {
  constructor(private getAllStudentsUseCase: GetAllStudentsUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      console.log("[GetAllStudentsController] Obteniendo todos los estudiantes.");

      const students = await this.getAllStudentsUseCase.execute();

      console.log(`[GetAllStudentsController] Se encontraron ${students.length} estudiantes.`);
      res.status(200).json(students);

    } catch (error) {
      console.error(`[GetAllStudentsController] Error: ${(error as Error).message}`);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

