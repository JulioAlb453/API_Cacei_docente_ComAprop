import "reflect-metadata";
import "dotenv/config";   
import express from "express";
import cors from "cors";
import { AppDataSource } from "./src/infraestructure/database/data-source";
import { eventRouter } from "./src/infraestructure/Routes/eventRoutes";
import { studentRouter } from "./src/infraestructure/Routes/studentRoutes";
import { metricsRouter } from "./src/infraestructure/Routes/metricsRoutes";
import { attendanceRouter } from "./src/infraestructure/Routes/attendanceRoutes";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión a Base de Datos establecida exitosamente.");
    const app = express();

    app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(express.json()); 

    // Rutas de la API
    app.use("/cacei/events", eventRouter);
    app.use("/cacei/students", studentRouter);
    app.use("/cacei/metrics", metricsRouter);
    app.use("/cacei/attendance", attendanceRouter);

    const PORT = 3002;
    app.listen(PORT, () => {
      console.log(` Servidor CACEI corriendo en: http://localhost:${PORT}`);
      console.log(` Rutas disponibles:`);
      console.log(`   - /cacei/events`);
      console.log(`   - /cacei/students`);
      console.log(`   - /cacei/metrics`);
      console.log(`   - /cacei/attendance`);
    });

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1); 
  }
}

bootstrap();