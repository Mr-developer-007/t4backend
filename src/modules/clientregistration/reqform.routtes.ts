import type { FastifyInstance } from "fastify";
import { registerForm } from "./regform.controller.js";



export const Reqform = async(app:FastifyInstance):Promise<void>=>{

app.post("/add",registerForm)


}