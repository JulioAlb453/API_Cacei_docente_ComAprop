import { Student } from "../../entities/Student";

export interface IStudentRepository {
  create(student: Student): Promise<Student>;
  findById(id: number): Promise<Student | null>;
  findAll(): Promise<Student[]>;
  update(student: Student): Promise<Student>;
}