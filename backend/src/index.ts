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

import path from "path";
import fs from "fs/promises";
import { raw } from "express";

// Directorio donde se guardarán los PDFs
const uploadDir = path.join(process.cwd(), "uploads");

// Asegurarse que exista
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Servir los archivos estáticos (para poder descargarlos/verlos luego)
app.use("/uploads", express.static(uploadDir));

// Endpoint para recibir el archivo binario (PUT a la URL "presignada")
app.put(
  "/uploads/:fileName",
  raw({
    type: [
      "application/pdf",
      "application/octet-stream" // por si el cliente no pone bien el mime
    ],
    limit: "20mb",
  }),
  async (req: Request, res: Response) => {
    try {
      const fileName = req.params.fileName;

      // En esta US solo aceptamos PDF
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

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
