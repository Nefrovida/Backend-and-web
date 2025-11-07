// Dependencies
import express, { Request, Response } from "express";
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

import router from "./routes/routes";

// Routes
app.use("/api", router);

// Start server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
