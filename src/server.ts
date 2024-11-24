import express from "express";
import "dotenv/config";
import router from "./router";
import { connectDB } from "./config/db.config";

const app = express();

//* Conexión a la base de datos
connectDB();

//* Lectura de json
app.use(express.json());

//* Routing
app.use("/", router);

export default app;
