import { Request, Response } from "express";
import { UpdateStudentUseCase } from "../../../../service/use-cases/Student/UpdateStudentUseCase";

export class UpdateStudentController {
  constructor(private updateStudentUseCase: UpdateStudentUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body;
      
      console.log(`[UpdateStudentController] Actualizando estudiante con ID: ${id}`, JSON.stringify(body));

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "ID de estudiante inválido." });
        return;
      }

      const updates: {
        name?: string;
        email?: string;
        password?: string;
        tuition?: number;
        grade?: number;
        group?: string;
        status?: string;
      } = {};

      if (body.name !== undefined) updates.name = body.name;
      if (body.email !== undefined) updates.email = body.email;
      if (body.password !== undefined) updates.password = body.password;
      if (body.tuition !== undefined) updates.tuition = Number(body.tuition);
      if (body.grade !== undefined) updates.grade = Number(body.grade);
      if (body.group !== undefined) updates.group = body.group;
      if (body.status !== undefined) updates.status = body.status;

      const result = await this.updateStudentUseCase.execute(Number(id), updates);

      console.log(`[UpdateStudentController] Estudiante actualizado: ${result.id}`);
      res.status(200).json(result);

    } catch (error) {
      console.error(`[UpdateStudentController] Error: ${(error as Error).message}`);
      
      if ((error as Error).message === "Estudiante no encontrado para actualizar") {
        res.status(404).json({ error: (error as Error).message });
        return;
      }
      
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

