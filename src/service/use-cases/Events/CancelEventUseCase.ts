import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository";

export class CancelEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: number): Promise<void> {
    try {
      console.log(
        `[CancelEventUseCase] Solicitud para cancelar evento ID: ${id}`
      );

      const event = await this.eventRepository.getById(id);

      if (!event) {
        throw new Error("El evento no existe.");
      }

      if (event.isPast()) {
        throw new Error("No se puede cancelar un evento que ya ocurrió.");
      }

      if (event.status === "completed") {
        throw new Error("El evento ya está marcado como completado.");
      }

      event.cancel();

      await this.eventRepository.update(event);

      console.log(
        `[CancelEventUseCase] Evento ID ${id} cancelado exitosamente.`
      );
    } catch (error) {
      console.error(
        `[CancelEventUseCase] Error al cancelar: ${(error as Error).message}`
      );
      throw error;
    }
  }
}
