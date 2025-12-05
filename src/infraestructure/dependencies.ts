import { EventRepository } from "./database/repositories/EventRepository";
import { StudentRepository } from "./database/repositories/StudentRepository";

import { TeacherRepository } from "./repositories/Teacher/TeacherRepository";
import { CreateEventUseCase } from "../service/use-cases/Events/CreateEventUseCase";
import { GetTeacherEventsUseCase } from "../service/use-cases/Events/GetTeacherEventsUseCase";
import { UpdateEventUseCase } from "../service/use-cases/Events/UpdateEventUseCase";
import { CancelEventUseCase } from "../service/use-cases/Events/CancelEventUseCase";

import { CreateStudentUseCase } from "../service/use-cases/Student/CreateStudentUseCase";
import { GetAllStudentsUseCase } from "../service/use-cases/Student/GetAllStudentsUseCase";
import { GetStudentByIdUseCase } from "../service/use-cases/Student/GetStudentByIdUseCase";
import { UpdateStudentUseCase } from "../service/use-cases/Student/UpdateStudentUseCase";
import { BulkCreateStudentsUseCase } from "../service/use-cases/Student/BulkCreateStudentsUseCase";

import { CreateEventController } from "./http/controllers/events/CreateEventController";
import { GetTeacherEventsController } from "./http/controllers/events/GetTeacherEventsController";
import { UpdateEventController } from "./http/controllers/events/UpdateEventController";
import { CancelEventController } from "./http/controllers/events/CancelEventController";

import { CreateStudentController } from "./http/controllers/students/CreateStudentController";
import { GetAllStudentsController } from "./http/controllers/students/GetAllStudentsController";
import { GetStudentByIdController } from "./http/controllers/students/GetStudentByIdController";
import { UpdateStudentController } from "./http/controllers/students/UpdateStudentController";
import { BulkCreateStudentsController } from "./http/controllers/students/BulkCreateStudentsController";

const eventRepository = new EventRepository();
const teacherRepository = new TeacherRepository();
const studentRepository = new StudentRepository();

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

// Student Use Cases
export const createStudentUseCase = new CreateStudentUseCase(studentRepository);
export const getAllStudentsUseCase = new GetAllStudentsUseCase(studentRepository);
export const getStudentByIdUseCase = new GetStudentByIdUseCase(studentRepository);
export const updateStudentUseCase = new UpdateStudentUseCase(studentRepository);
export const bulkCreateStudentsUseCase = new BulkCreateStudentsUseCase(studentRepository);

// Student Controllers
export const createStudentController = new CreateStudentController(
  createStudentUseCase
);
export const getAllStudentsController = new GetAllStudentsController(
  getAllStudentsUseCase
);
export const getStudentByIdController = new GetStudentByIdController(
  getStudentByIdUseCase
);
export const updateStudentController = new UpdateStudentController(
  updateStudentUseCase
);
export const bulkCreateStudentsController = new BulkCreateStudentsController(
  bulkCreateStudentsUseCase
);
