
import type {FastifyInstance,FastifyReply,FastifyRequest,preHandlerHookHandler,} from "fastify";

interface RateLimitOptions {
  max: number;
  windowSeconds: number;
  keyPrefix?: string;
}

const RATE_LIMIT_SCRIPT = `
  local current = redis.call("INCR", KEYS[1])

  if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end

  local ttl = redis.call("TTL", KEYS[1])

  return { current, ttl }
`;

export function createRateLimit(
  app: FastifyInstance,
  options: RateLimitOptions
): preHandlerHookHandler {
  const {
    max,
    windowSeconds,
    keyPrefix = "rate-limit",
  } = options;

  if (!Number.isInteger(max) ||max < 1 ||!Number.isInteger(windowSeconds) || windowSeconds < 1) {
    throw new Error("Invalid rate limit configuration");
  }

  return async function rateLimit(request: FastifyRequest, reply: FastifyReply) {

    const redis = app.redis;

    // Fail closed if Redis is unavailable.
    if (!redis || redis.status !== "ready") {
      return reply
        .header("Retry-After", String(windowSeconds))
        .code(503)
        .send({
          success: false,
          message: "Rate limiter temporarily unavailable",
        });
    }

    // Include route and client IP in the key.
    const route = request.routeOptions.url ?? request.url.split("?")[0];

    const key = `${keyPrefix}:${route}:${request.ip}`;

    try {
      const result = await redis.eval(
        RATE_LIMIT_SCRIPT,
        1,
        key,
        String(windowSeconds)
      ) as [number, number];

      const [current, ttl] = result;

      reply.header("X-RateLimit-Limit", String(max));
      reply.header(
        "X-RateLimit-Remaining",
        String(Math.max(0, max - current))
      );

      if (current > max) {
        const retryAfter = Math.max(1, ttl);

        return reply
          .header("Retry-After", String(retryAfter))
          .code(429)
          .send({
            success: false,
            message: `Too many requests. Please try again ${ttl} sec.`,
            retryAfter,
          });
      }
    } catch (error) {
      request.log.error(
        { err: error },
        "Redis rate limiter failed"
      );

      return reply
        .header("Retry-After", String(windowSeconds))
        .code(503)
        .send({
          success: false,
          message: "Rate limiter temporarily unavailable",
        });
    }
  };
}