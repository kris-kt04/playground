import "dotenv/config";
import { betterAuth } from "better-auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendVerificationEmail } from "better-auth/api";
import { Resend } from 'resend';

const { PrismaClient } = require("@prisma/client");

const DATABASE = process.env.DATABASE_URL;
if (!DATABASE) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: DATABASE });
const prisma = new PrismaClient({ adapter });
const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: "http://localhost:3000",
  trustedOrigins: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:3000"],
  emailAndPassword: {
    enabled: true,
    sendResetPassword : async ({ user, url }) => {
      try {
        const result = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: user.email,
          subject: 'Reset your password',
          html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
        });
      } catch (error) {
        console.error('📧 Resend error:', error);
      }
    },
  },
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:3000"],
    credentials: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  }
});