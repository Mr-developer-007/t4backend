import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export const registerCors = async(app:FastifyInstance):Promise<void>=>{
await app.register(cors,{origin:env.corsOrigins.length> 0?  env.corsOrigins : false,
    credentials:true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

}


)
}

