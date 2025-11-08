// Dependencies
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})


// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

import router from "./routes/routes";

// Routes
app.use("/api", router);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
