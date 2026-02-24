import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify();

app.register(cors, {
  origin: true, // allow frontend requests
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`API running at ${address}`);
});