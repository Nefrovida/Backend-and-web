// Dependencies
import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})


// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3000;

import router from "./routes/routes";
import laboratoristRouter from "./routes/laboratorista.routes";

// Routes
app.use("/api", router);
app.use("/api/laboratorist", laboratoristRouter),

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
