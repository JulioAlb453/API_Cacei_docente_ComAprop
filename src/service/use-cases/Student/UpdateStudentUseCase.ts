import { Student } from "../../../core/entities/Student";
import { IStudentRepository } from "../../../core/interfaces/Repositories/IStudentRepository";

export interface UpdateStudentDTO {
  name?: string;
  email?: string;
  password?: string;
  tuition?: number;
  grade?: number;
  group?: string;
  status?: string;
}

export class UpdateStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(id: number, updates: UpdateStudentDTO): Promise<Student> {
    const currentStudent = await this.studentRepository.findById(id);

    if (!currentStudent) {
      throw new Error("Estudiante no encontrado para actualizar");
    }

    // Aplicar cambios sobre la entidad existente
    const updatedStudent = new Student(
      currentStudent.id,
      updates.name || currentStudent.name,
      updates.email || currentStudent.email,
      updates.password || currentStudent.password,
      updates.tuition || currentStudent.tuition,
      updates.grade || currentStudent.grade,
      updates.group || currentStudent.group,
      updates.status || currentStudent.status
    );

    return await this.studentRepository.update(updatedStudent);
  }
}