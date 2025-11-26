import { Event } from "../../../core/entities/Event";
import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository";

export class GetEventByIdRequest {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: number): Promise<Event> {
    const event = await this.eventRepository.getById(id);
    if (!event) {
      throw new Error("No se encontró el evento");
    }
    return event;
  }
}
