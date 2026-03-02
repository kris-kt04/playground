import { betterAuth } from "better-auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { prismaAdapter } from "better-auth/adapters/prisma";

const { PrismaClient } = require("@prisma/client");

const DATABASE = process.env.DATABASE_URL;
if (!DATABASE) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: DATABASE });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: "http://localhost:3000",
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
  emailAndPassword: {
    enabled: true,
  },
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    credentials: true,
  },
});