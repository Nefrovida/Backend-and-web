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
  // Only set secure cookies in production (requires HTTPS). In dev (HTTP) this must be false.
  cookie: { secure: process.env.NODE_ENV === "production" }
}))

const port = process.env.SERVER_PORT || 3000;

// CORS configuration
// CORS: allow a configurable list of frontend origins. FRONTEND_URL may be a
// single origin or a comma-separated list (e.g. "http://localhost:3000,http://127.0.0.1:3000").
const whitelist = (process.env.FRONTEND_URL || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl or same-origin requests)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    // otherwise reject
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
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
