

import type { FastifyReply, FastifyRequest } from "fastify"
import JWT, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import Admin from "../modules/admin/admin.model.js";


interface AdminTokenPayload extends JwtPayload {
  adminId: string;
  email: string;
  role: "admin";
  count:number;
}


export const verifyAdmin = async( request: FastifyRequest,reply: FastifyReply)=>{
    try {
            const token = request.cookies.admin_token;

    if (!token) {
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
const count = payload.count;
if(!role || role !=="admin"){
       return reply.status(401).send({
        success: false,
        message: "Admin account not found",
      });
}

const admin = await Admin.findOne({_id:adminId,email,count}).select("-password");

   if (!admin) {
      return reply.status(401).send({
        success: false,
        message: "Admin account not found",
      });
    }

    request.admin = admin;






    } catch (error) {
        return reply.status(500).send({
      success: false,
      message: error,
    });  
    }
}
