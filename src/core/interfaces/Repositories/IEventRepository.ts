import { Event } from "../../entities/Event";

export interface IEventRepository {
  getAll(): Promise<Event[]>;
  getById(id: number): Promise<Event>;
  create(event: Event): Promise<Event>;
  update(event: Event): Promise<Event>;
  delete(id: number): Promise<void>;
}