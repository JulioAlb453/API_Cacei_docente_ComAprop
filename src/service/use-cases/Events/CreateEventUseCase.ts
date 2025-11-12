import { Teacher } from "../../../core/entities/Teacher";
import { Event } from "../../../core/entities/Event";
import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository";
import { ITeacherRepository } from "../../../core/interfaces/Repositories/ITeacherRepository";

export interface CreateEventRequest {
  teacherId: number;
  name: string;
  description: string;
  date: Date;
  category: string;
  location: string;
  start_time: Date;
  end_time: Date;
}

export class CreateEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private teacherRepository: ITeacherRepository
  ) {}

  async execute(request: CreateEventRequest): Promise<Event> {
    //  Validar que el tutor existe
    const teacher = await this.teacherRepository.findById(request.teacherId);
    if (!teacher) {
      throw new Error("Tutor no encontrado");
    }

  

    //  Validar fechas
    if (request.start_time >= request.end_time) {
      throw new Error("La hora de inicio debe ser anterior a la hora de fin");
    }

    if (request.date < new Date()) {
      throw new Error("No se pueden crear eventos en fechas pasadas");
    }

    //  Crear el evento usando la entidad Teacher
    const event = teacher.createEvent(
      request.name,
      request.description,
      request.date,
      request.category,
      request.location,
      request.start_time,
      request.end_time
    );

    //  Guardar en la base de datos
    return await this.eventRepository.create(event);
  }
}