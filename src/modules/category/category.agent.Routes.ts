import { FastifyInstance } from "fastify";
import { verifyClient } from "../../middlewere/verifyClient.js";
import { getCategory } from "./category.controller.js";




export const agencyCategorRoute = async(app:FastifyInstance)=>{

app.get(`/get`,{preHandler:verifyClient},getCategory)

}