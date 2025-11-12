import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: 3306,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [__dirname + "/../entities/*.js"],
    synchronize: NODE_ENV === "dev" ? true : false,
    logging: NODE_ENV === "dev" ? true : false,
    migrations: [__dirname + "/../migrations/*.js"],
    subscribers: [__dirname + "/../subscribers/*.js"],
    
})
