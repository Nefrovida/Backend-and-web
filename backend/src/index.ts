// Dependencies
import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})


// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

import router from "./routes/routes";

// Routes
app.use("/api", router);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
