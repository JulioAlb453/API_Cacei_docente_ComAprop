import { Repository } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import { Teacher } from "../../../core/entities/Teacher";
import { ITeacherRepository } from "../../../core/interfaces/Repositories/ITeacherRepository";
import { Teacher as TeacherDomain } from "../../../core/entities/Teacher"; 


export class TeacherRepository implements ITeacherRepository {
  private repository: Repository<Teacher>;

  constructor() {
    this.repository = AppDataSource.getRepository(Teacher);
  }

  async findById(id: number): Promise<Teacher | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async save(teacher: Teacher): Promise<Teacher> {
    const entity = this.mapToPersistence(teacher);
    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async update(teacher: Teacher): Promise<Teacher> {
    return this.save(teacher);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Teacher[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.mapToDomain(entity));
  }

  async findActiveTeachers(): Promise<Teacher[]> {
    const entities = await this.repository.find({ where: { status: "active" } });
    return entities.map(entity => this.mapToDomain(entity));
  }



   private mapToDomain(entity: Teacher): TeacherDomain {
    return new TeacherDomain(
      entity.id,
      entity.name,
      entity.last_name,
      entity.email,
      entity.password,
      entity.status as "active" | "inactive",
      entity.created_at,
      entity.updated_at
    );}

    private mapToPersistence(teacher: TeacherDomain): Teacher {
  const entity = new Teacher(
    teacher.id,
    teacher.name,
    teacher.last_name,
    teacher.email,
    teacher.password,
    teacher.status,
    teacher.created_at,
    teacher.updated_at
  );
  return entity;
}
}