import "reflect-metadata";
import "dotenv/config";   
import express from "express";
import { AppDataSource } from "./src/infraestructure/database/data-source";
import { eventRouter } from "./src/infraestructure/Routes/eventRoutes";
import { studentRouter } from "./src/infraestructure/Routes/studentRoutes";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión a Base de Datos establecida exitosamente.");
    const app = express();

    app.use(express.json()); 

    app.use("/cacei/events", eventRouter);
    app.use("/cacei/students", studentRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1); 
  }
}

bootstrap();