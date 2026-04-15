import Fastify from "fastify";
import cors from "@fastify/cors";
import { auth } from "./auth";
import { createOrganizationForUser } from "./db/organization";

const app = Fastify();

app.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
});

// Create organization for user
app.post("/api/organization", async (request, reply) => {
  try {
    const { userId, userName, userEmail } = request.body as {
      userId: string;
      userName?: string;
      userEmail: string;
    };

    if (!userId || !userEmail) {
      return reply.status(400).send({ error: "userId and userEmail are required" });
    }

    const organization = await createOrganizationForUser({
      userId,
      userName,
      userEmail,
    });

    return reply.send({ organization });
  } catch (error) {
    console.error("Create organization error:", error);
    return reply.status(500).send({ error: "Failed to create organization" });
  }
});

// Handle all auth routes
app.all("/api/auth/*", async (request, reply) => {
  try {
    const path = request.url.replace("/api/auth", "");
    
    // Get request body
    let body: any = null;
    if (request.method !== "GET") {
      body = request.body;
    }

    // Create a Request object compatible with better-auth
    const req = new Request(`http://localhost:3000${request.url}`, {
      method: request.method,
      headers: request.headers as any,
      body: body ? JSON.stringify(body) : undefined,
    });

    const response = await auth.handler(req);
    
    // Send response
    reply.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      reply.header(key, value);
    }
    
    const responseBody = await response.text();
    reply.send(responseBody);
  } catch (error) {
    console.error("Auth handler error:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`API running at ${address}`);
});