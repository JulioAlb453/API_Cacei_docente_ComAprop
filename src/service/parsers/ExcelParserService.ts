import * as XLSX from "xlsx";
import { StudentFromFileDTO } from "../use-cases/Student/BulkCreateStudentsUseCase";

export interface ParseResult {
  students: StudentFromFileDTO[];
  errors: string[];
}

export class ExcelParserService {
  /**
   * Parsea un archivo Excel (.xlsx) y extrae los datos de estudiantes
   * 
   * El archivo debe tener las siguientes columnas (en la primera fila como encabezado):
   * - nombre / name
   * - correo / email
   * - matricula / tuition
   * - grado / grade (opcional)
   * - grupo / group (opcional)
   */
  parseBuffer(buffer: Buffer): ParseResult {
    const result: ParseResult = {
      students: [],
      errors: []
    };

    try {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      
      // Usar la primera hoja
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        result.errors.push("El archivo Excel no contiene hojas de cálculo");
        return result;
      }

      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON con encabezados
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: ""
      });

      if (rows.length === 0) {
        result.errors.push("El archivo Excel está vacío o no tiene datos");
        return result;
      }

      // Procesar cada fila
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 porque fila 1 es encabezado

        try {
          const student = this.mapRowToStudent(row, rowNumber);
          if (student) {
            result.students.push(student);
          }
        } catch (error) {
          result.errors.push(`Fila ${rowNumber}: ${(error as Error).message}`);
        }
      }

    } catch (error) {
      result.errors.push(`Error al leer el archivo: ${(error as Error).message}`);
    }

    return result;
  }

  private mapRowToStudent(row: Record<string, any>, rowNumber: number): StudentFromFileDTO | null {
    // Mapeo flexible de columnas (soporta español e inglés)
    const name = this.getColumnValue(row, ["nombre", "name", "Nombre", "Name", "NOMBRE"]);
    const email = this.getColumnValue(row, ["correo", "email", "Correo", "Email", "CORREO", "correo_electronico", "correo electronico"]);
    const tuition = this.getColumnValue(row, ["matricula", "tuition", "Matricula", "Tuition", "MATRICULA", "matrícula", "Matrícula"]);
    const grade = this.getColumnValue(row, ["grado", "grade", "Grado", "Grade", "GRADO", "semestre", "Semestre"]);
    const group = this.getColumnValue(row, ["grupo", "group", "Grupo", "Group", "GRUPO"]);

    // Validar campos requeridos
    if (!name) {
      throw new Error("Falta el campo 'nombre'");
    }
    if (!email) {
      throw new Error("Falta el campo 'correo/email'");
    }
    if (!tuition) {
      throw new Error("Falta el campo 'matricula'");
    }

    // Validar formato de email básico
    if (!this.isValidEmail(String(email))) {
      throw new Error(`Email inválido: ${email}`);
    }

    return {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      tuition: Number(tuition),
      grade: grade ? Number(grade) : 1,
      group: group ? String(group).trim().toUpperCase() : "A"
    };
  }

  private getColumnValue(row: Record<string, any>, possibleKeys: string[]): any {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
        return row[key];
      }
    }
    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtiene las columnas esperadas para el archivo Excel
   */
  static getExpectedColumns(): string[] {
    return [
      "nombre (requerido)",
      "correo (requerido)", 
      "matricula (requerido)",
      "grado (opcional, default: 1)",
      "grupo (opcional, default: A)"
    ];
  }

  /**
   * Genera un archivo Excel de plantilla para descargar
   */
  static generateTemplate(): Buffer {
    const workbook = XLSX.utils.book_new();
    
    const templateData = [
      {
        nombre: "Juan Pérez García",
        correo: "juan.perez@universidad.edu.mx",
        matricula: 202310001,
        grado: 3,
        grupo: "A"
      },
      {
        nombre: "María López Hernández",
        correo: "maria.lopez@universidad.edu.mx",
        matricula: 202310002,
        grado: 3,
        grupo: "B"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }
}

