import { Router } from "express";

import {
  createEventController,
  getTeacherEventsController,
  updateEventController,
  cancelEventController,
} from "../dependencies";

const eventRouter = Router();

eventRouter.post("/", createEventController.run.bind(createEventController));

eventRouter.get(
  "/teacher/:teacherId",
  getTeacherEventsController.run.bind(getTeacherEventsController)
);

eventRouter.put("/:id", updateEventController.run.bind(updateEventController));

eventRouter.delete(
  "/:id/cancel",
  cancelEventController.run.bind(cancelEventController)
);

export { eventRouter };
