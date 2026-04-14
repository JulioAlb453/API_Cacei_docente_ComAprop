import { Request, Response } from "express";
import { GetStudentByIdUseCase } from "../../../../service/use-cases/Student/GetStudentByIdUseCase";

export class GetStudentByIdController {
  constructor(private getStudentByIdUseCase: GetStudentByIdUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`[GetStudentByIdController] Buscando estudiante con ID: ${id}`);

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "ID de estudiante inválido." });
        return;
      }

      const student = await this.getStudentByIdUseCase.execute(Number(id));

      console.log(`[GetStudentByIdController] Estudiante encontrado: ${student.name}`);
      res.status(200).json(student);

    } catch (error) {
      console.error(`[GetStudentByIdController] Error: ${(error as Error).message}`);
      
      if ((error as Error).message === "Estudiante no encontrado") {
        res.status(404).json({ error: (error as Error).message });
        return;
      }
      
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

