import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./router";
import { connectDB } from "./config/db.config";
import { corsConfig } from "./config/cors.config";

//* Conexión a la base de datos
connectDB();

const app = express();

//* Configuraciones de cors
app.use(cors(corsConfig));

//* Lectura de json
app.use(express.json());

//* Routing
app.use("/", router);

export default app;
