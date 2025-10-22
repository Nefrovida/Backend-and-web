// Dependencies
import express, { Request, Response } from "express";

// Initialize server
const app = express();

const port = process.env.SERVER_PORT || 3000;

import router from "./routes/routes";

// Routes
app.use("/api", router);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
