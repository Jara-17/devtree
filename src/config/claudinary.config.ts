import { v2 as cloudinary } from "cloudinary";

const { CLAUDINARY_NAME, CLAUDINARY_API_KEY, CLAUDINARY_API_SECRET } =
  process.env;

// Configuration
cloudinary.config({
  cloud_name: CLAUDINARY_NAME,
  api_key: CLAUDINARY_API_KEY,
  api_secret: CLAUDINARY_API_SECRET,
});

export default cloudinary;
