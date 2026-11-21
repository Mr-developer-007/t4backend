import { FastifyInstance } from "fastify";
import { createPackage } from "./packageAgency.Controller.js";
import { verifyClient } from "../../middlewere/verifyClient.js";



export const ClientPackageRoute = async(app:FastifyInstance):Promise<void>=>{

    app.post("/create",{preHandler:verifyClient},createPackage)


}
