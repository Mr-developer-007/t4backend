import type { FastifyReply, FastifyRequest } from "fastify"
import { env } from "../config/env.js";
import JWT, { type JwtPayload } from "jsonwebtoken";
import Client from "../modules/clients/clients.model.js";


interface AdminTokenPayload extends JwtPayload {
  adminId: string;
  email: string;
  role: "client";

}


export const verifyClient= async(request:FastifyRequest,reply:FastifyReply)=>{
    try {
        const token = request.cookies.client_token;
       
if(!token){
 return reply.status(401).send({
        success: false,
        message: "Please login to access this resource",
      });
}

 const secret = env.jwtSecret;

      const payload = JWT.verify(token, secret);

if (typeof payload === "string" || !("adminId" in payload)) {
  throw new Error("Invalid token payload");
}


const adminId = payload.adminId;
const email = payload.email;
const role = payload.role;

if(!role || role !=="client"){
       return reply.status(401).send({
        success: false,
        message: "Admin account not found",
      });
    }

const client = await Client.findOne({_id:adminId,email}).select("-password");

   if (!client) {
      return reply.status(401).send({
        success: false,
        message: "Client account not found",
      });
    }

    request.client = client;




    } catch (error) {
           return reply.status(500).send({
      success: false,
      message: error,
    });  
    }
}