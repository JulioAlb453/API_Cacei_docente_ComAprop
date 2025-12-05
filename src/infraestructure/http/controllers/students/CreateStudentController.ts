import { Request, Response } from "express";
import { CreateStudentUseCase } from "../../../../service/use-cases/Student/CreateStudentUseCase";

export class CreateStudentController {
  constructor(private createStudentUseCase: CreateStudentUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      console.log("[CreateStudentController] Procesando solicitud de creación.", JSON.stringify(body));

      // Validaciones HTTP básicas
      if (!body.name || !body.email || !body.password || !body.tuition || !body.grade || !body.group) {
        res.status(400).json({ 
          error: "Faltan campos obligatorios (name, email, password, tuition, grade, group)." 
        });
        return;
      }

      // Mapeo de request a DTO
      const studentData = {
        name: body.name,
        email: body.email,
        password: body.password,
        tuition: Number(body.tuition),
        grade: Number(body.grade),
        group: body.group
      };

      const result = await this.createStudentUseCase.execute(studentData);

      console.log(`[CreateStudentController] Estudiante creado con ID: ${result.id}`);
      res.status(201).json(result);

    } catch (error) {
      console.error(`[CreateStudentController] Error: ${(error as Error).message}`);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

