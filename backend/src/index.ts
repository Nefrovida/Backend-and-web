// Dependencies
import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import session from "express-session"
import { errorHandler } from './middleware/error.middleware';


dotenv.config({ path: "../.env" });

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

import path from "path";
import fs from "fs/promises";
import { raw } from "express";

// Dir for PDF storage
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Serve static files
app.use("/uploads", express.static(uploadDir));


// Endpoint to receibe new binary (presigned URL PUT)
app.put(
  "/uploads/:fileName",
  raw({
    type: [
      "application/pdf",
      "application/octet-stream"
    ],
    limit: "20mb",
  }),
  async (req: Request, res: Response) => {
    try {
      const fileName = req.params.fileName;

      const contentType = req.headers["content-type"];
      if (contentType !== "application/pdf" && contentType !== "application/octet-stream") {
        return res
          .status(400)
          .json({ success: false, message: "Only PDF uploads are allowed" });
      }

      if (!req.body || !(req.body instanceof Buffer) && !Buffer.isBuffer(req.body)) {
        return res
          .status(400)
          .json({ success: false, message: "File body is required" });
      }

      const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);

      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      return res.status(200).json({ success: true, path: `/uploads/${fileName}` });
    } catch (error: any) {
      console.error("Error saving uploaded file:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error saving uploaded file" });
    }
  }
);

import router from "./routes/routes";

// Routes
app.use("/api", router);

// Global error handler middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
