import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// In-memory rate limiting: userId -> { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // messages per hour
const HOUR_MS = 60 * 60 * 1000;

function getHuggingFaceConfig() {
  const model = process.env.HF_MODEL ?? "mistralai/Mistral-7B-Instruct-v0.2";
  const provider = process.env.HF_PROVIDER;
  const routerBaseUrl = (process.env.HF_ROUTER_BASE_URL ?? "https://router.huggingface.co").replace(/\/+$/, "");
  const inferenceUrl = process.env.HF_INFERENCE_URL ?? `${routerBaseUrl}/v1/chat/completions`;

  return { model, provider, inferenceUrl };
}

function getMockResponse(message: string): string {
  // Simple mock responses based on keywords
  const mockResponses: Record<string, string> = {
    "2+2": "2+2 equals 4. This is a simple arithmetic operation where you add 2 and 2 together to get the result of 4.",
    hello:
      "Hello! I'm an AI assistant powered by Mistral 7B. How can I help you today?",
    help: "I can help you with a wide range of questions and tasks. Just ask me anything!",
  };

  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Default response
  return `I received your message: "${message}". I'm running in mock mode for development. In production, I'll use the Mistral 7B model via Hugging Face API to provide intelligent responses.`;
}

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset window
    rateLimitStore.set(userId, { count: 1, resetTime: now + HOUR_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (userLimit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT - userLimit.count };
}

async function callHuggingFaceAPI(message: string): Promise<string> {
  // Always use mock responses for development (easier testing, no internet needed)
  // Set PRODUCTION_MODE=true to use real HF API
  const useRealAPI = process.env.PRODUCTION_MODE === "true";

  if (!useRealAPI) {
    // Development/offline mode with mock responses
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getMockResponse(message);
  }

  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGING_FACE_API_KEY not configured");
  }

  const hfConfig = getHuggingFaceConfig();

  // Production: call real HF API, but gracefully fallback if the endpoint is unreachable.
  try {
    const isChatCompletions = hfConfig.inferenceUrl.includes("/v1/chat/completions");
    const requestBody = isChatCompletions
      ? {
          model: hfConfig.model,
          provider: hfConfig.provider,
          messages: [{ role: "user", content: message }],
          max_tokens: 256,
          temperature: 0.7,
        }
      : {
          inputs: message,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.7,
          },
        };

    const response = await fetch(
      hfConfig.inferenceUrl,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("HF API Error:", error);
      throw new Error(`HF API error: ${response.status} (${hfConfig.provider}/${hfConfig.model})`);
    }

    const result = (await response.json()) as
      | Array<{ generated_text: string }>
      | { choices?: Array<{ message?: { content?: string } }> };

    // New OpenAI-compatible format
    if (
      !Array.isArray(result) &&
      result.choices?.[0]?.message?.content
    ) {
      return result.choices[0].message.content;
    }

    // Legacy inference format
    if (Array.isArray(result) && result[0]?.generated_text) {
      return result[0].generated_text;
    }

    throw new Error("Invalid response from Hugging Face API");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const cause = (error as { cause?: { code?: string; hostname?: string } }).cause;

    if (cause?.code) {
      const host = cause.hostname ?? "router.huggingface.co";
      console.warn(`HF API unreachable (${cause.code} ${host}), using mock response.`);
    } else {
      console.warn(`HF API request failed (${errorMessage}), using mock response.`);
      console.warn("Tip: set HF_MODEL and HF_PROVIDER in your API .env to a supported combination.");
    }

    return getMockResponse(message);
  }
}

export async function chatRoutes(app: FastifyInstance) {
  app.post(
    "/api/chat",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.headers["x-user-id"] as string;
        if (!userId) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        const { message } = request.body as { message: string };
        if (!message || typeof message !== "string" || message.trim().length === 0) {
          return reply.status(400).send({ error: "Message is required" });
        }

        // Check rate limit
        const { allowed, remaining } = checkRateLimit(userId);
        if (!allowed) {
          return reply.status(429).send({
            error: "Rate limit exceeded",
            message: "You've reached your 10 messages per hour limit",
            retryAfter: 3600,
          });
        }

        // Call Hugging Face API
        const response = await callHuggingFaceAPI(message);

        return reply.send({
          success: true,
          response,
          usage: {
            remaining,
            limit: RATE_LIMIT,
            resetTime: new Date(Date.now() + HOUR_MS).toISOString(),
          },
        });
      } catch (error) {
        console.error("Chat error:", error);
        return reply.status(500).send({
          error: "Failed to process message",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  // Quick health/config endpoint for chat runtime diagnostics
  app.get("/api/chat/health", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const useRealAPI = process.env.PRODUCTION_MODE === "true";
      const hfConfig = getHuggingFaceConfig();

      return reply.send({
        ok: true,
        mode: useRealAPI ? "production" : "mock",
        hf: {
          provider: hfConfig.provider ?? "auto",
          model: hfConfig.model,
          inferenceUrl: hfConfig.inferenceUrl,
          apiKeyConfigured: Boolean(process.env.HUGGING_FACE_API_KEY),
        },
      });
    } catch (error) {
      console.error("Chat health error:", error);
      return reply.status(500).send({ error: "Failed to fetch chat health" });
    }
  });

  // Get rate limit status
  app.get("/api/chat/usage", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.headers["x-user-id"] as string;
      if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const now = Date.now();
      const userLimit = rateLimitStore.get(userId);

      if (!userLimit || now > userLimit.resetTime) {
        return reply.send({
          used: 0,
          remaining: RATE_LIMIT,
          limit: RATE_LIMIT,
          resetTime: new Date(now + HOUR_MS).toISOString(),
        });
      }

      return reply.send({
        used: userLimit.count,
        remaining: RATE_LIMIT - userLimit.count,
        limit: RATE_LIMIT,
        resetTime: new Date(userLimit.resetTime).toISOString(),
      });
    } catch (error) {
      console.error("Usage error:", error);
      return reply.status(500).send({ error: "Failed to fetch usage" });
    }
  });
}
