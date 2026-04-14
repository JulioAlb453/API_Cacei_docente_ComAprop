import { Event } from "../../../core/entities/Event";
import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository"; 

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: number, updates: Partial<Event>): Promise<Event> {
    try {
      console.log(`Solicitud de actualización para ID: ${id}`, updates);

      const currentEvent = await this.eventRepository.getById(id);

      if (!currentEvent) {
        throw new Error("Evento no encontrado");
      }

      if (
        currentEvent.status === "cancelled" ||
        currentEvent.status === "completed"
      ) {
        throw new Error(
          "No se pueden editar eventos finalizados o cancelados."
        );
      }

      const updatedEventEntity = currentEvent.update(updates);

      if (updatedEventEntity.start_time >= updatedEventEntity.end_time) {
        throw new Error(
          "Las fechas actualizadas son inconsistentes (inicio >= fin)."
        );
      }

      const result = await this.eventRepository.update(updatedEventEntity);

      console.log(`Evento ID ${id} actualizado correctamente.`);
      return result;
    } catch (error) {
      console.error(`Fallo al actualizar: ${(error as Error).message}`);
      throw error;
    }
  }
}
