import type { FastifyInstance } from "fastify";
import { Redis } from "ioredis";
import { env } from "../config/env.js";



declare module "fastify" {
  interface FastifyInstance {
    redis: Redis;
  }
}



export async function registerRedis(app: FastifyInstance): Promise<void> {
  if (!env.redisUrl) {
    app.log.warn("REDIS_URL is not set, skipping Redis");
    return;
  }
  const redis = new Redis(env.redisUrl, { maxRetriesPerRequest: 2 });
  

redis.on("error", (err) => {
    app.log.error({ err }, "Redis connection error");
  });

   await redis.ping();
   app.log.info("Redis connected successfully");
  app.decorate("redis", redis);
  app.addHook("onClose", async () => {
    await redis.quit();
  });
}
