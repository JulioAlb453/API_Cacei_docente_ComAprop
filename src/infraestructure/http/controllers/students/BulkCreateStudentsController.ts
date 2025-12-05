import { Request, Response } from "express";
import { BulkCreateStudentsUseCase } from "../../../../service/use-cases/Student/BulkCreateStudentsUseCase";
import { ExcelParserService } from "../../../../service/parsers/ExcelParserService";

export class BulkCreateStudentsController {
  private excelParser: ExcelParserService;

  constructor(private bulkCreateStudentsUseCase: BulkCreateStudentsUseCase) {
    this.excelParser = new ExcelParserService();
  }

  async run(req: Request, res: Response): Promise<void> {
    try {
      console.log("[BulkCreateStudentsController] Procesando carga masiva de estudiantes.");

      // Verificar que se haya subido un archivo
      if (!req.file) {
        res.status(400).json({ 
          error: "No se ha proporcionado ningún archivo.",
          hint: "Sube un archivo Excel (.xlsx) con las columnas: nombre, correo, matricula, grado (opcional), grupo (opcional)"
        });
        return;
      }

      const file = req.file;
      console.log(`[BulkCreateStudentsController] Archivo recibido: ${file.originalname}, tipo: ${file.mimetype}`);

      // Validar tipo de archivo
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel" // .xls
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        res.status(400).json({ 
          error: "Tipo de archivo no soportado.",
          hint: "Solo se permiten archivos Excel (.xlsx, .xls)"
        });
        return;
      }

      // Parsear el archivo Excel
      const parseResult = this.excelParser.parseBuffer(file.buffer);

      if (parseResult.errors.length > 0 && parseResult.students.length === 0) {
        res.status(400).json({
          error: "No se pudieron extraer datos del archivo.",
          parseErrors: parseResult.errors
        });
        return;
      }

      console.log(`[BulkCreateStudentsController] Estudiantes encontrados en archivo: ${parseResult.students.length}`);

      // Crear estudiantes en lote
      const result = await this.bulkCreateStudentsUseCase.execute(parseResult.students);

      console.log(`[BulkCreateStudentsController] Resultado - Exitosos: ${result.successful}, Fallidos: ${result.failed}`);

      // Responder con resultado
      res.status(201).json({
        message: `Se procesaron ${result.total} registros.`,
        summary: {
          total: result.total,
          successful: result.successful,
          failed: result.failed
        },
        created: result.created.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          tuition: s.tuition,
          grade: s.grade,
          group: s.group
        })),
        errors: result.errors,
        parseWarnings: parseResult.errors
      });

    } catch (error) {
      console.error(`[BulkCreateStudentsController] Error: ${(error as Error).message}`);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Endpoint para descargar plantilla Excel
   */
  async downloadTemplate(req: Request, res: Response): Promise<void> {
    try {
      console.log("[BulkCreateStudentsController] Generando plantilla Excel.");

      const templateBuffer = ExcelParserService.generateTemplate();

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=plantilla_estudiantes.xlsx");
      res.send(templateBuffer);

    } catch (error) {
      console.error(`[BulkCreateStudentsController] Error al generar plantilla: ${(error as Error).message}`);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

