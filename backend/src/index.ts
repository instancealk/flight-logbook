import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { config } from "./config";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { initializeDatabase } from "./database/init";

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log("Database initialized");

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(
        `🔗 Health check: http://localhost:${config.port}/api/health`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
