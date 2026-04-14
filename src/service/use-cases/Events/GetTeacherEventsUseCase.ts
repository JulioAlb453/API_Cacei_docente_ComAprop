import { Event } from "../../../core/entities/Event"; 
import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository"; 

export class GetTeacherEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(teacherId: number): Promise<Event[]> {
    try {
      console.log(
        `[GetTeacherEventsUseCase] Buscando eventos del docente ID: ${teacherId}`
      );

      const allEvents = await this.eventRepository.getAll();

      const teacherEvents = allEvents.filter(
        (event) => event.teacher_id === teacherId
      );

      console.log(
        `[GetTeacherEventsUseCase] Se encontraron ${teacherEvents.length} eventos para el docente.`
      );
      return teacherEvents;
    } catch (error) {
      console.error(
        `[GetTeacherEventsUseCase] Error al recuperar eventos: ${
          (error as Error).message
        }`
      );
      throw error;
    }
  }
}
