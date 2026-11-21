import { FastifyInstance } from "fastify";
import { registerCors } from "./cors.js";
import { registerMongo } from "./mongooseConnect.js";
import { registerRedis } from "./redis.js";
import { registerHelmet } from "./helmet.js";
import { registerSwagger } from "./swagger.js";
import { registerRoutes } from "./routes.js";

export const bootstrap= async(app:FastifyInstance)=>{
    await  registerMongo()
    await registerHelmet(app)

    await registerCors(app)
    await registerRedis(app)
    await registerSwagger(app)
    await registerRoutes(app)
}