import {FastifyInstance} from 'fastify';
import { createOrganizationForUser } from '../db/organization';

export async function organizationRoutes(app: FastifyInstance) {
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
}