/*
Defines the schema path, migrations directory,
engine type, and datasource URL.
(It does not create or export a PrismaClient instance.)
*/

import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});

console.log(process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw Error("Error: DATABASE_URL is not defined in env, or env could not load");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
