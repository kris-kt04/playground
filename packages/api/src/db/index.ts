import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const DATABASE = process.env.DATABASE_URL;
if (!DATABASE) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: DATABASE });

export const prisma = new PrismaClient({ adapter });
