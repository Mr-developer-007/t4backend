import { Queue } from "bullmq";
import { env } from "../config/env.js";


export  const emailQueue =new Queue("email-queue",{
    connection: {
        url: env.redisUrl,
        maxRetriesPerRequest: null,
    }
})  


