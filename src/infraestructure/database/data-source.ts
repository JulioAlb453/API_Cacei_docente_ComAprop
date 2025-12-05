import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

import { EventSchema } from "./schemas/EventSchema";
import { StudentSchema } from "./schemas/StudentSchema";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    entities: [EventSchema, StudentSchema], 
    
    synchronize: true, 
    logging: false,
});