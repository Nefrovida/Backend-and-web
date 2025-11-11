// Dependencies
import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import session from "express-session"

dotenv.config({path: "../.env"})

// Initialize server
const app = express();
app.use(session({
  secret: process.env.SECRET ?? "tacocat",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true}
}))

const port = process.env.SERVER_PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

import router from "./routes/routes";

// Routes
app.use("/api", router);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
