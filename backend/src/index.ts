// Dependencies
import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})


// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3001;

import router from "./routes/routes";
import doctorAppointmentRouter from "./routes/appointments.routes";

// Routes
app.use("/api", router);
app.use("/api/doctor-appointments", doctorAppointmentRouter);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
