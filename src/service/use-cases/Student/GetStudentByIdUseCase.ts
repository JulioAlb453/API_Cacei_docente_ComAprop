import { Student } from "../../../core/entities/Student";
import { IStudentRepository } from "../../../core/interfaces/Repositories/IStudentRepository";

export class GetStudentByIdUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(id: number): Promise<Student> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new Error("Estudiante no encontrado");
    }

    return student;
  }
}