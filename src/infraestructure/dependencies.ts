import { EventRepository } from "./database/repositories/EventRepository";
import { TeacherRepository } from "../core/interfaces/Repositories/TeacherRepository";

import { CreateEventUseCase } from "../service/use-cases/Events/CreateEventUseCase";
import { GetTeacherEventsUseCase } from "../service/use-cases/Events/GetTeacherEventsUseCase";
import { UpdateEventUseCase } from "../service/use-cases/Events/UpdateEventUseCase";
import { CancelEventUseCase } from "../service/use-cases/Events/CancelEventUseCase";

import { CreateEventController } from "./http/controllers/events/CreateEventController";
import { GetTeacherEventsController } from "./http/controllers/events/GetTeacherEventsController";
import { UpdateEventController } from "./http/controllers/events/UpdateEventController";
import { CancelEventController } from "./http/controllers/events/CancelEventController";

const eventRepository = new EventRepository();
const teacherRepository = new TeacherRepository();

export const createEventUseCase = new CreateEventUseCase(
  eventRepository,
  teacherRepository
);
export const getTeacherEventsUseCase = new GetTeacherEventsUseCase(
  eventRepository
);
export const updateEventUseCase = new UpdateEventUseCase(eventRepository);
export const cancelEventUseCase = new CancelEventUseCase(eventRepository);

export const createEventController = new CreateEventController(
  createEventUseCase
);
export const getTeacherEventsController = new GetTeacherEventsController(
  getTeacherEventsUseCase
);
export const updateEventController = new UpdateEventController(
  updateEventUseCase
);
export const cancelEventController = new CancelEventController(
  cancelEventUseCase
);
