import { cleanEnv, str, port, url } from "envalid";
import "dotenv/config";

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: port({ default: 5000 }),
  MONGO_URI: url(),
  JWT_SECRET: str(),
  GOOGLE_CLIENT_ID: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_CLOUD_NAME: str(),
});

export default env;
