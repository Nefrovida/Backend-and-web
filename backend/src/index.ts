// Dependencies
import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})


// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3000;

import router from "./routes/routes";
import reportRouter from "./routes/report.routes";

// Routes
app.use("/api", router);
app.use("/api/report", reportRouter);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
