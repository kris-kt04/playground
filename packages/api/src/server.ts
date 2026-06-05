import Fastify from "fastify";
import cors from "@fastify/cors";
import { auth } from "./auth";
import { organizationRoutes } from "./routes/organization";
import { getAllUsers, getUserWithRole } from "./db/organization";

const app = Fastify();

app.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
});

app.register(organizationRoutes);

// Admin endpoint - must be BEFORE catch-all routes
app.get("/api/admin", async (request, reply) => {
  try {
    const userId = request.headers["x-user-id"] as string;
    if (!userId) {
      return reply.status(400).send({ error: "Missing user ID" });
    }

    // Check if current user is admin/owner
    const currentUser = await getUserWithRole(userId);
    const isAdmin = currentUser?.memberships.some(m => m.role === "OWNER");
    
    if (!isAdmin) {
      return reply.status(403).send({ error: "Unauthorized" });
    }

    // Get all users
    const users = await getAllUsers();
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.memberships[0]?.role || "USER",
    }));

    return reply.send({ adminUser: formattedUsers });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return reply.status(500).send({ error: "Internal server error" });
  }
});

// Handle all auth routes - catch-all must be LAST
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