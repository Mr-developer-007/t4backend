import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { AdminLoginAdmin, ClientVerifyOTP } from "../utils/mailer.js";

if (!env.redisUrl) {
  throw new Error("REDIS_URL is required for email worker");
}

const workerRedis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "admin-login-otp") {
      const { email, otp } = job.data as {
        email: string;
        otp: string;
      };

      await AdminLoginAdmin(email, otp);
      console.log(`OTP email processed for ${email}`);
    }
  else if(job.name === "client-email-verify"){
   const { email, otp } = job.data as {
        email: string;
        otp: string;
      };

      console.log("sendingg....")
await ClientVerifyOTP(email,otp)
console.log("send....")
 console.log(`OTP email processed for client ${email}`);
  }
 else if(job.name === "client-mobile-verify"){
   const { number, otp } = job.data as {
        number: string;
        otp: string;
      };

      console.log("sendingg....")
await ClientVerifyOTP(number,otp)
console.log("send....")
 console.log(`OTP email processed for client ${number}`);
  }


  },
  {
    connection: workerRedis,
    concurrency: 5,
  }
);
 
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed: ${error.message}`);
});

console.log("Email worker started");

const shutdown = async () => {
  await worker.close();
  await workerRedis.quit();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());