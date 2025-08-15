import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport";
import { sessionConfig } from "./config/session";
import { config } from "./config/environment";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { logger } from "./utils/logger";
import rateLimit from "express-rate-limit";
import path from "path";

// Route imports
import { healthRouter } from "./routes/health";
import { stravaRouter } from "./routes/strava";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { activitiesRouter } from "./routes/activities";
import { adminRouter } from "./routes/admin";
import metricsRouter from "./routes/metrics";
import { docsRouter } from "./routes/docs";

const requiredEnvVars = [
  "DATABASE_URL",
  "STRAVA_CLIENT_ID",
  "STRAVA_CLIENT_SECRET",
  "SESSION_SECRET",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    logger.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

/**
 * Express application factory
 */
const app = express();

// Trust proxy configuration for Railway
// Set to 1 to trust the first proxy (Railway's load balancer)
app.set("trust proxy", 1);

/**
 * CORS configuration
 */
const corsOptions: cors.CorsOptions = {
  origin: config.isProduction
    ? [
        "https://rain-or-shine-production.up.railway.app",
        "https://ngridge.com",
        "https://www.ngridge.com",
        "https://rain-or-shine.ngridge.com",
        "http://localhost:5173",
      ]
    : true, // Allow all in development
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Global middleware stack
 * Order is important: parsing → session → passport → logging → routes → error handling
 */
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use(requestLogger);

const API_PREFIX = "/api";

app.use(
  `${API_PREFIX}/strava/webhook`,
  rateLimit({
    windowMs: 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Skip rate limiting in development
    skip: () => config.isDevelopment,
  }),
);

app.use(
  `${API_PREFIX}/auth`,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10, // 10 auth attempts per 15 min per IP
    message: "Too many login attempts",
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // Skip rate limiting in development
    skip: () => config.isDevelopment,
  }),
  authRouter,
);

app.use(`${API_PREFIX}/strava`, stravaRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/activities`, activitiesRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/metrics`, metricsRouter);
app.use(`${API_PREFIX}/docs`, docsRouter);
app.use(`${API_PREFIX}/health`, healthRouter);

/**
 * Serve static files in production
 */
if (config.isProduction) {
  const clientPath = path.join(__dirname, "public");
  
  // Log the path for debugging
  logger.info("Serving static files from:", { clientPath });
  
  // Check if the public directory exists
  const fs = require("fs");
  if (!fs.existsSync(clientPath)) {
    logger.error("Public directory does not exist", { clientPath });
  } else {
    const indexPath = path.join(clientPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      logger.error("index.html not found", { indexPath });
    } else {
      logger.info("index.html found", { indexPath });
    }
  }
  
  app.use(express.static(clientPath));
  
  // Catch-all route to serve the React app for client-side routing
  // Only catch routes that don't start with /api
  app.get(/^(?!\/api).*/, (req, res) => {
    const indexPath = path.join(clientPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        logger.error("Error serving index.html", err);
        res.status(500).send("Error loading application");
      }
    });
  });
}

/**
 * Custom error handler
 */
app.use(errorHandler);

const port = config.PORT;

const server = app.listen(port, async () => {
  logger.info("Server started", {
    port,
    environment: config.NODE_ENV,
    nodeVersion: process.version,
    pid: process.pid,
    authMethod: "session",
  });

  // Initialize webhooks in production
  if (config.isProduction) {
    try {
      const { ensureWebhooksInitialized } = await import(
        "./utils/initWebhooks"
      );
      await ensureWebhooksInitialized();
    } catch (error) {
      logger.error("Failed to initialize webhooks", error);
    }
  }

  logger.info("API endpoints available", {
    health: `http://localhost:${port}${API_PREFIX}/health`,
    webhook: `http://localhost:${port}${API_PREFIX}/strava/webhook`,
    oauth: `http://localhost:${port}${API_PREFIX}/auth/strava`,
    admin: `http://localhost:${port}${API_PREFIX}/admin/*`,
  });
});

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal: NodeJS.Signals): Promise<void> => {
  logger.info("Shutdown signal received", { signal });

  server.close(async (err) => {
    if (err) {
      logger.error("Error during server shutdown", err);
      process.exit(1);
    }

    logger.info("HTTP server closed");

    try {
      // Cleanup tasks
      if (config.isDevelopment) {
        const { cleanupWebhookOnShutdown } = await import(
          "./services/startupWebhookSetup"
        );
        await cleanupWebhookOnShutdown();
      }

      // Close database connections
      const { disconnect } = await import("./lib/database");
      await disconnect();
      logger.info("Database connections closed");

      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Error during cleanup", error);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error("Forced shutdown due to timeout");
    process.exit(1);
  }, 10000);
};

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled promise rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
  gracefulShutdown("SIGTERM");
});
