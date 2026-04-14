import { Student } from "../../../core/entities/Student";
import { IStudentRepository } from "../../../core/interfaces/Repositories/IStudentRepository";
import bcrypt from "bcrypt";

export interface StudentFromFileDTO {
  name: string;
  email: string;
  tuition: number;
  grade: number;
  group: string;
}

export interface BulkCreateResult {
  created: Student[];
  errors: { row: number; error: string; data?: StudentFromFileDTO }[];
  total: number;
  successful: number;
  failed: number;
}

export class BulkCreateStudentsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(students: StudentFromFileDTO[]): Promise<BulkCreateResult> {
    const result: BulkCreateResult = {
      created: [],
      errors: [],
      total: students.length,
      successful: 0,
      failed: 0
    };

    for (let i = 0; i < students.length; i++) {
      const studentData = students[i];
      const rowNumber = i + 2; 

      try {
        if (!studentData.name || !studentData.email || !studentData.tuition) {
          result.errors.push({
            row: rowNumber,
            error: "Faltan campos requeridos (name, email, tuition)",
            data: studentData
          });
          result.failed++;
          continue;
        }

        const defaultPassword = studentData.tuition.toString();
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newStudent = new Student(
          0,
          studentData.name.trim(),
          studentData.email.trim().toLowerCase(),
          hashedPassword,
          studentData.tuition,
          studentData.grade || 1,
          studentData.group || "A",
          "active"
        );

        const createdStudent = await this.studentRepository.create(newStudent);
        result.created.push(createdStudent);
        result.successful++;

      } catch (error) {
        result.errors.push({
          row: rowNumber,
          error: (error as Error).message,
          data: studentData
        });
        result.failed++;
      }
    }

    return result;
  }
}

