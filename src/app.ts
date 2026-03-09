import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { router } from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Handle defined routes
app.use("/api/v1", router);

// Handle undefined routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    message: `Route: ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
