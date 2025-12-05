import { Router } from "express";
import multer from "multer";

import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  bulkCreateStudentsController,
} from "../dependencies";

// Configuración de Multer para archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos Excel (.xlsx, .xls)"));
    }
  }
});

const studentRouter = Router();

// POST /students - Crear estudiante individual (docente registra uno por uno)
studentRouter.post("/", createStudentController.run.bind(createStudentController));

// POST /students/bulk - Carga masiva desde archivo Excel (docente sube archivo)
studentRouter.post(
  "/bulk",
  upload.single("file"),
  bulkCreateStudentsController.run.bind(bulkCreateStudentsController)
);

// GET /students/template - Descargar plantilla Excel
studentRouter.get(
  "/template",
  bulkCreateStudentsController.downloadTemplate.bind(bulkCreateStudentsController)
);

// GET /students - Obtener todos los estudiantes
studentRouter.get("/", getAllStudentsController.run.bind(getAllStudentsController));

// GET /students/:id - Obtener estudiante por ID
studentRouter.get("/:id", getStudentByIdController.run.bind(getStudentByIdController));

// PUT /students/:id - Actualizar estudiante
studentRouter.put("/:id", updateStudentController.run.bind(updateStudentController));

export { studentRouter };

