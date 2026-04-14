import { IStudentRepository } from "../../../core/interfaces/Repositories/IStudentRepository";
import { Student } from "../../../core/entities/Student";
import { StudentSchema } from "../schemas/StudentSchema";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";

export class StudentRepository implements IStudentRepository {
  private repository: Repository<StudentSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(StudentSchema);
  }

  async create(student: Student): Promise<Student> {
    const schema = this.mapToPersistence(student);
    const savedSchema = await this.repository.save(schema);
    return this.mapToDomain(savedSchema);
  }

  async findById(id: number): Promise<Student | null> {
    const schema = await this.repository.findOneBy({ id: id });
    return schema ? this.mapToDomain(schema) : null;
  }

  async findAll(): Promise<Student[]> {
    const schemas = await this.repository.find();
    return schemas.map((s) => this.mapToDomain(s));
  }

  async update(student: Student): Promise<Student> {
    const schema = this.mapToPersistence(student);
    const saved = await this.repository.save(schema);
    return this.mapToDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const schema = await this.repository.findOneBy({ email: email });
    return schema ? this.mapToDomain(schema) : null;
  }

  private mapToDomain(schema: StudentSchema): Student {
    return new Student(
      schema.id,
      schema.name,
      schema.email,
      schema.password,
      schema.tuition,
      schema.grade,
      schema.group,
      schema.status
    );
  }

  private mapToPersistence(domain: Student): StudentSchema {
    const schema = new StudentSchema();
    if (domain.id && domain.id !== 0) schema.id = domain.id;

    schema.name = domain.name;
    schema.email = domain.email;
    schema.password = domain.password;
    schema.tuition = domain.tuition;
    schema.grade = domain.grade;
    schema.group = domain.group;
    schema.status = domain.status;

    return schema;
  }
}

