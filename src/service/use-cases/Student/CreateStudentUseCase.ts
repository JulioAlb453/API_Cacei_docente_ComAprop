import { Student } from "../../../core/entities/Student";
import { IStudentRepository } from "../../../core/interfaces/Repositories/IStudentRepository";
import bcrypt from "bcrypt";

export interface CreateStudentDTO {
  name: string;
  email: string;
  password?: string; // Opcional, si no viene se usa la matrícula
  tuition: number;
  grade: number;
  group: string;
}

export class CreateStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(data: CreateStudentDTO): Promise<Student> {
    // Si no se proporciona password, usar la matrícula como default
    const rawPassword = data.password || data.tuition.toString();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    
    const newStudent = new Student(
      0,
      data.name.trim(),
      data.email.trim().toLowerCase(),
      hashedPassword, 
      data.tuition,
      data.grade,
      data.group,
      "active"
    );

    return await this.studentRepository.create(newStudent);
  }
}