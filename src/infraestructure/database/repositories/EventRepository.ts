import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository";
import { Event } from "../../../core/entities/Event";
import { EventSchema } from "../schemas/EventSchema";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";

export class EventRepository implements IEventRepository {
  private repository: Repository<EventSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(EventSchema);
  }

  async create(event: Event): Promise<Event> {
    const schema = this.mapToPersistence(event);
    const savedSchema = await this.repository.save(schema);
    return this.mapToDomain(savedSchema);
  }

  // --- AQUÍ ESTABA EL ERROR, YA CORREGIDO ---
  async getById(id: number): Promise<Event | null> {
    // 1. Usamos findOneBy para obtener UNO solo (o null)
    // 2. Buscamos por 'id' (el ID del evento), NO por teacher_id
    const schema = await this.repository.findOneBy({ id: id });

    // 3. Si existe (no es null), lo mapeamos. Si no, devolvemos null.
    return schema ? this.mapToDomain(schema) : null;
  }
  // ------------------------------------------

  async update(event: Event): Promise<Event> {
    const schema = this.mapToPersistence(event);
    const saved = await this.repository.save(schema);
    return this.mapToDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getAll(): Promise<Event[]> {
    const schemas = await this.repository.find();
    return schemas.map((s) => this.mapToDomain(s));
  }

  async getByTeacherId(teacherId: number): Promise<Event[]> {
    // Aquí sí está bien buscar por teacher_id y usar find (array)
    const schemas = await this.repository.findBy({ teacher_id: teacherId });
    return schemas.map((s) => this.mapToDomain(s));
  }

  private mapToDomain(schema: EventSchema): Event {
    return new Event(
      schema.id,
      schema.name,
      schema.description,
      schema.date,
      schema.category,
      schema.location,
      schema.status,
      schema.start_time,
      schema.end_time,
      schema.teacher_id,
      schema.created_at,
      schema.updated_at
    );
  }

  private mapToPersistence(domain: Event): EventSchema {
    const schema = new EventSchema();
    if (domain.id && domain.id !== 0) schema.id = domain.id;

    schema.teacher_id = domain.teacher_id;
    schema.name = domain.name;
    schema.description = domain.description;
    schema.date = domain.date;
    schema.category = domain.category;
    schema.location = domain.location;
    schema.status = domain.status;
    schema.start_time = domain.start_time;
    schema.end_time = domain.end_time;
    schema.created_at = domain.created_at;
    schema.updated_at = domain.updated_at;

    return schema;
  }
}