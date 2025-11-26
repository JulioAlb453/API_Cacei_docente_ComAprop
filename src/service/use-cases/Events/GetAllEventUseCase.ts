import { Event } from "../../../core/entities/Event";
import { IEventRepository } from "../../../core/interfaces/Repositories/IEventRepository";

export interface EventsFilter {
  status?: string;
  category?: string;
  date?: Date;
  location?: string;
}

export class GetAllEventRequest {
  constructor(private eventRepository: IEventRepository) {}

  async execute(filters?: EventsFilter): Promise<Event[]> {
    let events = await this.eventRepository.getAll();
    if (filters) {
      events = events.filter((event) => {
        if (filters.status && filters.status !== event.status) {
          return false;
        }
        if (filters.category && filters.category !== event.category) {
          return false;
        }
        if (filters.date && filters.date !== event.date) {
          return false;
        }
        return true;
      });
    }
    return events;
  }
}
