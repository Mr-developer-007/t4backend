import  type{ FastifyInstance } from "fastify";
import { CreateClient,  type IClientverify,  VerifyOtp,  type IClientAuth, getAgency, type ClientQuery, getAgencySingle, IAgency } from "./clientController.js";
import { verifyAdmin } from "../../middlewere/verifyAdmin.js";
import { getClient, loginClient } from "./ClientAgencyController.js";
import { verifyClient } from "../../middlewere/verifyClient.js";


export const ClientRoutesAdmin= async(app:FastifyInstance):Promise<void>=>{
app.post<{ Body: IClientAuth }>("/create",{preHandler:verifyAdmin},CreateClient)
app.post<{ Body: IClientverify }>("/verify-otp",{preHandler:verifyAdmin},VerifyOtp)
app.get<{Querystring: ClientQuery}>("/get-all-clients",{preHandler:verifyAdmin},getAgency)
app.get<{Params:IAgency}>("/getclient/:id",{preHandler:verifyAdmin},getAgencySingle)
}




export const ClientRoutes = async(app:FastifyInstance):Promise<void>=>{
app.post("/login",loginClient)
app.get("/verify",{preHandler:verifyClient},getClient)

}