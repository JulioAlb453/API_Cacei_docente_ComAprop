import { Teacher } from "../../entities/Teacher";

export interface ITeacherRepository {
  save(teacher: Teacher): Promise<Teacher>;
  findById(id: number): Promise<Teacher | null>;
  findByEmail(email: string): Promise<Teacher | null>;
  findAll(): Promise<Teacher[]>;
  findActiveTeachers(): Promise<Teacher[]>;
  update(teacher: Teacher): Promise<Teacher>;
  delete(id: number): Promise<void>;
}