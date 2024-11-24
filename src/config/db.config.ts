import { bold } from "colors";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    const url = `${connection.host}:${connection.port}`;
    console.log(bold.magenta(`MongoDB Conectado en: ${url}`));
  } catch (error) {
    console.error(
      bold.bgRed.white(`[Error] conectando a MongoDB: ${error.message}`)
    );
    process.exit(1);
  }
};
