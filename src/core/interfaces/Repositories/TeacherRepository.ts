import { Repository } from "typeorm";
import { AppDataSource } from "../../../adapters/database/data-source";
import { ITeacherRepository } from "./ITeacherRepository";
import { Teacher } from "../../../core/entities/Teacher";

export class TeacherRepository implements ITeacherRepository {
  private repository: Repository<Teacher>;

  constructor() {
    this.repository = AppDataSource.getRepository(Teacher);
  }

  async findById(id: number): Promise<Teacher | null> {
    try {
      const entity = await this.repository.findOne({
        where: { id },
      });
      return entity; 
    } catch (error) {
      console.error("Error finding teacher by ID:", error);
      throw new Error("No se pudo encontrar el tutor");
    }
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    try {
      const entity = await this.repository.findOne({
        where: { email },
      });
      return entity;
    } catch (error) {
      console.error("Error finding teacher by email:", error);
      throw new Error("No se pudo encontrar el tutor por email");
    }
  }

  async save(teacher: Teacher): Promise<Teacher> {
    try {
      const savedEntity = await this.repository.save(teacher);
      return savedEntity;
    } catch (error) {
      console.error("Error saving teacher:", error);
      throw new Error("No se pudo guardar el tutor");
    }
  }

  async update(teacher: Teacher): Promise<Teacher> {
    try {
      return await this.save(teacher);
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw new Error("No se pudo actualizar el tutor");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      throw new Error("No se pudo eliminar el tutor");
    }
  }

  async findAll(): Promise<Teacher[]> {
    try {
      const entities = await this.repository.find();
      return entities; 
    } catch (error) {
      console.error("Error finding all teachers:", error);
      throw new Error("No se pudieron obtener los tutores");
    }
  }

  async findActiveTeachers(): Promise<Teacher[]> {
    try {
      const entities = await this.repository.find({
        where: { status: "active" },
      });
      return entities; 
    } catch (error) {
      console.error("Error finding active teachers:", error);
      throw new Error("No se pudieron obtener los tutores activos");
    }
  }
}
