import { Teacher } from "../../entities/Teacher";

export interface ITeacherRepository {
  findById(id: number): Promise<Teacher | null>;
  save(teacher: Teacher): Promise<Teacher>;
}