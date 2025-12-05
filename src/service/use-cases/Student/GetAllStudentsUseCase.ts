import { Student } from "../../../core/entities/Student";
import { IStudentRepository } from "../../../core/interfaces/Repositories/IStudentRepository";

export class GetAllStudentsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(): Promise<Student[]> {
    return await this.studentRepository.findAll();
  }
}