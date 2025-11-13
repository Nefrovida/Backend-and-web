// Dependencies
import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})

// Middleware
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import router from "./routes/routes";
app.use("/api", router);

// 404 Handler - debe estar ANTES del errorHandler
app.use(notFoundHandler);

// Error Handler - debe ser el ÚLTIMO middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
